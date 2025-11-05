import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import AIProctorSetup from "./AIProctorSetup";
import AIProctorDashboard from "./AIProctorDashboard";
import "../../App.css";

const AIProctor = () => {
  const [loading, setLoading] = useState(true);
  const [hasSetup, setHasSetup] = useState(false);
  const [uid, setUid] = useState(null);
  const [userData, setUserData] = useState({});
  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        alert("Please log in first.");
        navigate("/auth");
        return;
      }

      setUid(user.uid);
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setUserData(data);
        setHasSetup(!!data.schedule?.exercise?.time);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [auth, db, navigate]);

  if (loading) {
    return (
      <div style={{ minHeight: "80vh", display: "grid", placeItems: "center" }}>
        <p>Loading your AI Counselling data...</p>
      </div>
    );
  }

  return hasSetup ? (
    <AIProctorDashboard
      uid={uid}
      userData={userData}
      onEdit={() => setHasSetup(false)}
    />
  ) : (
    <AIProctorSetup uid={uid} onSetupComplete={() => setHasSetup(true)} />
  );
};

export default AIProctor;
