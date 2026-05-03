import { useState, useRef } from "react";
import { uploadVideoApi } from "../api/video.api";
import "./Upload.css";

export default function Upload() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const handleFile = (file) => {
    if (file && file.type.startsWith("video/")) {
      setVideo(file);
      setError("");
    } else {
      setError("Please select a valid video file.");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!video) return setError("Please select a video file.");
    setUploading(true);
    setError("");
    setSuccess(false);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("video", video);

    try {
      await uploadVideoApi(formData, (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percent);
      });
      setSuccess(true);
      setTitle("");
      setDescription("");
      setVideo(null);
      setUploadProgress(0);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="page-content">
      <div className="upload-header">
        <h1 className="upload-title">Upload Video</h1>
        <p className="upload-subtitle">Add a new video to your vault</p>
      </div>

      <div className="upload-card">
        {success && (
          <div className="upload-success">
            ✓ Video uploaded successfully! It will be processed shortly.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Drop zone */}
          <div
            className={`dropzone ${dragOver ? "dragover" : ""} ${video ? "has-file" : ""}`}
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <input
              ref={fileRef}
              type="file"
              accept="video/*"
              style={{ display: "none" }}
              onChange={(e) => handleFile(e.target.files[0])}
            />
            {video ? (
              <>
                <div className="dropzone-icon">🎞</div>
                <div className="dropzone-filename">{video.name}</div>
                <div className="dropzone-filesize">{(video.size / 1024 / 1024).toFixed(1)} MB</div>
                <button
                  type="button"
                  className="dropzone-change"
                  onClick={(e) => { e.stopPropagation(); setVideo(null); }}
                >
                  Change file
                </button>
              </>
            ) : (
              <>
                <div className="dropzone-icon">📂</div>
                <div className="dropzone-text">Drop your video here or click to browse</div>
                <div className="dropzone-hint">MP4, MOV, AVI, WebM supported</div>
              </>
            )}
          </div>

          <div className="upload-fields">
            <div className="field">
              <label className="field-label">Title</label>
              <input
                className="field-input"
                placeholder="My awesome video"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label className="field-label">Description <span className="field-optional">(optional)</span></label>
              <textarea
                className="field-input field-textarea"
                placeholder="Tell viewers what this video is about…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {uploading && (
            <div className="upload-progress-section">
              <div className="progress-label">
                <span>Uploading…</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${uploadProgress}%` }} />
              </div>
            </div>
          )}

          {error && <div className="auth-error" style={{ marginBottom: 16 }}>{error}</div>}

          <button
            className="btn-primary upload-btn"
            type="submit"
            disabled={uploading}
          >
            {uploading ? `Uploading ${uploadProgress}%…` : "Upload Video"}
          </button>
        </form>
      </div>
    </div>
  );
}
