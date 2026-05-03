

// import express from "express";
// import { upload } from "../middlewares/upload.middleware.js";
// import { protect } from "../middlewares/auth.middleware.js";
// import { authorizeRoles } from "../middlewares/role.middleware.js";
// import { uploadVideo, getMyVideos, streamVideo } from "../controllers/video.controller.js";
// import { getAllVideos, getAllUsers } from "../controllers/admin.controller.js";

// const router = express.Router();

// // Admin routes
// router.get("/admin/videos", protect, authorizeRoles("admin"), getAllVideos);
// router.get("/admin/users",  protect, authorizeRoles("admin"), getAllUsers);

// // Video routes
// router.post(
//   "/upload",
//   protect,
//   authorizeRoles("editor", "admin"),
//   upload.single("video"),
//   uploadVideo
// );

// router.get("/",           protect, getMyVideos);
// router.get("/stream/:id", protect, streamVideo);

// export default router;



import express from "express";
import { upload } from "../middlewares/upload.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import {
  uploadVideo,
  getMyVideos,
  streamVideo,
  assignVideo
} from "../controllers/video.controller.js";
import { getAllVideos, getAllUsers } from "../controllers/admin.controller.js";

const router = express.Router();

// Admin routes
router.get("/admin/videos", protect, authorizeRoles("admin"), getAllVideos);
router.get("/admin/users",  protect, authorizeRoles("admin"), getAllUsers);
router.put("/:id/assign",   protect, authorizeRoles("admin"), assignVideo);

// Video routes
router.post("/upload", protect, authorizeRoles("editor", "admin"), upload.single("video"), uploadVideo);
router.get("/",             protect, getMyVideos);
router.get("/stream/:id",   protect, streamVideo);

export default router;