const mongoose = require("mongoose");

const AssignmentSchema = new mongoose.Schema({
  user_id: String,
  platform: String,
  title: String,
  createDate: Date,
  dueDate: Date,
  rating: Number,
});

// compile model from schema
module.exports = mongoose.model("assignment", AssignmentSchema);
