import { useState, useEffect } from "react";
import { getCurrentAuthUser } from "../services/firebase/auth.service";
import { uploadLeisureProofImage } from "../services/firebase/storage.service";
import { saveLeisureTask } from "../services/firebase/tasks.service";
import { LEISURE_ACTIVITIES } from "../constants/leisureActivities";

export const useLeisureActivity = () => {
  const [activity, setActivity] = useState("");
  const [file, setFile] = useState(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const keys = Object.keys(LEISURE_ACTIVITIES);
    const key = keys[new Date().getDate() % keys.length];
    const options = LEISURE_ACTIVITIES[key];
    const act = options[new Date().getDate() % options.length];
    setActivity(act);
  }, []);

  const handleUpload = async () => {
    const user = getCurrentAuthUser();
    if (!user) return alert("Please log in to continue.");
    if (!file) return alert("Please upload a proof image first!");

    try {
      const downloadURL = await uploadLeisureProofImage(user.uid, file);
      await saveLeisureTask(user.uid, activity, downloadURL);
      setDone(true);
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Upload failed. Please try again.");
    }
  };

  return {
    activity,
    file,
    setFile,
    done,
    handleUpload,
  };
};
