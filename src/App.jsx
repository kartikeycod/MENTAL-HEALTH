// ✅ src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// Components
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import AnalyticsSection from "./components/AnalyticsSection";
import AboutSection from "./components/AboutSection";
import SpecialistSection from "./components/SpecialistSection";
import TestimonialSection from "./components/TestimonialSection";
import InteractiveCTA from "./components/InteractiveCTA";
import Footer from "./components/Footer";
import AuthPage from "./AuthPage";
import Form from "./components/Form";
import ProtectedRoute from "./components/ProtectedRoute";
import AssureSection from "./components/Assure";
import MentalHealthAssessment from "./components/MentalHealthAssessment";

function App() {
  return (
    <Router>
      {/* ✅ Navbar fixed at top for all routes */}
      <Navbar />

      {/* ✅ Add top margin so sections don’t hide behind Navbar */}
      <div style={{ marginTop: "80px" }}>
        <Routes>
          {/* 🏠 Home Page */}
          <Route
            path="/"
            element={
              <>
                <main>
                  <HeroSection />
                  <AssureSection />
                  <FeaturesSection />
                  <AnalyticsSection />
                  <AboutSection />
                  <SpecialistSection />
                  <TestimonialSection />
                  <InteractiveCTA />
                </main>
                <Footer />
              </>
            }
          />

          {/* 🔐 Auth Page */}
          <Route path="/auth" element={<AuthPage />} />

          {/* 📝 Form Page */}
          <Route path="/form" element={<Form />} />

          {/* 🧠 Protected Assessment Page */}
          <Route
            path="/assessment"
            element={
              <ProtectedRoute>
                <MentalHealthAssessment />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


