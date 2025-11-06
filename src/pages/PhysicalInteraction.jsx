// src/pages/PhysicalInteraction.jsx
import React, { useState } from "react";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const PhysicalInteraction = () => {
  const [summary, setSummary] = useState("");
  const [saved, setSaved] = useState(false);
  const db = getFirestore();
  const auth = getAuth();

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return alert("Login required");

    await setDoc(doc(db, "userTasks", `${user.uid}_physical`), {
      summary,
      date: new Date().toISOString(),
    });
    setSaved(true);
  };

  return (
    <div className="physical-page">
      <h2>💬 Physical / Social Interaction</h2>
      <p>Talk to someone today — a friend, teacher, or parent — and reflect below:</p>
      <textarea
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        placeholder="Write your conversation summary..."
        rows="5"
      />
      <button onClick={handleSave} disabled={saved}>
        {saved ? "Saved ✅" : "Save Reflection"}
      </button>
    </div>
  );
};

export default PhysicalInteraction;
