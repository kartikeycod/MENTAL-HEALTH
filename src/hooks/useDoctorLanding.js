import { useState, useEffect, useCallback } from "react";
import { fetchNearbyCounsellors } from "../services/api/counsellors.api";
import {
  registerDoctor,
  loginDoctor,
  fetchAllPatients,
} from "../services/firebase/doctor.service";

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

  const [doctorLoggedIn, setDoctorLoggedIn] = useState(false);
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

  const handleDoctorRegister = async () => {
    if (!dName || !dEmail || !dPass || !dSpec) {
      alert("Please fill all fields.");
      return;
    }
    try {
      await registerDoctor({
        name: dName,
        email: dEmail,
        password: dPass,
        specialization: dSpec,
      });
      alert("Registration successful — doctor saved to Firestore.");
      setShowJoin(false);
      setDName("");
      setDEmail("");
      setDPass("");
      setDSpec("");
    } catch (err) {
      console.error("Register error:", err);
      alert("Error registering doctor. Check console.");
    }
  };

  const loadUsers = useCallback(async () => {
    try {
      const arr = await fetchAllPatients();
      setAllUsers(arr);
    } catch (err) {
      console.error("Load users error:", err);
      alert("Unable to load users.");
    }
  }, []);

  const handleDoctorLogin = async () => {
    try {
      const res = await loginDoctor(loginEmail, loginPass);
      if (res) {
        setDoctorLoggedIn(true);
        setShowLogin(false);
        await loadUsers();
      } else {
        alert("Invalid credentials. Make sure the doctor exists in Firestore 'doctors' collection and the password matches.");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed. Check console for details.");
    }
  };

  useEffect(() => {
    let t;
    if (doctorLoggedIn) {
      loadUsers();
      t = setInterval(loadUsers, 60 * 1000);
    }
    return () => clearInterval(t);
  }, [doctorLoggedIn, loadUsers]);

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
