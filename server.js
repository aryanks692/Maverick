const express = require("express");
const app = express();

require("./db");

const { assignResource } = require("./resourceManager");

const Case = require("./models/Case");
const Report = require("./models/Report");
const Resource = require("./models/Resource");
const Log = require("./models/Log");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Omni-Triage Backend Running");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

// ================= SIGNAL CONFIG =================

const SIGNAL_KEYWORDS = {
  not_breathing: [
    "not breathing",
    "no breathing",
    "stopped breathing",
    "can't breathe",
    "cannot breathe",
    "gasping for air",
    "barely breathing"
  ],
  unconscious: [
    "unconscious",
    "not responding",
    "not waking",
    "passed out",
    "fainted",
    "collapsed and not responding"
  ],
  bleeding: [
    "bleeding",
    "heavy bleeding",
    "bleeding heavily",
    "losing blood",
    "blood everywhere",
    "severe bleeding",
    "profuse bleeding"
  ],
  burns: [
    "severe burns",
    "burn injuries",
    "on fire",
    "skin burned",
    "burned badly"
  ],
  accident: [
    "car accident",
    "road accident",
    "crash",
    "collision",
    "fell",
    "fell from",
    "fall",
    "hit by"
  ],
  fracture: [
    "broken bone",
    "fracture",
    "arm broken",
    "leg broken"
  ],
  environment: [
    "fire nearby",
    "trapped",
    "stuck under",
    "building collapse",
    "in smoke"
  ]
};

const WEIGHTS = {
  not_breathing: 6,
  unconscious: 5,
  bleeding: 4,
  burns: 4,
  accident: 2,
  fracture: 2,
  environment: 3
};

// ================= LOGIC FUNCTIONS =================

function calculateScore(signals) {
  return signals.reduce((sum, s) => sum + (WEIGHTS[s] || 0), 0);
}

function isNegated(text, phrase) {
  const negations = ["no", "not", "without", "fine", "okay", "normal"];
  return negations.some(neg => text.includes(`${neg} ${phrase}`));
}

function extractSignals(text = "", selected = []) {
  let detected = new Set(selected);
  const lowerText = text.toLowerCase();

  for (let signal in SIGNAL_KEYWORDS) {
    for (let keyword of SIGNAL_KEYWORDS[signal]) {
      if (lowerText.includes(keyword) && !isNegated(lowerText, keyword)) {
        detected.add(signal);
      }
    }
  }

  return Array.from(detected);
}

function getSeverity(score, signals) {
  if (signals.includes("not_breathing")) return "CRITICAL";
  if (signals.includes("unconscious")) return "CRITICAL";

  if (score >= 9) return "CRITICAL";
  if (score >= 6) return "HIGH";
  if (score >= 3) return "MEDIUM";

  return "LOW";
}

// ================= MAIN API =================

app.post("/report", async (req, res) => {
  try {
    const { input_mode, text = "", selected_signals = [], location = {} } = req.body;

    const signals = extractSignals(text, selected_signals);
    const score = calculateScore(signals);
    const severity = getSeverity(score, signals);

    const confidence = Math.min(1, signals.length / 4 + 0.2);

    const decision_tree = {
      conscious: !signals.includes("unconscious"),
      breathing: signals.includes("not_breathing") ? "no" : "unknown",
      trauma: signals.includes("accident") ||
        signals.includes("fracture") ||
        text.toLowerCase().includes("accident")
    };

    const case_id = "case_" + Date.now();

    const newCase = {
      case_id,
      severity,
      status: "waiting",
      assigned_unit: null,
      reassigned: false,
      confidence,
      timestamp: Date.now(),   // 🔥 FIXED
      location,
      input: {
        mode: input_mode,
        raw_text: text
      },
      processed: {
        signals,
        final_score: score
      },
      decision_tree
    };

    // ✅ Save Case
    await Case.create(newCase);

    // ✅ Save Report
    await Report.create({
      report_id: "R" + Date.now(),
      case_id,
      input: {
        mode: input_mode,
        raw_text: text,
        signals,
        confidence
      },
      location
    });

    // ✅ Log creation
    await Log.create({
      event: "CASE_CREATED",
      case_id,
      data: { severity, signals }
    });

    // ================= RESOURCE ALLOCATION =================

    const allCases = await Case.find();

    let dbResources = await Resource.find();

    // 🔥 AUTO INIT
    if (dbResources.length === 0) {
      console.log("Initializing resources...");

      await Resource.insertMany([
        { unit_id: "AMB_1", status: "available", current_case: null },
        { unit_id: "AMB_2", status: "available", current_case: null },
        { unit_id: "AMB_3", status: "available", current_case: null }
      ]);

      dbResources = await Resource.find();
    }

    // 🔥 CLEAN RESOURCES FORMAT
    const cleanResources = dbResources.map(r => ({
      unit_id: r.unit_id,
      current_case: r.current_case || null
    }));

    const result = assignResource(newCase, cleanResources, allCases);

    if (result) {

      // 🔁 REALLOCATION
      if (result.reassigned && result.previous_case) {

        await Case.updateOne(
          { case_id: result.previous_case.case_id },
          {
            status: "waiting",
            assigned_unit: null,
            reassigned: true
          }
        );

        await Log.create({
          event: "REALLOCATION",
          case_id,
          data: {
            from_case: result.previous_case.case_id,
            to_case: case_id,
            unit_id: result.unit.unit_id
          }
        });
      }

      // 🚑 ASSIGN NEW CASE
      await Case.updateOne(
        { case_id },
        {
          status: "assigned",
          assigned_unit: result.unit.unit_id
        }
      );

      // 🚑 UPDATE RESOURCE
      await Resource.updateOne(
        { unit_id: result.unit.unit_id },
        {
          current_case: case_id,
          status: "assigned",
          last_updated: new Date()
        }
      );

      await Log.create({
        event: "RESOURCE_ASSIGNED",
        case_id,
        data: {
          unit_id: result.unit.unit_id
        }
      });

    } else {
      console.log("No resource available for:", case_id);
    }

    res.json({ message: "Case processed", case_id });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ================= GET CASES =================

app.get("/cases", async (req, res) => {
  const data = await Case.find();
  res.json(data);
});