import { useEffect, useRef, useState } from "react";
import { getCurrentAuthUser } from "../services/firebase/auth.service";
import { logExerciseSession } from "../services/firebase/aiProctor.service";
import { ROUTES } from "../constants/routes";

export const useExercisePage = () => {
  const videoRef = useRef(null);
  const [status, setStatus] = useState("🧘 Initializing camera...");
  const [cameraActive, setCameraActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let stream;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
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
    const user = getCurrentAuthUser();
    if (!user) return alert("Please log in first.");

    setSaving(true);
    try {
      await logExerciseSession(user.uid);
      setSaving(false);
      alert("✅ Exercise logged successfully!");
      window.location.href = ROUTES.HOME;
    } catch (err) {
      alert(err.message || "Failed to log exercise.");
      setSaving(false);
    }
  };

  return {
    videoRef,
    status,
    cameraActive,
    timeLeft,
    saving,
    handleComplete,
  };
};
