import type { Coordinates, Location } from '../types/weather';

interface GeocodingResult {
  name: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
}

export const getLocationBySearch = async (query: string): Promise<Location[]> => {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const url = new URL('https://geocoding-api.open-meteo.com/v1/search');
  url.searchParams.set('name', trimmed);
  url.searchParams.set('count', '10');
  url.searchParams.set('language', 'en');
  url.searchParams.set('format', 'json');

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Location search failed: ${response.status}`);
  }

  const data = (await response.json()) as { results?: GeocodingResult[] };
  return (data.results ?? []).map((r) => ({
    name: r.name,
    country: r.country,
    admin1: r.admin1,
    latitude: r.latitude,
    longitude: r.longitude,
  }));
};

export const getCurrentLocation = (): Promise<Coordinates> =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      (error) => reject(new Error(`Geolocation error: ${error.message}`)),
    );
  });
