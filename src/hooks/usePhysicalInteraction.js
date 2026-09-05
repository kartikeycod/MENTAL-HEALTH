import { useState } from "react";
import { getCurrentAuthUser } from "../services/firebase/auth.service";
import { savePhysicalTask } from "../services/firebase/tasks.service";

export const usePhysicalInteraction = () => {
  const [summary, setSummary] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    const user = getCurrentAuthUser();
    if (!user) return alert("Login required");

    await savePhysicalTask(user.uid, summary);
    setSaved(true);
  };

  return {
    summary,
    setSummary,
    saved,
    handleSave,
  };
};
