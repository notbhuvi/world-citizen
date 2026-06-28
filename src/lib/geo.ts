export interface LocationInfo {
  latitude: number;
  longitude: number;
  city?: string;
  region?: string;
  country?: string;
  countryCode?: string;
}

export function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("Geolocation is not supported on this device."));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 12000,
      maximumAge: 5 * 60 * 1000,
    });
  });
}

export async function reverseGeocode(lat: number, lon: number): Promise<Partial<LocationInfo>> {
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
    );
    if (!res.ok) throw new Error("reverse geocode failed");
    const data = await res.json();
    return {
      city: data.city || data.locality,
      region: data.principalSubdivision,
      country: data.countryName,
      countryCode: data.countryCode,
    };
  } catch {
    return {};
  }
}

export async function resolveLocation(): Promise<LocationInfo> {
  const position = await getCurrentPosition();
  const { latitude, longitude } = position.coords;
  const place = await reverseGeocode(latitude, longitude);
  return { latitude, longitude, ...place };
}
