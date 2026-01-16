'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Location } from '@/types/weather';
import { searchLocations } from '@/services/geocoding';
import { Input } from '@/components/ui/input';
import { Search, MapPin, X, Clock } from 'lucide-react';

const RECENT_SEARCHES_KEY = 'weather-app-recent-searches';
const MAX_RECENT_SEARCHES = 5;

interface LocationSearchProps {
  onLocationSelect: (location: Location) => void;
}

function getRecentSearches(): Location[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function addRecentSearch(location: Location): void {
  if (typeof window === 'undefined') return;
  try {
    const recent = getRecentSearches();
    // Remove if already exists (to move it to front)
    const filtered = recent.filter((l) => l.id !== location.id);
    // Add to front and limit to MAX
    const updated = [location, ...filtered].slice(0, MAX_RECENT_SEARCHES);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  } catch {
    // Ignore localStorage errors
  }
}

export function LocationSearch({ onLocationSelect }: LocationSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Location[]>([]);
  const [recentSearches, setRecentSearches] = useState<Location[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches on mount
  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search locations
  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query.trim().length < 2) {
        setResults([]);
        setSelectedIndex(-1);
        return;
      }

      setIsSearching(true);
      try {
        const locations = await searchLocations(query);
        setResults(locations);
        setShowDropdown(true);
        setSelectedIndex(-1);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  const handleSelect = useCallback(
    (location: Location) => {
      addRecentSearch(location);
      setRecentSearches(getRecentSearches());
      onLocationSelect(location);
      setQuery('');
      setResults([]);
      setShowDropdown(false);
      setSelectedIndex(-1);
    },
    [onLocationSelect]
  );

  const clearInput = useCallback(() => {
    setQuery('');
    setResults([]);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  }, []);

  const handleFocus = useCallback(() => {
    // Show recent searches if no query
    if (!query.trim() && recentSearches.length > 0) {
      setShowDropdown(true);
    } else if (results.length > 0) {
      setShowDropdown(true);
    }
  }, [query, results.length, recentSearches.length]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const items = query.trim().length >= 2 ? results : recentSearches;

    if (!showDropdown || items.length === 0) {
      if (e.key === 'ArrowDown' && recentSearches.length > 0 && !query.trim()) {
        setShowDropdown(true);
        setSelectedIndex(0);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < items.length) {
          handleSelect(items[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const displayItems = query.trim().length >= 2 ? results : recentSearches;
  const showRecent = query.trim().length < 2 && recentSearches.length > 0;

  return (
    <div ref={searchRef} className="relative">
      <label htmlFor="location-search" className="sr-only">
        Search for a city
      </label>
      <div className="relative">
        <Search
          className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-zinc-400"
          aria-hidden="true"
        />
        <Input
          ref={inputRef}
          id="location-search"
          type="text"
          placeholder="Search for a city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-10"
          role="combobox"
          aria-expanded={showDropdown}
          aria-haspopup="listbox"
          aria-controls="location-results"
          aria-autocomplete="list"
          aria-activedescendant={selectedIndex >= 0 ? `location-option-${selectedIndex}` : undefined}
        />
        {query && (
          <button
            type="button"
            onClick={clearInput}
            className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {showDropdown && displayItems.length > 0 && (
        <div
          id="location-results"
          role="listbox"
          aria-label={showRecent ? 'Recent searches' : 'Search results'}
          className="absolute top-full z-50 mt-2 max-h-64 w-full overflow-y-auto rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
        >
          {showRecent && (
            <div className="flex items-center gap-2 border-b border-zinc-100 px-4 py-2 text-xs font-medium text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
              <Clock className="h-3 w-3" aria-hidden="true" />
              Recent Searches
            </div>
          )}
          {displayItems.map((location, index) => (
            <button
              key={location.id}
              id={`location-option-${index}`}
              role="option"
              aria-selected={index === selectedIndex}
              onClick={() => handleSelect(location)}
              className={`flex w-full items-center gap-3 border-b border-zinc-100 px-4 py-3 text-left transition-colors last:border-0 dark:border-zinc-800 ${
                index === selectedIndex
                  ? 'bg-blue-50 dark:bg-blue-900/20'
                  : 'hover:bg-zinc-50 dark:hover:bg-zinc-800'
              }`}
            >
              <MapPin className="h-4 w-4 flex-shrink-0 text-zinc-400" aria-hidden="true" />
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
        <div
          className="absolute top-full z-50 mt-2 w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-center text-sm text-zinc-500 shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
          role="status"
          aria-live="polite"
        >
          Searching...
        </div>
      )}

      {showDropdown && query.trim().length >= 2 && !isSearching && results.length === 0 && (
        <div
          className="absolute top-full z-50 mt-2 w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-center text-sm text-zinc-500 shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
          role="status"
        >
          No cities found for &quot;{query}&quot;
        </div>
      )}
    </div>
  );
}
