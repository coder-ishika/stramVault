// import mongoose from "mongoose";

// const videoSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true },

//     description: { type: String },

//     filename: { type: String, required: true },

//     filepath: { type: String, required: true },

//     status: {
//       type: String,
//       enum: ["uploaded", "processing", "processed", "failed"],
//       default: "uploaded"
//     },

//     sensitivity: {
//       type: String,
//       enum: ["safe", "flagged", "pending"],
//       default: "pending"
//     },

//     progress: { type: Number, default: 0 },

//     uploadedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true
//     }
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Video", videoSchema);import mongoose from "mongoose";


import mongoose from "mongoose";
const videoSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String },
  filename:    { type: String, required: true },
  filepath:    { type: String, required: true },
  uploadedBy:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  assignedTo:  [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // NEW
  status:      { type: String, enum: ["uploaded", "processing", "processed"], default: "uploaded" },
  sensitivity: { type: String, enum: ["pending", "safe", "flagged"], default: "pending" },
  progress:    { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("Video", videoSchema);