import { SavedLocation, UserSettings, WeatherData } from '@/types/weather';

const KEYS = {
  LOCATIONS: 'weather-app-locations',
  SETTINGS: 'weather-app-settings',
  WEATHER_CACHE: 'weather-app-cache',
} as const;

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

interface CacheEntry {
  data: WeatherData;
  timestamp: number;
}

interface WeatherCache {
  [locationId: string]: CacheEntry;
}

// Location management
export function getSavedLocations(): SavedLocation[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(KEYS.LOCATIONS);
  return data ? JSON.parse(data) : [];
}

export function saveLocation(location: SavedLocation): void {
  const locations = getSavedLocations();
  const exists = locations.find((l) => l.id === location.id);

  if (!exists) {
    locations.push(location);
    localStorage.setItem(KEYS.LOCATIONS, JSON.stringify(locations));
  }
}

export function removeLocation(locationId: string): void {
  const locations = getSavedLocations().filter((l) => l.id !== locationId);
  localStorage.setItem(KEYS.LOCATIONS, JSON.stringify(locations));
}

export function clearAllLocations(): void {
  localStorage.removeItem(KEYS.LOCATIONS);
}

// Settings management
export function getSettings(): UserSettings {
  if (typeof window === 'undefined') {
    return { temperatureUnit: 'celsius' };
  }
  const data = localStorage.getItem(KEYS.SETTINGS);
  return data ? JSON.parse(data) : { temperatureUnit: 'celsius' };
}

export function saveSettings(settings: UserSettings): void {
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
}

// Weather cache management
function getCache(): WeatherCache {
  if (typeof window === 'undefined') return {};
  const data = localStorage.getItem(KEYS.WEATHER_CACHE);
  return data ? JSON.parse(data) : {};
}

function setCache(cache: WeatherCache): void {
  localStorage.setItem(KEYS.WEATHER_CACHE, JSON.stringify(cache));
}

export function getCachedWeather(locationId: string): WeatherData | null {
  const cache = getCache();
  const entry = cache[locationId];

  if (!entry) return null;

  const now = Date.now();
  if (now - entry.timestamp > CACHE_DURATION) {
    // Cache expired
    return null;
  }

  return entry.data;
}

export function setCachedWeather(locationId: string, data: WeatherData): void {
  const cache = getCache();
  cache[locationId] = {
    data,
    timestamp: Date.now(),
  };
  setCache(cache);
}

export function clearCache(): void {
  localStorage.removeItem(KEYS.WEATHER_CACHE);
}

// Reset all data
export function resetAllData(): void {
  clearAllLocations();
  clearCache();
  saveSettings({ temperatureUnit: 'celsius' });
}
