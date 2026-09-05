import React from "react";
import DailyTest from "./DailyTest";
import { useAIProctorDashboard } from "../../hooks/useAIProctorDashboard";
import "../AIProctoring.css";
import "./AIProctorDashboard.css";

const AIProctorDashboard = () => {
  const {
    loading,
    dayPlan,
    course,
    showTest,
    showDialog,
    completed,
    handleToggle,
    handleCompleteDay,
    handleTestComplete,
  } = useAIProctorDashboard();

  if (loading)
    return <div className="ai-loading">Loading your plan...</div>;

  if (showTest)
    return (
      <div className="dailytest-container fade-in">
        <DailyTest onComplete={handleTestComplete} />
      </div>
    );

  if (!dayPlan)
    return (
      <div className="ai-finish">
        All 28 days completed 🎉 You’ve finished your AI Wellness Course!
      </div>
    );

  return (
    <div className="dailytest-container fade-in">
      <h2 className="dt-title">🌞 Day {course?.currentDay || 1} Plan</h2>
      <p className="dt-subtitle">
        Stay consistent. Your healing journey continues!
      </p>

      {/* 🥗 Checklist Section */}
      <div className="dt-grid">
        {["breakfast", "lunch", "dinner", "exercise"].map((type) => (
          <div key={type} className="dt-card">
            <label className="dt-label">{type.charAt(0).toUpperCase() + type.slice(1)}</label>
            <p>
              {type === "breakfast"
                ? dayPlan.breakfast
                : type === "lunch"
                ? dayPlan.lunch
                : type === "dinner"
                ? dayPlan.dinner
                : "🧘 Yoga / Cardio — as per your setup time"}
            </p>
            <label className="checkbox">
              <input
                type="checkbox"
                checked={completed[type]}
                onChange={() => handleToggle(type)}
              />{" "}
              Completed
            </label>
          </div>
        ))}
      </div>

      <div className="ai-progress">
        <p>🔥 Streak: {course?.streak || 0} days</p>
        <p>📈 Progress: {Math.round(course?.progressPct || 0)}%</p>
      </div>

      <button className="dt-submit" onClick={handleCompleteDay}>
        Mark Day Complete → Take Daily Test
      </button>

      {showDialog && (
        <div className="ai-dialog-overlay">
          <div className="ai-dialog">
            <h3>🌟 Progress Updated!</h3>
            <p>
              Great job staying consistent. Let’s do your daily reflection next!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIProctorDashboard;
