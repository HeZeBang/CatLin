const mongoose = require("mongoose");

const HomeworkSchema = new mongoose.Schema({
  users: [String],
  platform: String,
  course: String,
  title: String,
  due: Number,
  url: String,
  ratingSum: Number,
  ratingNumber: Number,
  catType: Number,
});

// compile model from schema
module.exports = mongoose.model("homework", HomeworkSchema);
