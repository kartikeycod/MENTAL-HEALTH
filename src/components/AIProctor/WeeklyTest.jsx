// ✅ src/components/AIProctor/WeeklyTest.jsx
import React, { useState, useEffect } from "react";
import "./WeeklyTest.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  doc,
  updateDoc,
  collection,
  addDoc,
  getDoc,
  serverTimestamp,
  increment,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const QUESTIONS = [
  "I felt motivated throughout the week.",
  "I was able to focus on my daily tasks.",
  "I managed my stress effectively.",
  "I experienced a stable mood most days.",
  "I maintained a consistent sleep schedule.",
  "I felt physically energetic this week.",
  "I engaged in social interaction comfortably.",
  "I felt optimistic about my personal goals.",
  "I managed my time well this week.",
  "I avoided overthinking minor issues.",
  "I practiced mindfulness or relaxation.",
  "I maintained a healthy diet.",
  "I felt in control of my emotions.",
  "I avoided procrastination.",
  "I was kind to myself when I made mistakes.",
  "I reached out for help when needed.",
  "I handled unexpected challenges calmly.",
  "I stayed away from negative influences.",
  "I took small steps toward self-improvement.",
  "I felt connected with my purpose.",
  "I didn’t feel overwhelmed by responsibilities.",
  "I balanced work and rest effectively.",
  "I limited screen time and distractions.",
  "I reflected on my progress this week.",
  "I felt satisfied with my personal relationships.",
  "I took time to enjoy hobbies or interests.",
  "I experienced gratitude regularly.",
  "I maintained confidence in decision-making.",
  "I expressed emotions in a healthy way.",
  "I had a generally positive week.",
  "I avoided negative self-talk.",
  "I learned something new about myself.",
  "I managed anxiety when it appeared.",
  "I accepted things beyond my control.",
  "I felt hopeful about the future.",
  "I had a sense of accomplishment.",
  "I communicated effectively with others.",
  "I practiced good posture and breathing.",
  "I felt emotionally supported.",
  "I took time to rest when needed.",
  "I avoided comparing myself to others.",
  "I felt grateful for small things.",
  "I believed in my ability to improve.",
  "I had meaningful moments this week.",
  "I practiced patience in stressful situations.",
  "I showed empathy toward others.",
  "I took responsibility for my actions.",
  "I felt proud of my progress.",
  "I am ending this week with a peaceful mind.",
];

const OPTIONS = [1, 2, 3, 4, 5]; // 1 = Strongly Disagree, 5 = Strongly Agree

const WeeklyTest = () => {
  const [uid, setUid] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();

  // 🧩 Check Auth
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        alert("Please log in first.");
        navigate("/auth");
        return;
      }
      setUid(user.uid);
    });
    return () => unsub();
  }, [auth, navigate]);

  // 🧠 Select Options
  const handleSelect = (qIndex, value) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: value }));
  };

  // 💾 Submit Test
  const handleSubmit = async () => {
    if (Object.keys(answers).length < QUESTIONS.length) {
      alert("Please complete all 50 questions before submitting.");
      return;
    }
    if (!uid) return;

    setSubmitting(true);

    const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
    const avgScore = (totalScore / QUESTIONS.length).toFixed(2);

    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data();
    const weekNum = Math.ceil((userData?.course?.currentDay || 1) / 7);

    // ✅ Add to weeklyTests collection
    await addDoc(collection(db, "users", uid, "weeklyTests"), {
      week: weekNum,
      answers,
      totalScore,
      avgScore,
      createdAt: serverTimestamp(),
    });

    // ✅ Also maintain a summary record in userStats
    await addDoc(collection(db, "users", uid, "userStats"), {
      type: "weeklyTest",
      week: weekNum,
      avgScore: parseFloat(avgScore),
      date: new Date().toISOString().split("T")[0],
      recordedAt: serverTimestamp(),
    });

    // ✅ Update course progress
    const completedWeeks = weekNum;
    const totalWeeks = 4;
    const progressPct = Math.min(100, (completedWeeks / totalWeeks) * 100);

    // ✅ Update next test date
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 7);

    await updateDoc(userRef, {
      "course.progressPct": progressPct,
      "course.updatedAt": serverTimestamp(),
      "schedule.weeklyTest.nextTestDate": nextDate.toISOString(),
      "schedule.weeklyTest.lastTaken": serverTimestamp(),
      "course.testsCompleted": increment(1),
    });

    setShowModal(true);
    setSubmitting(false);

    // Smooth redirect after short delay
    setTimeout(() => {
      setShowModal(false);
      navigate("/ai-proctor-dashboard");
    }, 3000);
  };

  return (
    <div className="weeklytest-container fade-in">
      <h2 className="weekly-title">🧩 Weekly Mental Wellness Assessment</h2>
      <p className="weekly-subtitle">
        Please answer honestly. This helps track your progress and emotional
        well-being.
      </p>

      <div className="weekly-grid">
        {QUESTIONS.map((q, i) => (
          <div key={i} className="weekly-card">
            <label className="weekly-label">
              {i + 1}. {q}
            </label>
            <div className="weekly-options">
              {OPTIONS.map((opt) => (
                <button
                  key={opt}
                  className={`weekly-option ${
                    answers[i] === opt ? "selected" : ""
                  }`}
                  onClick={() => handleSelect(i, opt)}
                  type="button"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        disabled={submitting}
        className="weekly-submit"
        onClick={handleSubmit}
        type="button"
      >
        {submitting ? "Submitting..." : "Submit Weekly Test"}
      </button>

      {showModal && (
        <div className="weekly-modal">
          <div className="weekly-modal-content">
            <h3>🎉 Test Submitted Successfully!</h3>
            <p>Your results have been securely saved.</p>
            <p className="weekly-modal-score">
              <strong>Average Score:</strong> {Object.values(answers).reduce((a, b) => a + b, 0) / QUESTIONS.length}/5
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyTest;
