import { useState, useEffect, useCallback } from "react";
import { getDoctorReviews, createReview, hasPatientReviewedDoctor } from "../services/firebase/reviewService";
import { checkPatientPurchasedDoctor } from "../services/firebase/orderService";
import { useAuth } from "./useAuth";
import { validateReviewForm } from "../utils/validation/doctorValidation";

export const useReviews = (doctorUid) => {
  const { user, profile } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canReview, setCanReview] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [checkingEligibility, setCheckingEligibility] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = useCallback(async () => {
    if (!doctorUid) return;
    setLoading(true);
    try {
      const list = await getDoctorReviews(doctorUid);
      setReviews(list);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  }, [doctorUid]);

  const checkEligibility = useCallback(async () => {
    if (!user?.uid || !doctorUid) {
      setCanReview(false);
      setAlreadyReviewed(false);
      return;
    }
    setCheckingEligibility(true);
    try {
      const eligible = await checkPatientPurchasedDoctor(user.uid, doctorUid);
      const reviewed = await hasPatientReviewedDoctor(user.uid, doctorUid);
      setAlreadyReviewed(reviewed);
      setCanReview(eligible && !reviewed);
    } catch (err) {
      console.error("Error checking review eligibility:", err);
      setCanReview(false);
    } finally {
      setCheckingEligibility(false);
    }
  }, [user?.uid, doctorUid]);

  useEffect(() => {
    fetchReviews();
    checkEligibility();
  }, [fetchReviews, checkEligibility]);

  const postReview = async ({ rating, comment, orderId }) => {
    if (!user?.uid || !doctorUid) {
      throw new Error("User must be logged in to submit a review.");
    }

    const { isValid, errors } = validateReviewForm({ rating, comment });
    if (!isValid) {
      const msg = Object.values(errors).join(" ");
      throw new Error(msg);
    }

    setSubmitting(true);
    try {
      const newReview = await createReview({
        doctorUid,
        patientUid: user.uid,
        patientName: profile?.displayName || user.displayName || "Patient",
        orderId,
        rating,
        comment,
      });

      setReviews((prev) => [newReview, ...prev]);
      return newReview;
    } catch (err) {
      console.error("Failed to post review:", err);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    reviews,
    loading,
    canReview,
    alreadyReviewed,
    checkingEligibility,
    submitting,
    postReview,
    refresh: fetchReviews,
  };
};
