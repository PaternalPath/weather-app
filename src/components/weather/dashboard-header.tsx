import { TemperatureUnit } from '@/types/weather';
import { Toggle } from '@/components/ui/toggle';

interface DashboardHeaderProps {
  unit: TemperatureUnit;
  onUnitChange: (unit: TemperatureUnit) => void;
}

export function DashboardHeader({ unit, onUnitChange }: DashboardHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl dark:text-zinc-100">
          Weather Dashboard
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Real-time weather data powered by Open-Meteo
        </p>
      </div>

      <Toggle
        options={[
          { value: 'celsius' as const, label: '°C', ariaLabel: 'Celsius' },
          { value: 'fahrenheit' as const, label: '°F', ariaLabel: 'Fahrenheit' },
        ]}
        value={unit}
        onChange={onUnitChange}
        size="sm"
      />
    </div>
  );
}
