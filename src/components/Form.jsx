// ✅ src/components/Form.jsx
import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Form() {
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

  // ✅ Check user authentication
 useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged(async (u) => {
    if (!u) {
      console.log("❌ User not logged in — redirecting to /auth");
      navigate("/auth");
      return;
    }

    console.log("✅ Logged in user:", u.email);
    setUser(u);

    try {
      const q = query(collection(db, "FORMS"), where("UID", "==", u.uid));
      const snapshot = await getDocs(q);
      console.log("📦 FORMS snapshot size:", snapshot.size);

      if (!snapshot.empty) {
        const userData = snapshot.docs[0].data();
        console.log("✅ Found user form in Firestore:", userData);

        setSubmitted(true);

        // 🔥 Store both in localStorage immediately
        localStorage.setItem("detailsFilled", "true");
        localStorage.setItem(
          "user",
          JSON.stringify({
            name: userData.NAME,
            email: userData.EMAIL,
          })
        );

        console.log("💾 LocalStorage updated:", {
          detailsFilled: localStorage.getItem("detailsFilled"),
          user: localStorage.getItem("user"),
        });
      } else {
        console.log("⚠️ No form found yet for UID:", u.uid);
      }
    } catch (err) {
      console.error("🔥 Firestore error:", err);
    }
  });

  return () => unsubscribe();
}, [navigate]);

  // ✅ Auto-location capture (works even if CORS blocks city name)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { "User-Agent": "MentalHealthApp/1.0" } }
          );
          if (!response.ok) throw new Error("Location fetch failed");
          const data = await response.json();
          const city =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            "Unknown";
          setFormData((prev) => ({
            ...prev,
            LOCATION: `${city} (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`,
          }));
        } catch {
          setFormData((prev) => ({
            ...prev,
            LOCATION: `(${latitude.toFixed(2)}, ${longitude.toFixed(2)})`,
          }));
        }
      });
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Submit and save in Firestore (FORMS collection)
  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!user) {
    alert("You must be logged in to submit the form!");
    return;
  }

  setLoading(true);

  try {
    // ✅ Add user data to Firestore
    await addDoc(collection(db, "FORMS"), {
      UID: user.uid,
      EMAIL: user.email,
      NAME: formData.NAME,
      AGE: Number(formData.AGE),
      PROFESSION: formData.PROFESSION,
      GENDER: formData.GENDER,
      ADDRESS: formData.ADDRESS,
      LOCATION: formData.LOCATION,
      STRESSLEVEL: formData.STRESSLEVEL,
      SLEEPHOURS: Number(formData.SLEEPHOURS),
      MOOD: formData.MOOD,
      CREATEDAT: new Date(),
    });

    // ✅ LocalStorage (set before navigation)
    localStorage.setItem("detailsFilled", "true");
    localStorage.setItem(
      "user",
      JSON.stringify({
        name: formData.NAME,
        email: user.email,
      })
    );

    console.log("✅ LocalStorage Saved:");
    console.log("detailsFilled:", localStorage.getItem("detailsFilled"));
    console.log("user:", localStorage.getItem("user"));

    setSubmitted(true);
    alert("✅ Details saved successfully!");
  } catch (err) {
    console.error("❌ Error saving data:", err);
    alert("Something went wrong while saving data!");
  } finally {
    setLoading(false);
  }
};

  if (submitted)
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "80px",
          color: "#5b2ecc",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <h2>✅ DETAILS ALREADY SUBMITTED!</h2>
        <p>YOUR DATA HAS BEEN SECURELY SAVED FOR MENTAL HEALTH ANALYSIS.</p>
      </div>
    );

  return (
    <div
      style={{
        background: "linear-gradient(180deg, #ffffff 0%, #e7d8ff 100%)",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          padding: "40px",
          borderRadius: "20px",
          boxShadow: "0 8px 25px rgba(136, 84, 208, 0.25)",
          width: "400px",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          border: "2px solid #b28dff",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            color: "#5b2ecc",
            fontWeight: "600",
            marginBottom: "10px",
          }}
        >
          🧠 MENTAL HEALTH INFO
        </h2>

        <input name="NAME" placeholder="FULL NAME" value={formData.NAME} onChange={handleChange} required style={inputStyle} />
        <input name="AGE" type="number" placeholder="AGE" value={formData.AGE} onChange={handleChange} required style={inputStyle} />
        <input name="PROFESSION" placeholder="PROFESSION" value={formData.PROFESSION} onChange={handleChange} style={inputStyle} />
        <select name="GENDER" value={formData.GENDER} onChange={handleChange} required style={inputStyle}>
          <option value="">SELECT GENDER</option>
          <option>MALE</option>
          <option>FEMALE</option>
          <option>OTHER</option>
        </select>
        <textarea name="ADDRESS" placeholder="ADDRESS" value={formData.ADDRESS} onChange={handleChange} rows={2} style={inputStyle} />
        <input name="LOCATION" value={formData.LOCATION} placeholder="AUTO LOCATION" readOnly style={{ ...inputStyle, backgroundColor: "#f3ebff" }} />
        <select name="STRESSLEVEL" value={formData.STRESSLEVEL} onChange={handleChange} style={inputStyle}>
          <option value="">WHY GIVING THE TEST?</option>
          <option>Depressed for a long time</option>
          <option>Mental illness</option>
          <option>just exploring</option>
          <option>anaonymus chatting</option>
          <option>other</option>
        </select>
        <input name="SLEEPHOURS" type="number" placeholder="AVERAGE SLEEP (HRS)" value={formData.SLEEPHOURS} onChange={handleChange} style={inputStyle} />
        <select name="MOOD" value={formData.MOOD} onChange={handleChange} style={inputStyle}>
          <option value="">PERSONALITY MOOD</option>
          <option>HAPPY</option>
          <option>NEUTRAL</option>
          <option>SAD</option>
          <option>ANXIOUS</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          style={{
            background: "#7a42f4",
            color: "white",
            border: "none",
            padding: "12px",
            borderRadius: "10px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "0.3s",
          }}
        >
          {loading ? "SUBMITTING..." : "SUBMIT DETAILS"}
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #b28dff",
  fontSize: "14px",
  outline: "none",
  transition: "0.3s",
  color: "#333",
};
