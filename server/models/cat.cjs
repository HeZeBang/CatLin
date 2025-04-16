const mongoose = require("mongoose");

const CatSchema = new mongoose.Schema({
  user_id: String,
  catType: String,
  mood: String,
  hp: Number,
});

// compile model from schema
module.exports = mongoose.model("cat", CatSchema);
