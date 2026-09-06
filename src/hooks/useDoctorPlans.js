import { useState, useEffect, useCallback } from "react";
import {
  getPlansByDoctorUid,
  createDoctorPlan,
  updateDoctorPlan,
  deleteDoctorPlan,
} from "../services/firebase/doctorPlanService";

export const useDoctorPlans = (doctorUid) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPlans = useCallback(async () => {
    if (!doctorUid) return;
    setLoading(true);
    try {
      const list = await getPlansByDoctorUid(doctorUid);
      setPlans(list);
    } catch (err) {
      console.error("Error fetching doctor plans:", err);
    } finally {
      setLoading(false);
    }
  }, [doctorUid]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const addPlan = async (planData) => {
    if (!doctorUid) return;
    const newPlan = await createDoctorPlan(doctorUid, planData);
    setPlans((prev) => [...prev, newPlan]);
    return newPlan;
  };

  const updatePlan = async (planId, updates) => {
    await updateDoctorPlan(planId, updates);
    setPlans((prev) =>
      prev.map((p) => (p.id === planId ? { ...p, ...updates } : p))
    );
  };

  const removePlan = async (planId) => {
    await deleteDoctorPlan(planId);
    setPlans((prev) => prev.filter((p) => p.id !== planId));
  };

  return { plans, loading, addPlan, updatePlan, removePlan, refresh: fetchPlans };
};
