import type { WeatherProvider, WeatherProviderOptions } from '../provider';
import { WeatherProviderError } from '../provider';
import type { WeatherData } from '../schemas';

interface OpenMeteoResponse {
  current: {
    time: string;
    temperature_2m: number;
    weather_code: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    precipitation: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
    precipitation: number[];
    relative_humidity_2m: number[];
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    precipitation_probability_max: number[];
  };
}

const API_BASE_URL = 'https://api.open-meteo.com/v1/forecast';
const DEFAULT_TIMEOUT = 10000; // 10 seconds

export class OpenMeteoProvider implements WeatherProvider {
  name = 'open-meteo';

  async fetchWeather(options: WeatherProviderOptions): Promise<WeatherData> {
    const { lat, lon, unit, timeout = DEFAULT_TIMEOUT } = options;

    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      current: [
        'temperature_2m',
        'weather_code',
        'wind_speed_10m',
        'wind_direction_10m',
        'relative_humidity_2m',
        'apparent_temperature',
        'precipitation',
      ].join(','),
      hourly: ['temperature_2m', 'weather_code', 'precipitation', 'relative_humidity_2m'].join(','),
      daily: [
        'weather_code',
        'temperature_2m_max',
        'temperature_2m_min',
        'precipitation_sum',
        'precipitation_probability_max',
      ].join(','),
      temperature_unit: unit === 'fahrenheit' ? 'fahrenheit' : 'celsius',
      wind_speed_unit: 'kmh',
      precipitation_unit: 'mm',
      timezone: 'auto',
      forecast_days: '7',
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(`${API_BASE_URL}?${params}`, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'WeatherApp/1.0',
        },
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new WeatherProviderError(
            'Rate limit exceeded',
            'RATE_LIMITED',
            'Please try again later'
          );
        }
        throw new WeatherProviderError(
          'Failed to fetch weather data',
          'PROVIDER_ERROR',
          `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const data: OpenMeteoResponse = await response.json();

      return this.transformResponse(data);
    } catch (error) {
      if (error instanceof WeatherProviderError) {
        throw error;
      }
      if (error instanceof Error && error.name === 'AbortError') {
        throw new WeatherProviderError(
          'Request timed out',
          'TIMEOUT',
          `Request exceeded ${timeout}ms timeout`
        );
      }
      throw new WeatherProviderError(
        'Failed to fetch weather data',
        'PROVIDER_ERROR',
        error instanceof Error ? error.message : 'Unknown error'
      );
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private transformResponse(data: OpenMeteoResponse): WeatherData {
    return {
      current: {
        temperature: data.current.temperature_2m,
        weatherCode: data.current.weather_code,
        windSpeed: data.current.wind_speed_10m,
        windDirection: data.current.wind_direction_10m,
        humidity: data.current.relative_humidity_2m,
        apparentTemperature: data.current.apparent_temperature,
        precipitation: data.current.precipitation,
        time: data.current.time,
      },
      hourly: {
        time: data.hourly.time,
        temperature: data.hourly.temperature_2m,
        weatherCode: data.hourly.weather_code,
        precipitation: data.hourly.precipitation,
        humidity: data.hourly.relative_humidity_2m,
      },
      daily: {
        time: data.daily.time,
        weatherCode: data.daily.weather_code,
        temperatureMax: data.daily.temperature_2m_max,
        temperatureMin: data.daily.temperature_2m_min,
        precipitationSum: data.daily.precipitation_sum,
        precipitationProbability: data.daily.precipitation_probability_max,
      },
    };
  }
}

export const openMeteoProvider = new OpenMeteoProvider();
