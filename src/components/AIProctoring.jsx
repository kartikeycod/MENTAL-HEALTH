import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import AIProctorDashboard from "./AIProctorDashboard";
import "./AIProctorDashboard.css";

const AIProctoring = () => {
  const [uid, setUid] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        alert("Please log in first.");
        window.location.href = "/auth";
        return;
      }
      setUid(user.uid);
      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) setUserData(snap.data());
      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) {
    return (
      <div className="ai-dashboard">
        <p>Loading AI Proctor Dashboard...</p>
      </div>
    );
  }

  return <AIProctorDashboard uid={uid} userData={userData} />;
};

export default AIProctoring;
