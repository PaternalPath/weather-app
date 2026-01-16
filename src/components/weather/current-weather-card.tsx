import { CurrentWeather, TemperatureUnit } from '@/types/weather';
import { Card, CardContent } from '@/components/ui/card';
import { getWeatherDescription, getWeatherIcon } from '@/lib/weather-codes';
import {
  formatTemperature,
  formatWindSpeed,
  formatWindDirection,
  formatHumidity,
  formatPrecipitation,
} from '@/lib/format';
import { Wind, Droplets, Thermometer, CloudRain } from 'lucide-react';

interface CurrentWeatherCardProps {
  weather: CurrentWeather;
  locationName: string;
  unit: TemperatureUnit;
}

export function CurrentWeatherCard({ weather, locationName, unit }: CurrentWeatherCardProps) {
  return (
    <Card className="border-none bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 text-white shadow-lg dark:from-blue-600 dark:via-blue-700 dark:to-indigo-800">
      <CardContent className="px-6 py-8">
        <div className="text-center">
          {/* Location */}
          <h2 className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl">{locationName}</h2>

          {/* Main temperature and condition */}
          <div className="mb-6">
            <div className="my-6 text-7xl drop-shadow-md sm:text-8xl">
              {getWeatherIcon(weather.weatherCode)}
            </div>
            <div className="mb-3 text-6xl font-bold tracking-tight drop-shadow-md sm:text-7xl">
              {formatTemperature(weather.temperature, unit)}
            </div>
            <p className="text-xl font-medium opacity-95 sm:text-2xl">
              {getWeatherDescription(weather.weatherCode)}
            </p>
          </div>

          {/* Weather details grid */}
          <div className="mx-auto mt-8 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="flex flex-col items-center rounded-lg bg-white/10 p-4 backdrop-blur-sm">
              <Thermometer className="mb-2 h-5 w-5 opacity-90" aria-hidden="true" />
              <div className="mb-1 text-xs opacity-90 sm:text-sm">Feels like</div>
              <div className="text-lg font-semibold">
                {formatTemperature(weather.apparentTemperature, unit)}
              </div>
            </div>

            <div className="flex flex-col items-center rounded-lg bg-white/10 p-4 backdrop-blur-sm">
              <Wind className="mb-2 h-5 w-5 opacity-90" aria-hidden="true" />
              <div className="mb-1 text-xs opacity-90 sm:text-sm">Wind</div>
              <div className="text-base font-semibold sm:text-lg">
                {formatWindSpeed(weather.windSpeed)}
              </div>
              <div className="text-xs opacity-80">{formatWindDirection(weather.windDirection)}</div>
            </div>

            <div className="flex flex-col items-center rounded-lg bg-white/10 p-4 backdrop-blur-sm">
              <Droplets className="mb-2 h-5 w-5 opacity-90" aria-hidden="true" />
              <div className="mb-1 text-xs opacity-90 sm:text-sm">Humidity</div>
              <div className="text-lg font-semibold">{formatHumidity(weather.humidity)}</div>
            </div>

            <div className="flex flex-col items-center rounded-lg bg-white/10 p-4 backdrop-blur-sm">
              <CloudRain className="mb-2 h-5 w-5 opacity-90" aria-hidden="true" />
              <div className="mb-1 text-xs opacity-90 sm:text-sm">Precipitation</div>
              <div className="text-lg font-semibold">
                {formatPrecipitation(weather.precipitation)}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
