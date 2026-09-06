import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../constants/routes";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <div className="spinner">Loading auth state...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={ROUTES.AUTH} state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
