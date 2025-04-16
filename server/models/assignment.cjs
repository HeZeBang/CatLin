const mongoose = require("mongoose");

const AssignmentSchema = new mongoose.Schema({
  user_id: String,
  platform: String,
  course: String,
  title: String,
  due: Number,
  submitted: Boolean,
  url: String,
  create: Number,
  ratingSum: Number,
  ratingNumber: Number,
  catType: String,
});

// compile model from schema
module.exports = mongoose.model("assignment", AssignmentSchema);
