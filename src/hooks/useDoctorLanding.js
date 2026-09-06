import { useState, useCallback } from "react";
import { fetchNearbyCounsellors } from "../services/api/counsellors.api";
import { fetchAllPatients } from "../services/firebase/doctor.service";

// This hook powers the legacy serenyDoctor/Landing page.
// Doctor login/register is now handled by dedicated pages at /doctor/login and /doctor/signup.
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

  const [doctorLoggedIn] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
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

  // These are now stubs — the actual flows are in /doctor/signup and /doctor/login
  const handleDoctorRegister = () => {};
  const handleDoctorLogin = () => {};

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
    doctorLoggedIn,
    allUsers,
    selectedUser,
    setSelectedUser,
    handleFindCounsellors,
    handleDoctorRegister,
    handleDoctorLogin,
  };
};
