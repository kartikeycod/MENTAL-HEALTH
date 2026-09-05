import React from "react";
import { useLeisureActivity } from "../hooks/useLeisureActivity";

const LeisureActivity = () => {
  const { activity, setFile, done, handleUpload } = useLeisureActivity();

  return (
    <div className="leisure-page">
      <h2>🎨 Leisure / Joyful Task</h2>
      <p>{activity || "Loading your task..."}</p>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload} disabled={done}>
        {done ? "Uploaded ✅" : "Upload Proof"}
      </button>

      <p style={{ marginTop: "16px", fontSize: "0.9rem", color: "#555" }}>
        <h1>⚙️ IoT Auto-Detect Feature — Coming Soon</h1>
      </p>
    </div>
  );
};

export default LeisureActivity;
