import { z } from 'zod';

// Request schemas
export const WeatherRequestSchema = z.object({
  lat: z.coerce
    .number()
    .min(-90, 'Latitude must be between -90 and 90')
    .max(90, 'Latitude must be between -90 and 90'),
  lon: z.coerce
    .number()
    .min(-180, 'Longitude must be between -180 and 180')
    .max(180, 'Longitude must be between -180 and 180'),
  unit: z.enum(['celsius', 'fahrenheit']).default('celsius'),
});

export type WeatherRequest = z.infer<typeof WeatherRequestSchema>;

// Response schemas
export const CurrentWeatherSchema = z.object({
  temperature: z.number(),
  weatherCode: z.number().int().min(0).max(99),
  windSpeed: z.number().min(0),
  windDirection: z.number().min(0).max(360),
  humidity: z.number().min(0).max(100),
  apparentTemperature: z.number(),
  precipitation: z.number().min(0),
  time: z.string(),
});

export const HourlyForecastSchema = z.object({
  time: z.array(z.string()),
  temperature: z.array(z.number()),
  weatherCode: z.array(z.number().int().min(0).max(99)),
  precipitation: z.array(z.number().min(0)),
  humidity: z.array(z.number().min(0).max(100)),
});

export const DailyForecastSchema = z.object({
  time: z.array(z.string()),
  weatherCode: z.array(z.number().int().min(0).max(99)),
  temperatureMax: z.array(z.number()),
  temperatureMin: z.array(z.number()),
  precipitationSum: z.array(z.number().min(0)),
  precipitationProbability: z.array(z.number().min(0).max(100)),
});

export const WeatherDataSchema = z.object({
  current: CurrentWeatherSchema,
  hourly: HourlyForecastSchema,
  daily: DailyForecastSchema,
});

export type WeatherData = z.infer<typeof WeatherDataSchema>;

// Error response schema
export const WeatherErrorSchema = z.object({
  error: z.string(),
  code: z.enum(['INVALID_REQUEST', 'PROVIDER_ERROR', 'RATE_LIMITED', 'TIMEOUT']),
  details: z.string().optional(),
});

export type WeatherError = z.infer<typeof WeatherErrorSchema>;

// API response (either success or error)
export const WeatherResponseSchema = z.union([
  z.object({ success: z.literal(true), data: WeatherDataSchema }),
  z.object({ success: z.literal(false), error: WeatherErrorSchema }),
]);

export type WeatherResponse = z.infer<typeof WeatherResponseSchema>;
