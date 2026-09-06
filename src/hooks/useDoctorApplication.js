import { useState, useCallback } from "react";
import { registerWithEmail } from "../services/firebase/auth.service";
import { createDoctorProfile } from "../services/firebase/doctorService";
import { submitDoctorApplication } from "../services/firebase/doctorApplicationService";
import { createDoctorPlan } from "../services/firebase/doctorPlanService";
import { validateDoctorForm } from "../utils/validation/doctorValidation";

export const useDoctorApplication = () => {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [geolocationLoading, setGeolocationLoading] = useState(false);

  const [formData, setFormData] = useState({
    // Account Info
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",

    // Professional Info
    fullName: "",
    displayName: "",
    degree: "",
    specialization: "",
    experienceYears: "",
    bio: "",
    languages: ["English"],
    gender: "Not specified",
    consultationMode: "Online Video & Chat",
    registrationNumber: "",

    // Location
    location: {
      country: "India",
      state: "",
      city: "",
      address: "",
      lat: null,
      lon: null,
    },

    // Verification Documents Metadata
    documents: [],

    // Profile & Pricing Details
    expertise: "",
    approach: "",
    plans: [
      {
        name: "Standard Consultation",
        description: "1-on-1 video session + chat follow-up",
        duration: "30 Mins",
        price: 499,
        currency: "INR",
        sessionsCount: 1,
        features: ["1-on-1 Video Session", "Session Summary Notes", "7 Days Follow-up Chat"],
        active: true,
      },
    ],
  });

  const [validationErrors, setValidationErrors] = useState({});

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const updateLocationField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      location: { ...prev.location, [field]: value },
    }));
  };

  const requestGeolocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setGeolocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData((prev) => ({
          ...prev,
          location: {
            ...prev.location,
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
          },
        }));
        setGeolocationLoading(false);
      },
      (err) => {
        console.warn("Geolocation permission denied or failed:", err);
        setGeolocationLoading(false);
      }
    );
  }, []);

  const handleDocumentSelection = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const metadataList = files.map((file) => ({
      name: file.name,
      sizeBytes: file.size,
      type: file.type,
      selectedAt: new Date().toISOString(),
      note: "File selected locally. Document handling marked as pending backend storage integration.",
    }));

    setFormData((prev) => ({
      ...prev,
      documents: [...prev.documents, ...metadataList],
    }));
    setValidationErrors((prev) => ({ ...prev, documents: undefined }));
  };

  const removeDocument = (index) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  };

  const addPlan = () => {
    setFormData((prev) => ({
      ...prev,
      plans: [
        ...prev.plans,
        {
          name: "Follow-up Package",
          description: "Multiple sessions plan",
          duration: "1 Month",
          price: 1499,
          currency: "INR",
          sessionsCount: 4,
          features: ["4 Sessions", "24/7 Priority Support"],
          active: true,
        },
      ],
    }));
  };

  const updatePlan = (index, field, value) => {
    setFormData((prev) => {
      const updatedPlans = [...prev.plans];
      updatedPlans[index] = { ...updatedPlans[index], [field]: value };
      return { ...prev, plans: updatedPlans };
    });
  };

  const removePlan = (index) => {
    if (formData.plans.length <= 1) {
      alert("At least one plan is required.");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      plans: prev.plans.filter((_, i) => i !== index),
    }));
  };

  const submitApplicationForm = async () => {
    setError("");
    setSuccess(false);

    const { isValid, errors } = validateDoctorForm(formData);
    if (!isValid) {
      setValidationErrors(errors);
      setError("Please fix the highlighted errors before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      // 1. Create Firebase Auth User with doctor role request
      const { user } = await registerWithEmail(formData.email, formData.password, { doctor: true });

      if (!user) throw new Error("Could not create user account.");

      const doctorUid = user.uid;

      // Calculate starting price from plans
      const startingPrice = Math.min(...formData.plans.map((p) => Number(p.price) || 0));

      // 2. Create Doctor Profile in doctorProfiles collection
      const profileData = {
        fullName: formData.fullName,
        displayName: formData.displayName || formData.fullName,
        degree: formData.degree,
        specialization: formData.specialization,
        experienceYears: Number(formData.experienceYears),
        bio: formData.bio,
        languages: formData.languages,
        gender: formData.gender,
        consultationMode: formData.consultationMode,
        registrationNumber: formData.registrationNumber,
        location: formData.location,
        expertise: formData.expertise,
        approach: formData.approach,
        startingPrice,
        contactEmail: formData.email,
        contactPhone: formData.phone,
      };

      await createDoctorProfile(doctorUid, profileData);

      // 3. Create Doctor Application in doctorApplications collection
      await submitDoctorApplication(doctorUid, profileData, formData.documents);

      // 4. Create Plans in doctorPlans collection
      for (const plan of formData.plans) {
        await createDoctorPlan(doctorUid, plan);
      }

      setSuccess(true);
      return { doctorUid };
    } catch (err) {
      console.error("Doctor application submission failed:", err);
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please log in instead.");
      } else {
        setError(err.message || "Failed to submit doctor application. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return {
    formData,
    updateField,
    updateLocationField,
    requestGeolocation,
    geolocationLoading,
    handleDocumentSelection,
    removeDocument,
    addPlan,
    updatePlan,
    removePlan,
    submitApplicationForm,
    validationErrors,
    submitting,
    error,
    success,
  };
};
