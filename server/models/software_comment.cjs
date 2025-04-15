const mongoose = require("mongoose");

const SoftwareCommentSchema = new mongoose.Schema({
  creator_id: String,
  creator_name: String,
  content: String,
  rating: Number,
});

// compile model from schema
module.exports = mongoose.model("software_comment", SoftwareCommentSchema);
