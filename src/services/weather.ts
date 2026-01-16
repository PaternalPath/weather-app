import { WeatherData, TemperatureUnit } from '@/types/weather';

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

export async function fetchWeather(
  lat: number,
  lon: number,
  unit: TemperatureUnit = 'celsius'
): Promise<WeatherData> {
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

  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);

  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }

  const data: OpenMeteoResponse = await response.json();

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
