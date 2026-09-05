import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { subscribeToAuthChanges } from "../services/firebase/auth.service";
import { getLegacyUserDoc } from "../services/firebase/user.service";
import { saveMentalHealthAssessment } from "../services/firebase/assessment.service";
import { computeAssessmentScores } from "../utils/assessment/scoreCalculator";
import { getStoredUser, setStoredUser } from "../utils/storage/storageHelpers";
import {
  ASSESSMENT_QUESTIONS,
  ASSESSMENT_SECTIONS,
} from "../constants/assessment";
import { ROUTES } from "../constants/routes";

export const useMentalHealthAssessment = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [nameFromDB, setNameFromDB] = useState("");
  const [answers, setAnswers] = useState({});
  const [loadingUser, setLoadingUser] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [sectionIndex, setSectionIndex] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const unsub = subscribeToAuthChanges(async (u) => {
      if (!u) {
        navigate(ROUTES.AUTH);
        return;
      }
      setUser(u);
      try {
        const userDoc = await getLegacyUserDoc(u.uid);
        if (userDoc) {
          const name = userDoc.NAME || userDoc.name || "";
          setNameFromDB(name);
          setStoredUser({ name, email: u.email, uid: u.uid });
        } else {
          const stored = getStoredUser();
          if (stored) setNameFromDB(stored.name || "");
        }
      } catch (err) {
        console.error("Error fetching user doc:", err);
      } finally {
        setLoadingUser(false);
      }
    });

    return () => unsub();
  }, [navigate]);

  const questionsByDomain = (domain) =>
    ASSESSMENT_QUESTIONS.filter((q) => q.domain === domain);

  const totalQuestions = ASSESSMENT_QUESTIONS.length;

  const handleSelect = (qid, value) => {
    setAnswers((prev) => ({ ...prev, [qid]: Number(value) }));
  };

  const handleSubmit = async () => {
    const answeredCount = Object.keys(answers).length;
    if (answeredCount < totalQuestions) {
      alert(`Please answer all ${totalQuestions} questions (answered ${answeredCount}).`);
      return;
    }

    if (!user) {
      alert("Please log in to submit the assessment.");
      navigate(ROUTES.AUTH);
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      const scores = computeAssessmentScores(answers, ASSESSMENT_QUESTIONS);
      const displayName =
        nameFromDB || getStoredUser()?.name || "";

      await saveMentalHealthAssessment({
        user,
        nameFromDB: displayName,
        answers,
        subscores: scores.subscores,
        MHI: scores.MHI,
        normalized: scores.normalized,
        conclusion: scores.conclusion,
        suicidalFlag: scores.suicidalFlag,
      });

      setMessage(`✅ Submitted — Score ${scores.normalized} — ${scores.conclusion}`);
      setTimeout(() => {
        navigate(ROUTES.HOME);
      }, 1200);
    } catch (err) {
      console.error("Error saving assessment:", err);
      setMessage("❌ Error saving assessment. Check console.");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    user,
    nameFromDB,
    answers,
    loadingUser,
    submitting,
    sectionIndex,
    setSectionIndex,
    message,
    sections: ASSESSMENT_SECTIONS,
    questionsByDomain,
    totalQuestions,
    handleSelect,
    handleSubmit,
  };
};
