// import { Link, useLocation } from "react-router-dom";
// import { useAuth } from "../context/authContext";
// import { useState, useEffect } from "react";
// import "./Sidebar.css";

// export default function Sidebar() {
//   const { user, logout } = useAuth();
//   const { pathname } = useLocation();

//   const [theme, setTheme] = useState(
//     () => document.documentElement.getAttribute("data-theme") || "dark"
//   );

//   useEffect(() => {
//     document.documentElement.setAttribute("data-theme", theme);
//     localStorage.setItem("theme", theme);
//   }, [theme]);

//   const toggleTheme = () => setTheme(t => t === "dark" ? "light" : "dark");

//   const canUpload = user?.role === "editor" || user?.role === "admin";

//   return (
//     <aside className="sidebar">
//       <div className="sidebar-top">
//         <Link to="/" className="sidebar-brand">
//           <span className="sidebar-brand-icon">▶</span>
//           <span className="sidebar-brand-name">StreamVault</span>
//         </Link>

//         <nav className="sidebar-nav">
//           <span className="sidebar-nav-label">Menu</span>
//           <Link to="/" className={`sidebar-link ${pathname === "/" ? "active" : ""}`}>
//             <span className="sidebar-link-icon">▦</span>
//             Dashboard
//           </Link>

//           {canUpload && (
//             <Link to="/upload" className={`sidebar-link ${pathname === "/upload" ? "active" : ""}`}>
//               <span className="sidebar-link-icon">⬆</span>
//               Upload
//             </Link>
//           )}
//         </nav>
//       </div>

//       <div className="sidebar-bottom">
//         <button className="theme-toggle" onClick={toggleTheme}>
//           <span className="theme-toggle-icon">{theme === "dark" ? "☀" : "☾"}</span>
//           <span className="theme-toggle-label">{theme === "dark" ? "Light mode" : "Dark mode"}</span>
//         </button>

//         {!user ? (
//           <div className="sidebar-auth-guest">
//             <Link to="/login" className={`sidebar-link ${pathname === "/login" ? "active" : ""}`}>
//               <span className="sidebar-link-icon">→</span>
//               Login
//             </Link>
//             <Link to="/register" className="sidebar-btn-primary">Get Started</Link>
//           </div>
//         ) : (
//           <div className="sidebar-auth-user">
//             <div className="sidebar-user-badge">
//               <span className="sidebar-user-avatar">{user.name?.[0]?.toUpperCase()}</span>
//               <span className="sidebar-user-info">
//                 <span className="sidebar-user-name">{user.name}</span>
//                 <span className="sidebar-user-role">{user.role}</span>
//               </span>
//             </div>
//             <button className="sidebar-btn-ghost" onClick={logout}>Sign out</button>
//           </div>
//         )}
//       </div>
//     </aside>
//   );
// }


import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useState, useEffect } from "react";
import "./Sidebar.css";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();

  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute("data-theme") || "dark"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === "dark" ? "light" : "dark");

  const canUpload = user?.role === "editor" || user?.role === "admin";
  const isAdmin   = user?.role === "admin";

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <Link to="/" className="sidebar-brand">
          <span className="sidebar-brand-icon">▶</span>
          <span className="sidebar-brand-name">StreamVault</span>
        </Link>

        <nav className="sidebar-nav">
          <span className="sidebar-nav-label">Menu</span>

          <Link to="/" className={`sidebar-link ${pathname === "/" ? "active" : ""}`}>
            <span className="sidebar-link-icon">▦</span>
            Dashboard
          </Link>

          {canUpload && (
            <Link to="/upload" className={`sidebar-link ${pathname === "/upload" ? "active" : ""}`}>
              <span className="sidebar-link-icon">⬆</span>
              Upload
            </Link>
          )}

          {isAdmin && (
            <Link to="/admin" className={`sidebar-link ${pathname === "/admin" ? "active" : ""}`}>
              <span className="sidebar-link-icon">⚙</span>
              Admin Panel
            </Link>
          )}
        </nav>
      </div>

      <div className="sidebar-bottom">
        <button className="theme-toggle" onClick={toggleTheme}>
          <span className="theme-toggle-icon">{theme === "dark" ? "☀" : "☾"}</span>
          <span className="theme-toggle-label">{theme === "dark" ? "Light mode" : "Dark mode"}</span>
        </button>

        {!user ? (
          <div className="sidebar-auth-guest">
            <Link to="/login" className={`sidebar-link ${pathname === "/login" ? "active" : ""}`}>
              <span className="sidebar-link-icon">→</span>
              Login
            </Link>
            <Link to="/register" className="sidebar-btn-primary">Get Started</Link>
          </div>
        ) : (
          <div className="sidebar-auth-user">
            <div className="sidebar-user-badge">
              <span className="sidebar-user-avatar">{user.name?.[0]?.toUpperCase()}</span>
              <span className="sidebar-user-info">
                <span className="sidebar-user-name">{user.name}</span>
                <span className="sidebar-user-role">{user.role}</span>
              </span>
            </div>
            <button className="sidebar-btn-ghost" onClick={logout}>Sign out</button>
          </div>
        )}
      </div>
    </aside>
  );
}