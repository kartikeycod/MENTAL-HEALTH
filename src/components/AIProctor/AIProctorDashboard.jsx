// ✅ src/components/AIProctor/AIProctorDashboard.jsx
import React, { useEffect, useState } from "react";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import DailyTest from "./DailyTest";
import "../AIProctoring.css";
import "./AIProctorDashboard.css";

const AIProctorDashboard = () => {
  const [uid, setUid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dayPlan, setDayPlan] = useState(null);
  const [course, setCourse] = useState(null);
  const [showTest, setShowTest] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [completed, setCompleted] = useState({
    breakfast: false,
    lunch: false,
    dinner: false,
    exercise: false,
  });

  const db = getFirestore();
  const auth = getAuth();
  const navigate = useNavigate();

  // 🔒 Verify login
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        alert("Please log in first.");
        navigate("/auth");
        return;
      }
      setUid(user.uid);
    });
    return () => unsub();
  }, [auth, navigate]);

  // 📦 Load current day plan
  const fetchPlan = async (customUid = uid) => {
    if (!customUid) return;
    const userRef = doc(db, "users", customUid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return;

    const data = userSnap.data();
    setCourse(data.course || {});
    const dayNumber = data.course?.currentDay || 1;

    const plans = await getDocs(collection(db, "users", customUid, "mealPlan"));
    const allMeals = [];
    plans.forEach((p) => allMeals.push(...(p.data().meals || [])));

    const today = allMeals.find((m) => m.day === `Day ${dayNumber}`);
    setDayPlan(today || null);
    setLoading(false);
  };

  useEffect(() => {
    fetchPlan();
  }, [uid]);

  const handleToggle = (type) => {
    setCompleted((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  // ✅ Mark day complete
  const handleCompleteDay = async () => {
    if (!uid || !dayPlan) return;

    const allChecked = Object.values(completed).every(Boolean);
    if (!allChecked) {
      alert("Please complete all meals and exercise before proceeding!");
      return;
    }

    const userRef = doc(db, "users", uid);
    const newDay = (course.currentDay || 1) + 1;
    const newProgress = Math.min(((newDay - 1) / 28) * 100, 100);
    const newStreak = (course.streak || 0) + 1;

    await updateDoc(userRef, {
      "course.currentDay": newDay,
      "course.progressPct": newProgress,
      "course.streak": newStreak,
      "course.updatedAt": serverTimestamp(),
      [`completedDays.day${course.currentDay}`]: {
        meals: completed,
        completedAt: new Date().toISOString(),
      },
    });

    setShowDialog(true);
    setTimeout(() => {
      setShowDialog(false);
      setShowTest(true);
    }, 1800);
  };

  // 🧠 Test submission handler
  const handleTestComplete = async () => {
    alert("✅ Daily test submitted successfully!");
    setShowTest(false);

    // 🟢 Fetch updated next-day plan directly
    await fetchPlan(uid);
    setCompleted({
      breakfast: false,
      lunch: false,
      dinner: false,
      exercise: false,
    });
  };

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
      <h2 className="dt-title">🌞 Day {course.currentDay || 1} Plan</h2>
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
        <p>🔥 Streak: {course.streak || 0} days</p>
        <p>📈 Progress: {Math.round(course.progressPct || 0)}%</p>
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
