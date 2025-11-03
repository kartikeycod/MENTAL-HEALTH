import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import AnimatedSection from "./AnimatedSection";
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
  const navigate = useNavigate();
  const auth = getAuth();

  // 🕒 Auto-change carousel every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const handleDotClick = (index) => setCurrentSlide(index);

  // ✅ Start Test Logic
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

  return (
    <section id="hero" className="hero-section">
      <div className="hero-carousel-wrapper">
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={index}
            className={`hero-slide ${index === currentSlide ? "active" : ""}`}
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            <div className="hero-grid content-padding">
              <AnimatedSection delay={0.1}>
                <div className="hero-main-content">
                  <h1>{slide.title}</h1>
                  <p className="hero-subtitle">{slide.subtitle}</p>

                  <div className="hero-actions">
                    {slide.buttonText === "Start Test" ? (
                      <button
                        className="btn-primary"
                        onClick={handleStartTest}
                      >
                        {slide.buttonText}
                      </button>
                    ) : (
                      <button className="btn-primary">
                        {slide.buttonText}
                      </button>
                    )}

                    <button className="btn-secondary-dark">
                      Find a Provider
                    </button>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.3}>
                <div className="hero-visual-panel">
                  <div className="visual-display">
                    <p>{slide.visualText}</p>
                    <div className="data-pulse"></div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        ))}
      </div>

      {/* 🔘 Carousel Dots */}
      <div className="carousel-dots-container">
        {HERO_SLIDES.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentSlide ? "active" : ""}`}
            onClick={() => handleDotClick(index)}
          ></span>
        ))}
      </div>

      {/* 🧾 Trust Bar */}
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
