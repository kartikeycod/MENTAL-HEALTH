import React from "react";
import "./FeaturesSection.css";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const PILLARS = [
  {
    icon: "🧠",
    title: "Weekly Assessment",
    description:
      "Understand your mental state with comprehensive, AI-powered evaluations.",
    colorClass: "feature-blue",
    link: "weekly-test",
  },
  {
    icon: "🧘‍♀️",
    title: "Yoga Monitoring",
    description:
      "Track your progress in yoga and meditation for enhanced mindfulness.",
    colorClass: "feature-green",
    link: "exercise",
  },
  {
    icon: "💬",
    title: "Doctor Chatbot",
    description:
      "Instant access to a smart AI chatbot for quick advice and guidance.",
    colorClass: "feature-pink",
    link: "doctor-chatbot",
  },
  {
    icon: "📈",
    title: "Progress Dashboard",
    description:
      "Visualize your mental wellness journey with interactive dashboards.",
    colorClass: "feature-yellow",
  },
  {
    icon: "📝",
    title: "Personalized Prescription",
    description:
      "Receive tailored recommendations for self-care and growth.",
    colorClass: "feature-lightgreen",
  },
  {
    icon: "💖",
    title: "Peer-Anonymus",
    description:
      "Chat safely and anonymously with peers to share and grow together.",
    colorClass: "feature-softpink",
    link: "peer-anonymous",
  },
  {
    icon: "😊",
    title: "Mood Tracking",
    description:
      "Log and analyze your moods over time to identify patterns and triggers.",
    colorClass: "feature-lightblue",
    link: "mood-chat",
  },
  {
    icon: "🎶",
    title: "Soothing Music",
    description:
      "Play calming rain, ocean, or lofi sounds to relax and refocus your mind.",
    colorClass: "feature-purple",
    link: "soothing-music",
  },
];

const FeaturesSection = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();

  const handleFeatureClick = async (pillar) => {
    const user = auth.currentUser;

    // 1️⃣ Weekly Assessment
    if (pillar.link === "weekly-test") {
      if (!user) {
        alert("⚠️ Please log in to access the weekly test.");
        navigate("/auth");
        return;
      }

      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);
      if (!snap.exists()) return;

      const nextTestDateStr =
        snap.data()?.schedule?.weeklyTest?.nextTestDate || null;

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
        if (confirmStart) navigate("/weekly-test");
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
        navigate("/auth");
        return;
      }
      navigate("/exercise");
    }

    // 3️⃣ Doctor Chatbot
    else if (pillar.link === "doctor-chatbot") {
      window.location.href = "https://hume-ai-tau.vercel.app/";
    }

    // 4️⃣ Peer-Anonymus
    else if (pillar.link === "peer-anonymous") {
      if (!user) {
        alert("⚠️ Please log in to access the Peer-Anonymus chat.");
        navigate("/auth");
        return;
      }
      window.location.href = "https://mlsa-chatroom.vercel.app/";
    }

    // 5️⃣ Mood Tracking
    else if (pillar.link === "mood-chat") {
      if (!user) {
        alert("⚠️ Please log in to access mood tracking chat.");
        navigate("/auth");
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
