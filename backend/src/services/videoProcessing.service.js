import Video from "../models/Video.model.js";
import { getIO } from "../config/socket.js";

export const processVideo = async (videoId, userId) => {
  try {
    const io = getIO();
    let progress = 0;

    await Video.findByIdAndUpdate(videoId, {
      status: "processing",
      progress: 0,
      sensitivity: "pending"
    });

    const interval = setInterval(async () => {
      progress += 10;

      await Video.findByIdAndUpdate(videoId, { progress });

      io.to(userId.toString()).emit("video-progress", {
        videoId,
        progress
      });

      if (progress >= 100) {
        clearInterval(interval);

        const result = Math.random() > 0.7 ? "flagged" : "safe";

        await Video.findByIdAndUpdate(videoId, {
          status: "processed",
          progress: 100,
          sensitivity: result
        });

        io.to(userId.toString()).emit("video-complete", {
          videoId,
          sensitivity: result
        });
      }
    }, 1000);
  } catch (error) {
    console.log("Processing error:", error.message);
  }
};