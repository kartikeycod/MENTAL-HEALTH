// src/pages/LeisureActivity.jsx
import React, { useState, useEffect } from "react";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";

const ACTIVITIES = {
  art: [
    "Create something with your hands — draw, sculpt, or craft.",
    "Paint what peace looks like to you.",
  ],
  nature: [
    "Take a mindful walk outside, observing the sky and trees.",
    "Collect 3 leaves and notice their shapes and patterns.",
  ],
  music: [
    "Play or listen to an uplifting tune.",
    "Write a small verse or rhythm that reflects your day.",
  ],
  mindfulness: [
    "Sit for 5 minutes and focus on your breathing.",
    "Journal 3 things that made you feel peaceful today.",
  ],
};

const LeisureActivity = () => {
  const [activity, setActivity] = useState("");
  const [file, setFile] = useState(null);
  const [done, setDone] = useState(false);
  const db = getFirestore();
  const storage = getStorage();
  const auth = getAuth();

  useEffect(() => {
    const pickActivity = () => {
      const keys = Object.keys(ACTIVITIES);
      const key = keys[new Date().getDate() % keys.length];
      const options = ACTIVITIES[key];
      const act = options[new Date().getDate() % options.length];
      setActivity(act);
    };
    pickActivity();
  }, []);

  const handleUpload = async () => {
    const user = auth.currentUser;
    if (!user) return alert("Please log in to continue.");
    if (!file) return alert("Please upload a proof image first!");

    try {
      const fileRef = ref(storage, `leisureProofs/${user.uid}_${Date.now()}.jpg`);
      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);

      await setDoc(doc(db, "userTasks", `${user.uid}_leisure`), {
        activity,
        proofUrl: downloadURL,
        date: new Date().toISOString(),
      });

      setDone(true);
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Upload failed. Please try again.");
    }
  };

  return (
    <div className="leisure-page">
      <h2>🎨 Leisure / Joyful Task</h2>
      <p>{activity || "Loading your task..."}</p>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload} disabled={done}>
        {done ? "Uploaded ✅" : "Upload Proof"}
      </button>

      {/* 👇 Add this line below proof upload */}
      <p style={{ marginTop: "16px", fontSize: "0.9rem", color: "#555" }}>
        <h1>⚙️ IoT Auto-Detect Feature — Coming Soon</h1>
      </p>
    </div>
  );
};

export default LeisureActivity;
