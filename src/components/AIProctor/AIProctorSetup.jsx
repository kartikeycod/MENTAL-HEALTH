import React from "react";
import { useAIProctorSetup } from "../../hooks/useAIProctorSetup";
import "../AIProctoring.css";

const AIProctorSetup = ({ uid, onSetupComplete }) => {
  const {
    prefs,
    setPrefs,
    schedule,
    setSchedule,
    handleSave,
  } = useAIProctorSetup(uid, onSetupComplete);

  return (
    <div className="ai-container">
      <h1>AI Counselling Setup</h1>
      <p>Let’s personalize your daily wellness routine.</p>

      <form className="ai-form" onSubmit={handleSave}>
        <div className="ai-field">
          <label>Your Location:</label>
          <input
            type="text"
            value={prefs.location}
            onChange={(e) => setPrefs({ ...prefs, location: e.target.value })}
            placeholder="City, Country"
            required
          />
        </div>

        <div className="ai-field">
          <label>Diet Type:</label>
          <select
            value={prefs.dietType}
            onChange={(e) =>
              setPrefs({ ...prefs, dietType: e.target.value })
            }
          >
            <option value="balanced">Balanced (Veg + Non-Veg)</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
          </select>
        </div>

        <div className="ai-field">
          <label>Exercise Time:</label>
          <input
            type="time"
            value={schedule.exerciseTime}
            onChange={(e) =>
              setSchedule({ ...schedule, exerciseTime: e.target.value })
            }
            required
          />
        </div>

        <div className="ai-field">
          <label>Meal Times (3 slots):</label>
          {schedule.mealTimes.map((t, i) => (
            <input
              key={i}
              type="time"
              value={t}
              onChange={(e) => {
                const arr = [...schedule.mealTimes];
                arr[i] = e.target.value;
                setSchedule({ ...schedule, mealTimes: arr });
              }}
              required
            />
          ))}
        </div>

        <div className="ai-field">
          <label>Weekly Psychometric Test Day:</label>
          <select
            value={schedule.weeklyTestDay}
            onChange={(e) =>
              setSchedule({ ...schedule, weeklyTestDay: e.target.value })
            }
          >
            {[
              "Sunday",
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ].map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <button className="ai-btn" type="submit">
          Save & Continue
        </button>
      </form>
    </div>
  );
};

export default AIProctorSetup;
