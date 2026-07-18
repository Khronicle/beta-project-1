import type { WeatherData } from '../types/weather';

const STORAGE_PREFIX = 'weather-dashboard:recent:';
const MAX_ENTRIES = 5;

export interface RecentForecastEntry {
  locationName: string;
  country: string;
  temperature: number;
  weatherCode: number;
  viewedAt: string;
}

function storageKey(userId: string): string {
  return `${STORAGE_PREFIX}${userId}`;
}

export function getRecentForecasts(userId: string): RecentForecastEntry[] {
  const raw = localStorage.getItem(storageKey(userId));
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as RecentForecastEntry[]) : [];
  } catch {
    return [];
  }
}

export function addRecentForecast(userId: string, data: WeatherData): void {
  const entry: RecentForecastEntry = {
    locationName: data.location.name,
    country: data.location.country,
    temperature: data.current.temperature,
    weatherCode: data.current.weatherCode,
    viewedAt: new Date().toISOString(),
  };

  const existing = getRecentForecasts(userId).filter(
    (item) => !(item.locationName === entry.locationName && item.country === entry.country)
  );

  const next = [entry, ...existing].slice(0, MAX_ENTRIES);
  localStorage.setItem(storageKey(userId), JSON.stringify(next));
}
