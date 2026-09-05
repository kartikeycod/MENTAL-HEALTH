import React from "react";
import "./FeaturesSection.css";
import { useNavigate } from "react-router-dom";
import { getCurrentAuthUser } from "../services/firebase/auth.service";
import { getUserDoc } from "../services/firebase/user.service";
import { PILLARS } from "../constants/pillars";
import { ROUTES } from "../constants/routes";

const FeaturesSection = () => {
  const navigate = useNavigate();

  const handleFeatureClick = async (pillar) => {
    const user = getCurrentAuthUser();

    // 1️⃣ Weekly Assessment
    if (pillar.link === "weekly-test") {
      if (!user) {
        alert("⚠️ Please log in to access the weekly test.");
        navigate(ROUTES.AUTH);
        return;
      }

      const userDoc = await getUserDoc(user.uid);
      if (!userDoc) return;

      const nextTestDateStr =
        userDoc.schedule?.weeklyTest?.nextTestDate || null;

      if (!nextTestDateStr) {
        alert("Weekly test schedule not found.");
        return;
      }

      const nextTestDate = new Date(nextTestDateStr);
      const today = new Date();

      const sameDay =
        today.getFullYear() === nextTestDate.getFullYear() &&
        today.getMonth() === nextTestDate.getMonth() &&
        today.getDate() === nextTestDate.getDate();

      if (sameDay || today > nextTestDate) {
        const confirmStart = window.confirm(
          "🧩 Your Weekly Test is available!\nWould you like to start it now?"
        );
        if (confirmStart) navigate(ROUTES.WEEKLY_TEST);
      } else {
        alert(
          `⏳ Your next weekly test will unlock on ${nextTestDate.toLocaleDateString()}.`
        );
      }
    }

    // 2️⃣ Yoga Monitoring
    else if (pillar.link === "exercise") {
      if (!user) {
        alert("⚠️ Please log in to continue your yoga monitoring.");
        navigate(ROUTES.AUTH);
        return;
      }
      navigate(ROUTES.EXERCISE);
    }

    // 3️⃣ Doctor Chatbot
    else if (pillar.link === "doctor-chatbot") {
      window.location.href = "https://hume-ai-tau.vercel.app/";
    }

    // 4️⃣ Peer-Anonymus
    else if (pillar.link === "peer-anonymous") {
      if (!user) {
        alert("⚠️ Please log in to access the Peer-Anonymus chat.");
        navigate(ROUTES.AUTH);
        return;
      }
      window.location.href = "https://mlsa-chatroom.vercel.app/";
    }

    // 5️⃣ Mood Tracking
    else if (pillar.link === "mood-chat") {
      if (!user) {
        alert("⚠️ Please log in to access mood tracking chat.");
        navigate(ROUTES.AUTH);
        return;
      }
      window.location.href = "https://mlsa-chatroom.vercel.app/";
    }

    // 6️⃣ Soothing Music
    else if (pillar.link === "soothing-music") {
      window.location.href = "https://mh-m-usic.vercel.app/";
    }
  };

  return (
    <section className="features-section">
      <div className="features-header">
        <h2>8 Pillars of Serenium's Futuristic Care 🌟</h2>
        <p>
          Serenium offers a diverse range of services designed to support every
          aspect of your mental well-being.
        </p>
      </div>

      <div className="features-pillars-grid">
        {PILLARS.map((pillar, index) => (
          <div
            className={`feature-card ${pillar.colorClass}`}
            key={index}
            onClick={() => handleFeatureClick(pillar)}
            style={{ cursor: pillar.link ? "pointer" : "default" }}
          >
            <div className="feature-card-icon">
              <span role="img" aria-label={pillar.title}>
                {pillar.icon}
              </span>
            </div>
            <h3>{pillar.title}</h3>
            <p>{pillar.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
