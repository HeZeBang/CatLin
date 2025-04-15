const mongoose = require("mongoose");

const CatSchema = new mongoose.Schema({
  assignment_id: String,
  mood: String,
  hp: Number,
});

// compile model from schema
module.exports = mongoose.model("cat", CatSchema);
