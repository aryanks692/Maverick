const mongoose = require("mongoose");
const Resource = require("./models/Resource"); // adjust if needed

mongoose.connect("mongodb://127.0.0.1:27017/omni_triage")
  .then(async () => {
    console.log("Connected to DB");

    await Resource.deleteMany({});

    await Resource.insertMany([
      { unit_id: "AMB_1", status: "available", current_case: null, last_updated: new Date() },
      { unit_id: "AMB_2", status: "available", current_case: null, last_updated: new Date() },
      { unit_id: "AMB_3", status: "available", current_case: null, last_updated: new Date() }
    ]);

    console.log("Seeding done ✅");
    process.exit();
  })
  .catch(err => console.log(err));