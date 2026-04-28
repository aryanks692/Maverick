const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
  report_id: String,
  case_id: String,

  timestamp: { type: Date, default: Date.now },

  input: {
    mode: String,
    raw_text: String,
    signals: [String],
    confidence: Number
  },

  location: {
    lat: Number,
    lng: Number
  }
});

module.exports = mongoose.model("Report", ReportSchema);