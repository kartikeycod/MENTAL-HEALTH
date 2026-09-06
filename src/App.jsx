import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// 🔹 Navigation & Structural Components
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// 🔹 Pages & Views
import HomePage from "./pages/Home/HomePage";
import AuthPage from "./AuthPage";
import Form from "./components/Form";
import MentalHealthAssessment from "./components/MentalHealthAssessment";
import Plan from "./components/Plan";
import AIProctorSetupPage from "./pages/AIProctor/AIProctorSetupPage";
import AIProctorDashboard from "./components/AIProctor/AIProctorDashboard";
import ExercisePage from "./components/AIProctor/ExercisePage";
import WeeklyTest from "./components/AIProctor/WeeklyTest";
import Landing from "./serenyDoctor/Landing";
import Lesson from "./pages/Lesson";
import PhysicalInteraction from "./pages/PhysicalInteraction";
import LeisureActivity from "./pages/LeisureActivity";
import AIDetectorPage from "./pages/AIDetector/AIDetectorPage";

function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ marginTop: "80px" }}>
        <Routes>
          {/* 🏠 Home Page */}
          <Route path="/" element={<HomePage />} />

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
          <Route path="/ai-proctor" element={<AIProctorSetupPage />} />
          <Route
            path="/ai-proctor-dashboard"
            element={<AIProctorDashboard />}
          />

          {/* 🧘 Exercise Page */}
          <Route path="/exercise" element={<ExercisePage />} />

          {/* 🧩 Weekly Test */}
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

          {/* 📘 Daily Tasks & Activities */}
          <Route path="/lesson" element={<Lesson />} />
          <Route path="/physical" element={<PhysicalInteraction />} />
          <Route path="/leisure" element={<LeisureActivity />} />

          {/* 🤖 Dedicated AI Mental Health Detector */}
          <Route path="/ai-detector" element={<AIDetectorPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
