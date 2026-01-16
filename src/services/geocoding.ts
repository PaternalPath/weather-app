import { Location } from '@/types/weather';

interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}

interface GeocodingResponse {
  results?: GeocodingResult[];
}

export async function searchLocations(query: string): Promise<Location[]> {
  if (!query.trim()) {
    return [];
  }

  const params = new URLSearchParams({
    name: query,
    count: '5',
    language: 'en',
    format: 'json',
  });

  const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params}`);

  if (!response.ok) {
    throw new Error('Failed to search locations');
  }

  const data: GeocodingResponse = await response.json();

  if (!data.results) {
    return [];
  }

  return data.results.map((result) => ({
    id: `${result.latitude},${result.longitude}`,
    name: result.name,
    lat: result.latitude,
    lon: result.longitude,
    country: result.country,
    admin1: result.admin1,
  }));
}
