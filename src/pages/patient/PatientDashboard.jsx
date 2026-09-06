import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { useOrders } from "../../hooks/useOrders";
import { useNavigate, Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import "./Dashboard.css";

const PatientDashboard = () => {
  const { user, profile, logout } = useAuth();
  const { patientOrders, loading } = useOrders();
  const navigate = useNavigate();

  const displayName = profile?.displayName || user?.displayName || user?.email?.split("@")[0] || "Patient";

  return (
    <div className="dashboard-page">
      <div className="dashboard-sidebar">
        <div className="dash-profile-card">
          <div className="dash-avatar">{displayName[0]?.toUpperCase()}</div>
          <h3>{displayName}</h3>
          <p>{user?.email}</p>
          <div className="dash-role-badge patient-badge">Patient Account</div>
        </div>
        <nav className="dash-nav">
          <div className="dash-nav-item active">📋 My Orders</div>
          <div className="dash-nav-item" onClick={() => navigate(ROUTES.TALK_TO_THERAPIST)}>🔍 Find Therapists</div>
          {profile?.roles?.doctor && (
            <div className="dash-nav-item" onClick={() => navigate(ROUTES.DOCTOR_DASHBOARD)}>🩺 Doctor Dashboard</div>
          )}
          <div className="dash-nav-item logout" onClick={logout}>← Logout</div>
        </nav>
      </div>

      <div className="dashboard-main">
        <div className="dashboard-header">
          <h2>My Consultations & Orders</h2>
          <p>Track your purchased therapy plans and session history.</p>
        </div>

        {loading ? (
          <div className="dash-skeleton-list">
            {[1,2,3].map(i => <div key={i} className="skeleton-row" />)}
          </div>
        ) : patientOrders.length === 0 ? (
          <div className="dash-empty-state">
            <div className="empty-icon-large">🛒</div>
            <h3>No consultations yet</h3>
            <p>Browse verified therapists and book your first session.</p>
            <Link to={ROUTES.TALK_TO_THERAPIST} className="btn-dash-primary">Find a Therapist</Link>
          </div>
        ) : (
          <div className="orders-list">
            {patientOrders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-card-header">
                  <div className="order-icon">🩺</div>
                  <div>
                    <h4>{order.planTitle}</h4>
                    <p>Dr. {order.doctorName}</p>
                  </div>
                  <div className="order-status-badge completed">
                    {order.status}
                  </div>
                </div>
                <div className="order-meta-row">
                  <span>💰 ₹{order.amount}</span>
                  <span>📅 {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString("en-IN") : "—"}</span>
                  {order.isDemo && <span className="demo-tag">⚡ Demo Order</span>}
                </div>
                <div className="order-actions">
                  <Link to={`/therapists/${order.doctorUid}`} className="btn-order-link">
                    View Therapist Profile & Write Review
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
