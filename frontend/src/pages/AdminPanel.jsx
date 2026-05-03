import { useEffect, useState } from "react";
import { getAllVideosApi, getAllUsersApi, assignVideoApi } from "../api/admin.api";
import "./AdminPanel.css";

export default function AdminPanel() {
  const [videos,  setVideos]  = useState([]);
  const [users,   setUsers]   = useState([]);
  const [tab,     setTab]     = useState("videos");
  const [loading, setLoading] = useState(true);
  const [assignModal, setAssignModal] = useState(null); // video being assigned
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([getAllVideosApi(), getAllUsersApi()])
      .then(([v, u]) => { setVideos(v); setUsers(u); })
      .finally(() => setLoading(false));
  }, []);

  // Only viewers can be assigned
  const viewers = users.filter(u => u.role === "viewer");

  const openAssign = (video) => {
    setAssignModal(video);
    setSelectedUsers(video.assignedTo?.map(u => u._id || u) || []);
  };

  const closeAssign = () => {
    setAssignModal(null);
    setSelectedUsers([]);
  };

  const toggleUser = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAssign = async () => {
    if (!assignModal) return;
    setSaving(true);
    try {
      const updated = await assignVideoApi(assignModal._id, selectedUsers);
      setVideos(prev =>
        prev.map(v => v._id === updated.video._id ? updated.video : v)
      );
      closeAssign();
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="page-content">
      <div className="loading-grid">
        {[1,2,3].map(i => <div key={i} className="skeleton-card" />)}
      </div>
    </div>
  );

  return (
    <div className="page-content">
      <div className="dash-header">
        <div>
          <h1 className="dash-title">Admin Panel</h1>
          <p className="dash-subtitle">Full system overview</p>
        </div>
      </div>

      <div className="admin-tabs">
        <button
          className={`admin-tab ${tab === "videos" ? "active" : ""}`}
          onClick={() => setTab("videos")}
        >
          All Videos ({videos.length})
        </button>
        <button
          className={`admin-tab ${tab === "users" ? "active" : ""}`}
          onClick={() => setTab("users")}
        >
          All Users ({users.length})
        </button>
      </div>

      {tab === "videos" && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Uploaded By</th>
                <th>Status</th>
                <th>Sensitivity</th>
                <th>Assigned To</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {videos.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", color: "var(--text3)", padding: "32px" }}>
                    No videos found
                  </td>
                </tr>
              ) : videos.map(v => (
                <tr key={v._id}>
                  <td>{v.title}</td>
                  <td>
                    {v.uploadedBy?.name || "—"}
                    <span className="admin-role-chip">{v.uploadedBy?.role}</span>
                  </td>
                  <td>
                    <span className={`badge badge-${v.status === "processed" ? "ready" : v.status}`}>
                      {v.status}
                    </span>
                  </td>
                  <td>
                    {v.sensitivity ? (
                      <span className={`admin-sensitivity-chip ${v.sensitivity}`}>
                        {v.sensitivity}
                      </span>
                    ) : "—"}
                  </td>
                  <td>
                    {v.assignedTo?.length > 0 ? (
                      <div className="assigned-avatars">
                        {v.assignedTo.map(u => (
                          <span key={u._id || u} className="assigned-avatar" title={u.name}>
                            {u.name?.[0]?.toUpperCase() || "?"}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span style={{ color: "var(--text3)", fontSize: "0.8rem" }}>None</span>
                    )}
                  </td>
                  <td style={{ color: "var(--text2)" }}>
                    {new Date(v.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    {v.status === "processed" && (
                      <button
                        className="assign-btn"
                        onClick={() => openAssign(v)}
                      >
                        Assign
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "users" && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", color: "var(--text3)", padding: "32px" }}>
                    No users found
                  </td>
                </tr>
              ) : users.map(u => (
                <tr key={u._id}>
                  <td>
                    <div className="admin-user-cell">
                      <span className="admin-avatar">{u.name?.[0]?.toUpperCase()}</span>
                      {u.name}
                    </div>
                  </td>
                  <td style={{ color: "var(--text2)" }}>{u.email}</td>
                  <td><span className="admin-role-chip">{u.role}</span></td>
                  <td style={{ color: "var(--text2)" }}>
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Assign Modal */}
      {assignModal && (
        <div className="modal-backdrop" onClick={closeAssign}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Assign Video</h2>
              <button className="modal-close" onClick={closeAssign}>✕</button>
            </div>
            <p className="modal-subtitle">
              "{assignModal.title}" — select viewers who can watch this video
            </p>

            <div className="modal-user-list">
              {viewers.length === 0 ? (
                <p style={{ color: "var(--text3)", fontSize: "0.88rem" }}>
                  No viewers registered yet
                </p>
              ) : viewers.map(u => (
                <label key={u._id} className="modal-user-row">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(u._id)}
                    onChange={() => toggleUser(u._id)}
                  />
                  <span className="admin-avatar" style={{ width: 28, height: 28, fontSize: "0.75rem" }}>
                    {u.name?.[0]?.toUpperCase()}
                  </span>
                  <span className="modal-user-name">{u.name}</span>
                  <span className="modal-user-email">{u.email}</span>
                </label>
              ))}
            </div>

            <div className="modal-footer">
              <button className="modal-cancel" onClick={closeAssign}>Cancel</button>
              <button className="modal-save" onClick={handleAssign} disabled={saving}>
                {saving ? "Saving…" : "Save Assignment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}