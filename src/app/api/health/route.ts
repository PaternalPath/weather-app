import { NextResponse } from 'next/server';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  uptime: number;
  checks: {
    name: string;
    status: 'pass' | 'fail';
    duration_ms?: number;
    message?: string;
  }[];
}

const startTime = Date.now();

export async function GET() {
  const checks: HealthStatus['checks'] = [];

  // Check weather API connectivity
  const weatherCheckStart = Date.now();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=0&longitude=0&current=temperature_2m',
      { signal: controller.signal }
    );
    clearTimeout(timeout);

    checks.push({
      name: 'weather_api',
      status: response.ok ? 'pass' : 'fail',
      duration_ms: Date.now() - weatherCheckStart,
      message: response.ok ? undefined : `HTTP ${response.status}`,
    });
  } catch (error) {
    checks.push({
      name: 'weather_api',
      status: 'fail',
      duration_ms: Date.now() - weatherCheckStart,
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }

  const allPassed = checks.every((c) => c.status === 'pass');
  const anyFailed = checks.some((c) => c.status === 'fail');

  const health: HealthStatus = {
    status: allPassed ? 'healthy' : anyFailed ? 'degraded' : 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '0.1.0',
    uptime: Math.floor((Date.now() - startTime) / 1000),
    checks,
  };

  return NextResponse.json(health, {
    status: health.status === 'unhealthy' ? 503 : 200,
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}
