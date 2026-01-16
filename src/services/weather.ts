import type { WeatherData, TemperatureUnit } from '@/types/weather';
import type { WeatherResponse, WeatherError } from '@/lib/weather/schemas';

export class WeatherAPIError extends Error {
  constructor(
    message: string,
    public code: WeatherError['code'],
    public details?: string
  ) {
    super(message);
    this.name = 'WeatherAPIError';
  }
}

export async function fetchWeather(
  lat: number,
  lon: number,
  unit: TemperatureUnit = 'celsius'
): Promise<WeatherData> {
  const params = new URLSearchParams({
    lat: lat.toString(),
    lon: lon.toString(),
    unit,
  });

  const response = await fetch(`/api/weather?${params}`);
  const result: WeatherResponse = await response.json();

  if (!result.success) {
    throw new WeatherAPIError(result.error.error, result.error.code, result.error.details);
  }

  return result.data;
}
