import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { subscribeToAuthChanges } from "../services/firebase/auth.service";
import { getFormByUid, submitUserForm } from "../services/firebase/form.service";
import { reverseGeocode } from "../services/api/geocoding.api";
import { setDetailsFilled, setStoredUser } from "../utils/storage/storageHelpers";
import { ROUTES } from "../constants/routes";

export const useUserForm = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    NAME: "",
    AGE: "",
    PROFESSION: "",
    GENDER: "",
    ADDRESS: "",
    LOCATION: "",
    STRESSLEVEL: "",
    SLEEPHOURS: "",
    MOOD: "",
  });

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (u) => {
      if (!u) {
        navigate(ROUTES.AUTH);
        return;
      }

      setUser(u);

      try {
        const userData = await getFormByUid(u.uid);
        if (userData) {
          setSubmitted(true);
          setDetailsFilled(true);
          setStoredUser({
            name: userData.NAME,
            email: userData.EMAIL,
          });
        }
      } catch (err) {
        console.error("Firestore error:", err);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        const res = await reverseGeocode(latitude, longitude);
        setFormData((prev) => ({
          ...prev,
          LOCATION: res.formattedLocation,
        }));
      });
    }
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("You must be logged in to submit the form!");
      return;
    }

    setLoading(true);

    try {
      await submitUserForm(user, formData);

      setDetailsFilled(true);
      setStoredUser({
        name: formData.NAME,
        email: user.email,
      });

      setSubmitted(true);
      alert("✅ Details saved successfully!");
    } catch (err) {
      console.error("Error saving data:", err);
      alert("Something went wrong while saving data!");
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    submitted,
    handleChange,
    handleSubmit,
  };
};
