import React from "react";
import { usePhysicalInteraction } from "../hooks/usePhysicalInteraction";

const PhysicalInteraction = () => {
  const { summary, setSummary, saved, handleSave } = usePhysicalInteraction();

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
