import React from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../constants/routes";

const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <div style={{ fontSize: "1.1rem", color: "#64748b" }}>Verifying administrator privileges...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={ROUTES.AUTH} replace />;
  }

  if (!isAdmin) {
    return (
      <div style={{ maxWidth: "600px", margin: "80px auto", padding: "40px 24px", textAlign: "center", backgroundColor: "#ffffff", borderRadius: "16px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)", border: "1px solid #fee2e2" }}>
        <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🛡️</div>
        <h2 style={{ fontSize: "1.8rem", fontWeight: "700", color: "#991b1b", marginBottom: "12px" }}>Super Admin Authorization Required</h2>
        <p style={{ color: "#64748b", fontSize: "1rem", lineHeight: "1.6", marginBottom: "24px" }}>
          This administrative control portal is restricted to authorized platform administrators only.
        </p>
        <Link to={ROUTES.HOME} style={{ padding: "10px 24px", background: "#0f172a", color: "#ffffff", borderRadius: "8px", textDecoration: "none", fontWeight: "600" }}>
          Return to Platform Home
        </Link>
      </div>
    );
  }

  return children;
};

export default AdminRoute;
