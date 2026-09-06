import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDoctorApplication } from "../../hooks/useDoctorApplication";
import { ROUTES } from "../../constants/routes";
import "./DoctorAuth.css";

const DoctorSignupPage = () => {
  const navigate = useNavigate();
  const {
    formData,
    updateField,
    updateLocationField,
    requestGeolocation,
    geolocationLoading,
    handleDocumentSelection,
    removeDocument,
    addPlan,
    updatePlan,
    removePlan,
    submitApplicationForm,
    validationErrors,
    submitting,
    error,
  } = useDoctorApplication();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await submitApplicationForm();
    if (result && result.doctorUid) {
      navigate(ROUTES.DOCTOR_PENDING);
    }
  };

  return (
    <div className="doctor-auth-wrapper large-form">
      <div className="doctor-auth-card width-wide">
        <div className="doctor-auth-header">
          <div className="doctor-auth-badge">Clinical Verification Onboarding</div>
          <h2>Join Serenium as a Therapist / Doctor</h2>
          <p>Complete your professional application to provide therapy and mental health care on Serenium.</p>
        </div>

        {error && <div className="doctor-auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="doctor-signup-grid">
          {/* SECTION 1: ACCOUNT INFORMATION */}
          <div className="signup-section">
            <h3>1. Account & Credentials</h3>
            <div className="form-grid-2">
              <div className="form-group">
                <label>Professional Email *</label>
                <input
                  type="email"
                  placeholder="doctor@example.com"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className={validationErrors.email ? "input-error" : ""}
                />
                {validationErrors.email && <span className="error-text">{validationErrors.email}</span>}
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 9876543210"
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Password *</label>
                <input
                  type="password"
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  className={validationErrors.password ? "input-error" : ""}
                />
                {validationErrors.password && <span className="error-text">{validationErrors.password}</span>}
              </div>

              <div className="form-group">
                <label>Confirm Password *</label>
                <input
                  type="password"
                  placeholder="Repeat password"
                  value={formData.confirmPassword}
                  onChange={(e) => updateField("confirmPassword", e.target.value)}
                  className={validationErrors.confirmPassword ? "input-error" : ""}
                />
                {validationErrors.confirmPassword && (
                  <span className="error-text">{validationErrors.confirmPassword}</span>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 2: PROFESSIONAL INFORMATION */}
          <div className="signup-section">
            <h3>2. Professional & Clinical Information</h3>
            <div className="form-grid-2">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  placeholder="Dr. Eleanor Vance"
                  value={formData.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                  className={validationErrors.fullName ? "input-error" : ""}
                />
                {validationErrors.fullName && <span className="error-text">{validationErrors.fullName}</span>}
              </div>

              <div className="form-group">
                <label>Professional Display Name</label>
                <input
                  type="text"
                  placeholder="Dr. Eleanor Vance, PsyD"
                  value={formData.displayName}
                  onChange={(e) => updateField("displayName", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Degree / Qualification *</label>
                <input
                  type="text"
                  placeholder="MD, M.Phil Clinical Psychology, PsyD"
                  value={formData.degree}
                  onChange={(e) => updateField("degree", e.target.value)}
                  className={validationErrors.degree ? "input-error" : ""}
                />
                {validationErrors.degree && <span className="error-text">{validationErrors.degree}</span>}
              </div>

              <div className="form-group">
                <label>Specialization *</label>
                <select
                  value={formData.specialization}
                  onChange={(e) => updateField("specialization", e.target.value)}
                  className={validationErrors.specialization ? "input-error" : ""}
                >
                  <option value="">Select Specialization</option>
                  <option value="Clinical Psychologist">Clinical Psychologist</option>
                  <option value="Psychiatrist">Psychiatrist</option>
                  <option value="Counseling Psychologist">Counseling Psychologist</option>
                  <option value="Cognitive Behavioral Therapist">Cognitive Behavioral Therapist (CBT)</option>
                  <option value="Child & Adolescent Therapist">Child & Adolescent Therapist</option>
                  <option value="Mindfulness & Stress Specialist">Mindfulness & Stress Specialist</option>
                </select>
                {validationErrors.specialization && (
                  <span className="error-text">{validationErrors.specialization}</span>
                )}
              </div>

              <div className="form-group">
                <label>Experience (Years) *</label>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 8"
                  value={formData.experienceYears}
                  onChange={(e) => updateField("experienceYears", e.target.value)}
                  className={validationErrors.experienceYears ? "input-error" : ""}
                />
                {validationErrors.experienceYears && (
                  <span className="error-text">{validationErrors.experienceYears}</span>
                )}
              </div>

              <div className="form-group">
                <label>Medical/License Registration Number</label>
                <input
                  type="text"
                  placeholder="RCI Reg / Medical Council ID"
                  value={formData.registrationNumber}
                  onChange={(e) => updateField("registrationNumber", e.target.value)}
                />
              </div>
            </div>

            <div className="form-group full-width">
              <label>Professional Bio / Overview *</label>
              <textarea
                rows="3"
                placeholder="Describe your background, therapeutic approach, and compassionate patient care philosophy..."
                value={formData.bio}
                onChange={(e) => updateField("bio", e.target.value)}
                className={validationErrors.bio ? "input-error" : ""}
              ></textarea>
              {validationErrors.bio && <span className="error-text">{validationErrors.bio}</span>}
            </div>
          </div>

          {/* SECTION 3: LOCATION & GEOLOCATION (OPTIONAL) */}
          <div className="signup-section">
            <h3>3. Practice & Clinic Location (Optional)</h3>
            <p className="doc-instruction" style={{ marginBottom: "12px" }}>
              Entering your clinic location is optional. You can enter your city/clinic address manually or use auto-detect.
            </p>
            <div className="geolocation-box">
              <button
                type="button"
                className="btn-location"
                onClick={requestGeolocation}
                disabled={geolocationLoading}
              >
                {geolocationLoading ? "Locating..." : "📍 Auto-Detect Location (Optional)"}
              </button>
              {formData.location.lat && (
                <span className="geo-status">
                  ✓ Coordinates captured (Lat: {formData.location.lat.toFixed(4)}, Lon: {formData.location.lon.toFixed(4)})
                </span>
              )}
            </div>

            <div className="form-grid-3">
              <div className="form-group">
                <label>City (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. San Francisco / New Delhi"
                  value={formData.location.city}
                  onChange={(e) => updateLocationField("city", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>State / Province (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. California / Delhi"
                  value={formData.location.state}
                  onChange={(e) => updateLocationField("state", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Country (Optional)</label>
                <input
                  type="text"
                  value={formData.location.country}
                  onChange={(e) => updateLocationField("country", e.target.value)}
                />
              </div>
            </div>

            <div className="form-group full-width" style={{ marginTop: "12px" }}>
              <label>Clinic Address / Street (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Suite 402, MindCare Clinic, Connaught Place"
                value={formData.location.address}
                onChange={(e) => updateLocationField("address", e.target.value)}
              />
            </div>
          </div>

          {/* SECTION 4: VERIFICATION DOCUMENTS */}
          <div className="signup-section">
            <h3>4. Qualification & License Verification Documents</h3>
            <div className="document-upload-card">
              <p className="doc-instruction">
                Please attach files proving your Degree, Medical Council Registration, or Clinical Practice License.
              </p>
              <input
                type="file"
                multiple
                accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                onChange={handleDocumentSelection}
                className="doc-file-input"
              />

              <div className="pending-storage-notice">
                ℹ️ <strong>Backend Storage Notice:</strong> Storage integration is pending backend storage deployment.
                Selected document names, sizes, and file metadata will be securely stored with your verification request for Super Admin review.
              </div>

              {formData.documents.length > 0 && (
                <div className="selected-docs-list">
                  <h4>Selected Documents ({formData.documents.length}):</h4>
                  {formData.documents.map((doc, idx) => (
                    <div key={idx} className="doc-item">
                      <span>📄 {doc.name} ({(doc.sizeBytes / 1024).toFixed(1)} KB)</span>
                      <button type="button" onClick={() => removeDocument(idx)} className="btn-remove-doc">
                        ✕ Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {validationErrors.documents && <span className="error-text">{validationErrors.documents}</span>}
            </div>
          </div>

          {/* SECTION 5: CONSULTATION PLANS & PRICING */}
          <div className="signup-section">
            <div className="section-title-action">
              <h3>5. Consultation Plans & Pricing</h3>
              <button type="button" onClick={addPlan} className="btn-add-plan">
                + Add Another Plan
              </button>
            </div>

            {formData.plans.map((plan, index) => (
              <div key={index} className="plan-editor-card">
                <div className="plan-editor-header">
                  <h4>Plan #{index + 1}</h4>
                  {formData.plans.length > 1 && (
                    <button type="button" onClick={() => removePlan(index)} className="btn-delete-plan">
                      Remove Plan
                    </button>
                  )}
                </div>

                <div className="form-grid-3">
                  <div className="form-group">
                    <label>Plan Name</label>
                    <input
                      type="text"
                      placeholder="Basic Counseling"
                      value={plan.name}
                      onChange={(e) => updatePlan(index, "name", e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Price (₹ INR)</label>
                    <input
                      type="number"
                      min="1"
                      placeholder="499"
                      value={plan.price}
                      onChange={(e) => updatePlan(index, "price", e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Duration</label>
                    <input
                      type="text"
                      placeholder="45 Mins / 1 Month"
                      value={plan.duration}
                      onChange={(e) => updatePlan(index, "duration", e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Plan Description</label>
                  <input
                    type="text"
                    placeholder="Includes 1-on-1 audio/video counseling session + chat notes"
                    value={plan.description}
                    onChange={(e) => updatePlan(index, "description", e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="form-submit-row">
            <button type="submit" className="doctor-btn-primary full-width-btn" disabled={submitting}>
              {submitting ? "Submitting Clinical Application..." : "Submit Application for Verification"}
            </button>
          </div>
        </form>

        <div className="doctor-auth-footer">
          <p>
            Already have a doctor account?{" "}
            <Link to={ROUTES.DOCTOR_LOGIN} className="doctor-link">
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DoctorSignupPage;
