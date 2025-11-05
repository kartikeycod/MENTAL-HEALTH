import React, { useState } from "react";
import "./Landing.css";

const LandingPage = () => {
  const [location, setLocation] = useState(null);

  const handleFindHospitals = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        () => {
          alert("Please allow location access to find nearby hospitals.");
        }
      );
    } else {
      alert("Geolocation not supported by your browser.");
    }
  };

  return (
    <div className="serenity-landing">
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <h1 className="logo">Serenity Doctor</h1>
          <nav className="nav">
            <a href="#home">Home</a>
            <a href="#plans">Plans</a>
            <a href="#find">Find Doctor</a>
            <a href="#testimonials">Testimonials</a>
            <a href="#contact">Contact</a>
          </nav>
          <button className="login-btn">Login as Doctor</button>
        </div>
      </header>

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
            <button className="primary-btn">Join as Doctor</button>
            <button className="secondary-btn" onClick={handleFindHospitals}>
              Find Nearby Doctors
            </button>
          </div>
        </div>

        <div className="hero-image">
          <div className="circle"></div>
        </div>
      </section>

      {/* Nearby Doctors */}
      <section id="find" className="find-section">
        <h2>Find Nearby Hospitals or Therapists</h2>
        <p>Allow location access to see hospitals near you.</p>

        <button onClick={handleFindHospitals} className="find-btn">
          Locate Me
        </button>

        {location && (
          <div className="map-placeholder">
            <p>
              Showing hospitals near: <br />
              <strong>
                Lat: {location.lat.toFixed(3)}, Lon: {location.lon.toFixed(3)}
              </strong>
            </p>
            <div className="map-box">[ Map / API Placeholder ]</div>
          </div>
        )}
      </section>

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
        <p className="footer-bottom">
          © 2025 Serenity Doctor. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
