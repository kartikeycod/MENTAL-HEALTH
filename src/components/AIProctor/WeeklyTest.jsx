import React from "react";
import { useWeeklyTest } from "../../hooks/useWeeklyTest";
import "./WeeklyTest.css";

const WeeklyTest = () => {
  const {
    answers,
    submitting,
    showModal,
    questions,
    options,
    calculatedAvgScore,
    handleSelect,
    handleSubmit,
  } = useWeeklyTest();

  return (
    <div className="weeklytest-container fade-in">
      <h2 className="weekly-title">🧩 Weekly Mental Wellness Assessment</h2>
      <p className="weekly-subtitle">
        Please answer honestly. This helps track your progress and emotional
        well-being.
      </p>

      <div className="weekly-grid">
        {questions.map((q, i) => (
          <div key={i} className="weekly-card">
            <label className="weekly-label">
              {i + 1}. {q}
            </label>
            <div className="weekly-options">
              {options.map((opt) => (
                <button
                  key={opt}
                  className={`weekly-option ${
                    answers[i] === opt ? "selected" : ""
                  }`}
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
        className="weekly-submit"
        onClick={handleSubmit}
        type="button"
      >
        {submitting ? "Submitting..." : "Submit Weekly Test"}
      </button>

      {showModal && (
        <div className="weekly-modal">
          <div className="weekly-modal-content">
            <h3>🎉 Test Submitted Successfully!</h3>
            <p>Your results have been securely saved.</p>
            <p className="weekly-modal-score">
              <strong>Average Score:</strong> {calculatedAvgScore}/5
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyTest;
