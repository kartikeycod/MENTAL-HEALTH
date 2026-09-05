import React, { useEffect, useState } from "react";
import { subscribeToAuthChanges } from "../services/firebase/auth.service";
import { getUserDoc } from "../services/firebase/user.service";
import { ROUTES } from "../constants/routes";
import AIProctorDashboard from "./AIProctor/AIProctorDashboard";
import "./AIProctor/AIProctorDashboard.css";

const AIProctoring = () => {
  const [uid, setUid] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToAuthChanges(async (user) => {
      if (!user) {
        alert("Please log in first.");
        window.location.href = ROUTES.AUTH;
        return;
      }
      setUid(user.uid);
      const data = await getUserDoc(user.uid);
      if (data) setUserData(data);
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
