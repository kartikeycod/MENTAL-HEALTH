import React from "react";
import "./Landing.css";
import { useDoctorLanding } from "../hooks/useDoctorLanding";
import { ROUTES } from "../constants/routes";

const Landing = () => {
  const {
    location,
    counsellors,
    loading,
    showLogin,
    setShowLogin,
    showJoin,
    setShowJoin,
    loginEmail,
    setLoginEmail,
    loginPass,
    setLoginPass,
    dName,
    setDName,
    dEmail,
    setDEmail,
    dPass,
    setDPass,
    dSpec,
    setDSpec,
    authError,
    authLoading,
    doctorLoggedIn,
    allUsers,
    selectedUser,
    setSelectedUser,
    handleFindCounsellors,
    handleDoctorRegister,
    handleDoctorLogin,
  } = useDoctorLanding();

  return (
    <div className="serenity-landing">
      {/* Hero */}
      <section id="home" className="hero">
        <div className="hero-content">
          <h2>
            Empowering Therapists. <br /> Healing Lives Together.
          </h2>
          <p>
            Connect with patients seeking care, manage sessions, and grow your
            mental wellness practice seamlessly.
          </p>
          <div className="hero-actions">
            <button className="primary-btn" onClick={() => setShowJoin(true)}>
              Join as Doctor
            </button>
            <button className="secondary-btn" onClick={() => (window.location.href = ROUTES.THERAPISTS)}>
              Find Therapists Marketplace
            </button>
          </div>
        </div>

        <div className="hero-image">
          <div className="circle"></div>
        </div>
      </section>

      {/* DOCTOR LOGIN POPUP */}
      {showLogin && (
        <div className="popup">
          <div className="popup-box">
            <h2>Doctor Login</h2>
            {authError && <div style={{ color: "#ef4444", marginBottom: "12px", fontSize: "0.9rem" }}>{authError}</div>}
            <input
              type="email"
              className="popup-input"
              placeholder="Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />
            <input
              type="password"
              className="popup-input"
              placeholder="Password"
              value={loginPass}
              onChange={(e) => setLoginPass(e.target.value)}
            />
            <button className="primary-btn" onClick={handleDoctorLogin} disabled={authLoading}>
              {authLoading ? "Logging in..." : "Login"}
            </button>
            <button className="close-btn" onClick={() => setShowLogin(false)} disabled={authLoading}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* DOCTOR JOIN POPUP */}
      {showJoin && (
        <div className="popup">
          <div className="popup-box">
            <h2>Join as Doctor</h2>
            {authError && <div style={{ color: "#ef4444", marginBottom: "12px", fontSize: "0.9rem" }}>{authError}</div>}

            <input
              className="popup-input"
              placeholder="Full name"
              value={dName}
              onChange={(e) => setDName(e.target.value)}
            />
            <input
              className="popup-input"
              placeholder="Email"
              value={dEmail}
              onChange={(e) => setDEmail(e.target.value)}
            />
            <input
              type="password"
              className="popup-input"
              placeholder="Password (min 6 characters)"
              value={dPass}
              onChange={(e) => setDPass(e.target.value)}
            />
            <input
              className="popup-input"
              placeholder="Specialization (e.g. Clinical Psychologist)"
              value={dSpec}
              onChange={(e) => setDSpec(e.target.value)}
            />

            <button className="primary-btn" onClick={handleDoctorRegister} disabled={authLoading}>
              {authLoading ? "Registering in Firebase..." : "Register"}
            </button>
            <button className="close-btn" onClick={() => setShowJoin(false)} disabled={authLoading}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* DOCTOR DASHBOARD */}
      {doctorLoggedIn && (
        <section className="dashboard-section">
          <h2>Doctor Dashboard</h2>
          <p>View & monitor every user's progress</p>

          <div className="dashboard-container">
            <div className="user-list">
              <h3>All Users</h3>
              {allUsers.length === 0 && <p>No users found.</p>}
              {allUsers.map((u) => (
                <div
                  key={u.id}
                  className={`user-card ${
                    selectedUser?.id === u.id ? "active-user" : ""
                  }`}
                  onClick={() => setSelectedUser(u)}
                >
                  <p>
                    <b>ID:</b> {u.id.slice(0, 10)}...
                  </p>
                  <p>
                    <b>Plan:</b> {u.plan || "—"}
                  </p>
                  <p>
                    <b>Location:</b> {u.prefs?.location || "—"}
                  </p>
                </div>
              ))}
            </div>

            <div className="user-details">
              {selectedUser ? (
                <>
                  <h3>Details for: {selectedUser.id}</h3>
                  <pre>{JSON.stringify(selectedUser, null, 2)}</pre>
                </>
              ) : (
                <p>Select a user to view details</p>
              )}
            </div>
          </div>
        </section>
      )}



      {/* Plans */}
      <section id="plans" className="plans-section">
        <h2>1-on-1 Counselling at the Lowest Cost Ever</h2>
        <p>Choose a plan that fits your healing journey.</p>

        <div className="plans-grid">
          <div className="plan-card">
            <h3>Basic Care</h3>
            <p>AI-guided sessions + Chat with doctor (2x/month)</p>
            <h4>₹199 / month</h4>
            <button>Start Now</button>
          </div>

          <div className="plan-card highlight">
            <h3>Complete Wellness</h3>
            <p>Unlimited text therapy + 1 video session / week</p>
            <h4>₹499 / month</h4>
            <button>Choose Plan</button>
          </div>

          <div className="plan-card">
            <h3>Premium Support</h3>
            <p>Dedicated therapist + personal progress reports</p>
            <h4>₹999 / month</h4>
            <button>Get Started</button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="testimonials">
        <h2>What Our Patients Say</h2>
        <div className="testimonial-grid">
          <div className="testimonial-card">
            <p>
              “Serenity Doctor helped me connect with an amazing therapist within
              minutes. Affordable and caring service!”
            </p>
            <h4>— Aditi Sharma</h4>
          </div>

          <div className="testimonial-card">
            <p>
              “The 1-on-1 counselling sessions made a huge difference in my daily
              routine and emotional balance.”
            </p>
            <h4>— Rahul Mehta</h4>
          </div>

          <div className="testimonial-card">
            <p>
              “Clean interface, supportive therapists, and really budget-friendly
              options. Highly recommended!”
            </p>
            <h4>— Priya Verma</h4>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="footer">
        <div className="footer-content">
          <div>
            <h3>Serenity Doctor</h3>
            <p>
              Your trusted partner in affordable and effective mental health
              therapy.
            </p>
          </div>
          <div className="footer-links">
            <a href="#home">Home</a>
            <a href="#plans">Plans</a>
            <a href="#find">Find Doctor</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
        <p className="footer-bottom">© 2025 Serenity Doctor. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
