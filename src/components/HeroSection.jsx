// ✅ src/components/HeroSection.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import AnimatedSection from "./AnimatedSection";
import "./Herosection.css";
import "../App.css";

const HERO_SLIDES = [
  {
    title: "Health Redefined: Give the test",
    subtitle:
      "Experience a new era of proactive wellness powered by ethical AI, dedicated to your longevity and vitality.",
    buttonText: "Start Test",
    visualText: "Real-Time Bio-Data Stream",
  },
  {
    title: "Personalized Wellness, Delivered Instantly.",
    subtitle:
      "Access your full genomic profile and receive weekly, predictive health updates directly on your dashboard.",
    buttonText: "Activate Patient Portal",
    visualText: "Genomic Profile Loading",
  },
  {
    title: "Global Experts, Local Access, Zero Friction.",
    subtitle:
      "Connect with world-class specialists for consultation and second opinions from the comfort of your home.",
    buttonText: "Find a Provider Today",
    visualText: "Global Consult Network",
  },
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();

  // 🕒 Auto-change carousel every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  // 🧭 Check localStorage for selected plan (AI or Doctor)
  useEffect(() => {
    const plan = localStorage.getItem("selectedPlan");
    if (plan) setSelectedPlan(plan);
  }, []);

  const handleStartTest = () => {
    const user = auth.currentUser || JSON.parse(localStorage.getItem("user"));
    const detailsFilled = localStorage.getItem("detailsFilled");

    if (!user) {
      alert("⚠️ Please log in to start your assessment.");
      navigate("/auth");
      return;
    }

    if (detailsFilled !== "true") {
      alert("📝 Please complete your basic details before taking the test.");
      navigate("/form");
      return;
    }

    const confirmProceed = window.confirm(
      "✅ Make sure you have entered your basic details correctly.\nClick OK to begin your Mental Health Assessment."
    );
    if (confirmProceed) navigate("/assessment");
  };

  // 👉 Render the dynamic plan button
  const renderPlanButton = () => {
    if (selectedPlan === "ai") {
      return (
        <button
          className="btn-secondary-new"
          onClick={() => navigate("/ai-proctor")}
        >
          AI Proctoring
        </button>
      );
    } else if (selectedPlan === "doctor") {
      return (
        <button
          className="btn-tertiary-new"
          onClick={() => navigate("/doctor-dashboard")}
        >
          Doctor Consultation
        </button>
      );
    } else {
      return (
        <button
          className="btn-secondary-new"
          onClick={() => navigate("/plan")}
        >
          Choose a Plan
        </button>
      );
    }
  };

  const handleDotClick = (index) => setCurrentSlide(index);
  const slide = HERO_SLIDES[currentSlide];

  return (
    <section id="hero" className="hero-section">
      <div className="hero-carousel-wrapper">
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={index}
            className={`hero-slide ${index === 0 ? "static-active" : ""}`}
          >
            <div className="hero-grid content-padding">
              <AnimatedSection delay={0.1}>
                <div className="hero-main-content">
                  <h1>
                    Your Partner in Mental<br />Wellness<br />Healing Starts with You
                  </h1>
                  <p className="hero-subtitle">
                    MindEase offers personalized mental health support through
                    assessments, therapy sessions, and AI-powered tools to help
                    you thrive.First enter detail and then start the test.
                  </p>

                  <div className="hero-actions">
                    {/* 🧠 Main Buttons */}
                    <button
                      className="btn-primary-new"
                      onClick={handleStartTest}
                    >
                      Take Assessment
                    </button>

                    <button
                      className="btn-secondary-new"
                      onClick={() => navigate("/serenyDoctor")}
                    >
                      Talk to a Therapist
                    </button>

                    {/* 💡 Dynamic Plan Button */}
                    {renderPlanButton()}
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.3}>
                <div className="hero-visual-panel">
                  <div className="visual-display-css">
                    <div className="mind-ease-logo">
                      <div className="logo-brain">
                        <div className="brain-half left"></div>
                        <div className="brain-half right"></div>
                        <div className="brain-center"></div>
                      </div>
                      <div className="logo-heart"></div>
                      <div className="logo-circle"></div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        ))}
      </div>

      <div className="carousel-dots-container">
        {HERO_SLIDES.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentSlide ? "active" : ""}`}
            onClick={() => handleDotClick(index)}
          ></span>
        ))}
      </div>

      <AnimatedSection delay={0.5}>
        <div className="hero-trust-bar">
          <span>99.9% Data Security</span>
          <span>WCAG AA Accessible</span>
          <span>ISO 27001 Certified</span>
          <span>24/7 AI Support</span>
        </div>
      </AnimatedSection>
    </section>
  );
};

export default HeroSection;
