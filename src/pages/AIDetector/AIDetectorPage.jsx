import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import "./AIDetectorPage.css";

const API_BASE_URL = "http://localhost:8000";

const SAMPLE_PROMPTS = [
  {
    label: "Feeling Hopeless & Drained",
    text: "I don't want to do any work. No work now motivates me. I lost interest in everything.",
  },
  {
    label: "Anxious & Racing",
    text: "My heart is pounding, I feel on edge, and I can't catch my breath or stop worrying.",
  },
  {
    label: "Work Stress",
    text: "Work deadlines are piling up, my head is aching, and I am completely overwhelmed.",
  },
  {
    label: "Peaceful & Positive",
    text: "Today went really well, had a good conversation with a friend, and felt calm and grounded.",
  },
  {
    label: "Mood Swings",
    text: "One moment I have endless energy and grand ideas, then suddenly I crash into deep fatigue.",
  },
];

export default function AIDetectorPage() {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState("checking"); // "online" | "offline" | "checking"
  const [activeModel, setActiveModel] = useState("DistilBERT");
  const [selectedEngine, setSelectedEngine] = useState("distilbert"); // "distilbert" | "ensemble" | "baseline"
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  // Check backend server health
  useEffect(() => {
    checkServerHealth();
    const interval = setInterval(checkServerHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  const checkServerHealth = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      if (res.ok) {
        const data = await res.json();
        setServerStatus("online");
        if (data.distilbert_loaded && data.baseline_loaded) {
          setActiveModel("DistilBERT + Baseline");
        } else if (data.distilbert_loaded) {
          setActiveModel("DistilBERT");
        } else if (data.baseline_loaded) {
          setActiveModel("Baseline Model");
        }
      } else {
        setServerStatus("offline");
      }
    } catch {
      setServerStatus("offline");
    }
  };

  const handleAnalyze = async () => {
    if (!inputText.trim()) {
      setErrorMsg("Please enter or select a statement to analyze.");
      return;
    }
    if (inputText.trim().length < 5) {
      setErrorMsg("Please write at least a full phrase for accurate emotional analysis.");
      return;
    }

    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: inputText.trim(),
          model_type: selectedEngine,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || "Server failed to process analysis.");
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setErrorMsg(
        err.message.includes("Failed to fetch")
          ? "Cannot connect to the AI model server (http://localhost:8000). Please ensure 'python model_server.py' is running."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setInputText("");
    setResult(null);
    setErrorMsg("");
  };

  return (
    <div className="ai-detector-page">
      <div className="ai-detector-hero">
        <div className="badge-wrapper">
          <span className="ai-badge">🤖 Deep Learning NLP</span>
          <div className={`status-pill ${serverStatus}`}>
            <span className="status-dot"></span>
            {serverStatus === "online"
              ? `AI Model Engine: Online (${activeModel})`
              : serverStatus === "checking"
              ? "Connecting to AI Model..."
              : "AI Server Offline (Run: python model_server.py)"}
          </div>
        </div>

        <h1 className="detector-title">
          AI Mental Health & Mood Detector
        </h1>
        <p className="detector-subtitle">
          Analyze personal thoughts, reflections, or journal entries in real-time.
          Powered by your fine-tuned <strong>DistilBERT sequence classifier</strong> trained on 7 mental wellness domains.
        </p>
      </div>

      <div className="detector-main-container">
        {/* Model Engine Selector */}
        <div className="engine-selector-card">
          <span className="engine-selector-title">Select Inference Engine:</span>
          <div className="engine-tabs">
            <button
              type="button"
              className={`engine-tab ${selectedEngine === "distilbert" ? "active" : ""}`}
              onClick={() => setSelectedEngine("distilbert")}
            >
              ⭐ DistilBERT (Deep Learning)
            </button>
            <button
              type="button"
              className={`engine-tab ${selectedEngine === "ensemble" ? "active" : ""}`}
              onClick={() => setSelectedEngine("ensemble")}
            >
              ⚡ Ensemble (Hybrid Blend)
            </button>
            <button
              type="button"
              className={`engine-tab ${selectedEngine === "baseline" ? "active" : ""}`}
              onClick={() => setSelectedEngine("baseline")}
            >
              📊 Baseline (TF-IDF + LR)
            </button>
          </div>
        </div>

        {/* Input Card */}
        <div className="detector-card input-card">
          <div className="card-header">
            <h3>📝 Express Your Current State of Mind</h3>
            <span className="char-count">{inputText.length} characters</span>
          </div>

          <textarea
            className="thought-textarea"
            placeholder="Write how you are feeling right now, or what is going through your mind... (e.g. 'I feel so drained lately and nothing seems to go right.')"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={5}
          />

          {/* Quick sample chips */}
          <div className="sample-prompts-section">
            <span className="sample-label">Quick Test Prompts:</span>
            <div className="prompt-chips">
              {SAMPLE_PROMPTS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="chip-btn"
                  onClick={() => {
                    setInputText(p.text);
                    setErrorMsg("");
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {errorMsg && <div className="error-banner">⚠️ {errorMsg}</div>}

          <div className="input-actions">
            <button
              type="button"
              className="btn-clear"
              onClick={handleClear}
              disabled={loading || (!inputText && !result)}
            >
              Clear
            </button>
            <button
              type="button"
              className="btn-analyze"
              onClick={handleAnalyze}
              disabled={loading || !inputText.trim()}
            >
              {loading ? (
                <>
                  <span className="spinner"></span> Analyzing Emotional State...
                </>
              ) : (
                "🔍 Analyze with AI"
              )}
            </button>
          </div>
        </div>

        {/* Results View */}
        {result && (
          <div className="detector-card results-card fade-in">
            <div className="card-header">
              <h3>📊 Clinical AI Analysis Results</h3>
              <span className="model-tag">{result.model_name}</span>
            </div>

            {/* Primary Diagnosis Hero */}
            <div
              className="primary-result-box"
              style={{
                borderLeftColor: result.recommendation?.badge_color || "#7c3aed",
              }}
            >
              <div className="result-top-row">
                <div>
                  <span className="result-caption">Primary Detected State</span>
                  <h2
                    className="prediction-name"
                    style={{
                      color: result.recommendation?.badge_color || "#7c3aed",
                    }}
                  >
                    {result.prediction}
                  </h2>
                </div>
                <div className="confidence-badge">
                  <span className="confidence-num">
                    {(result.confidence * 100).toFixed(1)}%
                  </span>
                  <span className="confidence-label">Confidence</span>
                </div>
              </div>

              <p className="summary-text">{result.recommendation?.summary}</p>
            </div>

            {/* Crisis Alert Banner (if critical) */}
            {result.recommendation?.is_crisis && (
              <div className="crisis-alert-box">
                <div className="crisis-title">
                  🚨 Immediate Support & Helpline Resources
                </div>
                <p>
                  You matter, and immediate free confidential care is available 24/7.
                  Please reach out to one of the trained crisis lines below:
                </p>
                <div className="helpline-grid">
                  {result.recommendation?.helplines?.map((hl, i) => (
                    <div key={i} className="helpline-item">
                      <strong>{hl.name}:</strong>
                      <span className="phone-tag">{hl.contact}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Probability Breakdown */}
            <div className="probabilities-section">
              <h4>Class Probabilities Breakdown</h4>
              <div className="prob-bars-list">
                {result.ranked_classes.map((rc) => {
                  const isTop = rc.label === result.prediction;
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
                            backgroundColor: isTop
                              ? result.recommendation?.badge_color || "#7c3aed"
                              : "#94a3b8",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actionable Insights */}
            {result.recommendation?.tips && (
              <div className="recommendations-box">
                <h4>🌱 Personalized Coping Guidance</h4>
                <ul className="tips-list">
                  {result.recommendation.tips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Next Steps Actions */}
            <div className="next-steps-actions">
              <button
                className="action-btn secondary"
                onClick={() => navigate(ROUTES.ASSESSMENT)}
              >
                📋 Take Comprehensive Assessment
              </button>
              <button
                className="action-btn primary"
                onClick={() => navigate(ROUTES.SERENY_DOCTOR)}
              >
                🩺 Connect with a Therapist
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
