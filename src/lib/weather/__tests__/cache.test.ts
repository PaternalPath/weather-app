import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { getCacheKey, getFromCache, setInCache, clearCache, getCacheStats } from '../cache';
import type { WeatherData } from '../schemas';

const mockWeatherData: WeatherData = {
  current: {
    temperature: 15.5,
    weatherCode: 3,
    windSpeed: 12.5,
    windDirection: 180,
    humidity: 65,
    apparentTemperature: 14.2,
    precipitation: 0,
    time: '2024-01-15T14:00',
  },
  hourly: {
    time: ['2024-01-15T14:00'],
    temperature: [15.5],
    weatherCode: [3],
    precipitation: [0],
    humidity: [65],
  },
  daily: {
    time: ['2024-01-15'],
    weatherCode: [3],
    temperatureMax: [18.5],
    temperatureMin: [10.2],
    precipitationSum: [0],
    precipitationProbability: [10],
  },
};

describe('Cache', () => {
  beforeEach(() => {
    clearCache();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('getCacheKey', () => {
    it('should generate consistent cache keys', () => {
      const key1 = getCacheKey(51.5074, -0.1278, 'celsius');
      const key2 = getCacheKey(51.5074, -0.1278, 'celsius');

      expect(key1).toBe(key2);
    });

    it('should round coordinates to 2 decimal places', () => {
      const key1 = getCacheKey(51.50741234, -0.12781234, 'celsius');
      const key2 = getCacheKey(51.51, -0.13, 'celsius');

      expect(key1).toBe(key2);
    });

    it('should include unit in cache key', () => {
      const celsiusKey = getCacheKey(51.51, -0.13, 'celsius');
      const fahrenheitKey = getCacheKey(51.51, -0.13, 'fahrenheit');

      expect(celsiusKey).not.toBe(fahrenheitKey);
    });
  });

  describe('getFromCache / setInCache', () => {
    it('should return null for non-existent key', () => {
      const result = getFromCache('non-existent-key');
      expect(result).toBeNull();
    });

    it('should store and retrieve data', () => {
      const key = getCacheKey(51.51, -0.13, 'celsius');

      setInCache(key, mockWeatherData);
      const result = getFromCache(key);

      expect(result).toEqual(mockWeatherData);
    });

    it('should return null for expired entries', () => {
      const key = getCacheKey(51.51, -0.13, 'celsius');

      setInCache(key, mockWeatherData);

      // Fast-forward 6 minutes (past TTL)
      vi.advanceTimersByTime(6 * 60 * 1000);

      const result = getFromCache(key);
      expect(result).toBeNull();
    });

    it('should return data within TTL', () => {
      const key = getCacheKey(51.51, -0.13, 'celsius');

      setInCache(key, mockWeatherData);

      // Fast-forward 4 minutes (within TTL)
      vi.advanceTimersByTime(4 * 60 * 1000);

      const result = getFromCache(key);
      expect(result).toEqual(mockWeatherData);
    });
  });

  describe('clearCache', () => {
    it('should clear all entries', () => {
      const key1 = getCacheKey(51.51, -0.13, 'celsius');
      const key2 = getCacheKey(40.71, -74.01, 'celsius');

      setInCache(key1, mockWeatherData);
      setInCache(key2, mockWeatherData);

      expect(getCacheStats().size).toBe(2);

      clearCache();

      expect(getCacheStats().size).toBe(0);
      expect(getFromCache(key1)).toBeNull();
      expect(getFromCache(key2)).toBeNull();
    });
  });

  describe('getCacheStats', () => {
    it('should return correct stats', () => {
      const stats = getCacheStats();

      expect(stats).toHaveProperty('size');
      expect(stats).toHaveProperty('maxSize');
      expect(stats).toHaveProperty('ttlMs');
      expect(stats.maxSize).toBe(1000);
      expect(stats.ttlMs).toBe(5 * 60 * 1000);
    });

    it('should track cache size correctly', () => {
      expect(getCacheStats().size).toBe(0);

      setInCache(getCacheKey(51.51, -0.13, 'celsius'), mockWeatherData);
      expect(getCacheStats().size).toBe(1);

      setInCache(getCacheKey(40.71, -74.01, 'celsius'), mockWeatherData);
      expect(getCacheStats().size).toBe(2);
    });
  });
});
