// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import Sidebar from "./components/SideBar";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Dashboard from "./pages/Dashboard";
// import Upload from "./pages/Upload";
// import Watch from "./pages/Watch";
// import { AuthProvider, useAuth } from "./context/authContext";
// import { SocketProvider } from "./context/SocketContext";
// import "./App.css";

// // Redirects to login if not logged in
// function ProtectedRoute({ children }) {
//   const { user } = useAuth();
//   if (!user) return <Navigate to="/login" replace />;
//   return children;
// }

// // Redirects to home if logged in but wrong role
// function RoleRoute({ children, roles }) {
//   const { user } = useAuth();
//   if (!user) return <Navigate to="/login" replace />;
//   if (!roles.includes(user.role)) return <Navigate to="/" replace />;
//   return children;
// }

// // Redirects to home if already logged in
// function GuestRoute({ children }) {
//   const { user } = useAuth();
//   if (user) return <Navigate to="/" replace />;
//   return children;
// }

// function AppLayout() {
//   const { user } = useAuth();

//   return (
//     <div className="app-shell">
//       {user && <Sidebar />}
//       <main className={user ? "app-main" : "app-main-full"}>
//         <Routes>
//           {/* Public only — logged-in users get sent home */}
//           <Route path="/login"    element={<GuestRoute><Login /></GuestRoute>} />
//           <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

//           {/* Protected — any logged-in user */}
//           <Route path="/" element={
//             <ProtectedRoute><Dashboard /></ProtectedRoute>
//           } />
//           <Route path="/watch/:id" element={
//             <ProtectedRoute><Watch /></ProtectedRoute>
//           } />

//           {/* Role-protected — editor and admin only */}
//           <Route path="/upload" element={
//             <RoleRoute roles={["editor", "admin"]}>
//               <Upload />
//             </RoleRoute>
//           } />

//           {/* Catch-all */}
//           <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
//         </Routes>
//       </main>
//     </div>
//   );
// }

// export default function App() {
//   return (
//     <BrowserRouter>
//       <AuthProvider>
//         <SocketProvider>
//           <AppLayout />
//         </SocketProvider>
//       </AuthProvider>
//     </BrowserRouter>
//   );
// }


import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/SideBar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Watch from "./pages/Watch";
import AdminPanel from "./pages/AdminPanel";
import { AuthProvider, useAuth } from "./context/authContext";
import { SocketProvider } from "./context/SocketContext";
import "./App.css";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function RoleRoute({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

function GuestRoute({ children }) {
  const { user } = useAuth();
  if (user) return <Navigate to="/" replace />;
  return children;
}

function AppLayout() {
  const { user } = useAuth();

  return (
    <div className="app-shell">
      {user && <Sidebar />}
      <main className={user ? "app-main" : "app-main-full"}>
        <Routes>
          <Route path="/login"    element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

          <Route path="/" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/watch/:id" element={
            <ProtectedRoute><Watch /></ProtectedRoute>
          } />
          <Route path="/upload" element={
            <RoleRoute roles={["editor", "admin"]}><Upload /></RoleRoute>
          } />
          <Route path="/admin" element={
            <RoleRoute roles={["admin"]}><AdminPanel /></RoleRoute>
          } />

          <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <AppLayout />
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}