# Architecture Documentation

## Overview

Weather Dashboard is a production-ready weather application built with Next.js 16 (App Router), TypeScript, and Tailwind CSS. This document describes the system architecture, data flow, and key design decisions.

## Tech Stack

| Category   | Technology                       |
| ---------- | -------------------------------- |
| Framework  | Next.js 16 (App Router)          |
| Language   | TypeScript 5                     |
| Styling    | Tailwind CSS 4                   |
| Validation | Zod                              |
| Testing    | Vitest (unit) + Playwright (E2E) |
| Icons      | Lucide React                     |
| Dates      | date-fns                         |

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          Browser                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │   UI Layer   │ -> │   Services   │ -> │ localStorage │      │
│  │  (React)     │    │  (fetch)     │    │   (cache)    │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
└────────────────────────────│────────────────────────────────────┘
                             │ HTTP GET /api/weather
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Next.js Server (Edge)                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   API Route Handler                       │  │
│  │  ┌──────────┐   ┌──────────┐   ┌──────────┐             │  │
│  │  │  Zod     │ ->│  Cache   │ ->│   Rate   │             │  │
│  │  │ Validate │   │  Check   │   │  Limit   │             │  │
│  │  └──────────┘   └──────────┘   └──────────┘             │  │
│  │                       │                                   │  │
│  │                       ▼                                   │  │
│  │  ┌──────────────────────────────────────────────────┐   │  │
│  │  │              Provider Adapter                      │   │  │
│  │  │  ┌────────────────┐    ┌────────────────┐        │   │  │
│  │  │  │  Open-Meteo    │ or │     Demo       │        │   │  │
│  │  │  │   Provider     │    │   Provider     │        │   │  │
│  │  │  └────────────────┘    └────────────────┘        │   │  │
│  │  └──────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼ (if using Open-Meteo)
┌─────────────────────────────────────────────────────────────────┐
│                    Open-Meteo API                                │
│  • Geocoding: https://geocoding-api.open-meteo.com/v1/search    │
│  • Forecast:  https://api.open-meteo.com/v1/forecast            │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### Weather Request Flow

```
User selects location
        │
        ▼
UI calls fetchWeather(lat, lon, unit)
        │
        ▼
Service sends GET /api/weather?lat=X&lon=Y&unit=Z
        │
        ▼
API Route: Validate with Zod
        │
        ├── Invalid → 400 { success: false, error: {...} }
        │
        ▼ (valid)
Check rate limit (30 req/min per IP)
        │
        ├── Exceeded → 429 { success: false, error: {...} }
        │
        ▼ (allowed)
Check server cache (5-min TTL)
        │
        ├── Cache HIT → Return cached data
        │
        ▼ (cache MISS)
Select provider (Open-Meteo or Demo)
        │
        ▼
Fetch from provider (10s timeout)
        │
        ├── Error → 502/504 { success: false, error: {...} }
        │
        ▼ (success)
Cache response, return to client
        │
        ▼
UI displays weather data
```

### Location Search Flow

```
User types in search box
        │
        ▼
Debounce (300ms)
        │
        ▼
Client calls Open-Meteo Geocoding API directly
        │
        ▼
Display search results
        │
        ▼
User selects location → Save to localStorage
```

## Key Components

### API Route (`/api/weather`)

The server-side API route handles all weather data requests:

| Feature        | Implementation                    |
| -------------- | --------------------------------- |
| Validation     | Zod schemas for request/response  |
| Caching        | In-memory Map with 5-min TTL      |
| Rate Limiting  | IP-based, 30 requests/minute      |
| Timeout        | 10 second abort on provider calls |
| Error Handling | Structured JSON errors with codes |

### Provider Pattern

```typescript
interface WeatherProvider {
  name: string;
  fetchWeather(options: WeatherProviderOptions): Promise<WeatherData>;
}
```

Two implementations:

- **OpenMeteoProvider** - Real weather data from Open-Meteo API
- **DemoProvider** - Deterministic data for testing (no network calls)

Provider selection:

```typescript
const provider = process.env.WEATHER_API_MODE === 'demo' ? demoProvider : openMeteoProvider;
```

### Zod Schemas

All data validated at runtime:

```typescript
// Request validation
WeatherRequestSchema.safeParse({ lat, lon, unit });

// Response validation
WeatherDataSchema.safeParse(providerResponse);
```

### Cache Strategy

| Location | Type          | TTL    | Purpose          |
| -------- | ------------- | ------ | ---------------- |
| Server   | In-memory Map | 5 min  | Reduce API calls |
| Client   | localStorage  | 10 min | Offline support  |

## Demo Mode

Demo mode provides stable, deterministic data for testing and demos.

### Activation

```bash
WEATHER_API_MODE=demo
```

### Supported Cities

| City     | Coordinates    | Weather Code      |
| -------- | -------------- | ----------------- |
| London   | 51.51, -0.13   | 3 (Overcast)      |
| New York | 40.71, -74.01  | 1 (Mainly clear)  |
| Tokyo    | 35.68, 139.65  | 2 (Partly cloudy) |
| Paris    | 48.86, 2.35    | 61 (Slight rain)  |
| Sydney   | -33.87, 151.21 | 0 (Clear sky)     |

Unknown coordinates return default data (weather code 1, temp 20°C).

### Why Demo Mode?

1. **Testing** - Deterministic data makes tests reliable
2. **Offline Development** - No network needed
3. **CI/CD** - Build without external dependencies
4. **Demos** - Consistent screenshots and presentations

## Directory Structure

```
weather-app/
├── src/
│   ├── app/
│   │   ├── api/weather/route.ts    # Server API
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Dashboard (client)
│   │   └── settings/page.tsx       # Settings (client)
│   ├── components/
│   │   ├── ui/                     # Generic UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   └── input.tsx
│   │   └── weather/                # Domain components
│   │       ├── current-weather-card.tsx
│   │       ├── hourly-forecast.tsx
│   │       ├── daily-forecast.tsx
│   │       └── location-search.tsx
│   ├── lib/
│   │   └── weather/
│   │       ├── schemas.ts          # Zod schemas
│   │       ├── provider.ts         # Provider interface
│   │       ├── cache.ts            # Server cache
│   │       ├── rate-limit.ts       # Rate limiter
│   │       └── providers/
│   │           ├── open-meteo.ts   # Real provider
│   │           └── demo.ts         # Demo provider
│   ├── services/
│   │   ├── weather.ts              # Client weather API
│   │   └── geocoding.ts            # Location search
│   └── types/
│       └── weather.ts              # TypeScript types
├── e2e/                            # Playwright E2E tests
├── docs/                           # Documentation
└── .github/workflows/              # CI/CD
```

## Error Handling

### Error Codes

| Code              | HTTP Status | Description        |
| ----------------- | ----------- | ------------------ |
| `INVALID_REQUEST` | 400         | Invalid parameters |
| `RATE_LIMITED`    | 429         | Too many requests  |
| `TIMEOUT`         | 504         | Provider timeout   |
| `PROVIDER_ERROR`  | 502         | Provider failure   |

### Error Response Format

```json
{
  "success": false,
  "error": {
    "error": "Too many requests",
    "code": "RATE_LIMITED",
    "details": "Rate limit exceeded. Try again in 45 seconds."
  }
}
```

## Security Considerations

1. **No API Keys Exposed** - Server-side provider calls
2. **Rate Limiting** - IP-based abuse protection
3. **Input Validation** - Zod schemas reject malformed requests
4. **No User Data Collection** - Privacy-first, localStorage only
5. **HTTPS Only** - All external API calls over HTTPS

## Performance

| Optimization     | Implementation                           |
| ---------------- | ---------------------------------------- |
| Server caching   | 5-min TTL reduces provider calls by ~90% |
| Client caching   | 10-min localStorage cache                |
| Debounced search | 300ms delay prevents excessive API calls |
| Code splitting   | Next.js automatic route-based splitting  |

## Testing Strategy

### Unit Tests (Vitest)

- Zod schema validation
- Provider implementations
- Cache behavior (TTL, eviction)

### E2E Tests (Playwright)

- Page loads correctly
- Search and select location
- Temperature unit toggle
- Error states display
- API route responses

Run tests:

```bash
npm test           # Unit tests
npm run test:e2e   # E2E tests
```

## Deployment

### Vercel (Recommended)

1. Connect GitHub repository
2. Auto-detected as Next.js
3. No environment variables required
4. Deploy

### Self-hosted

```bash
npm ci
npm run build
npm start
```

Requires Node.js 20+.

## Future Improvements

1. **Redis Cache** - Replace in-memory cache for multi-instance deployments
2. **Weather Alerts** - Push notifications for severe weather
3. **Geolocation** - Auto-detect user location
4. **PWA** - Service worker for offline support
5. **Multiple Providers** - Fallback between weather APIs
