import { HourlyForecast, TemperatureUnit } from '@/types/weather';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { format, parseISO } from 'date-fns';
import { formatTemperature } from '@/lib/format';
import { getWeatherIcon } from '@/lib/weather-codes';

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
        <CardTitle>Hourly Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="flex gap-4 pb-2">
            {next24Hours.map((hour, index) => (
              <div
                key={index}
                className="flex flex-col items-center min-w-[60px] text-center"
              >
                <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                  {index === 0 ? 'Now' : format(parseISO(hour.time), 'HH:mm')}
                </div>
                <div className="text-2xl mb-1">{getWeatherIcon(hour.weatherCode)}</div>
                <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {formatTemperature(hour.temperature, unit)}
                </div>
                {hour.precipitation > 0 && (
                  <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    {hour.precipitation.toFixed(1)}mm
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
