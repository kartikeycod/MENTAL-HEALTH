import React from "react";
import { useUserForm } from "../hooks/useUserForm";

export default function Form() {
  const {
    formData,
    loading,
    submitted,
    handleChange,
    handleSubmit,
  } = useUserForm();

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
