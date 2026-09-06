import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useDoctor } from "../../hooks/useDoctor";
import { useOrders } from "../../hooks/useOrders";
import { useDoctorPlans } from "../../hooks/useDoctorPlans";
import { updateDoctorProfile } from "../../services/firebase/doctorService";
import { useNavigate, Link } from "react-router-dom";
import { getApplicationByDoctorUid } from "../../services/firebase/doctorApplicationService";
import { STATUS_CONFIG, APPLICATION_STATUS } from "../../config/statuses";
import { ROUTES } from "../../constants/routes";
import "./Dashboard.css";

const DoctorDashboard = () => {
  const { user, profile, logout } = useAuth();
  const { doctor, refresh: refreshDoctor } = useDoctor(user?.uid);
  const { doctorOrders, loading: ordersLoading } = useOrders();
  const { plans, addPlan, updatePlan, removePlan, refresh: refreshPlans } = useDoctorPlans(user?.uid);
  const [application, setApplication] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  // Plan Form State
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [planFormData, setPlanFormData] = useState({
    name: "",
    price: "",
    duration: "45 Mins",
    description: "",
    sessionsCount: 1,
    featuresStr: "",
    active: true,
  });
  const [planSubmitting, setPlanSubmitting] = useState(false);
  const [planError, setPlanError] = useState("");

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileFormData, setProfileFormData] = useState({
    fullName: "",
    displayName: "",
    specialization: "",
    degree: "",
    experienceYears: "",
    phone: "",
    consultationMode: "",
    languagesStr: "",
    bio: "",
    city: "",
    state: "",
    country: "",
    address: "",
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState("");

  useEffect(() => {
    if (user?.uid) {
      getApplicationByDoctorUid(user.uid).then(setApplication);
    }
  }, [user?.uid]);

  useEffect(() => {
    if (doctor) {
      setProfileFormData({
        fullName: doctor.fullName || "",
        displayName: doctor.displayName || doctor.fullName || "",
        specialization: doctor.specialization || "",
        degree: doctor.degree || "",
        experienceYears: doctor.experienceYears || 0,
        phone: doctor.contactPhone || "",
        consultationMode: doctor.consultationMode || "Online Video & Chat",
        languagesStr: doctor.languages ? doctor.languages.join(", ") : "English",
        bio: doctor.bio || "",
        city: doctor.location?.city || "",
        state: doctor.location?.state || "",
        country: doctor.location?.country || "India",
        address: doctor.location?.address || "",
      });
    }
  }, [doctor]);

  const status = doctor?.applicationStatus || application?.status || APPLICATION_STATUS.PENDING;
  const config = STATUS_CONFIG[status] || STATUS_CONFIG[APPLICATION_STATUS.PENDING];
  const isVerified = status === APPLICATION_STATUS.APPROVED;
  const displayName = doctor?.displayName || doctor?.fullName || profile?.displayName || "Doctor";

  const totalRevenue = doctorOrders.reduce((sum, o) => sum + (Number(o.amount) || 0), 0);

  // Recalculate Starting Price
  const updateStartingPriceInProfile = async (allPlans) => {
    const activePrices = allPlans
      .filter((p) => p.active !== false)
      .map((p) => Number(p.price) || 0);
    const startingPrice = activePrices.length > 0 ? Math.min(...activePrices) : 0;
    await updateDoctorProfile(user.uid, { startingPrice });
    refreshDoctor();
  };

  // Plan Handlers
  const openNewPlanModal = () => {
    setEditingPlanId(null);
    setPlanFormData({
      name: "",
      price: "",
      duration: "45 Mins",
      description: "",
      sessionsCount: 1,
      featuresStr: "1-on-1 Session, Follow-up Notes",
      active: true,
    });
    setPlanError("");
    setShowPlanModal(true);
  };

  const openEditPlanModal = (plan) => {
    setEditingPlanId(plan.id);
    setPlanFormData({
      name: plan.name || "",
      price: plan.price || "",
      duration: plan.duration || "45 Mins",
      description: plan.description || "",
      sessionsCount: plan.sessionsCount || 1,
      featuresStr: plan.features ? plan.features.join(", ") : "",
      active: plan.active !== false,
    });
    setPlanError("");
    setShowPlanModal(true);
  };

  const handleSavePlan = async (e) => {
    e.preventDefault();
    setPlanError("");

    if (!planFormData.name.trim()) {
      setPlanError("Plan name is required.");
      return;
    }
    if (!planFormData.price || Number(planFormData.price) <= 0) {
      setPlanError("Please enter a valid positive price.");
      return;
    }

    setPlanSubmitting(true);
    try {
      const features = planFormData.featuresStr
        ? planFormData.featuresStr.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

      const payload = {
        name: planFormData.name,
        price: Number(planFormData.price),
        duration: planFormData.duration,
        description: planFormData.description,
        sessionsCount: Number(planFormData.sessionsCount) || 1,
        features,
        active: planFormData.active,
      };

      let updatedList = [];
      if (editingPlanId) {
        await updatePlan(editingPlanId, payload);
        updatedList = plans.map((p) => (p.id === editingPlanId ? { ...p, ...payload } : p));
      } else {
        const newP = await addPlan(payload);
        updatedList = [...plans, newP];
      }

      await updateStartingPriceInProfile(updatedList);
      setShowPlanModal(false);
    } catch (err) {
      setPlanError(err.message || "Failed to save plan.");
    } finally {
      setPlanSubmitting(false);
    }
  };

  const handleDeletePlan = async (planId) => {
    if (!window.confirm("Are you sure you want to delete this consultation plan?")) return;
    try {
      await removePlan(planId);
      const remaining = plans.filter((p) => p.id !== planId);
      await updateStartingPriceInProfile(remaining);
    } catch (err) {
      alert("Failed to delete plan: " + err.message);
    }
  };

  // Profile Save Handler
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileSuccessMsg("");
    try {
      const languages = profileFormData.languagesStr
        .split(",")
        .map((l) => l.trim())
        .filter(Boolean);

      const updates = {
        fullName: profileFormData.fullName,
        displayName: profileFormData.displayName || profileFormData.fullName,
        specialization: profileFormData.specialization,
        degree: profileFormData.degree,
        experienceYears: Number(profileFormData.experienceYears) || 0,
        contactPhone: profileFormData.phone,
        consultationMode: profileFormData.consultationMode,
        languages,
        bio: profileFormData.bio,
        location: {
          city: profileFormData.city,
          state: profileFormData.state,
          country: profileFormData.country,
          address: profileFormData.address,
        },
      };

      await updateDoctorProfile(user.uid, updates);
      await refreshDoctor();
      setProfileSuccessMsg("Profile and clinic location updated successfully!");
      setIsEditingProfile(false);
    } catch (err) {
      alert("Failed to update profile: " + err.message);
    } finally {
      setProfileSaving(false);
    }
  };

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
          {["overview", "orders", "plans", "profile"].map((tab) => (
            <div
              key={tab}
              className={`dash-nav-item ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "overview" && "📊 Overview"}
              {tab === "orders" && "📋 Patient Orders"}
              {tab === "plans" && "💼 Consultation Plans"}
              {tab === "profile" && "👤 Profile & Clinic Location"}
            </div>
          ))}
          <div className="dash-nav-item" onClick={() => navigate(ROUTES.THERAPISTS)}>
            🔍 Find Therapists (Marketplace)
          </div>
          <div className="dash-nav-item" onClick={() => navigate(ROUTES.PATIENT_DASHBOARD)}>
            🏥 Patient Mode
          </div>
          <div className="dash-nav-item logout" onClick={logout}>
            ← Logout
          </div>
        </nav>
      </div>

      <div className="dashboard-main">
        {!isVerified && (
          <div
            className="verification-banner"
            style={{ background: config.bgColor, border: `1.5px solid ${config.color}`, color: config.color }}
          >
            <strong>Account Status: {config.label}</strong> — {config.description}
            {status === APPLICATION_STATUS.REJECTED && application?.adminReviewNote && (
              <p style={{ margin: "8px 0 0", fontSize: "0.88rem" }}>Admin feedback: {application.adminReviewNote}</p>
            )}
          </div>
        )}

        {profileSuccessMsg && (
          <div style={{ padding: "12px 18px", background: "#dcfce7", color: "#166534", borderRadius: "10px", marginBottom: "20px", fontWeight: "600" }}>
            {profileSuccessMsg}
          </div>
        )}

        {/* OVERVIEW TAB */}
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

        {/* ORDERS TAB */}
        {/* ORDERS TAB (KNOW WHICH USER TOOK HIS PLAN) */}
        {activeTab === "orders" && (
          <>
            <div className="dashboard-header">
              <h2>Patient Consultations & Plan Subscribers</h2>
              <p>Track which patients purchased your consultation packages and view their booking details.</p>
            </div>
            {ordersLoading ? (
              <div className="dash-skeleton-list">{[1, 2, 3].map((i) => <div key={i} className="skeleton-row" />)}</div>
            ) : doctorOrders.length === 0 ? (
              <div className="dash-empty-state">
                <div className="empty-icon-large">📭</div>
                <h3>No patient bookings yet</h3>
                <p>When patients purchase your consultation plans on the marketplace, their booking details will appear here.</p>
              </div>
            ) : (
              <div className="orders-list">
                {doctorOrders.map((order) => (
                  <div key={order.id} className="order-card" style={{ borderLeft: "4px solid #059669" }}>
                    <div className="order-card-header">
                      <div className="order-icon" style={{ background: "#dcfce7", color: "#15803d", padding: "10px", borderRadius: "50%" }}>
                        👤
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: "1.05rem", color: "#0f172a", margin: "0 0 2px" }}>
                          Patient: {order.patientName || "Anonymous Patient"}
                        </h4>
                        <p style={{ fontSize: "0.85rem", color: "#64748b", margin: 0 }}>
                          Patient ID: <code style={{ background: "#f1f5f9", padding: "2px 6px", borderRadius: "4px" }}>{order.patientUid}</code>
                        </p>
                      </div>
                      <div className="order-status-badge completed">{order.status}</div>
                    </div>
                    <div className="order-meta-row" style={{ background: "#f8fafc", padding: "12px", borderRadius: "8px", margin: "10px 0" }}>
                      <span><strong>Plan Purchased:</strong> {order.planTitle}</span>
                      <span><strong>Amount:</strong> ₹{order.amount}</span>
                      <span><strong>Date:</strong> {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString("en-IN") : "Recent"}</span>
                      {order.isDemo && <span className="demo-tag">⚡ Demo Order</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* PLANS TAB (WITH ADD/EDIT/DELETE MODAL & PRICING) */}
        {activeTab === "plans" && (
          <>
            <div className="dashboard-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h2>Consultation Plans & Pricing</h2>
                <p>Add and manage your consultation packages, prices, and descriptions.</p>
              </div>
              <button
                onClick={openNewPlanModal}
                style={{
                  background: "linear-gradient(135deg, #059669, #0891b2)",
                  color: "#fff",
                  border: "none",
                  padding: "10px 18px",
                  borderRadius: "10px",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                + Add New Plan
              </button>
            </div>

            {/* Plan Modal Form */}
            {showPlanModal && (
              <div className="admin-modal-overlay">
                <div className="admin-modal" style={{ maxWidth: "540px", textWrap: "wrap", textAlign: "left" }}>
                  <h3 style={{ margin: "0 0 16px", color: "#0f172a" }}>
                    {editingPlanId ? "Edit Consultation Plan" : "Add New Consultation Plan"}
                  </h3>

                  {planError && <div className="doctor-auth-error">{planError}</div>}

                  <form onSubmit={handleSavePlan} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div>
                      <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#334155" }}>Plan Title *</label>
                      <input
                        type="text"
                        placeholder="e.g. 1-on-1 Counseling / CBT Session"
                        value={planFormData.name}
                        onChange={(e) => setPlanFormData({ ...planFormData, name: e.target.value })}
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", marginTop: "4px" }}
                        required
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div>
                        <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#334155" }}>Price (₹ INR) *</label>
                        <input
                          type="number"
                          min="1"
                          placeholder="e.g. 799"
                          value={planFormData.price}
                          onChange={(e) => setPlanFormData({ ...planFormData, price: e.target.value })}
                          style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", marginTop: "4px" }}
                          required
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#334155" }}>Duration</label>
                        <input
                          type="text"
                          placeholder="e.g. 45 Mins / 1 Month"
                          value={planFormData.duration}
                          onChange={(e) => setPlanFormData({ ...planFormData, duration: e.target.value })}
                          style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", marginTop: "4px" }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#334155" }}>Plan Description</label>
                      <textarea
                        rows="2"
                        placeholder="Detailed description of what this consultation package includes..."
                        value={planFormData.description}
                        onChange={(e) => setPlanFormData({ ...planFormData, description: e.target.value })}
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", marginTop: "4px" }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#334155" }}>Features (comma separated)</label>
                      <input
                        type="text"
                        placeholder="Video Consultation, Chat Support, Session Notes"
                        value={planFormData.featuresStr}
                        onChange={(e) => setPlanFormData({ ...planFormData, featuresStr: e.target.value })}
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", marginTop: "4px" }}
                      />
                    </div>

                    <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
                      <button
                        type="submit"
                        disabled={planSubmitting}
                        style={{
                          flex: 1,
                          padding: "10px",
                          background: "#4f46e5",
                          color: "#fff",
                          border: "none",
                          borderRadius: "8px",
                          fontWeight: "700",
                          cursor: "pointer",
                        }}
                      >
                        {planSubmitting ? "Saving Plan..." : "Save Plan"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowPlanModal(false)}
                        style={{
                          padding: "10px 16px",
                          background: "#f1f5f9",
                          color: "#334155",
                          border: "none",
                          borderRadius: "8px",
                          fontWeight: "600",
                          cursor: "pointer",
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {plans.length === 0 ? (
              <div className="dash-empty-state">
                <div className="empty-icon-large">💼</div>
                <h3>No plans added yet</h3>
                <p>Create your consultation packages to start accepting patient bookings.</p>
                <button onClick={openNewPlanModal} className="btn-dash-primary">
                  + Create Your First Plan
                </button>
              </div>
            ) : (
              <div className="plans-grid-dash">
                {plans.map((plan) => (
                  <div key={plan.id} className="plan-dash-card">
                    <div className="plan-dash-header">
                      <h4>{plan.name}</h4>
                      <span className={`plan-active-badge ${plan.active ? "active" : "inactive"}`}>
                        {plan.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p>{plan.description || "No description provided."}</p>
                    <div className="plan-dash-meta" style={{ marginBottom: "14px" }}>
                      <span style={{ fontSize: "1.1rem", fontWeight: "800", color: "#059669" }}>₹{plan.price}</span>
                      <span>⏱ {plan.duration}</span>
                      <span>📋 {plan.sessionsCount} session{plan.sessionsCount !== 1 ? "s" : ""}</span>
                    </div>
                    {plan.features?.length > 0 && (
                      <ul style={{ fontSize: "0.82rem", color: "#475569", margin: "0 0 14px", paddingLeft: "18px" }}>
                        {plan.features.map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    )}
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => openEditPlanModal(plan)}
                        style={{
                          flex: 1,
                          padding: "6px 12px",
                          background: "#f1f5f9",
                          color: "#334155",
                          border: "1px solid #cbd5e1",
                          borderRadius: "6px",
                          fontWeight: "600",
                          fontSize: "0.8rem",
                          cursor: "pointer",
                        }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeletePlan(plan.id)}
                        style={{
                          padding: "6px 12px",
                          background: "#fee2e2",
                          color: "#dc2626",
                          border: "1px solid #fca5a5",
                          borderRadius: "6px",
                          fontWeight: "600",
                          fontSize: "0.8rem",
                          cursor: "pointer",
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* PROFILE & CLINIC LOCATION TAB */}
        {activeTab === "profile" && (
          <>
            <div className="dashboard-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h2>My Profile & Clinic Location</h2>
                <p>Manage your professional details, clinical overview, and practice location.</p>
              </div>
              <button
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                style={{
                  background: isEditingProfile ? "#f1f5f9" : "#4f46e5",
                  color: isEditingProfile ? "#334155" : "#fff",
                  border: "none",
                  padding: "10px 18px",
                  borderRadius: "10px",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                {isEditingProfile ? "Cancel Editing" : "✏️ Edit Profile & Location"}
              </button>
            </div>

            {isEditingProfile ? (
              <form onSubmit={handleSaveProfile} style={{ background: "#fff", padding: "24px", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
                <h3 style={{ margin: "0 0 16px", fontSize: "1.1rem", color: "#0f172a" }}>Professional Information</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                  <div>
                    <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#334155" }}>Full Name</label>
                    <input
                      type="text"
                      value={profileFormData.fullName}
                      onChange={(e) => setProfileFormData({ ...profileFormData, fullName: e.target.value })}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", marginTop: "4px" }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#334155" }}>Display Title</label>
                    <input
                      type="text"
                      value={profileFormData.displayName}
                      onChange={(e) => setProfileFormData({ ...profileFormData, displayName: e.target.value })}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", marginTop: "4px" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#334155" }}>Specialization</label>
                    <input
                      type="text"
                      value={profileFormData.specialization}
                      onChange={(e) => setProfileFormData({ ...profileFormData, specialization: e.target.value })}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", marginTop: "4px" }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#334155" }}>Degree / Qualification</label>
                    <input
                      type="text"
                      value={profileFormData.degree}
                      onChange={(e) => setProfileFormData({ ...profileFormData, degree: e.target.value })}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", marginTop: "4px" }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#334155" }}>Experience (Years)</label>
                    <input
                      type="number"
                      min="0"
                      value={profileFormData.experienceYears}
                      onChange={(e) => setProfileFormData({ ...profileFormData, experienceYears: e.target.value })}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", marginTop: "4px" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#334155" }}>Phone Number</label>
                    <input
                      type="text"
                      value={profileFormData.phone}
                      onChange={(e) => setProfileFormData({ ...profileFormData, phone: e.target.value })}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", marginTop: "4px" }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#334155" }}>Languages (comma separated)</label>
                  <input
                    type="text"
                    value={profileFormData.languagesStr}
                    onChange={(e) => setProfileFormData({ ...profileFormData, languagesStr: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", marginTop: "4px" }}
                  />
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#334155" }}>Professional Bio</label>
                  <textarea
                    rows="3"
                    value={profileFormData.bio}
                    onChange={(e) => setProfileFormData({ ...profileFormData, bio: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", marginTop: "4px" }}
                  />
                </div>

                <h3 style={{ margin: "24px 0 16px", fontSize: "1.1rem", color: "#0f172a" }}>📍 Clinic Location (Optional)</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                  <div>
                    <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#334155" }}>City (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Delhi / Mumbai"
                      value={profileFormData.city}
                      onChange={(e) => setProfileFormData({ ...profileFormData, city: e.target.value })}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", marginTop: "4px" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#334155" }}>State (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Delhi / Maharashtra"
                      value={profileFormData.state}
                      onChange={(e) => setProfileFormData({ ...profileFormData, state: e.target.value })}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", marginTop: "4px" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#334155" }}>Country (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. India"
                      value={profileFormData.country}
                      onChange={(e) => setProfileFormData({ ...profileFormData, country: e.target.value })}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", marginTop: "4px" }}
                    />
                  </div>
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#334155" }}>Clinic Address / Street (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Suite 402, MindCare Clinic, Connaught Place"
                    value={profileFormData.address}
                    onChange={(e) => setProfileFormData({ ...profileFormData, address: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", marginTop: "4px" }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={profileSaving}
                  style={{
                    background: "linear-gradient(135deg, #059669, #0891b2)",
                    color: "#fff",
                    border: "none",
                    padding: "12px 24px",
                    borderRadius: "10px",
                    fontWeight: "700",
                    fontSize: "0.95rem",
                    cursor: "pointer",
                  }}
                >
                  {profileSaving ? "Saving Profile..." : "Save Profile & Location"}
                </button>
              </form>
            ) : (
              <>
                <div className="profile-info-grid">
                  {[
                    ["Full Name", doctor?.fullName],
                    ["Specialization", doctor?.specialization],
                    ["Degree", doctor?.degree],
                    ["Experience", `${doctor?.experienceYears || 0} years`],
                    [
                      "Clinic Location",
                      doctor?.location
                        ? [doctor.location.address, doctor.location.city, doctor.location.state, doctor.location.country]
                            .filter(Boolean)
                            .join(", ") || "Not specified"
                        : "Not specified",
                    ],
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
          </>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
