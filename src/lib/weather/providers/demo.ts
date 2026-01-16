import type { WeatherProvider, WeatherProviderOptions } from '../provider';
import type { WeatherData } from '../schemas';

// Deterministic demo data for known locations
// These locations match the demo locations in src/lib/demo-data.ts
const DEMO_LOCATIONS: Record<
  string,
  {
    name: string;
    baseTemp: { celsius: number; fahrenheit: number };
    weatherCode: number;
    humidity: number;
    windSpeed: number;
  }
> = {
  // London
  '51.51,-0.13': {
    name: 'London',
    baseTemp: { celsius: 12, fahrenheit: 54 },
    weatherCode: 3, // Overcast
    humidity: 78,
    windSpeed: 15,
  },
  // New York
  '40.71,-74.01': {
    name: 'New York',
    baseTemp: { celsius: 18, fahrenheit: 64 },
    weatherCode: 1, // Mainly clear
    humidity: 62,
    windSpeed: 12,
  },
  // Tokyo
  '35.68,139.65': {
    name: 'Tokyo',
    baseTemp: { celsius: 22, fahrenheit: 72 },
    weatherCode: 2, // Partly cloudy
    humidity: 70,
    windSpeed: 8,
  },
  // Paris (additional demo location)
  '48.86,2.35': {
    name: 'Paris',
    baseTemp: { celsius: 15, fahrenheit: 59 },
    weatherCode: 61, // Slight rain
    humidity: 75,
    windSpeed: 10,
  },
  // Sydney (additional demo location)
  '-33.87,151.21': {
    name: 'Sydney',
    baseTemp: { celsius: 25, fahrenheit: 77 },
    weatherCode: 0, // Clear sky
    humidity: 55,
    windSpeed: 18,
  },
};

// Default data for unknown locations
const DEFAULT_DATA = {
  baseTemp: { celsius: 20, fahrenheit: 68 },
  weatherCode: 1,
  humidity: 65,
  windSpeed: 10,
};

function getLocationKey(lat: number, lon: number): string {
  // Round to 2 decimal places for matching
  return `${lat.toFixed(2)},${lon.toFixed(2)}`;
}

function generateHourlyForecast(baseTemp: number, weatherCode: number): WeatherData['hourly'] {
  const now = new Date();
  const times: string[] = [];
  const temperatures: number[] = [];
  const weatherCodes: number[] = [];
  const precipitation: number[] = [];
  const humidity: number[] = [];

  for (let i = 0; i < 24; i++) {
    const time = new Date(now);
    time.setHours(now.getHours() + i, 0, 0, 0);
    times.push(time.toISOString().slice(0, 16));

    // Temperature varies through the day
    const hourOfDay = (now.getHours() + i) % 24;
    const tempVariation = Math.sin(((hourOfDay - 6) * Math.PI) / 12) * 4;
    temperatures.push(Math.round((baseTemp + tempVariation) * 10) / 10);

    // Weather code stays mostly consistent with small variations
    weatherCodes.push(i % 8 === 0 ? (weatherCode + 1) % 4 : weatherCode);

    // Precipitation based on weather code
    precipitation.push(weatherCode >= 60 ? Math.round(Math.random() * 2 * 10) / 10 : 0);

    // Humidity varies inversely with temperature
    humidity.push(Math.round(65 - tempVariation * 2));
  }

  return { time: times, temperature: temperatures, weatherCode: weatherCodes, precipitation, humidity };
}

function generateDailyForecast(
  baseTemp: number,
  weatherCode: number,
  unit: 'celsius' | 'fahrenheit'
): WeatherData['daily'] {
  const times: string[] = [];
  const weatherCodes: number[] = [];
  const temperatureMax: number[] = [];
  const temperatureMin: number[] = [];
  const precipitationSum: number[] = [];
  const precipitationProbability: number[] = [];

  const variance = unit === 'celsius' ? 3 : 5;

  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    times.push(date.toISOString().slice(0, 10));

    // Vary weather slightly day to day
    weatherCodes.push((weatherCode + i) % 4);

    // Temperature varies by day
    const dayVariation = Math.sin((i * Math.PI) / 7) * variance;
    temperatureMax.push(Math.round((baseTemp + 5 + dayVariation) * 10) / 10);
    temperatureMin.push(Math.round((baseTemp - 5 + dayVariation) * 10) / 10);

    // Precipitation
    precipitationSum.push(weatherCode >= 60 ? Math.round((5 - i) * 2) : 0);
    precipitationProbability.push(weatherCode >= 60 ? Math.max(10, 70 - i * 10) : Math.max(0, 20 - i * 3));
  }

  return {
    time: times,
    weatherCode: weatherCodes,
    temperatureMax,
    temperatureMin,
    precipitationSum,
    precipitationProbability,
  };
}

export class DemoProvider implements WeatherProvider {
  name = 'demo';

  async fetchWeather(options: WeatherProviderOptions): Promise<WeatherData> {
    const { lat, lon, unit } = options;

    // Simulate network delay (200-500ms)
    await new Promise((resolve) => setTimeout(resolve, 200 + Math.random() * 300));

    const locationKey = getLocationKey(lat, lon);
    const locationData = DEMO_LOCATIONS[locationKey] || DEFAULT_DATA;

    const baseTemp = unit === 'fahrenheit' ? locationData.baseTemp.fahrenheit : locationData.baseTemp.celsius;

    const now = new Date();

    const current: WeatherData['current'] = {
      temperature: baseTemp,
      weatherCode: locationData.weatherCode,
      windSpeed: locationData.windSpeed,
      windDirection: 180 + Math.round(Math.random() * 90),
      humidity: locationData.humidity,
      apparentTemperature: baseTemp - 2,
      precipitation: locationData.weatherCode >= 60 ? 0.5 : 0,
      time: now.toISOString().slice(0, 16),
    };

    const hourly = generateHourlyForecast(baseTemp, locationData.weatherCode);
    const daily = generateDailyForecast(baseTemp, locationData.weatherCode, unit);

    return { current, hourly, daily };
  }
}

export const demoProvider = new DemoProvider();
