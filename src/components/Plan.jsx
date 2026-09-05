import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { subscribeToAuthChanges } from "../services/firebase/auth.service";
import { saveUserPlanSelection } from "../services/firebase/user.service";
import { setSelectedPlan, setCourseStatus } from "../utils/storage/storageHelpers";
import { ROUTES } from "../constants/routes";
import "./Plan.css";

const Plan = () => {
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = subscribeToAuthChanges((user) => {
      if (!user) {
        alert("Please log in to choose a plan.");
        navigate(ROUTES.AUTH);
        return;
      }
      setUid(user.uid);
      setLoading(false);
    });
    return () => unsub();
  }, [navigate]);

  const handleSelect = async (plan) => {
    if (!uid) return;
    try {
      await saveUserPlanSelection(uid, plan);

      setSelectedPlan(plan);
      setCourseStatus("active");

      if (plan === "ai") {
        alert("🧠 AI Counselling selected. Let’s set up your AI Proctor module.");
        navigate(ROUTES.AI_PROCTOR);
      } else {
        alert("👩‍⚕️ Doctor Counselling selected.");
        navigate(ROUTES.DOCTOR_DASHBOARD);
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
