// server.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
