# Architecture Documentation

## Overview

The Weather Dashboard is built using modern web technologies with a focus on performance, maintainability, and user experience. This document outlines the architectural decisions, data flow, and component structure.

## Tech Stack

### Core Technologies

- **Next.js 16**: React framework with App Router for server-side rendering and static generation
- **TypeScript 5**: Type-safe development with full IntelliSense support
- **Tailwind CSS 4**: Utility-first CSS framework for rapid UI development
- **React 19**: Latest React with improved hooks and performance

### Supporting Libraries

- **Lucide React**: Modern icon library with tree-shaking support
- **date-fns**: Lightweight date manipulation and formatting
- **Zod**: Runtime type validation for API responses

## Architecture Patterns

### 1. Component Architecture

The application follows a layered component architecture:

```
Components (Presentation)
    ↓
Hooks (Logic & State)
    ↓
Services (Data Fetching)
    ↓
Storage (Persistence)
```

#### Component Layers

1. **UI Components** (`/components/ui`)
   - Pure presentational components
   - Reusable across the application
   - No business logic
   - Examples: Button, Card, Input

2. **Feature Components** (`/components/weather`, `/components/layout`)
   - Domain-specific components
   - Contain presentation logic
   - Consume hooks and services
   - Examples: CurrentWeatherCard, LocationSearch

3. **Page Components** (`/app`)
   - Top-level route components
   - Orchestrate feature components
   - Manage page-level state
   - Examples: Dashboard, Settings

### 2. Data Flow

```
User Action
    ↓
Component Event Handler
    ↓
Custom Hook / State Update
    ↓
Service Layer (API Call)
    ↓
Cache Check (localStorage)
    ↓
External API (Open-Meteo)
    ↓
Update State
    ↓
Re-render Components
```

### 3. State Management

The application uses a hybrid state management approach:

#### Local State (useState)
- Component-specific UI state
- Form inputs
- Modal visibility

#### localStorage State (useLocalStorage hook)
- Saved locations
- User settings
- Weather data cache

#### Advantages
- No external state management library needed
- Persistent across browser sessions
- Simple and performant

## Directory Structure

```
weather-app/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── layout.tsx              # Root layout (navigation, metadata)
│   │   ├── page.tsx                # Dashboard page
│   │   ├── settings/
│   │   │   └── page.tsx            # Settings page
│   │   └── globals.css             # Global styles
│   │
│   ├── components/
│   │   ├── layout/                 # Layout components
│   │   │   └── navigation.tsx      # App navigation bar
│   │   ├── ui/                     # Generic UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   └── input.tsx
│   │   └── weather/                # Weather-specific components
│   │       ├── current-weather-card.tsx
│   │       ├── hourly-forecast.tsx
│   │       ├── daily-forecast.tsx
│   │       ├── location-search.tsx
│   │       └── saved-locations.tsx
│   │
│   ├── hooks/                      # Custom React hooks
│   │   └── use-local-storage.ts    # localStorage hook with SSR safety
│   │
│   ├── lib/                        # Utility libraries
│   │   ├── demo-data.ts            # Demo location seeding
│   │   ├── format.ts               # Data formatting utilities
│   │   ├── storage.ts              # localStorage utilities
│   │   └── weather-codes.ts        # Weather code mappings
│   │
│   ├── services/                   # API services
│   │   ├── geocoding.ts            # Location search API
│   │   └── weather.ts              # Weather data API
│   │
│   └── types/                      # TypeScript definitions
│       └── weather.ts              # Weather data types
│
├── docs/                           # Documentation
│   └── ARCHITECTURE.md             # This file
│
└── public/                         # Static assets
```

## Key Design Decisions

### 1. Client-Side Rendering for Dashboard

**Decision**: Use `'use client'` directive for main pages

**Rationale**:
- Weather data is user-specific and dynamic
- localStorage access requires client-side code
- Better UX with instant updates
- No SEO requirements for authenticated pages

### 2. localStorage for Data Persistence

**Decision**: Use browser localStorage instead of a database

**Rationale**:
- No backend infrastructure needed
- Privacy-first approach (no server-side data)
- Fast access and updates
- Suitable for demo application
- Offline-capable

**Limitations**:
- Data not synced across devices
- 5-10MB storage limit per domain
- Cleared when user clears browser data

### 3. 10-Minute Cache Duration

**Decision**: Cache weather data for 10 minutes

**Rationale**:
- Balance between freshness and API usage
- Weather doesn't change significantly in 10 minutes
- Reduces unnecessary API calls
- Improves perceived performance

### 4. No Authentication

**Decision**: No user authentication system

**Rationale**:
- Simplifies deployment
- Reduces complexity
- Privacy-focused (no user data collection)
- Suitable for demo/personal use

## Data Models

### Location

```typescript
interface Location {
  id: string;              // Unique identifier (lat,lon)
  name: string;            // City name
  lat: number;             // Latitude
  lon: number;             // Longitude
  country: string;         // Country name
  admin1?: string;         // State/region
}
```

### Weather Data

```typescript
interface WeatherData {
  current: CurrentWeather;   // Current conditions
  hourly: HourlyForecast;    // 24h forecast
  daily: DailyForecast;      // 7-day forecast
}
```

### Cache Structure

```typescript
interface CacheEntry {
  data: WeatherData;
  timestamp: number;         // Unix timestamp
}
```

## API Integration

### Open-Meteo Geocoding API

**Endpoint**: `https://geocoding-api.open-meteo.com/v1/search`

**Request**:
```
GET /v1/search?name={city}&count=5&language=en&format=json
```

**Response**:
```json
{
  "results": [
    {
      "id": 2643743,
      "name": "London",
      "latitude": 51.5074,
      "longitude": -0.1278,
      "country": "United Kingdom",
      "admin1": "England"
    }
  ]
}
```

### Open-Meteo Forecast API

**Endpoint**: `https://api.open-meteo.com/v1/forecast`

**Request Parameters**:
- `latitude`, `longitude`: Location coordinates
- `current`: Current weather metrics
- `hourly`: Hourly forecast metrics
- `daily`: Daily forecast metrics
- `temperature_unit`: celsius or fahrenheit
- `timezone`: auto (uses location timezone)

**Response**: Complex JSON with time-series data

## Performance Optimizations

### 1. Code Splitting

- Automatic route-based code splitting via Next.js
- Dynamic imports for large components
- Tree-shaking for unused code

### 2. Caching Strategy

```
Request → Check localStorage cache
           ↓
        Valid?
       ↙     ↘
     Yes      No
      ↓        ↓
   Return   Fetch from API
   Cache       ↓
            Update Cache
               ↓
            Return Data
```

### 3. Debounced Search

Location search input is debounced (300ms) to reduce unnecessary API calls:

```typescript
useEffect(() => {
  const timeout = setTimeout(() => {
    searchLocations(query);
  }, 300);
  return () => clearTimeout(timeout);
}, [query]);
```

### 4. Optimistic UI Updates

- Immediate UI feedback on user actions
- Show loading states during API calls
- Graceful error handling

## Error Handling

### Network Errors

- Try-catch blocks around all API calls
- User-friendly error messages
- Maintain cached data on failure

### Data Validation

- TypeScript for compile-time type safety
- Runtime validation for API responses
- Default values for missing data

## Accessibility

- Semantic HTML elements
- ARIA labels for icon buttons
- Keyboard navigation support
- Focus management for modals/dropdowns
- Color contrast compliance

## Future Enhancements

### Potential Improvements

1. **Weather Alerts**: Add severe weather notifications
2. **Geolocation**: Auto-detect user location
3. **Charts**: Interactive temperature/precipitation charts
4. **PWA**: Add service worker for offline support
5. **Backend**: Optional backend for cross-device sync
6. **Weather Maps**: Integrate radar/satellite imagery
7. **Historical Data**: Show weather trends
8. **Multiple Languages**: i18n support

### Scalability Considerations

If scaling to support many users:

1. Add backend API with rate limiting
2. Implement user authentication
3. Use database for location storage
4. Add CDN for static assets
5. Implement server-side caching
6. Add analytics and monitoring

## Testing Strategy

### Recommended Tests

1. **Unit Tests**
   - Utility functions (format, weather codes)
   - Custom hooks
   - Service layer functions

2. **Integration Tests**
   - Component interactions
   - Data flow
   - API integration

3. **E2E Tests**
   - Critical user journeys
   - Location search and save
   - Settings persistence

### Testing Tools

- **Jest**: Unit testing
- **React Testing Library**: Component testing
- **Playwright**: E2E testing

## Deployment

### Vercel Deployment

The application is optimized for Vercel:

1. **Automatic Builds**: Push to main branch triggers deployment
2. **Preview Deployments**: PRs get preview URLs
3. **Edge Network**: Fast global CDN
4. **Zero Config**: Works out of the box

### Build Process

```bash
npm run build
```

Output:
- Static HTML/CSS/JS files
- Optimized images
- Minified bundles
- Source maps for debugging

## Security Considerations

### Current Security Measures

1. **No API Keys**: Public API with no authentication
2. **No User Data**: Everything stored locally
3. **HTTPS Only**: All API calls over HTTPS
4. **Input Sanitization**: Prevent XSS in search inputs
5. **CSP Headers**: Content Security Policy via Next.js

### Potential Vulnerabilities

1. **XSS**: Mitigated by React's auto-escaping
2. **CSRF**: Not applicable (no server-side state)
3. **localStorage Attacks**: Limited to same-origin

## Monitoring and Analytics

### Current Approach

- No analytics tracking (privacy-first)
- No error tracking service
- No performance monitoring

### Production Recommendations

1. **Error Tracking**: Sentry for error monitoring
2. **Analytics**: Privacy-friendly analytics (Plausible/Fathom)
3. **Performance**: Web Vitals tracking
4. **Logging**: Structured logging for debugging

## Conclusion

This architecture provides a solid foundation for a weather dashboard with room for growth. The modular structure allows for easy maintenance and feature additions while keeping the codebase clean and performant.
