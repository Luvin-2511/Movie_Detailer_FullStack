import { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import MagneticButton from "../components/Magneticbutton";
import "../styles/register.scss";

const Register = () => {
  const { handleRegister, authLoading, error } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    handleRegister(form);
  };

  return (
    <div className="register-page">
      {/* ── Left Form Panel ── */}
      <div className="register-page__form-panel">
        <div className="register-page__form-wrap">
          <div className="register-page__logo">CINEVERSE</div>

          <h2 className="register-page__heading">
            JOIN THE<br />UNIVERSE.
          </h2>
          <p className="register-page__sub">
            Create your free account and start exploring.
          </p>

          <form onSubmit={handleSubmit}>
            {error && <div className="register-page__error">{error}</div>}

            <div className="register-page__field">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="register-page__field">
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

            <div className="register-page__field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>

            <p className="register-page__terms">
              By creating an account you agree to our{" "}
              <a href="#">Terms of Service</a> and{" "}
              <a href="#">Privacy Policy</a>.
            </p>

            <MagneticButton type="submit" disabled={authLoading}>
              {authLoading ? "CREATING ACCOUNT..." : "CREATE MY ACCOUNT"}
            </MagneticButton>
          </form>

          <div className="register-page__footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>

      {/* ── Right Visual Panel ── */}
      <div className="register-page__visual">
        <div className="register-page__visual-bg" />
        <div className="register-page__visual-lines">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="vline" />
          ))}
        </div>

        <div className="register-page__visual-orb">
          <span className="register-page__visual-icon">🎬</span>
        </div>

        <div className="register-page__visual-content">
          <h2>UNLOCK EVERYTHING</h2>
          <ul className="register-page__visual-perks">
            <li>Unlimited favorites & watchlist</li>
            <li>Full watch history tracking</li>
            <li>Trailer previews with one click</li>
            <li>Personalized recommendations</li>
            <li>Cross-device sync</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Register;