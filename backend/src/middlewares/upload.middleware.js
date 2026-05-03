import multer from "multer";
import fs from "fs";

const uploadDir = "src/uploads/raw";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),

  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["video/mp4", "video/mkv", "video/avi", "video/mov"];

  if (!allowedTypes.includes(file.mimetype)) {
    cb(new Error("Only video files are allowed!"), false);
  } else {
    cb(null, true);
  }
};

export const upload = multer({
  storage,
  fileFilter,
 limits: { fileSize: 1024 * 1024 * 500 } // 500MB
});