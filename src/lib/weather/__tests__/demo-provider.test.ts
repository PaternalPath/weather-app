import { describe, it, expect } from 'vitest';
import { DemoProvider } from '../providers/demo';
import { WeatherDataSchema } from '../schemas';

describe('DemoProvider', () => {
  const provider = new DemoProvider();

  it('should have correct name', () => {
    expect(provider.name).toBe('demo');
  });

  it('should return valid weather data for London', async () => {
    const data = await provider.fetchWeather({
      lat: 51.51,
      lon: -0.13,
      unit: 'celsius',
    });

    // Validate against schema
    const result = WeatherDataSchema.safeParse(data);
    expect(result.success).toBe(true);

    // Check structure
    expect(data.current).toBeDefined();
    expect(data.hourly).toBeDefined();
    expect(data.daily).toBeDefined();

    // London should have overcast weather (code 3)
    expect(data.current.weatherCode).toBe(3);
  });

  it('should return valid weather data for New York', async () => {
    const data = await provider.fetchWeather({
      lat: 40.71,
      lon: -74.01,
      unit: 'celsius',
    });

    const result = WeatherDataSchema.safeParse(data);
    expect(result.success).toBe(true);

    // New York should have mainly clear weather (code 1)
    expect(data.current.weatherCode).toBe(1);
  });

  it('should return valid weather data for Tokyo', async () => {
    const data = await provider.fetchWeather({
      lat: 35.68,
      lon: 139.65,
      unit: 'celsius',
    });

    const result = WeatherDataSchema.safeParse(data);
    expect(result.success).toBe(true);

    // Tokyo should have partly cloudy weather (code 2)
    expect(data.current.weatherCode).toBe(2);
  });

  it('should return data for unknown locations', async () => {
    const data = await provider.fetchWeather({
      lat: 0,
      lon: 0,
      unit: 'celsius',
    });

    const result = WeatherDataSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('should return fahrenheit temperatures when requested', async () => {
    const celsiusData = await provider.fetchWeather({
      lat: 51.51,
      lon: -0.13,
      unit: 'celsius',
    });

    const fahrenheitData = await provider.fetchWeather({
      lat: 51.51,
      lon: -0.13,
      unit: 'fahrenheit',
    });

    // Fahrenheit temperature should be higher than Celsius for the same location
    expect(fahrenheitData.current.temperature).toBeGreaterThan(celsiusData.current.temperature);
  });

  it('should return 24 hourly forecasts', async () => {
    const data = await provider.fetchWeather({
      lat: 51.51,
      lon: -0.13,
      unit: 'celsius',
    });

    expect(data.hourly.time).toHaveLength(24);
    expect(data.hourly.temperature).toHaveLength(24);
    expect(data.hourly.weatherCode).toHaveLength(24);
  });

  it('should return 7 daily forecasts', async () => {
    const data = await provider.fetchWeather({
      lat: 51.51,
      lon: -0.13,
      unit: 'celsius',
    });

    expect(data.daily.time).toHaveLength(7);
    expect(data.daily.temperatureMax).toHaveLength(7);
    expect(data.daily.temperatureMin).toHaveLength(7);
  });

  it('should have max temps greater than min temps', async () => {
    const data = await provider.fetchWeather({
      lat: 35.68,
      lon: 139.65,
      unit: 'celsius',
    });

    for (let i = 0; i < data.daily.temperatureMax.length; i++) {
      expect(data.daily.temperatureMax[i]).toBeGreaterThan(data.daily.temperatureMin[i]);
    }
  });
});
