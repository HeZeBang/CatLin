import mongoose from "mongoose";

const softwareCommentSchema = new mongoose.Schema({
  creator_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  creator_name: String,
  content: String,
  rating: Number,
  created_at: Number,
});

export default mongoose.models.software_comments || mongoose.model("software_comments", softwareCommentSchema);