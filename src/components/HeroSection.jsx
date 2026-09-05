import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentAuthUser } from "../services/firebase/auth.service";
import AnimatedSection from "./AnimatedSection";
import { HERO_SLIDES, HERO_TRUST_BAR_ITEMS } from "../constants/heroSlides";
import {
  getStoredUser,
  getDetailsFilled,
  getSelectedPlan,
} from "../utils/storage/storageHelpers";
import { ROUTES } from "../constants/routes";
import "./Herosection.css";
import "../App.css";

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedPlan, setSelectedPlanState] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const plan = getSelectedPlan();
    if (plan) setSelectedPlanState(plan);
  }, []);

  const handleStartTest = () => {
    const user = getCurrentAuthUser() || getStoredUser();
    const detailsFilled = getDetailsFilled();

    if (!user) {
      alert("⚠️ Please log in to start your assessment.");
      navigate(ROUTES.AUTH);
      return;
    }

    if (!detailsFilled) {
      alert("📝 Please complete your basic details before taking the test.");
      navigate(ROUTES.FORM);
      return;
    }

    const confirmProceed = window.confirm(
      "✅ Make sure you have entered your basic details correctly.\nClick OK to begin your Mental Health Assessment."
    );
    if (confirmProceed) navigate(ROUTES.ASSESSMENT);
  };

  const renderPlanButton = () => {
    if (selectedPlan === "ai") {
      return (
        <button
          className="btn-secondary-new"
          onClick={() => navigate(ROUTES.AI_PROCTOR)}
        >
          AI Proctoring
        </button>
      );
    } else if (selectedPlan === "doctor") {
      return (
        <button
          className="btn-tertiary-new"
          onClick={() => navigate(ROUTES.DOCTOR_DASHBOARD)}
        >
          Doctor Consultation
        </button>
      );
    } else {
      return (
        <button
          className="btn-secondary-new"
          onClick={() => navigate(ROUTES.PLAN)}
        >
          Choose a Plan
        </button>
      );
    }
  };

  const handleDotClick = (index) => setCurrentSlide(index);

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
                    you thrive. First enter the detail and then take the test.
                  </p>

                  <div className="hero-actions">
                    <button
                      className="btn-primary-new"
                      onClick={handleStartTest}
                    >
                      Take Assessment
                    </button>

                    <button
                      className="btn-secondary-new"
                      onClick={() => navigate(ROUTES.SERENY_DOCTOR)}
                    >
                      Talk to a Therapist
                    </button>

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
          {HERO_TRUST_BAR_ITEMS.map((item, i) => (
            <span key={i}>{item}</span>
          ))}
        </div>
      </AnimatedSection>
    </section>
  );
};

export default HeroSection;
