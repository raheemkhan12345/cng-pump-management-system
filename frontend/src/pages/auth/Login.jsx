import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Eye, EyeOff, User, Lock } from "lucide-react";

import "./Login.css";

const Login = () => {
  // FORM STATES
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // AUTH CONTEXT
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  // HANDLE LOGIN
  const handleSubmit = async (e) => {
    e.preventDefault();

    // VALIDATION
    if (!email.trim()) {
      window.alert("Please enter your email.");
      return;
    }

    if (!password.trim()) {
      window.alert("Please enter your password.");
      return;
    }

    try {
      // LOGIN API
      const loggedInUser = await login(email.trim(), password);

      // VALIDATE LOGIN USER
      if (!loggedInUser) {
        throw new Error("User information was not returned by the server.");
      }

      // ROLE-BASED NAVIGATION
      if (loggedInUser.role === "SUPER_ADMIN") {
        navigate("/super-admin/dashboard", {
          replace: true,
        });

        return;
      }

      // ADMIN
      if (loggedInUser.role === "ADMIN") {
        navigate("/admin/dashboard", {
          replace: true,
        });

        return;
      }

      // INVALID ROLE
      window.alert("Your account does not have a valid dashboard role.");
    } catch (error) {
      console.error("Login Error:", error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.response?.data?.msg ||
        error?.message ||
        "Invalid email or password.";

      window.alert(errorMessage);
    }
  };

  // UI
  return (
    <div className="login-wrapper">
      <div className="login-card">
        {/* BRAND LOGO */}
        <div className="login-logo">
          <div className="logo-icon-wrap">
            <span className="logo-text-top">CNG HUB</span>
            <span className="logo-text-bottom">CNG Hub</span>
          </div>
        </div>

        {/* TITLE */}
        <h2 className="login-title">Station Admin Login</h2>

        <p className="login-subtitle">
          Enter your credentials to access your dashboard
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="login-form">
          {/* EMAIL */}
          <div className="form-group">
            <label className="form-label" htmlFor="email-input">
              Email or Username
            </label>

            <div className="input-container">
              <User className="input-icon" size={18} />

              <input
                id="email-input"
                type="email"
                className="form-input"
                placeholder="e.g. admin@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                disabled={isLoading}
                required
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="form-group">
            <label className="form-label" htmlFor="password-input">
              Password
            </label>

            <div className="input-container">
              <Lock className="input-icon" size={18} />

              <input
                id="password-input"
                type={showPassword ? "text" : "password"}
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={isLoading}
                required
              />

              {/* SHOW / HIDE PASSWORD */}
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* SUBMIT */}
          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* HELP */}
        <p className="help-text">
          Need help accessing your account?{" "}
          <a href="#support">Contact Support</a>
        </p>
      </div>

      {/* FOOTER */}
      <footer className="login-footer">
        <div>© 2026 Industrial Integrity Systems. All rights reserved.</div>

        <div className="footer-links">
          <a href="#privacy">Privacy Policy</a>
          <a href="#support">Support</a>
          <a href="#terms">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
};

export default Login;
