// HeroSection.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import AnimatedSection from "./AnimatedSection";
// 🚀 NEW: Importing the dedicated CSS file
import './Herosection.css'; 
import "../App.css";

const HERO_SLIDES = [
  {
    title: "Health Redefined: Give the test", // This title will be replaced in the UI
    subtitle:
      "Experience a new era of proactive wellness powered by ethical AI, dedicated to your longevity and vitality.", // This subtitle will be replaced in the UI
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
  const navigate = useNavigate();
  const auth = getAuth();

  // 🕒 Auto-change carousel every 8 seconds (LOGIC UNTOUCHED)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const handleDotClick = (index) => setCurrentSlide(index); // LOGIC UNTOUCHED

  // ✅ Start Test Logic (KEPT INTACT)
  const handleStartTest = () => {
    const user = auth.currentUser || JSON.parse(localStorage.getItem("user"));
    const detailsFilled = localStorage.getItem("detailsFilled");

    // 🧩 Step 1: Check login
    if (!user) {
      alert("⚠️ Please log in to start your assessment.");
      navigate("/auth");
      return;
    }

    // 🧩 Step 2: Check form completion
    if (detailsFilled !== "true") {
      alert("📝 Please complete your basic details before taking the test.");
      navigate("/form");
      return;
    }

    // 🧩 Step 3: Confirm and redirect
    const confirmProceed = window.confirm(
      "✅ Make sure you have entered your basic details correctly.\nClick OK to begin your Mental Health Assessment."
    );
    if (confirmProceed) navigate("/assessment");
  };

  // 📌 Using the content from the first slide for the static visual, but overriding the text in the UI
  const slide = HERO_SLIDES[currentSlide]; 

  return (
    // 💡 The 'hero-section' class is now the main entry point for the new styles
    <section id="hero" className="hero-section">
      <div className="hero-carousel-wrapper">
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={index}
            // 💡 We only show the first slide, and hide the others using CSS
            className={`hero-slide ${index === 0 ? "static-active" : ""}`} 
            // Removed inline transform style to prevent carousel effect
          >
            <div className="hero-grid content-padding">
              <AnimatedSection delay={0.1}>
                <div className="hero-main-content">
                  {/* 🚀 NEW STATIC TEXT for the MindEase Design */}
                  <h1>Your Partner in Mental<br/>Wellness<br/>Healing Starts with You</h1>
                  <p className="hero-subtitle">MindEase offers personalized mental health support through assessments, therapy sessions, and AI-powered tools to help you thrive.</p>

                  <div className="hero-actions">
                    {/* 1. Take Assessment Button (Primary) */}
                    <button
                      className="btn-primary-new" // Using a new class for the blue button
                      onClick={handleStartTest} // Logic is still tied here
                    >
                      Take Assessment
                    </button>

                    {/* 2. Talk to a Therapist Button (Secondary) */}
                    <button className="btn-secondary-new"> {/* Using a new class for the white button */}
                      Talk to a Therapist
                    </button>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.3}>
                {/* 🚀 Visual Panel where we'll create the brain/heart icon */}
                <div className="hero-visual-panel">
                  {/* 💡 The container for the CSS-based design */}
                  <div className="visual-display-css">
                    {/* The structure for the brain/heart icon is built in CSS */}
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

      {/* 🔘 Carousel Dots - HIDING THESE IN CSS */}
      <div className="carousel-dots-container">
        {HERO_SLIDES.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentSlide ? "active" : ""}`}
            onClick={() => handleDotClick(index)}
          ></span>
        ))}
      </div>

      {/* 🧾 Trust Bar - HIDING THIS IN CSS */}
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