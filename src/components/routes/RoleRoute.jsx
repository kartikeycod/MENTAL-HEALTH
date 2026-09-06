import React from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../constants/routes";

const RoleRoute = ({ requiredRole, children }) => {
  const { user, profile, loading, isDoctor } = useAuth();

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <div style={{ fontSize: "1.1rem", color: "#64748b" }}>Verifying permissions...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={ROUTES.AUTH} replace />;
  }

  const hasAccess = requiredRole === "doctor" ? isDoctor : profile?.roles?.[requiredRole];

  if (!hasAccess) {
    return (
      <div style={{ maxWidth: "600px", margin: "80px auto", padding: "40px 24px", textAlign: "center", backgroundColor: "#ffffff", borderRadius: "16px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0" }}>
        <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🔒</div>
        <h2 style={{ fontSize: "1.8rem", fontWeight: "700", color: "#0f172a", marginBottom: "12px" }}>Access Restricted</h2>
        <p style={{ color: "#64748b", fontSize: "1rem", lineHeight: "1.6", marginBottom: "24px" }}>
          You do not have active {requiredRole} access permissions on this account.
          {requiredRole === "doctor" && " If you are a therapist or clinical specialist, you can apply for doctor verification."}
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          {requiredRole === "doctor" ? (
            <Link to={ROUTES.DOCTOR_SIGNUP} style={{ padding: "10px 20px", background: "#4f46e5", color: "#fff", borderRadius: "8px", textDecoration: "none", fontWeight: "600" }}>
              Apply as Doctor
            </Link>
          ) : null}
          <Link to={ROUTES.HOME} style={{ padding: "10px 20px", background: "#f1f5f9", color: "#334155", borderRadius: "8px", textDecoration: "none", fontWeight: "600" }}>
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return children;
};

export default RoleRoute;
