const CITY = {
  NEW_YORK: "New York",
  CHICAGO: "Chicago",
  DALLAS: "Dallas",
  ATLANTA: "Atlanta",
  DENVER: "Denver",
  SEATTLE: "Seattle",
  LOS_ANGELES: "Los Angeles",
};

const ANCHORS = new Map([
  [CITY.NEW_YORK, { label: "New York", latitude: 40.7128, longitude: -74.006 }],
  [CITY.CHICAGO, { label: "Chicago", latitude: 41.8781, longitude: -87.6298 }],
  [CITY.DALLAS, { label: "Dallas", latitude: 32.7767, longitude: -96.797 }],
  [CITY.ATLANTA, { label: "Atlanta", latitude: 33.749, longitude: -84.388 }],
  [CITY.DENVER, { label: "Denver", latitude: 39.7392, longitude: -104.9903 }],
  [CITY.SEATTLE, { label: "Seattle", latitude: 47.6062, longitude: -122.3321 }],
  [CITY.LOS_ANGELES, { label: "Los Angeles", latitude: 34.0522, longitude: -118.2437 }],
]);

const CITY_KEYWORDS = [
  [CITY.NEW_YORK, CITY.NEW_YORK],
  [CITY.CHICAGO, CITY.CHICAGO],
  [CITY.DALLAS, CITY.DALLAS],
  [CITY.ATLANTA, CITY.ATLANTA],
  [CITY.DENVER, CITY.DENVER],
  [CITY.SEATTLE, CITY.SEATTLE],
  [CITY.LOS_ANGELES, CITY.LOS_ANGELES],
  ["Northeast", CITY.NEW_YORK],
  ["Midwest", CITY.CHICAGO],
  ["South", CITY.DALLAS],
  ["Southeast", CITY.ATLANTA],
  ["Mountain", CITY.DENVER],
  ["Pacific Northwest", CITY.SEATTLE],
  ["West Coast", CITY.LOS_ANGELES],
];

function normalize(value) {
  return String(value || "").trim().toLowerCase().replace(/\s+/g, " ");
}

function stableHash(value) {
  let hash = 2166136261;
  for (const character of String(value || "")) {
    hash ^= character.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function unitFromHash(seed, salt) {
  return (stableHash(`${seed}:${salt}`) % 1000000) / 1000000;
}

function roundCoordinate(value) {
  return Number(value.toFixed(6));
}

function anchorForLocation(location) {
  const city = String(location?.city || "");
  if (ANCHORS.has(city)) return { city, anchor: ANCHORS.get(city) };

  const searchable = normalize(`${location?.name || ""} ${location?.site_name || ""} ${location?.region || ""}`);
  for (const [keyword, targetCity] of CITY_KEYWORDS) {
    if (searchable.includes(normalize(keyword))) {
      return { city: targetCity, anchor: ANCHORS.get(targetCity) };
    }
  }

  return { city: CITY.NEW_YORK, anchor: ANCHORS.get(CITY.NEW_YORK) };
}

export function coordinatesForLocation(location) {
  const { city, anchor } = anchorForLocation(location || {});
  const seed = `${location?.name || ""}|${location?.site_name || ""}|${city}`;
  const angle = unitFromHash(seed, "angle") * Math.PI * 2;
  const distanceKm = 0.35 + unitFromHash(seed, "distance") * 6.75;
  const latitudeOffset = (Math.cos(angle) * distanceKm) / 111.32;
  const longitudeOffset = (Math.sin(angle) * distanceKm) / (111.32 * Math.cos((anchor.latitude * Math.PI) / 180));

  return {
    city,
    city_label: anchor.label,
    latitude: roundCoordinate(anchor.latitude + latitudeOffset),
    longitude: roundCoordinate(anchor.longitude + longitudeOffset),
  };
}

export function hasCoordinates(location) {
  if (!location) return false;
  const hasLatitude = location.latitude !== null && location.latitude !== undefined && location.latitude !== "";
  const hasLongitude = location.longitude !== null && location.longitude !== undefined && location.longitude !== "";
  return hasLatitude && hasLongitude && Number.isFinite(Number(location.latitude)) && Number.isFinite(Number(location.longitude));
}
