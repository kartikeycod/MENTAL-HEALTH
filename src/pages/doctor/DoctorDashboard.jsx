import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useDoctor } from "../../hooks/useDoctor";
import { useOrders } from "../../hooks/useOrders";
import { useDoctorPlans } from "../../hooks/useDoctorPlans";
import { useNavigate, Link } from "react-router-dom";
import { getApplicationByDoctorUid } from "../../services/firebase/doctorApplicationService";
import { STATUS_CONFIG, APPLICATION_STATUS } from "../../config/statuses";
import { ROUTES } from "../../constants/routes";
import { useEffect } from "react";
import "./Dashboard.css";

const DoctorDashboard = () => {
  const { user, profile, logout } = useAuth();
  const { doctor, loading: doctorLoading } = useDoctor(user?.uid);
  const { doctorOrders, loading: ordersLoading } = useOrders();
  const { plans, addPlan, removePlan } = useDoctorPlans(user?.uid);
  const [application, setApplication] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.uid) {
      getApplicationByDoctorUid(user.uid).then(setApplication);
    }
  }, [user?.uid]);

  const status = doctor?.applicationStatus || application?.status || APPLICATION_STATUS.PENDING;
  const config = STATUS_CONFIG[status] || STATUS_CONFIG[APPLICATION_STATUS.PENDING];
  const isVerified = status === APPLICATION_STATUS.APPROVED;
  const displayName = doctor?.displayName || doctor?.fullName || profile?.displayName || "Doctor";

  const totalRevenue = doctorOrders.reduce((sum, o) => sum + (Number(o.amount) || 0), 0);

  return (
    <div className="dashboard-page">
      <div className="dashboard-sidebar">
        <div className="dash-profile-card">
          <div className="dash-avatar doctor-avatar-color">{displayName[0]?.toUpperCase()}</div>
          <h3>{displayName}</h3>
          <p>{doctor?.specialization || "Therapist"}</p>
          <div
            className="dash-role-badge"
            style={{ background: config.bgColor, color: config.color, border: `1px solid ${config.color}` }}
          >
            {config.label}
          </div>
        </div>
        <nav className="dash-nav">
          {["overview", "orders", "plans", "profile"].map(tab => (
            <div
              key={tab}
              className={`dash-nav-item ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "overview" && "📊 Overview"}
              {tab === "orders" && "📋 Patient Orders"}
              {tab === "plans" && "💼 My Plans"}
              {tab === "profile" && "👤 My Profile"}
            </div>
          ))}
          <div className="dash-nav-item" onClick={() => navigate(ROUTES.PATIENT_DASHBOARD)}>🏥 Patient Mode</div>
          <div className="dash-nav-item logout" onClick={logout}>← Logout</div>
        </nav>
      </div>

      <div className="dashboard-main">
        {!isVerified && (
          <div className="verification-banner" style={{ background: config.bgColor, border: `1.5px solid ${config.color}`, color: config.color }}>
            <strong>Account Status: {config.label}</strong> — {config.description}
            {status === APPLICATION_STATUS.REJECTED && application?.adminReviewNote && (
              <p style={{ margin: "8px 0 0", fontSize: "0.88rem" }}>Admin feedback: {application.adminReviewNote}</p>
            )}
          </div>
        )}

        {activeTab === "overview" && (
          <>
            <div className="dashboard-header">
              <h2>Doctor Dashboard</h2>
              <p>Welcome back, {displayName}. Here's your practice overview.</p>
            </div>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📋</div>
                <div className="stat-value">{doctorOrders.length}</div>
                <div className="stat-label">Total Consultations</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-value">₹{totalRevenue.toLocaleString()}</div>
                <div className="stat-label">Total Revenue (Demo)</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⭐</div>
                <div className="stat-value">{doctor?.ratingSummary?.averageRating?.toFixed(1) || "—"}</div>
                <div className="stat-label">Average Rating</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💬</div>
                <div className="stat-value">{doctor?.ratingSummary?.reviewCount || 0}</div>
                <div className="stat-label">Total Reviews</div>
              </div>
            </div>
          </>
        )}

        {activeTab === "orders" && (
          <>
            <div className="dashboard-header">
              <h2>Patient Orders</h2>
            </div>
            {ordersLoading ? (
              <div className="dash-skeleton-list">{[1,2,3].map(i => <div key={i} className="skeleton-row" />)}</div>
            ) : doctorOrders.length === 0 ? (
              <div className="dash-empty-state">
                <div className="empty-icon-large">📭</div>
                <h3>No orders yet</h3>
                <p>Orders will appear here when patients purchase your consultation plans.</p>
              </div>
            ) : (
              <div className="orders-list">
                {doctorOrders.map(order => (
                  <div key={order.id} className="order-card">
                    <div className="order-card-header">
                      <div className="order-icon">👤</div>
                      <div>
                        <h4>{order.patientName || "Patient"}</h4>
                        <p>Plan: {order.planTitle}</p>
                      </div>
                      <div className="order-status-badge completed">{order.status}</div>
                    </div>
                    <div className="order-meta-row">
                      <span>💰 ₹{order.amount}</span>
                      <span>📅 {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString("en-IN") : "—"}</span>
                      {order.isDemo && <span className="demo-tag">⚡ Demo</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "plans" && (
          <>
            <div className="dashboard-header">
              <h2>Consultation Plans</h2>
            </div>
            <div className="plans-grid-dash">
              {plans.map(plan => (
                <div key={plan.id} className="plan-dash-card">
                  <div className="plan-dash-header">
                    <h4>{plan.name}</h4>
                    <span className={`plan-active-badge ${plan.active ? "active" : "inactive"}`}>
                      {plan.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p>{plan.description}</p>
                  <div className="plan-dash-meta">
                    <span>₹{plan.price}</span>
                    <span>⏱ {plan.duration}</span>
                    <span>📋 {plan.sessionsCount} session{plan.sessionsCount !== 1 ? "s" : ""}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "profile" && (
          <>
            <div className="dashboard-header">
              <h2>My Profile</h2>
            </div>
            <div className="profile-info-grid">
              {[
                ["Full Name", doctor?.fullName],
                ["Specialization", doctor?.specialization],
                ["Degree", doctor?.degree],
                ["Experience", `${doctor?.experienceYears || 0} years`],
                ["Location", doctor?.location ? `${doctor.location.city || ""}, ${doctor.location.state || ""}`.trim().replace(/^,|,$/g, "").trim() : "—"],
                ["Languages", doctor?.languages?.join(", ") || "—"],
                ["Consultation Mode", doctor?.consultationMode || "—"],
                ["Registration No.", doctor?.registrationNumber || "Not provided"],
              ].map(([label, value]) => (
                <div key={label} className="profile-info-item">
                  <span className="profile-info-label">{label}</span>
                  <span className="profile-info-value">{value || "—"}</span>
                </div>
              ))}
            </div>
            {doctor?.bio && (
              <div className="profile-bio-box">
                <h4>Professional Bio</h4>
                <p>{doctor.bio}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
