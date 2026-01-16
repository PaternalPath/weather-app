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
              className={`flex items-center justify-between rounded-lg border p-3 transition-colors ${
                currentLocationId === location.id
                  ? 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950'
                  : 'border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800'
              } `}
            >
              <button
                onClick={() => onLocationSelect(location)}
                className="flex flex-1 items-center gap-3 text-left"
              >
                <MapPin
                  className={`h-4 w-4 flex-shrink-0 ${
                    currentLocationId === location.id
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-zinc-400'
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-zinc-900 dark:text-zinc-100">
                    {location.name}
                  </div>
                  <div className="truncate text-sm text-zinc-500 dark:text-zinc-400">
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
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
