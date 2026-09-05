import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { subscribeToAuthChanges } from "../../services/firebase/auth.service";
import { getUserDoc } from "../../services/firebase/user.service";
import { ROUTES } from "../../constants/routes";
import AIProctorSetup from "../../components/AIProctor/AIProctorSetup";

const AIProctorSetupPage = () => {
  const [uid, setUid] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = subscribeToAuthChanges(async (user) => {
      if (!user) {
        alert("Please log in first.");
        navigate(ROUTES.AUTH);
        return;
      }

      const userData = await getUserDoc(user.uid);
      if (userData && userData.prefs) {
        navigate(ROUTES.AI_PROCTOR_DASHBOARD);
        return;
      }

      setUid(user.uid);
      setLoading(false);
    });

    return () => unsub();
  }, [navigate]);

  if (loading)
    return (
      <div style={{ padding: "100px", textAlign: "center" }}>
        Loading setup...
      </div>
    );

  return (
    <AIProctorSetup
      uid={uid}
      onSetupComplete={() => navigate(ROUTES.AI_PROCTOR_DASHBOARD)}
    />
  );
};

export default AIProctorSetupPage;
