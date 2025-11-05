// ✅ src/components/Plan.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import "./Plan.css";

const Plan = () => {
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        alert("Please log in to choose a plan.");
        navigate("/auth");
        return;
      }
      setUid(user.uid);
      setLoading(false);
    });
    return () => unsub();
  }, [auth, navigate]);

  const handleSelect = async (plan) => {
    if (!uid) return;
    try {
      const userRef = doc(db, "users", uid);
      const snap = await getDoc(userRef);

      const start = new Date();
      const end = new Date(start);
      end.setDate(end.getDate() + 28);

      const payload = {
        plan,
        course: {
          startDate: start.toISOString(),
          endDate: end.toISOString(),
          currentDay: 1,
          progressPct: 0,
          testMode: "daily", // 🧠 now daily test instead of weekly
          status: "active",
          updatedAt: serverTimestamp(),
        },
        schedule:
          snap.exists() && snap.data().schedule
            ? snap.data().schedule
            : { exercise: null, meals: null, testMode: "daily" },
        lastLoginAt: serverTimestamp(),
      };

      await setDoc(userRef, payload, { merge: true });
      localStorage.setItem("selectedPlan", plan);
      localStorage.setItem("courseStatus", "active");

      if (plan === "ai") {
        alert("🧠 AI Counselling selected. Let’s set up your AI Proctor module.");
        navigate("/ai-proctor"); // ✅ new route
      } else {
        alert("👩‍⚕️ Doctor Counselling selected.");
        navigate("/doctor-dashboard");
      }
    } catch (err) {
      console.error(err);
      alert("Could not save your plan. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="plan-loading">
        <p>Checking your session…</p>
      </div>
    );
  }

  return (
    <div className="plan-container">
      <h1 className="plan-title">Choose Your Wellness Path</h1>
      <p className="plan-subtitle">
        Pick the plan that fits your healing journey. You can always switch later.
      </p>

      <div className="plan-grid">
        {/* AI Counselling Plan */}
        <div className="plan-card">
          <h2 className="plan-heading">AI Counselling</h2>
          <p className="plan-desc">
            A guided 28-day mental wellness course with AI-based proctoring,
            daily exercises, and AI check-ins.
          </p>
          <ul className="plan-list">
            <li>Daily exercise & meal tracking</li>
            <li>AI feedback and motivation</li>
            <li>Personalized daily tests</li>
          </ul>
          <button className="plan-btn" onClick={() => handleSelect("ai")}>
            Select AI Counselling
          </button>
        </div>

        {/* Doctor Counselling Plan */}
        <div className="plan-card">
          <h2 className="plan-heading">Doctor Counselling</h2>
          <p className="plan-desc">
            One-on-one professional sessions with licensed therapists and mental
            health specialists for deeper guidance.
          </p>
          <ul className="plan-list">
            <li>Video consultations</li>
            <li>Personal care plan</li>
            <li>Confidential therapy sessions</li>
          </ul>
          <button className="plan-btn" onClick={() => handleSelect("doctor")}>
            Select Doctor Counselling
          </button>
        </div>
      </div>
    </div>
  );
};

export default Plan;
