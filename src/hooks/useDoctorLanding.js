import { useState } from "react";
import { fetchNearbyCounsellors } from "../services/api/counsellors.api";
import { registerWithEmail, loginWithEmail } from "../services/firebase/auth.service";
import { createDoctorProfile } from "../services/firebase/doctorService";
import { submitDoctorApplication } from "../services/firebase/doctorApplicationService";
import { createDoctorPlan } from "../services/firebase/doctorPlanService";

export const useDoctorLanding = () => {
  const [location, setLocation] = useState(null);
  const [counsellors, setCounsellors] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showLogin, setShowLogin] = useState(false);
  const [showJoin, setShowJoin] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [dName, setDName] = useState("");
  const [dEmail, setDEmail] = useState("");
  const [dPass, setDPass] = useState("");
  const [dSpec, setDSpec] = useState("");

  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [doctorLoggedIn, setDoctorLoggedIn] = useState(false);
  const [allUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleFindCounsellors = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setLocation({ lat, lon });
        setLoading(true);

        try {
          const mapped = await fetchNearbyCounsellors(lat, lon);
          setCounsellors(mapped);
        } catch (err) {
          console.error(err);
          alert("Unable to fetch nearby counsellors.");
        } finally {
          setLoading(false);
        }
      },
      () => {
        alert("Please allow location access to find nearby counsellors.");
      }
    );
  };

  const handleDoctorRegister = async () => {
    setAuthError("");
    if (!dName || !dEmail || !dPass || !dSpec) {
      setAuthError("Please fill in all fields (Name, Email, Password, Specialization).");
      return;
    }
    if (dPass.length < 6) {
      setAuthError("Password must be at least 6 characters long.");
      return;
    }

    setAuthLoading(true);
    try {
      // 1. Create Firebase Auth user
      const { user } = await registerWithEmail(dEmail, dPass, { doctor: true });
      if (!user) throw new Error("Failed to create user account.");

      const doctorUid = user.uid;
      const profileData = {
        fullName: dName,
        displayName: dName,
        specialization: dSpec,
        degree: "Therapist / Specialist",
        experienceYears: 1,
        bio: `Specialist in ${dSpec}.`,
        languages: ["English"],
        consultationMode: "Online Video & Chat",
        startingPrice: 499,
        contactEmail: dEmail,
      };

      // 2. Create Doctor Profile in Firestore (doctorProfiles collection)
      await createDoctorProfile(doctorUid, profileData);

      // 3. Create Doctor Application in Firestore (doctorApplications collection)
      await submitDoctorApplication(doctorUid, profileData, []);

      // 4. Create default consultation plan (doctorPlans collection)
      await createDoctorPlan(doctorUid, {
        name: "Standard Session",
        description: "1-on-1 consultation session",
        duration: "30 Mins",
        price: 499,
        currency: "INR",
        sessionsCount: 1,
        features: ["1-on-1 Session", "Follow-up Notes"],
        active: true,
      });

      setShowJoin(false);
      setDoctorLoggedIn(true);
      alert("✅ Doctor Registration Successful! Your profile and application have been saved to Firebase.");
    } catch (err) {
      console.error("Doctor registration error:", err);
      if (err.code === "auth/email-already-in-use") {
        setAuthError("This email is already registered. Please log in instead.");
      } else {
        setAuthError(err.message || "Failed to register doctor account in Firebase.");
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleDoctorLogin = async () => {
    setAuthError("");
    if (!loginEmail || !loginPass) {
      setAuthError("Please enter email and password.");
      return;
    }

    setAuthLoading(true);
    try {
      const { user } = await loginWithEmail(loginEmail, loginPass);
      if (!user) throw new Error("Invalid credentials.");

      setShowLogin(false);
      setDoctorLoggedIn(true);
      alert("✅ Doctor Logged In successfully!");
    } catch (err) {
      console.error("Doctor login error:", err);
      setAuthError(err.message || "Failed to log in.");
    } finally {
      setAuthLoading(false);
    }
  };

  return {
    location,
    counsellors,
    loading,
    showLogin,
    setShowLogin,
    showJoin,
    setShowJoin,
    loginEmail,
    setLoginEmail,
    loginPass,
    setLoginPass,
    dName,
    setDName,
    dEmail,
    setDEmail,
    dPass,
    setDPass,
    dSpec,
    setDSpec,
    authError,
    setAuthError,
    authLoading,
    doctorLoggedIn,
    allUsers,
    selectedUser,
    setSelectedUser,
    handleFindCounsellors,
    handleDoctorRegister,
    handleDoctorLogin,
  };
};
