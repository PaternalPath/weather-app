import { SavedLocation } from '@/types/weather';

export const DEMO_LOCATIONS: SavedLocation[] = [
  {
    id: '51.5074,-0.1278',
    name: 'London',
    lat: 51.5074,
    lon: -0.1278,
    country: 'United Kingdom',
    admin1: 'England',
    addedAt: Date.now() - 86400000 * 2, // 2 days ago
  },
  {
    id: '40.7128,-74.006',
    name: 'New York',
    lat: 40.7128,
    lon: -74.006,
    country: 'United States',
    admin1: 'New York',
    addedAt: Date.now() - 86400000, // 1 day ago
  },
  {
    id: '35.6762,139.6503',
    name: 'Tokyo',
    lat: 35.6762,
    lon: 139.6503,
    country: 'Japan',
    admin1: 'Tokyo',
    addedAt: Date.now(),
  },
];

export function seedDemoData(): void {
  if (typeof window === 'undefined') return;

  const existing = localStorage.getItem('weather-app-locations');
  if (!existing) {
    localStorage.setItem('weather-app-locations', JSON.stringify(DEMO_LOCATIONS));
  }
}
