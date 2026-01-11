import { DailyForecast, TemperatureUnit } from '@/types/weather';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { format, parseISO } from 'date-fns';
import { formatTemperature } from '@/lib/format';
import { getWeatherDescription, getWeatherIcon } from '@/lib/weather-codes';
import { CloudRain } from 'lucide-react';

interface DailyForecastProps {
  forecast: DailyForecast;
  unit: TemperatureUnit;
}

export function DailyForecastCard({ forecast, unit }: DailyForecastProps) {
  const days = forecast.time.map((time, index) => ({
    date: time,
    weatherCode: forecast.weatherCode[index],
    tempMax: forecast.temperatureMax[index],
    tempMin: forecast.temperatureMin[index],
    precipitation: forecast.precipitationSum[index],
    precipitationProb: forecast.precipitationProbability[index],
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>7-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {days.map((day, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-800 last:border-0"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-16 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {index === 0 ? 'Today' : format(parseISO(day.date), 'EEE')}
                </div>
                <div className="text-2xl">{getWeatherIcon(day.weatherCode)}</div>
                <div className="flex-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {getWeatherDescription(day.weatherCode)}
                </div>
              </div>

              <div className="flex items-center gap-4">
                {day.precipitationProb > 0 && (
                  <div className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400">
                    <CloudRain className="w-4 h-4" />
                    <span>{day.precipitationProb}%</span>
                  </div>
                )}
                <div className="flex gap-2 min-w-[100px] justify-end">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {formatTemperature(day.tempMax, unit)}
                  </span>
                  <span className="text-zinc-500 dark:text-zinc-500">
                    {formatTemperature(day.tempMin, unit)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
