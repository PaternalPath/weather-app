import { NextRequest, NextResponse } from 'next/server';
import {
  WeatherRequestSchema,
  type WeatherResponse,
  type WeatherError,
} from '@/lib/weather/schemas';
import { openMeteoProvider } from '@/lib/weather/providers/open-meteo';
import { demoProvider } from '@/lib/weather/providers/demo';
import { WeatherProviderError } from '@/lib/weather/provider';
import { getCacheKey, getFromCache, setInCache } from '@/lib/weather/cache';
import { checkRateLimit } from '@/lib/weather/rate-limit';

// Check if demo mode is enabled
// Demo mode is used when WEATHER_API_MODE=demo or when no specific mode is set
// Since we use Open-Meteo (no API key needed), we default to real provider
// But for testing/demo purposes, WEATHER_API_MODE=demo forces demo provider
function isDemoMode(): boolean {
  return process.env.WEATHER_API_MODE === 'demo';
}

function getClientIP(request: NextRequest): string {
  // Try various headers that might contain the real IP
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  // Fallback - not ideal but works for dev
  return 'unknown';
}

function createErrorResponse(error: WeatherError, status: number): NextResponse<WeatherResponse> {
  return NextResponse.json({ success: false, error } as WeatherResponse, {
    status,
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}

export async function GET(request: NextRequest): Promise<NextResponse<WeatherResponse>> {
  // Rate limiting
  const clientIP = getClientIP(request);
  const rateLimit = checkRateLimit(clientIP);

  if (!rateLimit.allowed) {
    return createErrorResponse(
      {
        error: 'Too many requests',
        code: 'RATE_LIMITED',
        details: `Rate limit exceeded. Try again in ${Math.ceil((rateLimit.resetAt - Date.now()) / 1000)} seconds.`,
      },
      429
    );
  }

  // Parse and validate query parameters
  const searchParams = request.nextUrl.searchParams;
  const rawParams = {
    lat: searchParams.get('lat'),
    lon: searchParams.get('lon'),
    unit: searchParams.get('unit') || 'celsius',
  };

  const parseResult = WeatherRequestSchema.safeParse(rawParams);

  if (!parseResult.success) {
    const errorMessages = parseResult.error.issues
      .map((e) => `${e.path.join('.')}: ${e.message}`)
      .join('; ');

    return createErrorResponse(
      {
        error: 'Invalid request parameters',
        code: 'INVALID_REQUEST',
        details: errorMessages,
      },
      400
    );
  }

  const { lat, lon, unit } = parseResult.data;

  // Check cache first
  const cacheKey = getCacheKey(lat, lon, unit);
  const cachedData = getFromCache(cacheKey);

  if (cachedData) {
    return NextResponse.json({ success: true, data: cachedData } as WeatherResponse, {
      headers: {
        'X-Cache': 'HIT',
        'X-RateLimit-Remaining': rateLimit.remaining.toString(),
        'Cache-Control': 'public, max-age=60',
      },
    });
  }

  // Select provider
  const provider = isDemoMode() ? demoProvider : openMeteoProvider;

  try {
    const data = await provider.fetchWeather({
      lat,
      lon,
      unit,
      timeout: 10000, // 10 second timeout
    });

    // Cache the result
    setInCache(cacheKey, data);

    return NextResponse.json({ success: true, data } as WeatherResponse, {
      headers: {
        'X-Cache': 'MISS',
        'X-Provider': provider.name,
        'X-RateLimit-Remaining': rateLimit.remaining.toString(),
        'Cache-Control': 'public, max-age=60',
      },
    });
  } catch (error) {
    if (error instanceof WeatherProviderError) {
      const status = error.code === 'RATE_LIMITED' ? 429 : error.code === 'TIMEOUT' ? 504 : 502;

      return createErrorResponse(
        {
          error: error.message,
          code: error.code,
          details: error.details,
        },
        status
      );
    }

    // Unexpected error
    console.error('Unexpected error in weather API:', error);

    return createErrorResponse(
      {
        error: 'An unexpected error occurred',
        code: 'PROVIDER_ERROR',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
}
