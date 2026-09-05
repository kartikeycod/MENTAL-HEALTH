import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import "./AuthPage.css";
import { ROUTES } from "./constants/routes";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isPrimaryActive, setIsPrimaryActive] = useState(false);
  const navigate = useNavigate();

  const { login, register, googleSignIn } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      if (isLogin) {
        const refreshedUser = await login(email, password);
        if (!refreshedUser.emailVerified) {
          setMessage("❌ Please verify your email before logging in.");
        } else {
          setMessage("✅ Login successful! Welcome back.");
          setTimeout(() => {
            navigate(ROUTES.HOME);
          }, 1000);
        }
      } else {
        await register(email, password);
        setMessage("📝 Registration complete. Check your inbox for verification.");
      }
    } catch (err) {
      const cleanMessage = err.message.includes("auth/")
        ? "❌ Authentication failed. Please check your credentials."
        : err.message;
      setMessage(cleanMessage);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const user = await googleSignIn();
      if (user) {
        const userName = user.displayName || "User";
        setMessage(`🌐 Signed in with Google. Hello, ${userName}!`);
        setTimeout(() => {
          navigate(ROUTES.HOME);
        }, 1000);
      }
    } catch {
      setMessage("🛑 Google sign-in was cancelled.");
    }
  };

  const getMessageClass = () => {
    if (message.startsWith("✅") || message.startsWith("📝") || message.startsWith("🌐")) {
      return "auth-message-success";
    } else if (message.startsWith("❌") || message.startsWith("🛑")) {
      return "auth-message-error";
    }
    return "";
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <h2 className="auth-title">
          {isLogin ? "Member Sign In" : "Create New Account"}
        </h2>

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="auth-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="auth-input"
          />
          <button
            type="submit"
            className={`auth-button auth-button-primary ${
              isPrimaryActive ? "auth-button-active" : ""
            }`}
            onMouseDown={() => setIsPrimaryActive(true)}
            onMouseUp={() => setIsPrimaryActive(false)}
            onMouseLeave={() => setIsPrimaryActive(false)}
          >
            {isLogin ? "Enter Portal" : "Join Now"}
          </button>
        </form>

        <p className="auth-toggle-text">
          {isLogin ? "New user registration?" : "Returning member?"}{" "}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage("");
            }}
            className="auth-toggle-button"
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </p>

        <div className="auth-divider" />

        <button
          onClick={handleGoogleLogin}
          className="auth-button auth-button-google"
        >
          <span className="google-icon" role="img" aria-label="Google icon">
            G
          </span>
          Continue with Google
        </button>

        {message && (
          <p className={`auth-message ${getMessageClass()}`}>{message}</p>
        )}
      </div>
    </div>
  );
}
