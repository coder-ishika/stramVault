import { useState } from "react";
import { registerUser } from "../api/auth.api";
import { useAuth } from "../context/authContext";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "viewer" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await registerUser(form);
      login(data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="auth-logo-icon">▶</span>
          <span className="auth-logo-name">StreamVault</span>
        </div>

        <h1 className="auth-title">Create your account</h1>
        <p className="auth-subtitle">
          Already have one? <Link to="/login">Sign in</Link>
        </p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="field-label">Full name</label>
            <input
              className="field-input"
              name="name"
              placeholder="Alex Johnson"
              value={form.name}
              onChange={handleChange}
              required
              autoComplete="name"
            />
          </div>

          <div className="field">
            <label className="field-label">Email address</label>
            <input
              className="field-input"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>

          <div className="field">
            <label className="field-label">Password</label>
            <input
              className="field-input"
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
          </div>

          <div className="field">
            <label className="field-label">Role</label>
            <select className="field-select" name="role" value={form.role} onChange={handleChange}>
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}
