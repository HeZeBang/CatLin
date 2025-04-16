import mongoose from "mongoose";

const softwareCommentSchema = new mongoose.Schema({
  creator_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  creator_name: String,
  content: String,
  rating: Number,
  created_at: Number,
});

export default mongoose.models.SoftwareComment || mongoose.model("SoftwareComment", softwareCommentSchema);