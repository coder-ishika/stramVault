// import { useEffect, useState } from "react";
// import { getMyVideosApi } from "../api/video.api";
// import { Link } from "react-router-dom";
// import { useSocket } from "../context/SocketContext";
// import { useAuth } from "../context/authContext";
// import "./Dashboard.css";

// function StatusBadge({ status }) {
//   const map = {
//     pending:    { label: "Pending",    cls: "badge-pending" },
//     processing: { label: "Processing", cls: "badge-processing" },
//     processed:  { label: "Ready",      cls: "badge-ready" },
//   };
//   const { label, cls } = map[status] || { label: status, cls: "" };
//   return <span className={`badge ${cls}`}>{label}</span>;
// }

// function ProgressBar({ value }) {
//   return (
//     <div className="progress-track">
//       <div className="progress-fill" style={{ width: `${value || 0}%` }} />
//     </div>
//   );
// }

// export default function Dashboard() {
//   const [videos, setVideos] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { socket } = useSocket();
//   const { user } = useAuth();

//   const canUpload = user?.role === "editor" || user?.role === "admin";

//   const fetchVideos = async () => {
//     try {
//       const data = await getMyVideosApi();
//       setVideos(data);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchVideos(); }, []);

//   useEffect(() => {
//     if (!socket) return;
//     socket.on("video-progress", (data) => {
//       setVideos((prev) =>
//         prev.map((v) =>
//           v._id === data.videoId ? { ...v, progress: data.progress, status: "processing" } : v
//         )
//       );
//     });
//     socket.on("video-complete", (data) => {
//       setVideos((prev) =>
//         prev.map((v) =>
//           v._id === data.videoId
//             ? { ...v, progress: 100, status: "processed", sensitivity: data.sensitivity }
//             : v
//         )
//       );
//     });
//     return () => { socket.off("video-progress"); socket.off("video-complete"); };
//   }, [socket]);

//   if (loading) return (
//     <div className="page-content">
//       <div className="loading-grid">
//         {[1,2,3].map(i => <div key={i} className="skeleton-card" />)}
//       </div>
//     </div>
//   );

//   return (
//     <div className="page-content">
//       <div className="dash-header">
//         <div>
//           <h1 className="dash-title">My Videos</h1>
//           <p className="dash-subtitle">{videos.length} video{videos.length !== 1 ? "s" : ""} in your vault</p>
//         </div>
//         {canUpload && (
//           <Link to="/upload" className="btn-primary">+ Upload New</Link>
//         )}
//       </div>

//       {videos.length === 0 ? (
//         <div className="empty-state">
//           <div className="empty-icon">🎬</div>
//           <h3>No videos yet</h3>
//           {canUpload ? (
//             <>
//               <p>Upload your first video to get started</p>
//               <Link to="/upload" className="btn-primary" style={{ marginTop: 16 }}>
//                 Upload a video
//               </Link>
//             </>
//           ) : (
//             <p>No videos have been shared with you yet.</p>
//           )}
//         </div>
//       ) : (
//         <div className="video-grid">
//           {videos.map((video) => (
//             <div key={video._id} className="video-card">
//               <div className="video-card-thumb">
//                 <span className="video-thumb-icon">🎞</span>
//               </div>
//               <div className="video-card-body">
//                 <div className="video-card-top">
//                   <h3 className="video-title">{video.title}</h3>
//                   <StatusBadge status={video.status} />
//                 </div>
//                 {video.description && (
//                   <p className="video-desc">{video.description}</p>
//                 )}
//                 <div className="video-meta">
//                   {video.sensitivity && (
//                     <span className="meta-chip">Sensitivity: {video.sensitivity}</span>
//                   )}
//                 </div>
//                 {(video.status === "processing" || (video.progress > 0 && video.status !== "processed")) && (
//                   <div className="progress-section">
//                     <div className="progress-label">
//                       <span>Processing</span>
//                       <span>{video.progress || 0}%</span>
//                     </div>
//                     <ProgressBar value={video.progress} />
//                   </div>
//                 )}
//                 {video.status === "processed" && (
//                   <Link to={`/watch/${video._id}`} className="watch-btn">
//                     ▶ Watch Video
//                   </Link>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }



import { useEffect, useState } from "react";
import { getMyVideosApi } from "../api/video.api";
import { Link } from "react-router-dom";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/authContext";
import "./Dashboard.css";

function StatusBadge({ status }) {
  const map = {
    pending:    { label: "Pending",    cls: "badge-pending" },
    processing: { label: "Processing", cls: "badge-processing" },
    processed:  { label: "Ready",      cls: "badge-ready" },
  };
  const { label, cls } = map[status] || { label: status, cls: "" };
  return <span className={`badge ${cls}`}>{label}</span>;
}

function ProgressBar({ value }) {
  return (
    <div className="progress-track">
      <div className="progress-fill" style={{ width: `${value || 0}%` }} />
    </div>
  );
}

export default function Dashboard() {
  const [videos,  setVideos]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState("all");
  const { socket } = useSocket();
  const { user }   = useAuth();

  const canUpload = user?.role === "editor" || user?.role === "admin";

  const fetchVideos = async (activeFilter = "all") => {
    try {
      setLoading(true);
      const filters = {};
      if (activeFilter === "safe")    filters.sensitivity = "safe";
      if (activeFilter === "flagged") filters.sensitivity = "flagged";
      if (activeFilter === "processing" || activeFilter === "pending")
        filters.status = activeFilter;

      const data = await getMyVideosApi(filters);
      setVideos(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVideos(); }, []);

  const handleFilter = (f) => {
    setFilter(f);
    fetchVideos(f);
  };

  useEffect(() => {
    if (!socket) return;
    socket.on("video-progress", (data) => {
      setVideos((prev) =>
        prev.map((v) =>
          v._id === data.videoId
            ? { ...v, progress: data.progress, status: "processing" }
            : v
        )
      );
    });
    socket.on("video-complete", (data) => {
      setVideos((prev) =>
        prev.map((v) =>
          v._id === data.videoId
            ? { ...v, progress: 100, status: "processed", sensitivity: data.sensitivity }
            : v
        )
      );
    });
    return () => { socket.off("video-progress"); socket.off("video-complete"); };
  }, [socket]);

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
          <h1 className="dash-title">My Videos</h1>
          <p className="dash-subtitle">
            {videos.length} video{videos.length !== 1 ? "s" : ""} in your vault
          </p>
        </div>
        {canUpload && (
          <Link to="/upload" className="btn-primary">+ Upload New</Link>
        )}
      </div>

      {/* Filter bar — only show for editors/admins since viewers only see processed */}
      {canUpload && (
        <div className="filter-bar">
          {["all", "safe", "flagged", "processing", "pending"].map(f => (
            <button
              key={f}
              className={`filter-chip ${filter === f ? "active" : ""}`}
              onClick={() => handleFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      )}

      {videos.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎬</div>
          <h3>No videos yet</h3>
          {canUpload ? (
            <>
              <p>Upload your first video to get started</p>
              <Link to="/upload" className="btn-primary" style={{ marginTop: 16 }}>
                Upload a video
              </Link>
            </>
          ) : (
            <p>No videos have been shared with you yet.</p>
          )}
        </div>
      ) : (
        <div className="video-grid">
          {videos.map((video) => (
            <div key={video._id} className="video-card">
              <div className="video-card-thumb">
                <span className="video-thumb-icon">🎞</span>
              </div>
              <div className="video-card-body">
                <div className="video-card-top">
                  <h3 className="video-title">{video.title}</h3>
                  <StatusBadge status={video.status} />
                </div>
                {video.description && (
                  <p className="video-desc">{video.description}</p>
                )}
                <div className="video-meta">
                  {video.sensitivity && (
                    <span className="meta-chip">Sensitivity: {video.sensitivity}</span>
                  )}
                </div>
                {(video.status === "processing" ||
                  (video.progress > 0 && video.status !== "processed")) && (
                  <div className="progress-section">
                    <div className="progress-label">
                      <span>Processing</span>
                      <span>{video.progress || 0}%</span>
                    </div>
                    <ProgressBar value={video.progress} />
                  </div>
                )}
                {video.status === "processed" && (
                  <Link to={`/watch/${video._id}`} className="watch-btn">
                    ▶ Watch Video
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}