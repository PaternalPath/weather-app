import type { Metadata } from 'next';
import { Navigation } from '@/components/layout/navigation';
import './globals.css';

export const metadata: Metadata = {
  title: 'Weather Dashboard - Live Weather Forecasts',
  description:
    'Get accurate weather forecasts and current conditions powered by Open-Meteo API. Track multiple locations with hourly and 7-day forecasts.',
  keywords: ['weather', 'forecast', 'temperature', 'precipitation', 'open-meteo'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Navigation />
        {children}
      </body>
    </html>
  );
}
