import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import "./CheckIn.css";

const API_BASE_URL = "http://localhost:5000";

const LABEL_COLORS = {
  Normal: "#10b981",
  Stress: "#f59e0b",
  Anxiety: "#f97316",
  Depression: "#8b5cf6",
  Bipolar: "#ec4899",
  "Personality disorder": "#6366f1",
  Suicidal: "#ef4444",
};

function parseInstagramExport(jsonData) {
  const extracted = [];

  function walk(node) {
    if (Array.isArray(node)) {
      node.forEach(walk);
    } else if (node && typeof node === "object") {
      if (typeof node.title === "string" && node.title.trim().length > 5) {
        extracted.push({
          text: node.title.trim(),
          timestamp: node.creation_timestamp || null,
        });
      }
      Object.values(node).forEach(walk);
    }
  }

  walk(jsonData);
  return extracted;
}

export default function CheckIn() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [posts, setPosts] = useState([{ text: "" }]);
  const [phq9Score, setPhq9Score] = useState(0);
  const [gad7Score, setGad7Score] = useState(0);
  const [trustedContactName, setTrustedContactName] = useState("");
  const [trustedContactEmail, setTrustedContactEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [importMessage, setImportMessage] = useState("");

  const handlePostChange = (index, value) => {
    const newPosts = [...posts];
    newPosts[index].text = value;
    setPosts(newPosts);
  };

  const addPostField = () => {
    if (posts.length < 5) {
      setPosts([...posts, { text: "" }]);
    }
  };

  const removePostField = (index) => {
    const newPosts = [...posts];
    newPosts.splice(index, 1);
    setPosts(newPosts);
  };

  const handleInstagramUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        const extracted = parseInstagramExport(json);

        if (extracted.length === 0) {
          setImportMessage(
            "No captions found in this file. Make sure you uploaded posts_1.json from your Instagram export."
          );
          return;
        }

        const recent = extracted.slice(-5).map((p) => ({ text: p.text }));
        setPosts(recent);
        setImportMessage(`Imported ${recent.length} recent posts from your Instagram export.`);
      } catch (err) {
        setImportMessage(
          "Couldn't read that file — make sure it's the posts_1.json from your Instagram data export."
        );
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setResult(null);

    const validPosts = posts.filter((p) => p.text.trim().length >= 5);
    if (validPosts.length === 0) {
      setErrorMsg("Please enter at least one valid journal entry (min 5 characters).");
      return;
    }

    setLoading(true);

    const trustedContacts = [];
    if (trustedContactName.trim() && trustedContactEmail.trim()) {
      trustedContacts.push({
        name: trustedContactName.trim(),
        email: trustedContactEmail.trim(),
      });
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/risk/check-risk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: userName.trim() || "Anonymous User",
          posts: validPosts,
          phq9Score: Number(phq9Score),
          gad7Score: Number(gad7Score),
          riskHistory: [],
          trustedContacts,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to process check-in.");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setErrorMsg(
        err.message.includes("Failed to fetch")
          ? "Cannot connect to backend server (http://localhost:5000)."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkin-page-wrapper">
      <div className="checkin-hero">
        <span className="ai-badge">🛡️ Serenium Security & Privacy</span>
        <h1 className="checkin-title">Daily Clinical Check-In</h1>
        <p className="checkin-subtitle">
          Log your thoughts and feelings. Our clinical AI will analyze your entries and provide
          immediate feedback. You can optionally notify a trusted contact if risk patterns are detected.
        </p>
      </div>

      <div className="checkin-content-layout">
        <div className="checkin-form-card fade-in">
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h3>👤 Basic Info</h3>
              <div className="input-group">
                <label>Your Name (Optional)</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="e.g. Alex"
                />
              </div>
            </div>

            <div className="form-section">
              <h3>📝 Journal Entries & Posts</h3>
              <p className="section-desc">Paste your recent thoughts or journal excerpts below.</p>

              <div className="instagram-import-box">
                <label
                  htmlFor="ig-upload"
                  className="btn-add-post"
                  style={{ display: "inline-block", cursor: "pointer" }}
                >
                  📤 Or upload your Instagram data export (posts_1.json)
                </label>
                <input
                  id="ig-upload"
                  type="file"
                  accept=".json"
                  onChange={handleInstagramUpload}
                  style={{ display: "none" }}
                />
                {importMessage && (
                  <p className="section-desc" style={{ marginTop: 8 }}>
                    {importMessage}
                  </p>
                )}
              </div>

              {posts.map((post, index) => (
                <div key={index} className="post-input-group">
                  <textarea
                    value={post.text}
                    onChange={(e) => handlePostChange(index, e.target.value)}
                    placeholder={`Entry #${index + 1}... (Write what's on your mind)`}
                    rows={3}
                  />
                  {posts.length > 1 && (
                    <button type="button" className="btn-remove" onClick={() => removePostField(index)}>
                      ✕ Remove
                    </button>
                  )}
                </div>
              ))}
              {posts.length < 5 && (
                <button type="button" className="btn-add-post" onClick={addPostField}>
                  + Add Another Entry
                </button>
              )}
            </div>

            <div className="form-section clinical-scores">
              <h3>📊 Clinical Screener Scores (Optional)</h3>
              <p className="section-desc">
                If you have recently taken these assessments, provide your scores to improve AI accuracy.
              </p>
              <div className="score-inputs-row">
                <div className="input-group">
                  <label>PHQ-9 (Depression) [0-27]</label>
                  <input
                    type="number"
                    min="0"
                    max="27"
                    value={phq9Score}
                    onChange={(e) => setPhq9Score(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label>GAD-7 (Anxiety) [0-21]</label>
                  <input
                    type="number"
                    min="0"
                    max="21"
                    value={gad7Score}
                    onChange={(e) => setGad7Score(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="form-section trusted-contact">
              <h3>🤝 Trusted Contact (Optional)</h3>
              <p className="section-desc">
                We'll email them an alert if our AI detects a high-risk pattern. We won't share your exact
                words, just a gentle check-in prompt.
              </p>
              <div className="input-group">
                <label>Contact Name</label>
                <input
                  type="text"
                  value={trustedContactName}
                  onChange={(e) => setTrustedContactName(e.target.value)}
                  placeholder="e.g. Mom, Best Friend, Therapist"
                />
              </div>
              <div className="input-group">
                <label>Contact Email</label>
                <input
                  type="email"
                  value={trustedContactEmail}
                  onChange={(e) => setTrustedContactEmail(e.target.value)}
                  placeholder="e.g. friend@example.com"
                />
              </div>
            </div>

            {errorMsg && <div className="checkin-error">⚠️ {errorMsg}</div>}

            <button type="submit" className="btn-submit-checkin" disabled={loading}>
              {loading ? <span className="spinner"></span> : "Analyze & Check-In"}
            </button>
          </form>
        </div>

        {result && (
          <div className="checkin-result-card fade-in">
            <div className="result-header">
              <h3>Diagnosis & AI Feedback</h3>
            </div>

            <div className="result-score-box">
              <div className="score-label">Composite Risk Score</div>
              <div className={`score-value ${result.composite_score > 0.65 ? "danger" : "safe"}`}>
                {(result.composite_score * 100).toFixed(1)}%
              </div>
              <p className="score-desc">Fusion of NLP models and clinical scales.</p>
            </div>

            <div className="result-category">
              <strong>Primary Detected State:</strong>
              <span className="category-tag">{result.category}</span>
            </div>

            {result.riskiest_post?.ranked_classes && (
              <div className="probabilities-section">
                <h4>Class Probabilities Breakdown</h4>
                <div className="prob-bars-list">
                  {result.riskiest_post.ranked_classes.map((rc) => {
                    const isTop = rc.label === result.riskiest_post.prediction;
                    return (
                      <div key={rc.label} className={`prob-row ${isTop ? "is-top" : ""}`}>
                        <div className="prob-label-row">
                          <span className="prob-class-name">
                            {isTop && "⭐ "}
                            {rc.label}
                          </span>
                          <span className="prob-pct">{rc.percentage}%</span>
                        </div>
                        <div className="prob-bar-track">
                          <div
                            className="prob-bar-fill"
                            style={{
                              width: `${Math.max(rc.percentage, 2)}%`,
                              backgroundColor: isTop ? LABEL_COLORS[rc.label] || "#3b82f6" : "#94a3b8",
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {result.alert_sent && (
              <div className="alert-sent-banner">
                ✉️ <strong>Alert Sent:</strong> We've confidentially emailed your trusted contact to check in
                on you.
              </div>
            )}

            {result.is_crisis && (
              <div className="crisis-banner">
                <h4>🚨 Immediate Support Needed</h4>
                <p>Please reach out immediately. You are not alone.</p>
                <ul>
                  <li>
                    <strong>Tele-MANAS:</strong> 14416 (Toll Free)
                  </li>
                  <li>
                    <strong>KIRAN:</strong> 1800-599-0019
                  </li>
                  <li>
                    <strong>Vandrevala Foundation:</strong> +91 9999 666 555
                  </li>
                </ul>
              </div>
            )}

            <div className="next-steps">
              <button
                className="btn-primary-action"
                onClick={() => navigate(ROUTES?.SERENY_DOCTOR || "/therapists")}
              >
                Connect with a Therapist
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}