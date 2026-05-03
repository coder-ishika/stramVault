import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";
import "./NavBar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="navbar-brand-icon">▶</span>
          <span className="navbar-brand-name">StreamVault</span>
        </Link>

        <div className="navbar-links">
          <Link to="/" className={`nav-link ${pathname === "/" ? "active" : ""}`}>Dashboard</Link>
          <Link to="/upload" className={`nav-link ${pathname === "/upload" ? "active" : ""}`}>Upload</Link>
        </div>

        <div className="navbar-auth">
          {!user ? (
            <>
              <Link to="/login" className={`nav-link ${pathname === "/login" ? "active" : ""}`}>Login</Link>
              <Link to="/register" className="nav-btn-primary">Get Started</Link>
            </>
          ) : (
            <>
              <div className="user-badge">
                <span className="user-avatar">{user.name?.[0]?.toUpperCase()}</span>
                <span className="user-info">
                  <span className="user-name">{user.name}</span>
                  <span className="user-role">{user.role}</span>
                </span>
              </div>
              <button className="nav-btn-ghost" onClick={logout}>Sign out</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
