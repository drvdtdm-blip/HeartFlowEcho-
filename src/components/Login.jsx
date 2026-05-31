import React, { useState, useEffect } from "react";
import { Lock, Eye, EyeOff, ShieldCheck, AlertCircle, Heart } from "lucide-react";
import { isPasswordSet, initPassword, verifyPassword } from "../utils/security";

export default function Login({ onLoginSuccess }) {
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    setIsFirstTime(!isPasswordSet());
  }, []);

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!password) {
      setError("Password field cannot be empty.");
      triggerShake();
      return;
    }

    if (isFirstTime) {
      if (password.length < 4) {
        setError("Password must be at least 4 characters long.");
        triggerShake();
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        triggerShake();
        return;
      }

      try {
        await initPassword(password);
        sessionStorage.setItem("echo_authenticated", "true");
        onLoginSuccess();
      } catch (err) {
        setError("Failed to set password. Try again.");
        triggerShake();
      }
    } else {
      const isValid = await verifyPassword(password);
      if (isValid) {
        sessionStorage.setItem("echo_authenticated", "true");
        onLoginSuccess();
      } else {
        setError("Invalid password. Please try again.");
        triggerShake();
      }
    }
  };

  return (
    <div className="login-wrapper">
      <div className={`login-card ${isShaking ? "shake-anim" : ""}`}>
        <div className="login-header">
          <div className="login-logo bg-primary">
            <Heart className="text-white fill-white animate-pulse" size={32} />
          </div>
          <h2 className="login-title">Vision Heart Centre</h2>
          <p className="login-subtitle">Transthoracic Echocardiography Portal</p>
        </div>

        <div className="login-body">
          {isFirstTime ? (
            <div className="setup-badge bg-primary-light text-primary flex items-center gap-2 p-3 rounded-lg mb-4 border border-l-4 border-primary">
              <ShieldCheck size={20} className="flex-shrink-0" />
              <div>
                <p className="font-semibold text-xs m-0">First-Time Setup Required</p>
                <p className="text-xs text-gray-600 m-0 leading-normal">
                  Create a password to secure patient records and settings on this device.
                </p>
              </div>
            </div>
          ) : (
            <div className="lock-message text-center text-xs text-muted mb-4">
              Enter your password to unlock the reporting application.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-group">
              <label className="form-label" htmlFor="password-field">
                {isFirstTime ? "Choose Password" : "Password"}
              </label>
              <div className="password-input-wrapper">
                <Lock size={16} className="password-icon text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password-field"
                  className="form-control password-input"
                  placeholder={isFirstTime ? "Enter secure password" : "••••••••"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle-btn text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {isFirstTime && (
              <div className="form-group">
                <label className="form-label" htmlFor="confirm-password-field">
                  Confirm Password
                </label>
                <div className="password-input-wrapper">
                  <Lock size={16} className="password-icon text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="confirm-password-field"
                    className="form-control password-input"
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="error-message bg-danger-light text-danger flex items-center gap-2 p-2.5 rounded-lg text-xs font-medium border border-danger">
                <AlertCircle size={14} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button type="submit" className="btn btn-primary w-full justify-center py-2.5 mt-2">
              {isFirstTime ? "Set & Lock Portal" : "Unlock Portal"}
            </button>
          </form>
        </div>

        <div className="login-footer text-center text-xs text-muted pt-4 border-t">
          Disclaimer: Unauthorized access is strictly prohibited. &copy; {new Date().getFullYear()} Vision Heart Centre, Rewa
        </div>
      </div>
    </div>
  );
}
