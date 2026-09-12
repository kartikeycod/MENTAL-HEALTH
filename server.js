// server.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));

// ✅ Poll for Hume batch job results
async function pollJobResult(jobId, apiKey, retries = 40) {
  for (let i = 0; i < retries; i++) {
    const res = await fetch(`https://api.hume.ai/v0/batch/jobs/${jobId}`, {
      headers: { "X-Hume-Api-Key": apiKey },
    });
    const data = await res.json();

    if (data.state?.status === "completed") {
      console.log("✅ Job completed.");
      return data;
    }

    if (data.state?.status === "failed") {
      console.error("❌ Job failed:", data);
      throw new Error("Hume job failed");
    }

    console.log(`⏳ Waiting for job... (${i + 1}/${retries})`);
    await new Promise((r) => setTimeout(r, 3000)); // 3s pause between checks
  }

  throw new Error("Job timed out after waiting 2 minutes.");
}

// ✅ Analyze endpoint
app.post("/analyze", async (req, res) => {
  try {
    const apiKey = process.env.VITE_HUME_API_KEY || process.env.HUME_API_KEY;
    if (!apiKey) {
      console.error("❌ Missing Hume API key");
      return res.status(500).json({ error: "Missing Hume API key" });
    }

    const userText = req.body.text;
    if (!userText) return res.status(400).json({ error: "Missing text input" });
    console.log("📩 Incoming /analyze request:", userText);

    // ✅ Step 1: Create a batch job
    const createJobRes = await fetch("https://api.hume.ai/v0/batch/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Hume-Api-Key": apiKey,
      },
      body: JSON.stringify({
        json: [
          {
            model: "language/emotion",
            value: userText,
          },
        ],
      }),
    });

    const jobData = await createJobRes.json();

    if (!createJobRes.ok) {
      console.error("❌ Failed to create job:", jobData);
      return res.status(createJobRes.status).json(jobData);
    }

    const jobId = jobData.id || jobData.job_id;
    console.log("🆔 Job created:", jobId);

    // ✅ Step 2: Poll until done
    const result = await pollJobResult(jobId, apiKey);

    // ✅ Step 3: Return results to frontend
    res.json(result);
  } catch (err) {
    console.error("❌ Server error:", err);
    res.status(500).json({
      error: "Failed to contact Hume API",
      detail: String(err),
    });
  }
});

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";
const RISK_THRESHOLD = 0.65;

function compositeRiskScore(textRiskProba, phq9Score = 0, gad7Score = 0) {
  const wText = 0.4, wPhq = 0.35, wGad = 0.25;
  const phqNorm = phq9Score / 27;
  const gadNorm = gad7Score / 21;
  return +(wText * textRiskProba + wPhq * phqNorm + wGad * gadNorm).toFixed(3);
}

function detectTrend(scoreHistory) {
  if (scoreHistory.length < 3) return "insufficient_data";
  const recent = scoreHistory.slice(-3);
  const earlier = scoreHistory.slice(0, -3);
  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const earlierAvg = earlier.length ? earlier.reduce((a, b) => a + b, 0) / earlier.length : recentAvg;
  return recentAvg - earlierAvg > 0.15 ? "rising_risk_flag" : "stable";
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ALERT_EMAIL,
    pass: process.env.ALERT_EMAIL_PASS,
  },
});

async function sendAlertEmail(trustedContacts, userName, category) {
  const emails = trustedContacts.map((c) => c.email);
  await transporter.sendMail({
    from: process.env.ALERT_EMAIL,
    to: emails.join(", "),
    subject: "A check-in with someone you care about might help",
    text: `Hi,

You're listed as a trusted contact for ${userName || "someone you know"} on Serenium.

Our system noticed some patterns in their recent activity that suggest they might be going through a difficult time (flagged category: ${category}). This isn't a diagnosis — it's an automated pattern flag, and it could be wrong. But a check-in from someone they trust could genuinely help right now.

This message was sent because they chose you as a trusted contact and opted into this feature.`,
  });
}

app.post("/api/risk/check-risk", async (req, res) => {
  try {
    const { posts, phq9Score, gad7Score, riskHistory = [], trustedContacts = [], userName } = req.body;

    if (!posts || !posts.length) {
      return res.status(400).json({ error: "posts array is required" });
    }

    const mlRes = await fetch(`${ML_SERVICE_URL}/analyze-batch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ posts }),
    });
    const mlData = await mlRes.json();

    if (!mlData.results?.length) {
      return res.json({ message: "No posts could be analyzed", raw: mlData });
    }

    const riskiestPost = mlData.results.reduce((max, p) =>
      p.confidence > max.confidence ? p : max, mlData.results[0]);

    const textRiskProba = ["Depression", "Suicidal"].includes(riskiestPost.prediction)
      ? riskiestPost.confidence : 0.2;

    const composite = compositeRiskScore(textRiskProba, phq9Score, gad7Score);
    const updatedHistory = [...riskHistory, { score: composite, category: riskiestPost.prediction, timestamp: Date.now() }];
    const trend = detectTrend(updatedHistory);

    let alertSent = false;
    if ((composite > RISK_THRESHOLD || riskiestPost.is_crisis || trend === "rising_risk_flag") && trustedContacts.length) {
      await sendAlertEmail(trustedContacts, userName, riskiestPost.prediction);
      alertSent = true;
    }

    res.json({
      composite_score: composite,
      category: riskiestPost.prediction,
      is_crisis: riskiestPost.is_crisis,
      trend,
      alert_sent: alertSent,
      posts_analyzed: mlData.posts_analyzed,
      all_results: mlData.results,
      riskiest_post: riskiestPost,
    });
  } catch (err) {
    console.error("Risk check error:", err);
    res.status(500).json({ error: "Risk check failed", detail: String(err) });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
