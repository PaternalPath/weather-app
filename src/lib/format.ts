import { TemperatureUnit } from '@/types/weather';

export function formatTemperature(temp: number, unit: TemperatureUnit): string {
  return `${Math.round(temp)}°${unit === 'celsius' ? 'C' : 'F'}`;
}

export function formatWindSpeed(speed: number): string {
  return `${Math.round(speed)} km/h`;
}

export function formatWindDirection(degrees: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

export function formatPrecipitation(mm: number): string {
  return `${mm.toFixed(1)} mm`;
}

export function formatHumidity(humidity: number): string {
  return `${Math.round(humidity)}%`;
}
