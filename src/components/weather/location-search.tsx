'use client';

import { useState, useEffect, useRef } from 'react';
import { Location } from '@/types/weather';
import { searchLocations } from '@/services/geocoding';
import { Input } from '@/components/ui/input';
import { Search, MapPin } from 'lucide-react';

interface LocationSearchProps {
  onLocationSelect: (location: Location) => void;
}

export function LocationSearch({ onLocationSelect }: LocationSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Location[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const locations = await searchLocations(query);
        setResults(locations);
        setShowResults(true);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  const handleSelect = (location: Location) => {
    onLocationSelect(location);
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  return (
    <div ref={searchRef} className="relative">
      <div className="relative">
        <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-zinc-400" />
        <Input
          type="text"
          placeholder="Search for a city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setShowResults(true)}
          className="pl-10"
        />
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute top-full z-50 mt-2 max-h-64 w-full overflow-y-auto rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
          {results.map((location) => (
            <button
              key={location.id}
              onClick={() => handleSelect(location)}
              className="flex w-full items-center gap-3 border-b border-zinc-100 px-4 py-3 text-left transition-colors last:border-0 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800"
            >
              <MapPin className="h-4 w-4 flex-shrink-0 text-zinc-400" />
              <div className="min-w-0 flex-1">
                <div className="font-medium text-zinc-900 dark:text-zinc-100">{location.name}</div>
                <div className="truncate text-sm text-zinc-500 dark:text-zinc-400">
                  {[location.admin1, location.country].filter(Boolean).join(', ')}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {isSearching && (
        <div className="absolute top-full z-50 mt-2 w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-center text-sm text-zinc-500 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
          Searching...
        </div>
      )}
    </div>
  );
}
