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
  rating: Number,
  catType: Number,
  parent: String, // links to the _id of a parent homework
});

// compile model from schema
module.exports = mongoose.model("assignment", AssignmentSchema);
