// ✅ src/components/AIProctor/AIProctorSetup.jsx
import React, { useEffect, useState } from "react";
import {
  getFirestore,
  doc,
  setDoc,
  addDoc,
  collection,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import "../AIProctoring.css";
import useMealGenerator from "./useMealGenerator";

const AIProctorSetup = ({ uid, onSetupComplete }) => {
  const db = getFirestore();
  const [prefs, setPrefs] = useState({ location: "", dietType: "balanced" });
  const [schedule, setSchedule] = useState({
    exerciseTime: "",
    mealTimes: ["", "", ""],
    weeklyTestDay: "Sunday",
  });
  const [packType] = useState("ai"); // 🧠 Default AI pack since this setup is AI mode
  const generateMealPlan = useMealGenerator();

  // 🗺️ Auto-detect location
  useEffect(() => {
    if (prefs.location) return;
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
            );
            const data = await res.json();
            const city =
              data.address.city ||
              data.address.town ||
              data.address.village ||
              "";
            const country = data.address.country || "";
            if (city || country)
              setPrefs((p) => ({
                ...p,
                location: `${city ? city + ", " : ""}${country}`,
              }));
          } catch {}
        },
        () => {},
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  }, [prefs.location]);

  // 💾 Save setup to Firestore
  const handleSave = async (e) => {
    e.preventDefault();
    if (!uid) return;

    const userRef = doc(db, "users", uid);

    // Generate 28-day meal plan
    const mealPlan = generateMealPlan(prefs.location, prefs.dietType);
    const mealPlanData = {
      packType, // 👈 added packType (AI or Doctor)
      weekNumber: 1,
      meals: mealPlan.map((d, i) => ({
        day: `Day ${i + 1}`,
        breakfast: d[0],
        lunch: d[1],
        dinner: d[2],
        completed: false,
      })),
      generatedAt: serverTimestamp(),
    };

    // Store user preferences + schedule + initial course tracking
    await setDoc(
      userRef,
      {
        prefs,
        packType,
        schedule: {
          exercise: { time: schedule.exerciseTime },
          meals: schedule.mealTimes,
          weeklyTest: {
            day: schedule.weeklyTestDay,
            nextTestDate: new Date().toISOString(),
          },
        },
        course: {
          currentDay: 1,
          progressPct: 0,
          streak: 0,
          status: "active",
          startedAt: serverTimestamp(),
        },
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    // Add meal plan to subcollection
    await addDoc(collection(db, "users", uid, "mealPlan"), mealPlanData);

    localStorage.setItem("courseStatus", "active");
    localStorage.setItem("packType", packType);

    alert("✅ AI Pack setup complete!");
    onSetupComplete();
  };

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
