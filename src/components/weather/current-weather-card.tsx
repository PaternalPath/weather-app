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
import { Wind, Droplets, Thermometer } from 'lucide-react';

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
    <Card className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-800 border-none text-white">
      <CardContent className="py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">{locationName}</h1>
          <div className="text-7xl my-4">{getWeatherIcon(weather.weatherCode)}</div>
          <div className="text-6xl font-bold mb-2">
            {formatTemperature(weather.temperature, unit)}
          </div>
          <p className="text-xl opacity-90 mb-6">
            {getWeatherDescription(weather.weatherCode)}
          </p>

          <div className="grid grid-cols-3 gap-4 mt-6 max-w-md mx-auto">
            <div className="flex flex-col items-center">
              <Thermometer className="w-5 h-5 mb-1 opacity-80" />
              <div className="text-sm opacity-80">Feels like</div>
              <div className="font-semibold">
                {formatTemperature(weather.apparentTemperature, unit)}
              </div>
            </div>

            <div className="flex flex-col items-center">
              <Wind className="w-5 h-5 mb-1 opacity-80" />
              <div className="text-sm opacity-80">Wind</div>
              <div className="font-semibold">
                {formatWindSpeed(weather.windSpeed)} {formatWindDirection(weather.windDirection)}
              </div>
            </div>

            <div className="flex flex-col items-center">
              <Droplets className="w-5 h-5 mb-1 opacity-80" />
              <div className="text-sm opacity-80">Humidity</div>
              <div className="font-semibold">{formatHumidity(weather.humidity)}</div>
            </div>
          </div>

          {weather.precipitation > 0 && (
            <div className="mt-4 text-sm opacity-90">
              Precipitation: {formatPrecipitation(weather.precipitation)}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
