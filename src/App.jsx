import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import "./App.css";

// 🔹 SerenyDoctor Interface
import Landing from "./serenyDoctor/Landing";

// 🔹 Firebase Imports
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";

// 🔹 Core UI Components
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import AnalyticsSection from "./components/AnalyticsSection";
import AboutSection from "./components/AboutSection";
import TestimonialSection from "./components/TestimonialSection";
import InteractiveCTA from "./components/InteractiveCTA";
import Footer from "./components/Footer";
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

// ---------------------------------------------------------
// 🔹 Wrapper for AI Proctor setup (checks login & prefs)
// ---------------------------------------------------------
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
  const [showWeeklyBanner, setShowWeeklyBanner] = useState(false);
  const [checked, setChecked] = useState(false);
  const auth = getAuth();
  const db = getFirestore();

  // 🔄 Check Weekly/Daily Test Banner Logic
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        console.log("🚫 No user logged in");
        return;
      }

      console.log("✅ Logged in user:", user.uid);

      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);
      if (!snap.exists()) {
        console.log("⚠️ User doc not found");
        return;
      }

      const nextTestDateStr = snap.data()?.schedule?.weeklyTest?.nextTestDate;
      console.log("📅 Firestore nextTestDate:", nextTestDateStr);

      if (!nextTestDateStr) {
        const today = new Date();
        await updateDoc(userRef, {
          "schedule.weeklyTest.nextTestDate": today.toISOString(),
        });
        console.log("🆕 Set new nextTestDate:", today);
        setShowWeeklyBanner(true);
        setChecked(true);
        return;
      }

      const nextTestDate = new Date(nextTestDateStr);
      const today = new Date();

      const sameDay =
        today.getFullYear() === nextTestDate.getFullYear() &&
        today.getMonth() === nextTestDate.getMonth() &&
        today.getDate() === nextTestDate.getDate();

      // ✅ For testing — always true if same calendar day OR forced below
      if (sameDay || today >= nextTestDate || true) {
        console.log("✅ Showing banner (daily test mode)");
        setShowWeeklyBanner(true);
      } else {
        console.log("❌ Banner hidden (next test not due)");
        setShowWeeklyBanner(false);
      }

      setChecked(true);
    });

    return () => unsub();
  }, [auth, db]);

  if (!checked) {
    return (
      <div style={{ padding: "60px", textAlign: "center" }}>
        Checking schedule...
      </div>
    );
  }

  return (
    <Router>
      <Navbar />

      {/* 🧠 Global Daily/Weekly Test Banner */}
      {showWeeklyBanner && (
        <div className="weekly-banner">
          <Link to="/weekly-test" className="banner-text">
            🧩 It’s Your Daily Wellness Assessment! Click here to begin.
          </Link>
        </div>
      )}

      <div style={{ marginTop: "80px" }}>
        <Routes>
          {/* 🏠 Main Home Page */}
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
                  <TestimonialSection />
                  <InteractiveCTA />
                </main>
                <Footer />
              </>
            }
          />

          {/* 🔐 Auth Routes */}
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

          {/* 🧩 Daily/Weekly Test */}
          <Route path="/weekly-test" element={<WeeklyTest />} />

          {/* 🧘 Exercise Page */}
          <Route path="/exercise" element={<ExercisePage />} />

          {/* 🩺 Doctor Interface — SerenyDoctor Landing */}
          <Route path="/serenyDoctor" element={<Landing />} />

          {/* 🧑‍⚕️ Doctor Dashboard (Future Implementation) */}
          <Route
            path="/doctor-dashboard"
            element={
              <div style={{ padding: "100px", textAlign: "center" }}>
                Doctor Dashboard Coming Soon...
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
