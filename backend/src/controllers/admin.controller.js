import Video from "../models/Video.model.js";
import User  from "../models/user.model.js";

export const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find()
      .populate("uploadedBy", "name email role")
      .sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};