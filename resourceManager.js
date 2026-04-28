function getSeverityRank(severity) {
  return {
    CRITICAL: 4,
    HIGH: 3,
    MEDIUM: 2,
    LOW: 1
  }[severity] || 1;
}

function assignResource(newCase, resources, cases) {

  // 🔥 1. Try free resource from DB
  let free = resources.find(r => !r.current_case);

  if (free) {
    return {
      unit: free,
      reassigned: false,
      previous_case: null
    };
  }

  const newRank = getSeverityRank(newCase.severity);

  // 🔥 2. Find weakest assigned case
  let targetResource = null;
  let lowestRank = Infinity;

  for (let r of resources) {
    if (!r.current_case) continue;

    const currentCase = cases.find(c => c.case_id === r.current_case);
    if (!currentCase) continue;

    const currentRank = getSeverityRank(currentCase.severity);

    if (currentRank < newRank && currentRank < lowestRank) {
      lowestRank = currentRank;
      targetResource = r;
    }
  }

  // 🔥 3. Reassign if weaker case found
  if (targetResource) {
    const oldCase = cases.find(c => c.case_id === targetResource.current_case);

    return {
      unit: targetResource,
      reassigned: true,
      previous_case: oldCase
    };
  }

  return null;
}

module.exports = {
  assignResource
};