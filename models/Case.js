const mongoose = require("mongoose");

const CaseSchema = new mongoose.Schema({
  case_id: { type: String, unique: true },
  timestamp: { type: Date, default: Date.now },

  severity: { type: String, enum: ["CRITICAL","HIGH","MEDIUM","LOW"] },
  status: { type: String, enum: ["waiting","assigned","on_site","completed"], default: "waiting" },

  assigned_unit: { type: String, default: null },
  reassigned: { type: Boolean, default: false },

  confidence: { type: Number, default: 0 },

  location: {
    lat: Number,
    lng: Number
  },

  input: {
    mode: String,
    raw_text: String
  },

  processed: {
    signals: [String],
    final_score: Number
  },

  decision_tree: {
    conscious: Boolean,
    breathing: String,
    trauma: Boolean
  },

  // 🔥🔥 ADD THESE (CRITICAL FIX)
  routePath: {
    type: [[Number]],
    default: []
  },

  origin_lat: {
    type: Number,
    default: null
  },

  origin_lng: {
    type: Number,
    default: null
  }

});

module.exports = mongoose.model("Case", CaseSchema);