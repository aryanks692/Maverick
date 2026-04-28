let resources = [
  { unit_id: "AMB_1", current_case: null },
  { unit_id: "AMB_2", current_case: null }
];

function getEffectivePriority(caseObj) {
  let base = 0;

  if (caseObj.severity === "CRITICAL") base = 4;
  else if (caseObj.severity === "HIGH") base = 3;
  else if (caseObj.severity === "MEDIUM") base = 2;
  else base = 1;

  const waitMinutes = (Date.now() - caseObj.timestamp) / 60000;

  return base + waitMinutes * 0.1;
}

function assignResource(newCase, cases) {
  const severityRank = {
    CRITICAL: 4,
    HIGH: 3,
    MEDIUM: 2,
    LOW: 1
  };

  // 🔥 1. Try free resource
  let free = resources.find(r => r.current_case === null);
  if (free) {
    return {
      unit: free,
      reassigned: false,
      previous_case: null
    };
  }

  const newRank = severityRank[newCase.severity];

  // 🔥 2. Find weakest eligible case (ONLY lower severity)
  let targetResource = null;
  let lowestRank = Infinity;

  for (let r of resources) {
    if (!r.current_case) continue;

    const current = r.current_case;
    const currentRank = severityRank[current.severity];

    // 🔥 Only consider weaker cases
    if (currentRank < newRank) {
      if (currentRank < lowestRank) {
        lowestRank = currentRank;
        targetResource = r;
      }
    }
  }

  // 🔥 3. Reassign ONLY if weaker case exists
  if (targetResource) {
    return {
      unit: targetResource,
      reassigned: true,
      previous_case: targetResource.current_case
    };
  }

  return null;
}

module.exports = {
  assignResource,
  resources
};