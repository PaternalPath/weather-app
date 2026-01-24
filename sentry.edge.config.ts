import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // Performance monitoring sample rate
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Only enable in production or when DSN is configured
  enabled: !!process.env.SENTRY_DSN,

  // Set environment
  environment: process.env.NODE_ENV,
});
