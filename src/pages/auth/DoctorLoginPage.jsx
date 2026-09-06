import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getDoctorById } from "../../services/firebase/doctorService";
import { getApplicationByDoctorUid } from "../../services/firebase/doctorApplicationService";
import { ROUTES } from "../../constants/routes";
import { APPLICATION_STATUS } from "../../config/statuses";
import { isSuperAdminEmail } from "../../config/roles";
import "./DoctorAuth.css";

const DoctorLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleDoctorLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const { user, profile } = await login(email, password);

      if (!user) {
        setErrorMessage("Invalid credentials.");
        setLoading(false);
        return;
      }

      // Check doctor profile and application status
      const doctorProfile = await getDoctorById(user.uid);
      const doctorApp = await getApplicationByDoctorUid(user.uid);

      const isAdminUser = profile?.roles?.admin || isSuperAdminEmail(user.email);

      if (!doctorProfile && !doctorApp && !isAdminUser) {
        setErrorMessage(
          "No doctor practice record found for this account. If you wish to join Serenium as a therapist, please submit an application."
        );
        setLoading(false);
        return;
      }

      if (isAdminUser && !doctorProfile && !doctorApp) {
        navigate(ROUTES.ADMIN);
        return;
      }

      const status = doctorProfile?.applicationStatus || doctorApp?.status || APPLICATION_STATUS.PENDING;

      if (status === APPLICATION_STATUS.APPROVED) {
        navigate(ROUTES.DOCTOR_DASHBOARD);
      } else if (status === APPLICATION_STATUS.REJECTED) {
        setErrorMessage(
          `Your doctor application was rejected. Reason: ${
            doctorProfile?.rejectionReason || doctorApp?.adminReviewNote || "Qualification verification failed."
          }`
        );
      } else if (status === APPLICATION_STATUS.SUSPENDED) {
        setErrorMessage("Your doctor account is currently suspended by administration.");
      } else {
        // Pending or under review
        navigate(ROUTES.DOCTOR_PENDING);
      }
    } catch (err) {
      console.error("Doctor Login Error:", err);
      if (err.code === "auth/user-not-found" || err.code === "auth/invalid-credential" || err.code === "auth/wrong-password" || err.code === "auth/invalid-email") {
        setErrorMessage("Invalid email or password. Please check your credentials.");
      } else if (err.code === "auth/too-many-requests") {
        setErrorMessage("Access temporarily blocked due to too many failed login attempts. Please try again later.");
      } else {
        setErrorMessage(err.message || "Failed to log in as doctor. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="doctor-auth-wrapper">
      <div className="doctor-auth-card">
        <div className="doctor-auth-header">
          <div className="doctor-auth-badge">Therapist & Specialist Portal</div>
          <h2>Doctor Sign In</h2>
          <p>Access your practice dashboard, manage patient plans, and track consultations.</p>
        </div>

        {errorMessage && <div className="doctor-auth-error">{errorMessage}</div>}

        <form onSubmit={handleDoctorLogin} className="doctor-auth-form">
          <div className="form-group">
            <label>Professional Email</label>
            <input
              type="email"
              placeholder="doctor@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="doctor-btn-primary" disabled={loading}>
            {loading ? "Verifying Credentials..." : "Log In to Doctor Dashboard"}
          </button>
        </form>

        <div className="doctor-auth-footer">
          <p>
            Don't have a doctor account?{" "}
            <Link to={ROUTES.DOCTOR_SIGNUP} className="doctor-link">
              Apply to join as a Doctor
            </Link>
          </p>
          <p>
            <Link to={ROUTES.HOME} className="doctor-link-subtle">
              ← Return to Serenium Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DoctorLoginPage;
