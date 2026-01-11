'use client';

import { useState, useEffect } from 'react';
import { Location, SavedLocation, WeatherData, UserSettings } from '@/types/weather';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { fetchWeather } from '@/services/weather';
import {
  getSavedLocations,
  saveLocation,
  removeLocation,
  getSettings,
  getCachedWeather,
  setCachedWeather,
} from '@/lib/storage';
import { seedDemoData } from '@/lib/demo-data';
import { LocationSearch } from '@/components/weather/location-search';
import { SavedLocations } from '@/components/weather/saved-locations';
import { CurrentWeatherCard } from '@/components/weather/current-weather-card';
import { HourlyForecastCard } from '@/components/weather/hourly-forecast';
import { DailyForecastCard } from '@/components/weather/daily-forecast';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [savedLocations, setSavedLocations] = useLocalStorage<SavedLocation[]>(
    'weather-app-locations',
    []
  );
  const [currentLocation, setCurrentLocation] = useState<SavedLocation | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings] = useLocalStorage<UserSettings>('weather-app-settings', { temperatureUnit: 'celsius' });

  // Seed demo data on first load
  useEffect(() => {
    seedDemoData();
    const locations = getSavedLocations();
    setSavedLocations(locations);

    // Load first location by default
    if (locations.length > 0 && !currentLocation) {
      setCurrentLocation(locations[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch weather when location changes
  useEffect(() => {
    if (!currentLocation) return;

    const loadWeather = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Check cache first
        const cached = getCachedWeather(currentLocation.id);
        if (cached) {
          setWeatherData(cached);
          setIsLoading(false);
          return;
        }

        // Fetch fresh data
        const userSettings = getSettings();
        const data = await fetchWeather(
          currentLocation.lat,
          currentLocation.lon,
          userSettings.temperatureUnit
        );
        setWeatherData(data);
        setCachedWeather(currentLocation.id, data);
      } catch (err) {
        setError('Failed to load weather data. Please try again.');
        console.error('Weather fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadWeather();
  }, [currentLocation]);

  const handleLocationSelect = (location: Location) => {
    const savedLocation: SavedLocation = {
      ...location,
      addedAt: Date.now(),
    };

    saveLocation(savedLocation);
    const updated = getSavedLocations();
    setSavedLocations(updated);
    setCurrentLocation(savedLocation);
  };

  const handleLocationRemove = (locationId: string) => {
    removeLocation(locationId);
    const updated = getSavedLocations();
    setSavedLocations(updated);

    // If removing current location, switch to first available
    if (currentLocation?.id === locationId) {
      setCurrentLocation(updated[0] || null);
      setWeatherData(null);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
                Search Location
              </h2>
              <LocationSearch onLocationSelect={handleLocationSelect} />
            </div>

            <SavedLocations
              locations={savedLocations}
              currentLocationId={currentLocation?.id || null}
              onLocationSelect={setCurrentLocation}
              onLocationRemove={handleLocationRemove}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {isLoading && (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            )}

            {error && (
              <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-900 dark:text-red-100">
                {error}
              </div>
            )}

            {!isLoading && !error && currentLocation && weatherData && (
              <>
                <CurrentWeatherCard
                  weather={weatherData.current}
                  locationName={currentLocation.name}
                  unit={settings.temperatureUnit}
                />

                <HourlyForecastCard
                  forecast={weatherData.hourly}
                  unit={settings.temperatureUnit}
                />

                <DailyForecastCard
                  forecast={weatherData.daily}
                  unit={settings.temperatureUnit}
                />
              </>
            )}

            {!isLoading && !error && !currentLocation && (
              <div className="text-center py-20 text-zinc-500 dark:text-zinc-400">
                <p className="text-lg">Search for a location to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
