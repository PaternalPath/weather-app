export interface Location {
  id: string;
  name: string;
  lat: number;
  lon: number;
  country: string;
  admin1?: string;
}

export interface CurrentWeather {
  temperature: number;
  weatherCode: number;
  windSpeed: number;
  windDirection: number;
  humidity: number;
  apparentTemperature: number;
  precipitation: number;
  time: string;
}

export interface HourlyForecast {
  time: string[];
  temperature: number[];
  weatherCode: number[];
  precipitation: number[];
  humidity: number[];
}

export interface DailyForecast {
  time: string[];
  weatherCode: number[];
  temperatureMax: number[];
  temperatureMin: number[];
  precipitationSum: number[];
  precipitationProbability: number[];
}

export interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyForecast;
  daily: DailyForecast;
}

export type TemperatureUnit = 'celsius' | 'fahrenheit';

export interface UserSettings {
  temperatureUnit: TemperatureUnit;
}

export interface SavedLocation extends Location {
  addedAt: number;
}
