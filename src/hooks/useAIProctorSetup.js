import { useState, useEffect } from "react";
import { saveAIProctorSetup } from "../services/firebase/aiProctor.service";
import { reverseGeocode } from "../services/api/geocoding.api";
import { generateMealPlan } from "../utils/generators/mealPlanGenerator";
import { setCourseStatus, setPackType } from "../utils/storage/storageHelpers";

export const useAIProctorSetup = (uid, onSetupComplete) => {
  const [prefs, setPrefs] = useState({ location: "", dietType: "balanced" });
  const [schedule, setSchedule] = useState({
    exerciseTime: "",
    mealTimes: ["", "", ""],
    weeklyTestDay: "Sunday",
  });
  const [packTypeState] = useState("ai");

  useEffect(() => {
    if (prefs.location) return;
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          const res = await reverseGeocode(latitude, longitude);
          if (res.cityCountry) {
            setPrefs((p) => ({ ...p, location: res.cityCountry }));
          }
        },
        () => {},
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  }, [prefs.location]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!uid) return;

    const mealPlan = generateMealPlan(prefs.location, prefs.dietType);

    await saveAIProctorSetup(uid, {
      prefs,
      packType: packTypeState,
      schedule,
      mealPlan,
    });

    setCourseStatus("active");
    setPackType(packTypeState);

    alert("✅ AI Pack setup complete!");
    onSetupComplete();
  };

  return {
    prefs,
    setPrefs,
    schedule,
    setSchedule,
    handleSave,
  };
};
