const mongoose = require("mongoose");

const ResourceSchema = new mongoose.Schema({
  unit_id: String,
  status: String, // available / assigned

  current_case: String,
  previous_case: String,

  location: {
    lat: Number,
    lng: Number
  },

  last_updated: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Resource", ResourceSchema);