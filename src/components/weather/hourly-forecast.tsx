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
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white dark:from-zinc-900 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-zinc-900 to-transparent z-10 pointer-events-none" />

          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700 scrollbar-track-transparent">
            <div className="flex gap-2 pb-2 px-2">
              {next24Hours.map((hour, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center min-w-[72px] text-center p-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  <div className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                    {index === 0 ? 'Now' : format(parseISO(hour.time), 'HH:mm')}
                  </div>
                  <div className="text-3xl mb-2" role="img" aria-label="Weather icon">
                    {getWeatherIcon(hour.weatherCode)}
                  </div>
                  <div className="font-bold text-base text-zinc-900 dark:text-zinc-100 mb-1">
                    {formatTemperature(hour.temperature, unit)}
                  </div>
                  {hour.precipitation > 0 && (
                    <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                      <CloudRain className="w-3 h-3" aria-hidden="true" />
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
