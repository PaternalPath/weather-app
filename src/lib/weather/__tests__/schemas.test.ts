import { describe, it, expect } from 'vitest';
import {
  WeatherRequestSchema,
  WeatherDataSchema,
  CurrentWeatherSchema,
  HourlyForecastSchema,
  DailyForecastSchema,
} from '../schemas';

describe('WeatherRequestSchema', () => {
  it('should validate valid request with all fields', () => {
    const result = WeatherRequestSchema.safeParse({
      lat: 51.5074,
      lon: -0.1278,
      unit: 'celsius',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.lat).toBe(51.5074);
      expect(result.data.lon).toBe(-0.1278);
      expect(result.data.unit).toBe('celsius');
    }
  });

  it('should coerce string lat/lon to numbers', () => {
    const result = WeatherRequestSchema.safeParse({
      lat: '40.7128',
      lon: '-74.006',
      unit: 'fahrenheit',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.lat).toBe(40.7128);
      expect(result.data.lon).toBe(-74.006);
    }
  });

  it('should use default unit when not provided', () => {
    const result = WeatherRequestSchema.safeParse({
      lat: 35.6762,
      lon: 139.6503,
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.unit).toBe('celsius');
    }
  });

  it('should reject latitude out of range', () => {
    const result = WeatherRequestSchema.safeParse({
      lat: 91,
      lon: 0,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('Latitude must be between');
    }
  });

  it('should reject longitude out of range', () => {
    const result = WeatherRequestSchema.safeParse({
      lat: 0,
      lon: 181,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('Longitude must be between');
    }
  });

  it('should reject invalid unit value', () => {
    const result = WeatherRequestSchema.safeParse({
      lat: 0,
      lon: 0,
      unit: 'kelvin',
    });

    expect(result.success).toBe(false);
  });

  it('should reject non-numeric lat/lon', () => {
    const result = WeatherRequestSchema.safeParse({
      lat: 'not-a-number',
      lon: 0,
    });

    expect(result.success).toBe(false);
  });
});

describe('CurrentWeatherSchema', () => {
  it('should validate valid current weather data', () => {
    const result = CurrentWeatherSchema.safeParse({
      temperature: 15.5,
      weatherCode: 3,
      windSpeed: 12.5,
      windDirection: 180,
      humidity: 65,
      apparentTemperature: 14.2,
      precipitation: 0,
      time: '2024-01-15T14:00',
    });

    expect(result.success).toBe(true);
  });

  it('should reject humidity out of range', () => {
    const result = CurrentWeatherSchema.safeParse({
      temperature: 15.5,
      weatherCode: 3,
      windSpeed: 12.5,
      windDirection: 180,
      humidity: 150,
      apparentTemperature: 14.2,
      precipitation: 0,
      time: '2024-01-15T14:00',
    });

    expect(result.success).toBe(false);
  });

  it('should reject invalid weather code', () => {
    const result = CurrentWeatherSchema.safeParse({
      temperature: 15.5,
      weatherCode: 100,
      windSpeed: 12.5,
      windDirection: 180,
      humidity: 65,
      apparentTemperature: 14.2,
      precipitation: 0,
      time: '2024-01-15T14:00',
    });

    expect(result.success).toBe(false);
  });
});

describe('HourlyForecastSchema', () => {
  it('should validate valid hourly forecast data', () => {
    const result = HourlyForecastSchema.safeParse({
      time: ['2024-01-15T14:00', '2024-01-15T15:00'],
      temperature: [15.5, 16.0],
      weatherCode: [3, 2],
      precipitation: [0, 0.5],
      humidity: [65, 60],
    });

    expect(result.success).toBe(true);
  });
});

describe('DailyForecastSchema', () => {
  it('should validate valid daily forecast data', () => {
    const result = DailyForecastSchema.safeParse({
      time: ['2024-01-15', '2024-01-16'],
      weatherCode: [3, 1],
      temperatureMax: [18.5, 20.0],
      temperatureMin: [10.2, 11.5],
      precipitationSum: [0, 2.5],
      precipitationProbability: [10, 40],
    });

    expect(result.success).toBe(true);
  });
});

describe('WeatherDataSchema', () => {
  it('should validate complete weather data', () => {
    const weatherData = {
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

    const result = WeatherDataSchema.safeParse(weatherData);
    expect(result.success).toBe(true);
  });
});
