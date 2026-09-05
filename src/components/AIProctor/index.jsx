import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { subscribeToAuthChanges } from "../../services/firebase/auth.service";
import { getUserDoc } from "../../services/firebase/user.service";
import { ROUTES } from "../../constants/routes";
import AIProctorSetup from "./AIProctorSetup";
import AIProctorDashboard from "./AIProctorDashboard";
import "../../App.css";

const AIProctor = () => {
  const [loading, setLoading] = useState(true);
  const [hasSetup, setHasSetup] = useState(false);
  const [uid, setUid] = useState(null);
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = subscribeToAuthChanges(async (user) => {
      if (!user) {
        alert("Please log in first.");
        navigate(ROUTES.AUTH);
        return;
      }

      setUid(user.uid);
      const data = await getUserDoc(user.uid);
      if (data) {
        setUserData(data);
        setHasSetup(!!data.schedule?.exercise?.time);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [navigate]);

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
