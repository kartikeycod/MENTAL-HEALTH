// ✅ src/components/AIProctor/DailyTest.jsx
import React, { useState } from "react";
import "./DailyTest.css";

const QUESTIONS = [
  "How was your overall mood today?",
  "How well did you sleep last night?",
  "How focused did you feel during the day?",
  "How stressful was your day?",
  "Did you practice any relaxation/mindfulness?",
];

const OPTIONS = ["Very Poor", "Poor", "Neutral", "Good", "Excellent"];

const DailyTest = ({ onComplete }) => {
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleSelect = (qIndex, value) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: value }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < QUESTIONS.length) {
      alert("Please answer all questions.");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      // store to DB if you want here
      alert("✅ Daily reflection submitted!");
      onComplete();
    }, 800);
  };

  return (
    <div className="dailytest-container fade-in">
      <h2 className="dt-title">🧘 Daily Reflection</h2>
      <p className="dt-subtitle">
        Take a mindful minute. How did you feel today?
      </p>

      <div className="dt-grid">
        {QUESTIONS.map((q, i) => (
          <div key={i} className="dt-card">
            <label className="dt-label">
              {i + 1}. {q}
            </label>
            <div className="dt-options">
              {OPTIONS.map((opt) => (
                <button
                  key={opt}
                  className={`dt-option ${answers[i] === opt ? "selected" : ""}`}
                  onClick={() => handleSelect(i, opt)}
                  type="button"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        disabled={submitting}
        className="dt-submit"
        onClick={handleSubmit}
        type="button"
      >
        {submitting ? "Submitting..." : "Submit Reflection"}
      </button>
    </div>
  );
};

export default DailyTest;
