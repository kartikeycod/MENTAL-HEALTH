import { useState, useEffect, useCallback } from "react";
import { getDoctorById, updateDoctorProfile } from "../services/firebase/doctorService";
import { getPlansByDoctorUid } from "../services/firebase/doctorPlanService";
import { getDoctorReviews } from "../services/firebase/reviewService";

export const useDoctor = (doctorId) => {
  const [doctor, setDoctor] = useState(null);
  const [plans, setPlans] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDoctorData = useCallback(async () => {
    if (!doctorId) return;
    setLoading(true);
    setError(null);
    try {
      const [docProfile, docPlans, docReviews] = await Promise.all([
        getDoctorById(doctorId),
        getPlansByDoctorUid(doctorId),
        getDoctorReviews(doctorId),
      ]);

      setDoctor(docProfile);
      setPlans(docPlans);
      setReviews(docReviews);
    } catch (err) {
      console.error("Error fetching doctor profile details:", err);
      setError("Failed to load doctor profile.");
    } finally {
      setLoading(false);
    }
  }, [doctorId]);

  useEffect(() => {
    fetchDoctorData();
  }, [fetchDoctorData]);

  const updateProfile = async (updates) => {
    if (!doctorId) return;
    await updateDoctorProfile(doctorId, updates);
    setDoctor((prev) => ({ ...prev, ...updates }));
  };

  return {
    doctor,
    plans,
    reviews,
    loading,
    error,
    refresh: fetchDoctorData,
    updateProfile,
  };
};
