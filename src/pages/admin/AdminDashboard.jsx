import React, { useState } from "react";
import { useAdmin } from "../../hooks/useAdmin";
import { useAuth } from "../../hooks/useAuth";
import { getDoctorById } from "../../services/firebase/doctorService";
import { STATUS_CONFIG, APPLICATION_STATUS } from "../../config/statuses";
import "./AdminDashboard.css";

const StatCard = ({ icon, label, value, color }) => (
  <div className="admin-stat-card" style={{ borderTop: `3px solid ${color}` }}>
    <div className="admin-stat-icon">{icon}</div>
    <div className="admin-stat-value">{value}</div>
    <div className="admin-stat-label">{label}</div>
  </div>
);

const ConfirmModal = ({ message, onConfirm, onCancel }) => (
  <div className="admin-modal-overlay">
    <div className="admin-modal">
      <p>{message}</p>
      <div className="admin-modal-actions">
        <button className="btn-admin-danger" onClick={onConfirm}>Confirm</button>
        <button className="btn-admin-secondary" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const {
    metrics, users, applications, actionLogs, loading,
    userRoleFilter, setUserRoleFilter,
    userSearchQuery, setUserSearchQuery,
    appStatusFilter, setAppStatusFilter,
    approveApplication, rejectApplication, suspendDoctorAccount,
    refresh,
  } = useAdmin();

  const [activeTab, setActiveTab] = useState("overview");
  const [selectedApp, setSelectedApp] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [actionNote, setActionNote] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const handleAction = (type, doctorUid) => {
    setConfirm({
      type,
      doctorUid,
      message: type === "approve"
        ? "Approve this doctor application? Their profile will go live on the marketplace."
        : type === "reject"
        ? "Reject this application? The doctor will be notified."
        : "Suspend this doctor account? They will be removed from the public marketplace.",
    });
  };

  const executeAction = async () => {
    if (!confirm) return;
    setActionLoading(true);
    try {
      if (confirm.type === "approve") await approveApplication(confirm.doctorUid, actionNote);
      else if (confirm.type === "reject") await rejectApplication(confirm.doctorUid, actionNote);
      else if (confirm.type === "suspend") await suspendDoctorAccount(confirm.doctorUid, actionNote);
      setSelectedApp(null);
      setConfirm(null);
      setActionNote("");
    } catch (err) {
      alert("Action failed: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const TABS = [
    { id: "overview", label: "📊 Overview" },
    { id: "users", label: "👥 Users" },
    { id: "applications", label: "🩺 Doctor Applications" },
    { id: "logs", label: "📜 Admin Logs" },
  ];

  return (
    <div className="admin-page">
      {confirm && (
        <ConfirmModal
          message={confirm.message}
          onConfirm={executeAction}
          onCancel={() => setConfirm(null)}
        />
      )}

      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-shield">🛡️</div>
          <div>
            <div className="admin-brand-title">Admin Portal</div>
            <div className="admin-brand-sub">{user?.email}</div>
          </div>
        </div>
        <nav className="admin-nav">
          {TABS.map(tab => (
            <div
              key={tab.id}
              className={`admin-nav-item ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </div>
          ))}
          <div className="admin-nav-item logout" onClick={logout}>← Logout</div>
        </nav>
      </aside>

      <main className="admin-main">
        {activeTab === "overview" && (
          <>
            <div className="admin-page-header">
              <h2>Platform Overview</h2>
              <button className="btn-admin-refresh" onClick={refresh} disabled={loading}>
                {loading ? "Loading..." : "↻ Refresh"}
              </button>
            </div>
            <div className="admin-stats-grid">
              <StatCard icon="👥" label="Total Users" value={metrics.totalUsers} color="#4f46e5" />
              <StatCard icon="🩺" label="Total Doctors" value={metrics.totalDoctors} color="#0891b2" />
              <StatCard icon="✅" label="Verified Doctors" value={metrics.verifiedDoctors} color="#16a34a" />
              <StatCard icon="⏳" label="Pending Applications" value={metrics.pendingApplications} color="#d97706" />
              <StatCard icon="🛒" label="Total Orders" value={metrics.totalOrders} color="#7c3aed" />
            </div>
          </>
        )}

        {activeTab === "users" && (
          <>
            <div className="admin-page-header">
              <h2>All Users</h2>
            </div>
            <div className="admin-filter-bar">
              <input
                type="text"
                placeholder="Search by name, email..."
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                className="admin-search-input"
              />
              <select value={userRoleFilter} onChange={(e) => setUserRoleFilter(e.target.value)} className="admin-filter-select">
                <option value="all">All Roles</option>
                <option value="patient">Patients</option>
                <option value="doctor">Doctors</option>
                <option value="admin">Admins</option>
              </select>
            </div>

            {loading ? (
              <div className="admin-loading">Loading users...</div>
            ) : (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Roles</th>
                      <th>Status</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr><td colSpan="5" className="table-empty">No users found.</td></tr>
                    ) : users.map(u => (
                      <tr key={u.id}>
                        <td className="user-name-cell">{u.displayName || "—"}</td>
                        <td>{u.email || "—"}</td>
                        <td>
                          <div className="role-chips">
                            {u.roles?.admin && <span className="role-chip admin">Admin</span>}
                            {u.roles?.doctor && <span className="role-chip doctor">Doctor</span>}
                            {!u.roles?.admin && <span className="role-chip patient">Patient</span>}
                          </div>
                        </td>
                        <td>
                          <span className={`status-dot ${u.status === "active" ? "active" : "inactive"}`}>
                            {u.status || "active"}
                          </span>
                        </td>
                        <td>{u.createdAt?.toDate ? u.createdAt.toDate().toLocaleDateString("en-IN") : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {activeTab === "applications" && (
          <>
            <div className="admin-page-header">
              <h2>Doctor Applications</h2>
            </div>
            <div className="admin-filter-bar">
              <select value={appStatusFilter} onChange={(e) => setAppStatusFilter(e.target.value)} className="admin-filter-select">
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="under_review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            <div className="apps-layout">
              <div className="apps-list">
                {loading ? (
                  <div className="admin-loading">Loading applications...</div>
                ) : applications.length === 0 ? (
                  <div className="admin-empty">No applications found for this filter.</div>
                ) : applications.map(app => {
                  const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG[APPLICATION_STATUS.PENDING];
                  return (
                    <div
                      key={app.id}
                      className={`app-list-item ${selectedApp?.id === app.id ? "selected" : ""}`}
                      onClick={() => setSelectedApp(app)}
                    >
                      <div className="app-list-name">{app.submittedInfo?.fullName || app.doctorUid}</div>
                      <div className="app-list-spec">{app.submittedInfo?.specialization || "—"}</div>
                      <span className="app-status-mini" style={{ background: cfg.bgColor, color: cfg.color }}>
                        {cfg.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="app-detail-panel">
                {!selectedApp ? (
                  <div className="app-detail-empty">Select an application to review</div>
                ) : (
                  <>
                    <h3>Application Review</h3>
                    <div className="app-detail-grid">
                      {[
                        ["Doctor UID", selectedApp.doctorUid],
                        ["Full Name", selectedApp.submittedInfo?.fullName],
                        ["Degree", selectedApp.submittedInfo?.degree],
                        ["Specialization", selectedApp.submittedInfo?.specialization],
                        ["Experience", selectedApp.submittedInfo?.experienceYears + " years"],
                        ["Location", selectedApp.submittedInfo?.location
                          ? `${selectedApp.submittedInfo.location.city || ""}, ${selectedApp.submittedInfo.location.state || ""}`.trim()
                          : "—"],
                        ["Reg. Number", selectedApp.submittedInfo?.registrationNumber || "Not provided"],
                        ["Contact Email", selectedApp.submittedInfo?.contactEmail],
                        ["Submitted", selectedApp.submittedAt?.toDate ? selectedApp.submittedAt.toDate().toLocaleDateString("en-IN") : "—"],
                        ["Current Status", selectedApp.status],
                      ].map(([label, val]) => (
                        <div key={label} className="app-detail-row">
                          <span className="app-detail-label">{label}</span>
                          <span className="app-detail-value">{val || "—"}</span>
                        </div>
                      ))}
                    </div>

                    {selectedApp.submittedInfo?.bio && (
                      <div className="app-bio-box">
                        <strong>Professional Bio:</strong>
                        <p>{selectedApp.submittedInfo.bio}</p>
                      </div>
                    )}

                    {selectedApp.documents?.length > 0 && (
                      <div className="app-docs-box">
                        <strong>Submitted Documents ({selectedApp.documents.length}):</strong>
                        {selectedApp.documents.map((doc, i) => (
                          <div key={i} className="app-doc-item">
                            📄 {doc.name} ({(doc.sizeBytes / 1024).toFixed(1)} KB) —
                            <em> {doc.note || "Pending storage integration"}</em>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="app-action-note">
                      <label>Admin Note / Reason (optional)</label>
                      <textarea
                        rows="2"
                        placeholder="Reason for action, feedback for doctor..."
                        value={actionNote}
                        onChange={(e) => setActionNote(e.target.value)}
                      />
                    </div>

                    <div className="app-actions">
                      {selectedApp.status !== APPLICATION_STATUS.APPROVED && (
                        <button
                          className="btn-admin-approve"
                          disabled={actionLoading}
                          onClick={() => handleAction("approve", selectedApp.doctorUid)}
                        >
                          ✅ Approve Application
                        </button>
                      )}
                      {selectedApp.status !== APPLICATION_STATUS.REJECTED && (
                        <button
                          className="btn-admin-reject"
                          disabled={actionLoading}
                          onClick={() => handleAction("reject", selectedApp.doctorUid)}
                        >
                          ❌ Reject Application
                        </button>
                      )}
                      {selectedApp.status !== APPLICATION_STATUS.SUSPENDED && (
                        <button
                          className="btn-admin-suspend"
                          disabled={actionLoading}
                          onClick={() => handleAction("suspend", selectedApp.doctorUid)}
                        >
                          🔒 Suspend Doctor
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === "logs" && (
          <>
            <div className="admin-page-header">
              <h2>Admin Action Audit Log</h2>
            </div>
            {loading ? (
              <div className="admin-loading">Loading logs...</div>
            ) : actionLogs.length === 0 ? (
              <div className="admin-empty">No admin actions recorded yet.</div>
            ) : (
              <div className="logs-list">
                {actionLogs.map(log => (
                  <div key={log.id} className="log-item">
                    <div className="log-action">{log.action}</div>
                    <div className="log-meta">
                      <span>Target: {log.targetUid}</span>
                      <span>Admin: {log.adminUid}</span>
                      <span>{log.timestamp?.toDate ? log.timestamp.toDate().toLocaleString("en-IN") : "—"}</span>
                    </div>
                    {log.metadata?.note && <div className="log-note">Note: {log.metadata.note}</div>}
                    {log.metadata?.reason && <div className="log-note">Reason: {log.metadata.reason}</div>}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
