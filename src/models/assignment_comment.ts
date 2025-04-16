import mongoose from "mongoose";

const assignmentCommentSchema = new mongoose.Schema({
  creator_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  creator_name: String,
  creator_badge: Number,
  is_annonymous: Boolean,
  content: String,
  parent: { type: mongoose.Schema.Types.ObjectId, ref: "Homework" },
  rating: Number,
  created_at: Number,
});

export default mongoose.models.AssignmentComment || mongoose.model("AssignmentComment", assignmentCommentSchema);