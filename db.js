const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://admin:Maverick%40123@omni-triage.uoykbjy.mongodb.net/omni_triage?retryWrites=true&w=majority")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

module.exports = mongoose;