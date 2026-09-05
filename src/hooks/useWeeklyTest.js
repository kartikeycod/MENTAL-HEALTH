import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { subscribeToAuthChanges } from "../services/firebase/auth.service";
import { submitWeeklyTestResults } from "../services/firebase/aiProctor.service";
import {
  WEEKLY_TEST_QUESTIONS,
  WEEKLY_TEST_OPTIONS,
} from "../constants/weeklyTest";
import { ROUTES } from "../constants/routes";

export const useWeeklyTest = () => {
  const [uid, setUid] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
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

  const handleSelect = (qIndex, value) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: value }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < WEEKLY_TEST_QUESTIONS.length) {
      alert("Please complete all 50 questions before submitting.");
      return;
    }
    if (!uid) return;

    setSubmitting(true);

    try {
      await submitWeeklyTestResults(uid, answers, WEEKLY_TEST_QUESTIONS.length);
      setShowModal(true);
      setSubmitting(false);

      setTimeout(() => {
        setShowModal(false);
        navigate(ROUTES.AI_PROCTOR_DASHBOARD);
      }, 3000);
    } catch (err) {
      console.error("Error submitting weekly test:", err);
      setSubmitting(false);
    }
  };

  const calculatedAvgScore =
    Object.keys(answers).length > 0
      ? (
          Object.values(answers).reduce((a, b) => a + b, 0) /
          WEEKLY_TEST_QUESTIONS.length
        ).toFixed(2)
      : 0;

  return {
    uid,
    answers,
    submitting,
    showModal,
    questions: WEEKLY_TEST_QUESTIONS,
    options: WEEKLY_TEST_OPTIONS,
    calculatedAvgScore,
    handleSelect,
    handleSubmit,
  };
};
