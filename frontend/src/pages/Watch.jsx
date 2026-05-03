import { useParams, Link } from "react-router-dom";
import "./Watch.css";

export default function Watch() {
  const { id } = useParams();
  const videoUrl = `http://localhost:5000/api/videos/stream/${id}`;

  return (
    <div className="page-content">
      <Link to="/" className="watch-back">← Back to Dashboard</Link>

      <div className="watch-card">
        <div className="video-wrapper">
          <video className="video-player" controls autoPlay>
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
}
