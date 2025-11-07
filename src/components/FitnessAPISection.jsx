// ✅ src/components/FitnessAPISection.jsx
import React from "react";
import "./FitnessAPISection.css";

const FitnessAPISection = () => {
  // Function to handle button click
  const handleConnectClick = () => {
    // Opens your fitness-band site in a new tab
    window.open("https://fitness-band-mh.vercel.app/", "_blank", "noopener,noreferrer");
  };

  return (
    <section className="fitness-api-section">
      <div className="fitness-api-bg-glow"></div>

      <div className="fitness-api-content">
        <h2 className="fitness-api-title">
          Seamless Fitness Band Integration
        </h2>
        <p className="fitness-api-subtitle">
          Serenium connects to free fitness-band APIs to bring real-time heart
          rate, sleep, and movement data directly into your mental wellness
          dashboard.
        </p>

        <div className="fitness-api-grid">
          <div className="fitness-api-card">
            <div className="fitness-api-icon">❤️</div>
            <h3>Live Heartbeat Sync</h3>
            <p>
              Get live biometric readings from APIs like Google Fit and Health
              Connect — keeping your AI wellness profile continuously updated.
            </p>
          </div>

          <div className="fitness-api-card">
            <div className="fitness-api-icon">📊</div>
            <h3>Smart Health Tracking</h3>
            <p>
              Track heart rate variability, steps, and recovery insights
              automatically — no paid subscriptions or manual uploads required.
            </p>
          </div>

          <div className="fitness-api-card">
            <div className="fitness-api-icon">🤖</div>
            <h3>+80% AI Accuracy Boost</h3>
            <p>
              Integrating physical metrics with Serenium’s AI engine enhances
              emotion prediction accuracy by over <b>80%</b>.
            </p>
          </div>
        </div>

        <div className="fitness-api-cta">
          <h4>Connect Your Fitness Band Now</h4>
          <p>
            Experience a futuristic blend of mind and body data — powered by
            real-time biometric connectivity.
          </p>
          {/* 🚀 On click, open the external link */}
          <button className="connect-btn" onClick={handleConnectClick}>
            ⚡ Connect Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default FitnessAPISection;
