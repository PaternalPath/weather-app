# Weather Dashboard

A modern, responsive weather dashboard built with Next.js 16, TypeScript, and Tailwind CSS. Get accurate weather forecasts and current conditions powered by the Open-Meteo API.

![Weather Dashboard](https://img.shields.io/badge/Next.js-16.1.1-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css)

## Features

### Weather Data
- **Live Weather Data**: Current conditions, hourly forecasts (24h), and 7-day forecasts
- **Location Search**: Search and save multiple cities worldwide using geocoding
- **Smart Caching**: 10-minute localStorage cache to reduce API calls and improve performance
- **Demo Ready**: Pre-seeded with 3 example cities (London, New York, Tokyo)
- **Privacy First**: No API keys required, all data stored locally

### UI/UX
- **Modern Design**: Beautiful gradient cards with glassmorphism effects
- **Temperature Toggle**: Quick switch between Celsius and Fahrenheit in dashboard header
- **Responsive Layout**: Mobile-first design, works perfectly on 375px+ screens
- **Loading States**: Skeleton loaders for smooth loading experience
- **Error Handling**: User-friendly error messages with retry functionality
- **Empty States**: Helpful guidance when no location is selected
- **Smooth Animations**: Polished transitions and hover effects
- **Dark Mode**: Full dark mode support with automatic theme detection
- **Accessibility**: WCAG compliant with proper ARIA labels, focus states, and keyboard navigation

## Quick Start

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd weather-app

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

### Build for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

### Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Create production build
- `npm start` - Start production server
- `npm run lint` - Run ESLint to check code quality

## Open-Meteo API

This application uses the [Open-Meteo API](https://open-meteo.com/), a free weather API that doesn't require authentication.

### API Endpoints Used

1. **Geocoding API**: Search for locations by city name
   - Endpoint: `https://geocoding-api.open-meteo.com/v1/search`
   - Returns: City name, coordinates, country, and administrative region

2. **Forecast API**: Get weather data for specific coordinates
   - Endpoint: `https://api.open-meteo.com/v1/forecast`
   - Returns: Current weather, hourly forecasts, and daily forecasts

### Features from Open-Meteo

- Current temperature and weather conditions
- Feels-like temperature
- Wind speed and direction
- Humidity levels
- Precipitation data
- Weather codes with descriptions
- Hourly forecasts for the next 24 hours
- 7-day daily forecasts with min/max temperatures

## Deploy to Vercel

The easiest way to deploy your Weather Dashboard is using the Vercel Platform.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Deployment Steps

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import your repository to Vercel
3. Vercel will automatically detect Next.js and configure build settings
4. Click "Deploy"

Your dashboard will be live in under a minute!

### Environment Variables

No environment variables are required. The app uses Open-Meteo's free API which doesn't need authentication.

## Project Structure

```
weather-app/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx          # Root layout with navigation
│   │   ├── page.tsx            # Dashboard page
│   │   └── settings/           # Settings page
│   ├── components/             # React components
│   │   ├── layout/             # Layout components (navigation)
│   │   ├── ui/                 # Reusable UI components
│   │   └── weather/            # Weather-specific components
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utility functions
│   ├── services/               # API services
│   └── types/                  # TypeScript type definitions
├── docs/                       # Documentation
│   └── ARCHITECTURE.md         # Architecture documentation
└── public/                     # Static assets
```

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Validation**: Zod
- **Deployment**: Vercel-ready

## UI Components

The dashboard includes a comprehensive set of reusable UI components:

### Base Components
- **Card**: Elevated cards with hover effects and rounded corners
- **Button**: Multiple variants (primary, secondary, danger, ghost) with proper focus states
- **Input**: Form inputs with error states and accessibility features
- **Toggle**: Segmented control for switching between options (used for temperature units)

### Specialized Components
- **Skeleton**: Loading placeholders for weather cards and lists
- **Stat**: Metric display with icon, label, and value
- **ErrorState**: User-friendly error messages with retry functionality
- **EmptyState**: Helpful guidance when no data is available

### Weather Components
- **DashboardHeader**: Page header with temperature unit toggle
- **CurrentWeatherCard**: Hero card showing current conditions with gradient background
- **HourlyForecastCard**: Horizontal scrolling 24-hour forecast with fade edges
- **DailyForecastCard**: 7-day forecast list with precipitation probability
- **LocationSearch**: Autocomplete search with debouncing
- **SavedLocations**: Manage and switch between saved cities

All components are:
- ✅ Fully typed with TypeScript
- ✅ Accessible (ARIA labels, keyboard navigation)
- ✅ Responsive (mobile-first design)
- ✅ Dark mode compatible
- ✅ Properly focused (visible focus indicators)

## Data Storage & Privacy

All data is stored locally in your browser using localStorage:

- **Saved Locations**: Your favorite cities are saved in your browser
- **Settings**: Temperature unit preference stored locally
- **Weather Cache**: 10-minute cache to reduce API calls
- **No Tracking**: No analytics, no cookies, no external tracking
- **No Backend**: All data stays on your device

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Acknowledgments

- Weather data provided by [Open-Meteo](https://open-meteo.com/)
- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide](https://lucide.dev/)

---

**Note**: This is a demo application. Weather data accuracy depends on the Open-Meteo API service.
