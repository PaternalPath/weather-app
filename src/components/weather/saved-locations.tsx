import { SavedLocation } from '@/types/weather';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, X } from 'lucide-react';

interface SavedLocationsProps {
  locations: SavedLocation[];
  currentLocationId: string | null;
  onLocationSelect: (location: SavedLocation) => void;
  onLocationRemove: (locationId: string) => void;
}

export function SavedLocations({
  locations,
  currentLocationId,
  onLocationSelect,
  onLocationRemove,
}: SavedLocationsProps) {
  if (locations.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved Locations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {locations.map((location) => (
            <div
              key={location.id}
              className={`
                flex items-center justify-between p-3 rounded-lg border transition-colors
                ${currentLocationId === location.id
                  ? 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800'
                  : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                }
              `}
            >
              <button
                onClick={() => onLocationSelect(location)}
                className="flex items-center gap-3 flex-1 text-left"
              >
                <MapPin className={`w-4 h-4 flex-shrink-0 ${
                  currentLocationId === location.id
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-zinc-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-zinc-900 dark:text-zinc-100">
                    {location.name}
                  </div>
                  <div className="text-sm text-zinc-500 dark:text-zinc-400 truncate">
                    {[location.admin1, location.country].filter(Boolean).join(', ')}
                  </div>
                </div>
              </button>

              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onLocationRemove(location.id);
                }}
                className="ml-2"
                aria-label={`Remove ${location.name}`}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
