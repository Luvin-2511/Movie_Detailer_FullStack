import { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import MagneticButton from "../components/Magneticbutton";
import "../styles/login.scss";

const TICKER_TEXT =
  "TRENDING NOW — OPPENHEIMER — DUNE PART TWO — THE BATMAN — POOR THINGS — PAST LIVES — KILLERS OF THE FLOWER MOON — ";

const Login = () => {
  const { handleLogin, authLoading, error } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(form);
  };

  return (
    <div className="login-page">
      <div className="login-page__scan-line" />

      {/* ── Left Cinema Panel ── */}
      <div className="login-page__cinema">
        <div className="login-page__cinema-bg" />
        <div className="login-page__cinema-grid" />
        <div className="login-page__cinema-reel" />

        <div className="login-page__cinema-content">
          <p className="login-page__cinema-eyebrow">Est. 2025 · Stream Platform</p>
          <h1 className="login-page__cinema-title">
            YOUR<br />
            WORLD.<br />
            YOUR<br />
            <span>FILMS.</span>
          </h1>
          <p className="login-page__cinema-desc">
            Curated cinema at your fingertips. Discover trending, track your
            history, and build the perfect watchlist.
          </p>

          <div className="login-page__cinema-counter">
            <div className="stat">
              <div className="stat__num">50K+</div>
              <div className="stat__label">Titles</div>
            </div>
            <div className="stat">
              <div className="stat__num">4K</div>
              <div className="stat__label">Quality</div>
            </div>
            <div className="stat">
              <div className="stat__num">∞</div>
              <div className="stat__label">Watchlist</div>
            </div>
          </div>

          <div className="login-page__cinema-ticker">
            <span className="login-page__cinema-ticker-inner">
              {TICKER_TEXT + TICKER_TEXT}
            </span>
          </div>
        </div>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="login-page__form-panel">
        <div className="login-page__form-wrap">
          <div className="login-page__logo">
            CINEVERSE <span>v1.0</span>
          </div>

          <h2 className="login-page__heading">
            WELCOME<br />BACK.
          </h2>
          <p className="login-page__sub">Sign in to continue your journey.</p>

          <form onSubmit={handleSubmit}>
            {error && <div className="login-page__error">{error}</div>}

            <div className="login-page__field">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="login-page__field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="login-page__forgot">
              <a href="#">Forgot password?</a>
            </div>

            <MagneticButton type="submit" disabled={authLoading}>
              {authLoading ? "AUTHENTICATING..." : "ENTER THE PLATFORM"}
            </MagneticButton>
          </form>

          <div className="login-page__divider">
            <span>or</span>
          </div>

          <div className="login-page__footer">
            No account yet?{" "}
            <Link to="/register">Create one — it's free</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;