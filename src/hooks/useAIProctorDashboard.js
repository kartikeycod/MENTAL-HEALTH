import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { subscribeToAuthChanges } from "../services/firebase/auth.service";
import {
  fetchAIProctorPlan,
  completeAIDay,
} from "../services/firebase/aiProctor.service";
import { ROUTES } from "../constants/routes";

export const useAIProctorDashboard = () => {
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

  const navigate = useNavigate();

  useEffect(() => {
    const unsub = subscribeToAuthChanges((user) => {
      if (!user) {
        alert("Please log in first.");
        navigate(ROUTES.AUTH);
        return;
      }
      setUid(user.uid);
    });
    return () => unsub();
  }, [navigate]);

  const loadPlan = useCallback(async (targetUid = uid) => {
    if (!targetUid) return;
    try {
      const res = await fetchAIProctorPlan(targetUid);
      if (res) {
        setCourse(res.course);
        setDayPlan(res.dayPlan);
      }
    } catch (err) {
      console.error("Error loading plan:", err);
    } finally {
      setLoading(false);
    }
  }, [uid]);

  useEffect(() => {
    loadPlan();
  }, [loadPlan, uid]);

  const handleToggle = (type) => {
    setCompleted((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const handleCompleteDay = async () => {
    if (!uid || !dayPlan) return;

    const allChecked = Object.values(completed).every(Boolean);
    if (!allChecked) {
      alert("Please complete all meals and exercise before proceeding!");
      return;
    }

    await completeAIDay(uid, course, completed);

    setShowDialog(true);
    setTimeout(() => {
      setShowDialog(false);
      setShowTest(true);
    }, 1800);
  };

  const handleTestComplete = async () => {
    alert("✅ Daily test submitted successfully!");
    setShowTest(false);
    await loadPlan(uid);
    setCompleted({
      breakfast: false,
      lunch: false,
      dinner: false,
      exercise: false,
    });
  };

  return {
    uid,
    loading,
    dayPlan,
    course,
    showTest,
    showDialog,
    completed,
    handleToggle,
    handleCompleteDay,
    handleTestComplete,
  };
};
