import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// 🔹 Navigation & Structural Components
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/routes/RoleRoute";

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

// 🩺 Marketplace & Doctor Pages
import MarketplacePage from "./pages/marketplace/MarketplacePage";
import DoctorDetailPage from "./pages/marketplace/DoctorDetailPage";
import DoctorLoginPage from "./pages/auth/DoctorLoginPage";
import DoctorSignupPage from "./pages/auth/DoctorSignupPage";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import DoctorPendingPage from "./pages/doctor/DoctorPendingPage";

// 👤 Patient & 🛡️ Admin Dashboards
import PatientDashboard from "./pages/patient/PatientDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

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

          {/* 🛒 Therapist Marketplace */}
          <Route path="/therapists" element={<MarketplacePage />} />
          <Route path="/talk-to-therapist" element={<MarketplacePage />} />
          <Route path="/therapists/:doctorId" element={<DoctorDetailPage />} />

          {/* 🩺 Doctor Authentication & Portal */}
          <Route path="/doctor/login" element={<DoctorLoginPage />} />
          <Route path="/doctor/signup" element={<DoctorSignupPage />} />
          <Route path="/doctor/pending" element={<DoctorPendingPage />} />
          <Route
            path="/doctor/dashboard"
            element={
              <RoleRoute allowedRoles={["doctor"]}>
                <DoctorDashboard />
              </RoleRoute>
            }
          />

          {/* 🩺 Legacy Doctor Landing */}
          <Route path="/serenyDoctor" element={<Landing />} />

          {/* 👤 Patient Dashboard */}
          <Route
            path="/patient/dashboard"
            element={
              <ProtectedRoute>
                <PatientDashboard />
              </ProtectedRoute>
            }
          />

          {/* 🛡️ Super Admin Portal */}
          <Route
            path="/admin"
            element={
              <RoleRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </RoleRoute>
            }
          />

          {/* 📘 Daily Tasks & Activities */}
          <Route path="/lesson" element={<Lesson />} />
          <Route path="/physical" element={<PhysicalInteraction />} />
          <Route path="/leisure" element={<LeisureActivity />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
