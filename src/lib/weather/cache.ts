import type { WeatherData } from './schemas';

interface CacheEntry {
  data: WeatherData;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();

// 5 minute TTL
const CACHE_TTL_MS = 5 * 60 * 1000;

// Max cache size to prevent memory issues
const MAX_CACHE_SIZE = 1000;

export function getCacheKey(lat: number, lon: number, unit: string): string {
  // Round to 2 decimal places for cache key
  return `${lat.toFixed(2)},${lon.toFixed(2)},${unit}`;
}

export function getFromCache(key: string): WeatherData | null {
  const entry = cache.get(key);

  if (!entry) {
    return null;
  }

  // Check if expired
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }

  return entry.data;
}

export function setInCache(key: string, data: WeatherData): void {
  // Enforce max cache size (LRU-ish: just delete oldest entries)
  if (cache.size >= MAX_CACHE_SIZE) {
    const keysToDelete = Array.from(cache.keys()).slice(0, 100);
    keysToDelete.forEach((k) => cache.delete(k));
  }

  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

export function clearCache(): void {
  cache.clear();
}

export function getCacheStats(): { size: number; maxSize: number; ttlMs: number } {
  return {
    size: cache.size,
    maxSize: MAX_CACHE_SIZE,
    ttlMs: CACHE_TTL_MS,
  };
}
