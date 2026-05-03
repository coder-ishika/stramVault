import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import videoRoutes from "./routes/video.routes.js";

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/videos", videoRoutes);

app.get("/", (req, res) => {
  res.send("Backend Running ✅");
});

export default app;