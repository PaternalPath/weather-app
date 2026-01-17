import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import { WeatherResponseSchema } from '@/lib/weather/schemas';
import { GET } from '../route';

describe('GET /api/weather (demo mode)', () => {
  const originalEnv = process.env.WEATHER_API_MODE;

  beforeEach(() => {
    process.env.WEATHER_API_MODE = 'demo';
  });

  afterEach(() => {
    if (originalEnv === undefined) {
      delete process.env.WEATHER_API_MODE;
    } else {
      process.env.WEATHER_API_MODE = originalEnv;
    }
  });

  it('returns a successful response with a stable data shape', async () => {
    const request = new NextRequest(
      'http://localhost/api/weather?lat=51.5074&lon=-0.1278&unit=celsius'
    );

    const response = await GET(request);
    const contentType = response.headers.get('content-type');
    const payload = await response.json();
    const parsed = WeatherResponseSchema.safeParse(payload);

    expect(response.status).toBe(200);
    expect(contentType).toContain('application/json');
    expect(parsed.success).toBe(true);
    expect(payload.success).toBe(true);
    expect(payload.data).toHaveProperty('current');
    expect(payload.data).toHaveProperty('hourly');
    expect(payload.data).toHaveProperty('daily');
  });
});
