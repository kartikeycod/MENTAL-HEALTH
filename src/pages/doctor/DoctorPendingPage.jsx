import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getApplicationByDoctorUid } from "../../services/firebase/doctorApplicationService";
import { STATUS_CONFIG, APPLICATION_STATUS } from "../../config/statuses";
import { ROUTES } from "../../constants/routes";
import "./DoctorPending.css";

const DoctorPendingPage = () => {
  const { user, logout } = useAuth();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;
    getApplicationByDoctorUid(user.uid)
      .then(setApplication)
      .finally(() => setLoading(false));
  }, [user?.uid]);

  const status = application?.status || APPLICATION_STATUS.PENDING;
  const config = STATUS_CONFIG[status] || STATUS_CONFIG[APPLICATION_STATUS.PENDING];
  const submittedAt = application?.submittedAt?.toDate
    ? application.submittedAt.toDate().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : "Submitted recently";

  return (
    <div className="pending-page">
      <div className="pending-card">
        <div className="pending-logo">⚕️</div>
        <h1>Doctor Application Status</h1>

        {loading ? (
          <div className="pending-loading">Loading your application status...</div>
        ) : (
          <>
            <div
              className="status-badge"
              style={{ background: config.bgColor, color: config.color, border: `1.5px solid ${config.color}` }}
            >
              {config.label}
            </div>

            <div className="pending-description">{config.description}</div>

            {application?.adminReviewNote && status !== APPLICATION_STATUS.PENDING && (
              <div className="admin-feedback-box">
                <strong>Admin Note:</strong> {application.adminReviewNote}
              </div>
            )}

            <div className="pending-info-grid">
              <div className="pending-info-item">
                <span className="info-label">Application ID</span>
                <span className="info-value">{application?.id || "—"}</span>
              </div>
              <div className="pending-info-item">
                <span className="info-label">Submitted On</span>
                <span className="info-value">{submittedAt}</span>
              </div>
              <div className="pending-info-item">
                <span className="info-label">Account Email</span>
                <span className="info-value">{user?.email || "—"}</span>
              </div>
            </div>

            {status === APPLICATION_STATUS.PENDING || status === APPLICATION_STATUS.UNDER_REVIEW ? (
              <div className="pending-next-steps">
                <h3>What happens next?</h3>
                <ol>
                  <li>Our clinical verification team will review your submitted documents and credentials.</li>
                  <li>You may be contacted via email for additional information if needed.</li>
                  <li>Once approved, your profile becomes live on the Serenium therapist marketplace.</li>
                  <li>Verification typically takes 1–3 business days.</li>
                </ol>
              </div>
            ) : null}

            <div className="pending-actions">
              {status === APPLICATION_STATUS.APPROVED && (
                <Link to={ROUTES.DOCTOR_DASHBOARD} className="btn-pending-primary">
                  Open Doctor Dashboard
                </Link>
              )}
              <button onClick={logout} className="btn-pending-secondary">
                Sign Out
              </button>
              <Link to={ROUTES.HOME} className="btn-pending-subtle">
                Return to Home
              </Link>
            </div>

            <div className="pending-support">
              <p>Questions or need help? Contact our support team:</p>
              <a href="mailto:support@serenium.health">support@serenium.health</a>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DoctorPendingPage;
