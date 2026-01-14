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

export function CurrentWeatherCard({
  weather,
  locationName,
  unit,
}: CurrentWeatherCardProps) {
  return (
    <Card className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 dark:from-blue-600 dark:via-blue-700 dark:to-indigo-800 border-none text-white shadow-lg">
      <CardContent className="py-8 px-6">
        <div className="text-center">
          {/* Location */}
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 tracking-tight">
            {locationName}
          </h2>

          {/* Main temperature and condition */}
          <div className="mb-6">
            <div className="text-7xl sm:text-8xl my-6 drop-shadow-md">
              {getWeatherIcon(weather.weatherCode)}
            </div>
            <div className="text-6xl sm:text-7xl font-bold mb-3 tracking-tight drop-shadow-md">
              {formatTemperature(weather.temperature, unit)}
            </div>
            <p className="text-xl sm:text-2xl opacity-95 font-medium">
              {getWeatherDescription(weather.weatherCode)}
            </p>
          </div>

          {/* Weather details grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 max-w-2xl mx-auto">
            <div className="flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <Thermometer className="w-5 h-5 mb-2 opacity-90" aria-hidden="true" />
              <div className="text-xs sm:text-sm opacity-90 mb-1">Feels like</div>
              <div className="font-semibold text-lg">
                {formatTemperature(weather.apparentTemperature, unit)}
              </div>
            </div>

            <div className="flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <Wind className="w-5 h-5 mb-2 opacity-90" aria-hidden="true" />
              <div className="text-xs sm:text-sm opacity-90 mb-1">Wind</div>
              <div className="font-semibold text-base sm:text-lg">
                {formatWindSpeed(weather.windSpeed)}
              </div>
              <div className="text-xs opacity-80">
                {formatWindDirection(weather.windDirection)}
              </div>
            </div>

            <div className="flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <Droplets className="w-5 h-5 mb-2 opacity-90" aria-hidden="true" />
              <div className="text-xs sm:text-sm opacity-90 mb-1">Humidity</div>
              <div className="font-semibold text-lg">
                {formatHumidity(weather.humidity)}
              </div>
            </div>

            <div className="flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <CloudRain className="w-5 h-5 mb-2 opacity-90" aria-hidden="true" />
              <div className="text-xs sm:text-sm opacity-90 mb-1">Precipitation</div>
              <div className="font-semibold text-lg">
                {formatPrecipitation(weather.precipitation)}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
