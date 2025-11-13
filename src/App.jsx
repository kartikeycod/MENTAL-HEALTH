import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import "./App.css";

// 🔹 SerenyDoctor Interface
import Landing from "./serenyDoctor/Landing";

// 🔹 Core UI Components
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import AnalyticsSection from "./components/AnalyticsSection";
import AboutSection from "./components/AboutSection";
import TestimonialSection from "./components/TestimonialSection";
import InteractiveCTA from "./components/InteractiveCTA";
import Footer from "./components/Footer";
import Yoga from "./components/yoga";
import AssureSection from "./components/Assure";

// 🔹 Flow Components
import AuthPage from "./AuthPage";
import Form from "./components/Form";
import ProtectedRoute from "./components/ProtectedRoute";
import MentalHealthAssessment from "./components/MentalHealthAssessment";
import Plan from "./components/Plan";

// 🔹 AI Proctor Components
import AIProctorSetup from "./components/AIProctor/AIProctorSetup";
import AIProctorDashboard from "./components/AIProctor/AIProctorDashboard";
import WeeklyTest from "./components/AIProctor/WeeklyTest";
import ExercisePage from "./components/AIProctor/ExercisePage";
import ToDo from "./components/ToDo";
import Lesson from "./pages/Lesson";
import PhysicalInteraction from "./pages/PhysicalInteraction";
import LeisureActivity from "./pages/LeisureActivity";

import Upcoming from "./Upcoming";
// ---------------------------------------------------------
// 🔹 AI Proctor Setup Wrapper
// ---------------------------------------------------------
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FitnessAPISection from "./components/FitnessAPISection";

const AIProctorSetupWrapper = () => {
  const [uid, setUid] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        alert("Please log in first.");
        navigate("/auth");
        return;
      }

      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);

      if (snap.exists() && snap.data().prefs) {
        navigate("/ai-proctor-dashboard");
        return;
      }

      setUid(user.uid);
      setLoading(false);
    });

    return () => unsub();
  }, [auth, db, navigate]);

  if (loading)
    return (
      <div style={{ padding: "100px", textAlign: "center" }}>
        Loading setup...
      </div>
    );

  return (
    <AIProctorSetup
      uid={uid}
      onSetupComplete={() => navigate("/ai-proctor-dashboard")}
    />
  );
};

// ---------------------------------------------------------
// 🔹 Main Application
// ---------------------------------------------------------
function App() {
  return (
    <Router>
      <Navbar />
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
                   <FitnessAPISection />
                   <ToDo />
                  <Yoga />
                  <AnalyticsSection />
                  <AboutSection />
                  <TestimonialSection />
                  <InteractiveCTA />
                </main>
                <Footer />
                <Upcoming/>
              </>
            }
          />

          {/* 🔐 Auth & Form */}
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/form" element={<Form />} />

          {/* 🧠 Mental Health Assessment */}
          <Route
            path="/assessment"
            element={
              <ProtectedRoute>
                <MentalHealthAssessment />
              </ProtectedRoute>
            }
          />

          {/* 💳 Plan Selection */}
          <Route path="/plan" element={<Plan />} />

          {/* 🤖 AI Proctoring Flow */}
          <Route path="/ai-proctor" element={<AIProctorSetupWrapper />} />
          <Route
            path="/ai-proctor-dashboard"
            element={<AIProctorDashboard />}
          />

          {/* 🧘 Exercise Page */}
          <Route path="/exercise" element={<ExercisePage />} />

          {/* 🧩 Weekly Test (Manual Access Only) */}
          <Route path="/weekly-test" element={<WeeklyTest />} />

          {/* 🩺 Doctor Interface */}
          <Route path="/serenyDoctor" element={<Landing />} />

          {/* 🧑‍⚕️ Doctor Dashboard Placeholder */}
          <Route
            path="/doctor-dashboard"
            element={
              <div style={{ padding: "100px", textAlign: "center" }}>
                Doctor Dashboard Coming Soon...
              </div>
            }
          />
          <Route path="/lesson" element={<Lesson />} />
<Route path="/physical" element={<PhysicalInteraction />} />
<Route path="/leisure" element={<LeisureActivity />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
