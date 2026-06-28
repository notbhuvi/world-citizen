export interface WeatherSnapshot {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  weatherCode: number;
  isDay: boolean;
  sunrise: string;
  sunset: string;
  precipitation: number;
}

export interface AirQualitySnapshot {
  aqi: number;
  pm2_5: number;
  pm10: number;
  category: string;
}

const WEATHER_CODE_LABELS: Record<number, string> = {
  0: "Clear sky",
  1: "Mostly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Freezing fog",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Dense drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  71: "Light snow",
  73: "Snow",
  75: "Heavy snow",
  80: "Rain showers",
  81: "Rain showers",
  82: "Violent rain showers",
  95: "Thunderstorm",
  96: "Thunderstorm with hail",
  99: "Severe thunderstorm",
};

export function weatherCodeLabel(code: number): string {
  return WEATHER_CODE_LABELS[code] ?? "Unknown";
}

export async function fetchWeather(lat: number, lon: number): Promise<WeatherSnapshot> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,uv_index,weather_code,is_day,precipitation&daily=sunrise,sunset&timezone=auto`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch weather");
  const data = await res.json();
  return {
    temperature: data.current.temperature_2m,
    apparentTemperature: data.current.apparent_temperature,
    humidity: data.current.relative_humidity_2m,
    windSpeed: data.current.wind_speed_10m,
    uvIndex: data.current.uv_index ?? 0,
    weatherCode: data.current.weather_code,
    isDay: data.current.is_day === 1,
    precipitation: data.current.precipitation ?? 0,
    sunrise: data.daily.sunrise[0],
    sunset: data.daily.sunset[0],
  };
}

function aqiCategory(aqi: number): string {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy for Sensitive Groups";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";
  return "Hazardous";
}

export async function fetchAirQuality(lat: number, lon: number): Promise<AirQualitySnapshot> {
  const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm2_5,pm10`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch air quality");
  const data = await res.json();
  const aqi = Math.round(data.current.us_aqi ?? 0);
  return {
    aqi,
    pm2_5: data.current.pm2_5,
    pm10: data.current.pm10,
    category: aqiCategory(aqi),
  };
}
