// src/components/Upcoming.jsx
import React from "react";
import "./Upcoming.css";

const Upcoming = () => {
  return (
    <section className="upcoming-grand">
      <div className="upcoming-gradient"></div>
      <div className="upcoming-container">
        <div className="upcoming-text">
          <h1 className="grand-title">
            Introducing the <span>Sereny Band</span>
          </h1>
          <p className="grand-subtitle">
            A <strong>mood-intelligent wearable</strong> that understands your emotions,
            syncs with your environment, and evolves with your mental state.  
            The future of <em>empathic technology</em> begins here — where
            <strong> AI intuition</strong> meets <strong>IoT precision</strong>.
          </p>
          <p className="coming-note">
            ⚙️ IoT Auto-Detect & Emotion Synchronization — <em>Coming Soon</em>
          </p>
        </div>

        <div className="upcoming-image">
          <img
            src="https://thumbs.dreamstime.com/b/black-electronic-watch-smart-fitness-tracker-textured-black-background-dark-object-dark-background-dark-black-electronic-211742402.jpg"
            alt="Sereny Band"
            className="band-img"
          />
          <div className="band-glow"></div>
        </div>
      </div>
    </section>
  );
};

export default Upcoming;
