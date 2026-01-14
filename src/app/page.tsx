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
  saveSettings,
  getCachedWeather,
  setCachedWeather,
  clearCache,
} from '@/lib/storage';
import { seedDemoData } from '@/lib/demo-data';
import { DashboardHeader } from '@/components/weather/dashboard-header';
import { LocationSearch } from '@/components/weather/location-search';
import { SavedLocations } from '@/components/weather/saved-locations';
import { CurrentWeatherCard } from '@/components/weather/current-weather-card';
import { HourlyForecastCard } from '@/components/weather/hourly-forecast';
import { DailyForecastCard } from '@/components/weather/daily-forecast';
import { SkeletonCurrentWeather, SkeletonHourlyForecast, SkeletonCard } from '@/components/ui/skeleton';
import { ErrorState, EmptyState } from '@/components/ui/error-state';
import { CloudSun } from 'lucide-react';

export default function Home() {
  const [savedLocations, setSavedLocations] = useLocalStorage<SavedLocation[]>(
    'weather-app-locations',
    []
  );
  const [currentLocation, setCurrentLocation] = useState<SavedLocation | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useLocalStorage<UserSettings>('weather-app-settings', {
    temperatureUnit: 'celsius',
  });

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
    setWeatherData(null); // Clear old data while loading
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

  const handleUnitChange = (unit: 'celsius' | 'fahrenheit') => {
    setSettings({ temperatureUnit: unit });
    saveSettings({ temperatureUnit: unit });
    // Clear cache so data is refetched with new unit
    clearCache();
    // Trigger reload
    if (currentLocation) {
      setWeatherData(null);
      setCurrentLocation({ ...currentLocation });
    }
  };

  const handleRetry = () => {
    if (currentLocation) {
      clearCache();
      setCurrentLocation({ ...currentLocation });
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-50 via-zinc-50 to-blue-50 dark:from-black dark:via-zinc-950 dark:to-blue-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Dashboard Header */}
        <DashboardHeader unit={settings.temperatureUnit} onUnitChange={handleUnitChange} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
                Search Location
              </h2>
              <LocationSearch onLocationSelect={handleLocationSelect} />
            </div>

            {savedLocations.length > 0 && (
              <SavedLocations
                locations={savedLocations}
                currentLocationId={currentLocation?.id || null}
                onLocationSelect={setCurrentLocation}
                onLocationRemove={handleLocationRemove}
              />
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Loading State */}
            {isLoading && (
              <>
                <SkeletonCurrentWeather />
                <SkeletonHourlyForecast />
                <SkeletonCard />
              </>
            )}

            {/* Error State */}
            {!isLoading && error && (
              <ErrorState
                title="Unable to load weather data"
                message={error}
                onRetry={handleRetry}
              />
            )}

            {/* Weather Data */}
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

            {/* Empty State */}
            {!isLoading && !error && !currentLocation && savedLocations.length === 0 && (
              <EmptyState
                title="Welcome to Weather Dashboard"
                description="Search for a city above to get started with real-time weather forecasts and conditions."
                icon={<CloudSun className="w-full h-full" />}
              />
            )}

            {!isLoading && !error && !currentLocation && savedLocations.length > 0 && (
              <EmptyState
                title="Select a location"
                description="Choose one of your saved locations or search for a new city to view weather data."
                icon={<CloudSun className="w-full h-full" />}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
