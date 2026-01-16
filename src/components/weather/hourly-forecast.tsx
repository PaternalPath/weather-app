import { HourlyForecast, TemperatureUnit } from '@/types/weather';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { format, parseISO } from 'date-fns';
import { formatTemperature } from '@/lib/format';
import { getWeatherIcon } from '@/lib/weather-codes';
import { CloudRain } from 'lucide-react';

interface HourlyForecastProps {
  forecast: HourlyForecast;
  unit: TemperatureUnit;
}

export function HourlyForecastCard({ forecast, unit }: HourlyForecastProps) {
  // Get next 24 hours
  const next24Hours = forecast.time.slice(0, 24).map((time, index) => ({
    time,
    temperature: forecast.temperature[index],
    weatherCode: forecast.weatherCode[index],
    precipitation: forecast.precipitation[index],
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>24-Hour Forecast</CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="relative">
          {/* Fade effect on edges */}
          <div className="pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-8 bg-gradient-to-r from-white to-transparent dark:from-zinc-900" />
          <div className="pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-8 bg-gradient-to-l from-white to-transparent dark:from-zinc-900" />

          <div className="scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700 scrollbar-track-transparent overflow-x-auto">
            <div className="flex gap-2 px-2 pb-2">
              {next24Hours.map((hour, index) => (
                <div
                  key={index}
                  className="flex min-w-[72px] flex-col items-center rounded-lg p-3 text-center transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800"
                >
                  <div className="mb-2 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                    {index === 0 ? 'Now' : format(parseISO(hour.time), 'HH:mm')}
                  </div>
                  <div className="mb-2 text-3xl" role="img" aria-label="Weather icon">
                    {getWeatherIcon(hour.weatherCode)}
                  </div>
                  <div className="mb-1 text-base font-bold text-zinc-900 dark:text-zinc-100">
                    {formatTemperature(hour.temperature, unit)}
                  </div>
                  {hour.precipitation > 0 && (
                    <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                      <CloudRain className="h-3 w-3" aria-hidden="true" />
                      <span>{hour.precipitation.toFixed(1)}mm</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
