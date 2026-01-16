import type { WeatherData } from './schemas';
import type { TemperatureUnit } from '@/types/weather';

export interface WeatherProviderOptions {
  lat: number;
  lon: number;
  unit: TemperatureUnit;
  timeout?: number;
}

export interface WeatherProvider {
  name: string;
  fetchWeather(options: WeatherProviderOptions): Promise<WeatherData>;
}

export class WeatherProviderError extends Error {
  constructor(
    message: string,
    public code: 'PROVIDER_ERROR' | 'TIMEOUT' | 'RATE_LIMITED',
    public details?: string
  ) {
    super(message);
    this.name = 'WeatherProviderError';
  }
}
