import React from "react";
import { useExercisePage } from "../../hooks/useExercisePage";
import "./ExercisePage.css";

const ExercisePage = () => {
  const {
    videoRef,
    status,
    cameraActive,
    timeLeft,
    saving,
    handleComplete,
  } = useExercisePage();

  return (
    <div className="exercise-page fade-in">
      <h1>🏋️ AI Exercise Proctor</h1>
      <p>{status}</p>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="exercise-video"
      />
      {cameraActive && (
        <>
          <div className="exercise-timer">⏱️ {timeLeft}s left</div>
          <button
            className="complete-btn"
            onClick={handleComplete}
            disabled={saving}
          >
            {saving ? "Saving..." : "Complete Exercise"}
          </button>
        </>
      )}
    </div>
  );
};

export default ExercisePage;
