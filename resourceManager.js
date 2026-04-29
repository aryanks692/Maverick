async function getRoute(origin, destination) {
  const url = `http://router.project-osrm.org/route/v1/driving/` +
    `${origin.lng},${origin.lat};${destination.lng},${destination.lat}` +
    `?overview=full&geometries=geojson`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.routes && data.routes.length > 0) {
    return data.routes[0].geometry.coordinates.map(coord => [
      coord[1], coord[0]
    ]);
  }

  return [
    [origin.lat, origin.lng],
    [destination.lat, destination.lng]
  ];
}

function getSeverityRank(severity) {
  return {
    CRITICAL: 4,
    HIGH: 3,
    MEDIUM: 2,
    LOW: 1
  }[severity] || 1;
}

async function assignResource(newCase, resources, cases) {

  // 🔥 1. Try free resource
  let free = resources.find(r => !r.current_case);

  if (free) {
    const origin = {
      lat: free.location?.lat || 12.9716,
      lng: free.location?.lng || 77.5946
    };

    const destination = {
      lat: newCase.location.lat,
      lng: newCase.location.lng
    };

    const route = await getRoute(origin, destination);

    return {
      unit: free,
      reassigned: false,
      previous_case: null,

      routePath: route,
      origin_lat: origin.lat,
      origin_lng: origin.lng
    };
  }

  // 🔥 2. Reassignment logic
  const newRank = getSeverityRank(newCase.severity);

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

  // 🔥 3. Reassign if needed
  if (targetResource) {
    const oldCase = cases.find(c => c.case_id === targetResource.current_case);

    const origin = {
      lat: targetResource.location?.lat || 12.9716,
      lng: targetResource.location?.lng || 77.5946
    };

    const destination = {
      lat: newCase.location.lat,
      lng: newCase.location.lng
    };

    const route = await getRoute(origin, destination);

    return {
      unit: targetResource,
      reassigned: true,
      previous_case: oldCase,

      routePath: route,
      origin_lat: origin.lat,
      origin_lng: origin.lng
    };
  }

  return null;
}

module.exports = {
  assignResource
};