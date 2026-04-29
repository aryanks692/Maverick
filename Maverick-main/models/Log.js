const mongoose = require("mongoose");

const LogSchema = new mongoose.Schema({
  event: String,
  case_id: String,
  timestamp: { type: Date, default: Date.now },

  data: Object
});

module.exports = mongoose.model("Log", LogSchema);