# Test Coverage Analysis Report

## Current State

**Unit Tests**: 33 passing tests across 4 test files
**E2E Tests**: 12 tests in Playwright
**Testing Frameworks**: Vitest (unit), Playwright (E2E)

### Existing Test Coverage

| Module | File | Coverage Status |
|--------|------|-----------------|
| Weather Cache | `src/lib/weather/cache.ts` | ✅ Well tested (10 tests) |
| Validation Schemas | `src/lib/weather/schemas.ts` | ✅ Well tested (13 tests) |
| Demo Provider | `src/lib/weather/providers/demo.ts` | ✅ Well tested (9 tests) |
| API Route | `src/app/api/weather/route.ts` | ✅ Tested (1 unit + E2E) |

---

## Priority 1: Critical Gaps (High Business Risk)

### 1.1 Rate Limiting Logic - `src/lib/weather/rate-limit.ts`

**Risk**: Rate limiting protects against API abuse and DoS attacks. Bugs could either block legitimate users or allow abuse.

**Missing Tests**:
- First request within window is allowed
- Request count increments correctly
- Blocking after MAX_REQUESTS (30) reached
- Window expiration and reset behavior
- Cleanup interval removes stale entries
- Stats reporting accuracy

**Suggested Test File**: `src/lib/weather/__tests__/rate-limit.test.ts`

```typescript
// Recommended test cases:
describe('checkRateLimit', () => {
  it('should allow first request and return remaining count')
  it('should track multiple requests from same identifier')
  it('should block requests after limit exceeded')
  it('should reset count after window expires')
  it('should handle multiple identifiers independently')
})

describe('cleanup', () => {
  it('should remove expired entries')
  it('should keep active entries')
})
```

### 1.2 Storage Layer - `src/lib/storage.ts`

**Risk**: Data persistence for saved locations, settings, and weather cache. Bugs cause data loss or corruption.

**Missing Tests**:
- `getSavedLocations()` - empty state, existing data, JSON parse errors
- `saveLocation()` - new location, duplicate prevention
- `removeLocation()` - existing/non-existing location
- `clearAllLocations()` - clears correctly
- `getSettings()` / `saveSettings()` - defaults, persistence
- `getCachedWeather()` / `setCachedWeather()` - TTL expiration (10 min)
- `resetAllData()` - full reset

**Suggested Test File**: `src/lib/__tests__/storage.test.ts`

```typescript
// Recommended test structure using mock localStorage:
describe('Location Management', () => {
  it('should return empty array when no locations saved')
  it('should save and retrieve locations')
  it('should prevent duplicate locations')
  it('should remove location by id')
})

describe('Weather Cache', () => {
  it('should return null for non-existent cache entry')
  it('should return cached data within TTL')
  it('should return null for expired cache entry')
})
```

### 1.3 Geocoding Service - `src/services/geocoding.ts`

**Risk**: External API integration. Network failures, malformed responses, or API changes could break location search.

**Missing Tests**:
- Empty query handling
- Successful API response transformation
- No results found case
- Network error handling
- Non-200 response handling
- Malformed JSON response

**Suggested Test File**: `src/services/__tests__/geocoding.test.ts`

```typescript
// Use fetch mocking (vi.mock or msw):
describe('searchLocations', () => {
  it('should return empty array for empty query')
  it('should transform API response to Location format')
  it('should handle no results gracefully')
  it('should throw on network error')
  it('should throw on non-OK response')
})
```

---

## Priority 2: Important Gaps (Medium Risk)

### 2.1 Weather Service - `src/services/weather.ts`

**Missing Tests**:
- Successful weather fetch and data extraction
- Error response handling (WeatherAPIError)
- Network failure scenarios
- Parameter serialization

**Suggested Test File**: `src/services/__tests__/weather.test.ts`

### 2.2 Open-Meteo Provider - `src/lib/weather/providers/open-meteo.ts`

**Missing Tests**:
- Successful API call and response transformation
- HTTP 429 rate limit handling
- Non-200 response error handling
- Request timeout (AbortController)
- Network error handling
- Response transformation accuracy

**Suggested Test File**: `src/lib/weather/providers/__tests__/open-meteo.test.ts`

### 2.3 Formatting Utilities - `src/lib/format.ts`

**Risk**: Display bugs. Wrong temperature symbols, wind directions, or humidity formatting.

**Missing Tests**:
- `formatTemperature()` - Celsius vs Fahrenheit, rounding
- `formatWindSpeed()` - rounding, units
- `formatWindDirection()` - all 8 compass directions, edge cases (0°, 360°)
- `formatPrecipitation()` - decimal formatting
- `formatHumidity()` - percentage formatting

**Suggested Test File**: `src/lib/__tests__/format.test.ts`

```typescript
describe('formatWindDirection', () => {
  it.each([
    [0, 'N'],
    [45, 'NE'],
    [90, 'E'],
    [135, 'SE'],
    [180, 'S'],
    [225, 'SW'],
    [270, 'W'],
    [315, 'NW'],
    [360, 'N'],  // Edge case: 360 should wrap to N
  ])('should return %s for %d degrees', (degrees, expected) => {
    expect(formatWindDirection(degrees)).toBe(expected)
  })
})
```

---

## Priority 3: Lower Priority (Low Risk)

### 3.1 Custom Hook - `src/hooks/use-local-storage.ts`

**Missing Tests**:
- Initial value when localStorage empty
- Loading existing value from localStorage
- Updating value with direct value
- Updating value with function
- Error handling (localStorage quota exceeded)
- `isLoaded` state management

**Note**: Consider using `@testing-library/react-hooks` or Vitest's component testing.

### 3.2 Weather Code Mappings - `src/lib/weather-codes.ts`

**Missing Tests**:
- All weather codes map to valid descriptions
- All weather codes map to valid icons
- Unknown code handling

### 3.3 UI Components (Lower Priority)

These are covered by E2E tests, but isolated unit tests could be added:
- `LocationSearch` - input handling, keyboard navigation
- `SavedLocations` - location list rendering, click handlers
- `CurrentWeatherCard` - data display formatting
- Weather display components - rendering with various data states

---

## Recommended Test Implementation Order

1. **Week 1**: Rate limiting + Storage layer (critical infrastructure)
2. **Week 2**: Geocoding + Weather services (external integrations)
3. **Week 3**: Formatting utilities + Open-Meteo provider
4. **Week 4**: Custom hooks + remaining utilities

---

## Testing Infrastructure Improvements

### 1. Add Test Coverage Thresholds

Update `vitest.config.ts`:
```typescript
coverage: {
  provider: 'v8',
  thresholds: {
    lines: 60,      // Start modest, increase over time
    functions: 60,
    branches: 50,
    statements: 60,
  },
}
```

### 2. Add Mock Utilities

Create `src/test-utils/mocks.ts`:
```typescript
// Mock localStorage
export const mockLocalStorage = () => {
  const store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value }),
    removeItem: vi.fn((key: string) => { delete store[key] }),
    clear: vi.fn(() => { Object.keys(store).forEach(k => delete store[k]) }),
  };
};

// Mock fetch
export const mockFetch = (response: unknown, ok = true) => {
  return vi.fn().mockResolvedValue({
    ok,
    status: ok ? 200 : 500,
    json: () => Promise.resolve(response),
  });
};
```

### 3. Consider Integration Tests

Add tests that exercise multiple modules together:
- Location search → Weather fetch → Cache storage
- Settings change → Weather refetch with new unit

---

## Summary

| Priority | Module | Estimated Tests | Effort |
|----------|--------|-----------------|--------|
| P1 | Rate Limiting | 8-10 tests | Low |
| P1 | Storage Layer | 12-15 tests | Medium |
| P1 | Geocoding Service | 6-8 tests | Low |
| P2 | Weather Service | 4-6 tests | Low |
| P2 | Open-Meteo Provider | 8-10 tests | Medium |
| P2 | Format Utilities | 10-12 tests | Low |
| P3 | useLocalStorage Hook | 6-8 tests | Medium |
| P3 | Weather Codes | 3-4 tests | Low |

**Current Coverage**: ~35% of modules have unit tests
**Target Coverage**: 70-80% with above additions
**Total New Tests Needed**: ~60-75 tests

The most impactful improvements will be testing the rate limiting and storage layers, as these handle critical application state and security concerns.
