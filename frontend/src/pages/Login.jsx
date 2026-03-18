import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../services/api.js";
import "../../styles/AdminLoginStyles.css";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  useEffect(() => {
    // Add animation classes on mount
    const loginContainer = document.querySelector('.login-container');
    if (loginContainer) {
      loginContainer.classList.add('loaded');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    document.body.classList.toggle('light-theme');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      const data = await apiFetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // Save token
      localStorage.setItem("token", data.token);

      // (Optional) store user for UI
      if (data.user) localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect to admin page
      nav("/admin/incidents");
    } catch (err) {
      setMsg(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`login-container ${isDarkTheme ? 'dark' : 'light'}`}>
      {/* Background Image */}
      <div className="background-image"></div>
      
      {/* Background Overlay */}
      <div className="background-overlay"></div>

      {/* Floating Particles */}
      <div className="floating-particles">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className={`particle particle-${i}`}></div>
        ))}
      </div>

      {/* Orange Form Glow Effect */}
      <div className="orange-form-glow"></div>

      {/* Theme Toggle */}
      <div className="theme-toggle-container">
        <button className={`theme-toggle ${isDarkTheme ? 'dark' : 'light'}`} onClick={toggleTheme}>
          {isDarkTheme ? (
            <span className="theme-icon">🌙</span>
          ) : (
            <span className="theme-icon">☀️</span>
          )}
        </button>
      </div>

      <div className="scroll-container">
        <div className="content">
          
          {/* Header Section */}
          <div className="header">
            <div className="welcome-text">
              WELCOME BACK TO
            </div>
            
            <div className="title-container">
              <h1 className="title">
                ResQ<span className="title-accent">Map</span>
              </h1>
            </div>
            
            <div className="subtitle">
              Login to continue your rescue journey
            </div>
          </div>

          {/* Form Section */}
          <div className={`form-container ${isDarkTheme ? 'dark' : 'light'}`}>
            <form onSubmit={onSubmit}>
              <div className="input-container">
                <label className={`input-label ${isDarkTheme ? 'dark' : 'light'}`}>
                  Email Address
                </label>
                <div className="input-wrapper">
                  <input
                    className={`input ${isDarkTheme ? 'dark' : 'light'} ${
                      focusedInput === 'email' ? 'focused' : ''
                    }`}
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedInput('email')}
                    onBlur={() => setFocusedInput(null)}
                    required
                  />
                </div>
              </div>

              <div className="input-container">
                <label className={`input-label ${isDarkTheme ? 'dark' : 'light'}`}>
                  Password
                </label>
                <div className="input-wrapper">
                  <input
                    className={`input ${isDarkTheme ? 'dark' : 'light'} ${
                      focusedInput === 'password' ? 'focused' : ''
                    }`}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedInput('password')}
                    onBlur={() => setFocusedInput(null)}
                    required
                  />
                  <button
                    type="button"
                    className={`password-toggle ${isDarkTheme ? 'dark' : 'light'}`}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 'HIDE' : 'SHOW'}
                  </button>
                </div>
              </div>

              {msg && (
                <div className="error-message">
                  {msg}
                </div>
              )}

              <button 
                type="submit" 
                className="primary-button"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading-spinner"></span>
                ) : (
                  'Log In'
                )}
              </button>
            </form>
          </div>

          {/* Divider */}
          <div className="divider">
            <div className={`divider-line ${isDarkTheme ? 'dark' : 'light'}`}></div>
            <div className={`divider-text ${isDarkTheme ? 'dark' : 'light'}`}>
              Secure Access
            </div>
            <div className={`divider-line ${isDarkTheme ? 'dark' : 'light'}`}></div>
          </div>

          {/* Features Section */}
          <div className={`features-container ${isDarkTheme ? 'dark' : 'light'}`}>
            <div className="features-title">
              Platform Features
            </div>
            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-icon-container">
                  <span className="feature-icon">🚨</span>
                </div>
                <div className={`feature-text ${isDarkTheme ? 'dark' : 'light'}`}>
                  Live Emergency Alerts
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon-container">
                  <span className="feature-icon">🗺️</span>
                </div>
                <div className={`feature-text ${isDarkTheme ? 'dark' : 'light'}`}>
                  Real-time Rescue Maps
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon-container">
                  <span className="feature-icon">👥</span>
                </div>
                <div className={`feature-text ${isDarkTheme ? 'dark' : 'light'}`}>
                  Community Coordination
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="footer">
            <div className={`footer-text ${isDarkTheme ? 'dark' : 'light'}`}>
              New to ResQMap?
            </div>
            <a href="/register" className={`link ${isDarkTheme ? 'dark' : 'light'}`}>
              Create Your Account
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}