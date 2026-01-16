'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { resetAllData, clearCache } from '@/lib/storage';
import { UserSettings } from '@/types/weather';
import { AlertTriangle } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useLocalStorage<UserSettings>('weather-app-settings', {
    temperatureUnit: 'celsius',
  });
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleUnitChange = (unit: 'celsius' | 'fahrenheit') => {
    setSettings({ ...settings, temperatureUnit: unit });
    // Clear cache when unit changes so data is refetched
    clearCache();
  };

  const handleReset = () => {
    resetAllData();
    setShowResetConfirm(false);
    router.push('/');
  };

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-zinc-100">Settings</h1>

        <div className="space-y-6">
          {/* Temperature Unit */}
          <Card>
            <CardHeader>
              <CardTitle>Temperature Unit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button
                  variant={settings.temperatureUnit === 'celsius' ? 'primary' : 'secondary'}
                  onClick={() => handleUnitChange('celsius')}
                >
                  Celsius (°C)
                </Button>
                <Button
                  variant={settings.temperatureUnit === 'fahrenheit' ? 'primary' : 'secondary'}
                  onClick={() => handleUnitChange('fahrenheit')}
                >
                  Fahrenheit (°F)
                </Button>
              </div>
              <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
                Changes will apply after refreshing weather data
              </p>
            </CardContent>
          </Card>

          {/* Reset Data */}
          <Card>
            <CardHeader>
              <CardTitle>Reset Data</CardTitle>
            </CardHeader>
            <CardContent>
              {!showResetConfirm ? (
                <>
                  <p className="mb-4 text-sm text-zinc-700 dark:text-zinc-300">
                    Reset all application data including saved locations, settings, and cache. This
                    will restore the demo data.
                  </p>
                  <Button variant="danger" onClick={() => setShowResetConfirm(true)}>
                    Reset All Data
                  </Button>
                </>
              ) : (
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-950">
                  <div className="mb-4 flex items-start gap-3">
                    <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600 dark:text-yellow-400" />
                    <div>
                      <h3 className="mb-1 font-semibold text-yellow-900 dark:text-yellow-100">
                        Are you sure?
                      </h3>
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        This action cannot be undone. All your saved locations and settings will be
                        permanently deleted.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="danger" onClick={handleReset}>
                      Yes, Reset Everything
                    </Button>
                    <Button variant="secondary" onClick={() => setShowResetConfirm(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* About */}
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-3 text-sm text-zinc-700 dark:text-zinc-300">
                This weather dashboard uses Open-Meteo API to provide accurate weather forecasts and
                current conditions.
              </p>
              <p className="mb-3 text-sm text-zinc-700 dark:text-zinc-300">
                Weather data is cached for 10 minutes to improve performance and reduce API calls.
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Version 0.1.0</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
