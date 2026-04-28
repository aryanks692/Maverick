const express = require("express");
const app = express();
const { assignResource } = require("./resourceManager");


app.use(express.json());

app.get("/", (req, res) => {
  res.send("Omni-Triage Backend Running");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

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

function calculateScore(signals) {
  let score = 0;

  signals.forEach(signal => {
    score += WEIGHTS[signal] || 0;
  });

  return score;
}

function isNegated(text, phrase) {
  const negations = ["no", "not", "without", "fine", "okay", "normal"];

  for (let neg of negations) {
    if (text.includes(`${neg} ${phrase}`)) {
      return true;
    }
  }
  return false;
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
  // 🔴 OVERRIDES (MOST IMPORTANT)
  if (signals.includes("not_breathing")) return "CRITICAL";
  if (signals.includes("unconscious")) return "CRITICAL";
  
  // 🟠 Normal scoring
  if (score >= 9) return "CRITICAL";
  if (score >= 6) return "HIGH";
  if (score >= 3) return "MEDIUM";

  return "LOW";
}

let cases = [];
let caseCounter = 1;

app.post("/report", (req, res) => {
  const { input_mode, text = "", selected_signals = [], location = {} } = req.body;

  const signals = extractSignals(text, selected_signals);
  const score = calculateScore(signals);
  const severity = getSeverity(score, signals);
  const reason = signals.join(" + ");
  const timestamp = Date.now();

  const newCase = {
    case_id: "case_" + caseCounter++,
    signals,
    score,
    severity,
    reason,
    status: "waiting",
    location,
    timestamp,
    assigned_unit: "none",
    reassigned: false
  };

  // 🔥 STORE FIRST
  cases.push(newCase);

  // 🔥 TRY ALLOCATION
  const result = assignResource(newCase, cases);

  if (result) {
    // 🔴 STEP 1: Handle reassignment FIRST
    if (result.reassigned && result.previous_case) {
      result.previous_case.status = "waiting";
      result.previous_case.assigned_unit = "none";
      result.previous_case.reassigned = true;

      console.log("Reassigned case:", result.previous_case.case_id);
    }

    // 🔴 STEP 2: Assign new case
    newCase.assigned_unit = result.unit.unit_id;
    newCase.status = "assigned";

    result.unit.current_case = newCase;
  }

  console.log("Stored case:", newCase);

  res.json(newCase);
});

app.get("/cases", (req, res) => {
  const formatted = cases.map(c => ({
    case_id: c.case_id,
    severity: c.severity,
    status: c.status,
    location: c.location,
    signals: c.signals,
    score: c.score,
    reason: c.reason,
    assigned_unit: c.assigned_unit,
    reassigned: c.reassigned || false
  }));

  res.json(formatted);
});