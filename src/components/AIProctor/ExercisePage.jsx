// ✅ src/components/AIProctor/ExercisePage.jsx
import React, { useEffect, useRef, useState } from "react";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import "./ExercisePage.css";

const ExercisePage = () => {
  const videoRef = useRef(null);
  const [status, setStatus] = useState("🧘 Initializing camera...");
  const [cameraActive, setCameraActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [saving, setSaving] = useState(false);
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    let stream;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        videoRef.current.srcObject = stream;
        setCameraActive(true);
        setStatus("📹 Camera active! Perform your exercise.");
      } catch {
        setStatus("⚠️ Please allow camera access to continue.");
      }
    };
    startCamera();
    return () => stream?.getTracks().forEach((t) => t.stop());
  }, []);

  useEffect(() => {
    if (!cameraActive || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [cameraActive, timeLeft]);

  const handleComplete = async () => {
    const user = auth.currentUser;
    if (!user) return alert("Please log in first.");

    setSaving(true);
    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      alert("User record not found.");
      setSaving(false);
      return;
    }

    const currentDay = snap.data()?.course?.currentDay || 1;
    const logRef = collection(db, "users", user.uid, "exerciseLogs");

    await addDoc(logRef, {
      date: new Date().toISOString().split("T")[0],
      duration: 30,
      status: "completed",
      completedAt: serverTimestamp(),
    });

    await updateDoc(ref, {
      "course.exerciseDone": true,
      "course.currentDay": currentDay,
      updatedAt: serverTimestamp(),
    });

    setSaving(false);
    alert("✅ Exercise logged successfully!");
    window.location.href = "/";
  };

  return (
    <div className="exercise-page fade-in">
      <h1>🏋️ AI Exercise Proctor</h1>
      <p>{status}</p>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="exercise-video"
      />
      {cameraActive && (
        <>
          <div className="exercise-timer">⏱️ {timeLeft}s left</div>
          <button
            className="complete-btn"
            onClick={handleComplete}
            disabled={saving}
          >
            {saving ? "Saving..." : "Complete Exercise"}
          </button>
        </>
      )}
    </div>
  );
};

export default ExercisePage;
