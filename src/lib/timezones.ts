const FALLBACK_ZONES = [
  "America/New_York",
  "America/Los_Angeles",
  "America/Chicago",
  "America/Sao_Paulo",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Moscow",
  "Africa/Cairo",
  "Africa/Johannesburg",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Shanghai",
  "Asia/Tokyo",
  "Asia/Singapore",
  "Australia/Sydney",
  "Pacific/Auckland",
];

let cachedZones: string[] | null = null;

export function getTimezoneList(): string[] {
  if (cachedZones) return cachedZones;

  const supportedValuesOf = (Intl as unknown as { supportedValuesOf?: (key: string) => string[] }).supportedValuesOf;
  if (typeof supportedValuesOf !== "function") {
    cachedZones = FALLBACK_ZONES;
    return cachedZones;
  }

  try {
    const zones = supportedValuesOf("timeZone");
    cachedZones = zones.length > 0 ? zones : FALLBACK_ZONES;
  } catch {
    cachedZones = FALLBACK_ZONES;
  }
  return cachedZones;
}

export function formatTimezoneLabel(zone: string): string {
  const parts = zone.split("/");
  return parts[parts.length - 1].replace(/_/g, " ");
}

export function getZoneOffsetLabel(zone: string): string {
  try {
    const formatter = new Intl.DateTimeFormat("en-US", { timeZone: zone, timeZoneName: "shortOffset" });
    const part = formatter.formatToParts(new Date()).find((p) => p.type === "timeZoneName");
    return part?.value ?? "";
  } catch {
    return "";
  }
}
