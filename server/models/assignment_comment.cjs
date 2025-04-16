const mongoose = require("mongoose");

const AssignmentCommentSchema = new mongoose.Schema({
  creator_id: String,
  creator_name: String,
  creator_badge: Number,
  is_annonymous: Boolean,
  parent: String, // links to the _id of a parent homework
  content: String,
  created_at: Number,
  rating: Number,
});

// compile model from schema
module.exports = mongoose.model("assignment_comment", AssignmentCommentSchema);
