


// import fs from "fs";
// import path from "path";
// import Video from "../models/Video.model.js";
// import { processVideo } from "../services/videoProcessing.service.js";

// export const uploadVideo = async (req, res) => {
//   try {
//     const { title, description } = req.body;

//     if (!req.file) {
//       return res.status(400).json({ message: "No video file uploaded" });
//     }

//     const video = await Video.create({
//       title,
//       description,
//       filename: req.file.filename,
//       filepath: req.file.path,
//       uploadedBy: req.user._id,
//       status: "uploaded",
//       sensitivity: "pending",
//       progress: 0
//     });

//     processVideo(video._id, req.user._id);

//     res.status(201).json({
//       message: "Video uploaded successfully",
//       video
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const getMyVideos = async (req, res) => {
//   try {
//     const { status, sensitivity } = req.query;

//     let filter = {};

//     if (req.user.role === "viewer") {
//       // Viewers see all processed videos from everyone
//       filter.status = "processed";
//     } else {
//       // Editors and admins see only their own uploads
//       filter.uploadedBy = req.user._id;
//       if (status) filter.status = status;
//       if (sensitivity) filter.sensitivity = sensitivity;
//     }

//     const videos = await Video.find(filter).sort({ createdAt: -1 });
//     res.json(videos);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const streamVideo = async (req, res) => {
//   try {
//     const video = await Video.findById(req.params.id);

//     if (!video) return res.status(404).json({ message: "Video not found" });

//     const isViewer = req.user.role === "viewer";
//     const isOwner  = video.uploadedBy.toString() === req.user._id.toString();

//     if (!isViewer && !isOwner) {
//       return res.status(403).json({ message: "Access denied" });
//     }

//     if (isViewer && video.status !== "processed") {
//       return res.status(403).json({ message: "Video not available yet" });
//     }

//     const videoPath = path.resolve(video.filepath);
//     const videoSize = fs.statSync(videoPath).size;

//     const range = req.headers.range;
//     if (!range) return res.status(400).send("Requires Range header");

//     const CHUNK_SIZE = 10 ** 6;
//     const start = Number(range.replace(/\D/g, ""));
//     const end   = Math.min(start + CHUNK_SIZE, videoSize - 1);
//     const contentLength = end - start + 1;

//     const headers = {
//       "Content-Range":  `bytes ${start}-${end}/${videoSize}`,
//       "Accept-Ranges":  "bytes",
//       "Content-Length": contentLength,
//       "Content-Type":   "video/mp4"
//     };

//     res.writeHead(206, headers);
//     const stream = fs.createReadStream(videoPath, { start, end });
//     stream.pipe(res);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };



import fs from "fs";
import path from "path";
import Video from "../models/Video.model.js";
import { processVideo } from "../services/videoProcessing.service.js";

export const uploadVideo = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No video file uploaded" });
    }

    const video = await Video.create({
      title,
      description,
      filename: req.file.filename,
      filepath: req.file.path,
      uploadedBy: req.user._id,
      status: "uploaded",
      sensitivity: "pending",
      progress: 0
    });

    processVideo(video._id, req.user._id);

    res.status(201).json({ message: "Video uploaded successfully", video });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyVideos = async (req, res) => {
  try {
    const { status, sensitivity } = req.query;

    let filter = {};

    if (req.user.role === "viewer") {
      // Viewers only see videos assigned to them that are processed
      filter = { assignedTo: req.user._id, status: "processed" };
    } else {
      // Editors and admins see their own uploads
      filter.uploadedBy = req.user._id;
      if (status)      filter.status      = status;
      if (sensitivity) filter.sensitivity = sensitivity;
    }

    const videos = await Video.find(filter).sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const assignVideo = async (req, res) => {
  try {
    const { userIds } = req.body; // array of viewer user IDs

    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { assignedTo: userIds },
      { new: true }
    ).populate("assignedTo", "name email role");

    if (!video) return res.status(404).json({ message: "Video not found" });

    res.json({ message: "Video assigned successfully", video });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const streamVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) return res.status(404).json({ message: "Video not found" });

    const isViewer = req.user.role === "viewer";
    const isOwner  = video.uploadedBy.toString() === req.user._id.toString();
    const isAssigned = video.assignedTo.map(id => id.toString()).includes(req.user._id.toString());

    // Viewers must be assigned to watch
    if (isViewer && !isAssigned) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Editors/admins must own the video
    if (!isViewer && !isOwner) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (isViewer && video.status !== "processed") {
      return res.status(403).json({ message: "Video not available yet" });
    }

    const videoPath     = path.resolve(video.filepath);
    const videoSize     = fs.statSync(videoPath).size;
    const range         = req.headers.range;

    if (!range) return res.status(400).send("Requires Range header");

    const CHUNK_SIZE    = 10 ** 6;
    const start         = Number(range.replace(/\D/g, ""));
    const end           = Math.min(start + CHUNK_SIZE, videoSize - 1);
    const contentLength = end - start + 1;

    res.writeHead(206, {
      "Content-Range":  `bytes ${start}-${end}/${videoSize}`,
      "Accept-Ranges":  "bytes",
      "Content-Length": contentLength,
      "Content-Type":   "video/mp4"
    });

    fs.createReadStream(videoPath, { start, end }).pipe(res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};