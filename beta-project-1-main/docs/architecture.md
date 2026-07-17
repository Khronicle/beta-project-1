# 🏗️ Architecture Guide

Overview of the Weather Dashboard application architecture and design patterns.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     React Application                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Pages (Route Components)                │  │
│  │  ┌─────────────┬──────────────┬─────────┬──────────┐ │  │
│  │  │    Home     │   Forecast   │  About  │ NotFound │ │  │
│  │  └──────┬──────┴──────┬───────┴────┬────┴────┬─────┘ │  │
│  └─────────┼─────────────┼────────────┼────────┼────────┘  │
│            │             │            │        │           │
│  ┌─────────┴─────────────┴────────────┴────────┴────────┐  │
│  │          Layout (Navbar, Footer, Main)             │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │        Reusable Components                     │  │  │
│  │  │  ├─ Common/  (Button, Card, Input)            │  │  │
│  │  │  ├─ Weather/ (CurrentWeather, WeatherCard)    │  │  │
│  │  │  ├─ Alerts/  (AlertBanner, AlertModal)        │  │  │
│  │  │  └─ Layout/  (Navbar, Footer, Sidebar)        │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │                       │                               │  │
│  │  ┌────────────────────┴────────────────────────────┐  │  │
│  │  │       React Context (Global State)             │  │  │
│  │  │  ├─ WeatherContext (current weather)           │  │  │
│  │  │  ├─ LocationContext (user location)            │  │  │
│  │  │  └─ SettingsContext (user preferences)         │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │                       │                               │  │
│  │  ┌────────────────────┴────────────────────────────┐  │  │
│  │  │       Custom Hooks                             │  │  │
│  │  │  ├─ useWeather() - fetch weather data          │  │  │
│  │  │  ├─ useLocation() - manage location            │  │  │
│  │  │  ├─ useForecast() - fetch forecast data        │  │  │
│  │  │  └─ useGeolocation() - get user position       │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │                       │                               │  │
│  │  ┌────────────────────┴────────────────────────────┐  │  │
│  │  │       Services (API Integration)               │  │  │
│  │  │  ├─ weatherApi.js (fetch weather)              │  │  │
│  │  │  └─ locationApi.js (find locations)            │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │                       │                               │  │
│  │  ┌────────────────────┴────────────────────────────┐  │  │
│  │  │       External APIs                            │  │  │
│  │  │  ├─ Weather API (OpenWeatherMap, etc.)         │  │  │
│  │  │  ├─ Geolocation API (browser)                  │  │  │
│  │  │  └─ Reverse Geocoding (location names)         │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
src/
├── app/                      # Application configuration
│   ├── store.ts             # Redux/Context store setup
│   └── config.ts            # App configuration
│
├── components/              # React components
│   ├── common/              # Reusable UI components
│   │   ├── Button.tsx       # Button component
│   │   ├── Card.tsx         # Card component
│   │   └── Input.tsx        # Input component
│   │
│   ├── weather/             # Weather-related components
│   │   ├── CurrentWeather.tsx
│   │   ├── WeatherCard.tsx
│   │   └── WeatherDetails.tsx
│   │
│   ├── alerts/              # Alert components
│   │   ├── AlertBanner.tsx
│   │   └── AlertModal.tsx
│   │
│   └── layout/              # Layout components
│       ├── Navbar.tsx       # Navigation bar
│       ├── Footer.tsx       # Footer
│       └── pages.tsx        # Layout wrapper
│
├── pages/                   # Page components (routes)
│   ├── Home/
│   │   └── Home.tsx
│   ├── Forecast/
│   │   └── Forecast.tsx
│   ├── About/
│   │   └── About.tsx
│   └── NotFound/
│       └── NotFound.tsx
│
├── hooks/                   # Custom React hooks
│   ├── useWeather.ts
│   ├── useLocation.ts
│   ├── useForecast.ts
│   └── useGeolocation.ts
│
├── services/                # API services
│   ├── weatherApi.js        # Weather API calls
│   └── locationApi.js       # Location API calls
│
├── context/                 # React Context
│   ├── WeatherContext.tsx
│   ├── LocationContext.tsx
│   └── SettingsContext.tsx
│
├── types/                   # TypeScript type definitions
│   ├── weather.ts
│   ├── location.ts
│   └── api.ts
│
├── utils/                   # Utility functions
│   ├── formatters.ts        # Data formatting
│   ├── validators.ts        # Input validation
│   └── helpers.ts           # Helper functions
│
├── styles/                  # Global styles
│   └── globals.css          # Global CSS
│
├── assets/                  # Static assets
│   ├── images/
│   └── icons/
│
├── App.tsx                  # Root component
├── main.tsx                 # Application entry point
└── index.css               # Index styles
```

## Data Flow

### 1. Component State Management

```
User Action
    ↓
Component State Update
    ↓
Context Update (if needed)
    ↓
Service API Call
    ↓
Update Global State
    ↓
Component Re-render
```

### 2. API Data Flow

```
Component/Hook
    ↓
Custom Hook (useWeather)
    ↓
Service Layer (weatherApi.js)
    ↓
External API (Weather API)
    ↓
Format Response
    ↓
Update Context
    ↓
Component Receives Data
```

## Component Hierarchy

```
App.tsx
├── Layout (pages.tsx)
│   ├── Navbar
│   ├── Main Content
│   │   └── Router
│   │       ├── Home Page
│   │       │   ├── SearchBar
│   │       │   ├── CurrentWeather
│   │       │   └── WeatherCard[]
│   │       ├── Forecast Page
│   │       │   └── ForecastCard[]
│   │       ├── About Page
│   │       └── 404 Page
│   └── Footer
└── Global Providers
    ├── WeatherProvider
    ├── LocationProvider
    └── SettingsProvider
```

## State Management Strategy

### Context API Implementation

We use React Context for global state:

```typescript
// WeatherContext
- currentWeather: Weather
- forecast: Forecast[]
- loading: boolean
- error: string | null
- setWeather: (weather: Weather) => void

// LocationContext
- currentLocation: Location
- searchedLocations: Location[]
- loading: boolean
- setLocation: (location: Location) => void

// SettingsContext
- theme: 'light' | 'dark'
- units: 'metric' | 'imperial'
- updateSettings: (settings: Settings) => void
```

## API Service Layer

### weatherApi.js

```typescript
export async function getWeather(latitude, longitude);
export async function getForecast(latitude, longitude, days);
export async function getWeatherByCity(city);
```

### locationApi.js

```typescript
export async function getLocationByCoordinates(lat, lon);
export async function getLocationBySearch(query);
export async function getCurrentLocation();
```

## Key Design Patterns

### 1. **Custom Hooks Pattern**

Encapsulate logic in custom hooks for reusability:

```typescript
const useWeather = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchWeather = async (lat, lon) => {
    setLoading(true);
    const data = await weatherApi.getWeather(lat, lon);
    setWeather(data);
    setLoading(false);
  };

  return { weather, loading, fetchWeather };
};
```

### 2. **Context Provider Pattern**

Global state management with Context:

```typescript
<WeatherProvider>
  <LocationProvider>
    <SettingsProvider>
      <App />
    </SettingsProvider>
  </LocationProvider>
</WeatherProvider>
```

### 3. **Composition Pattern**

Build complex UIs from small components:

```typescript
<Page>
  <Header />
  <SearchBar />
  <CurrentWeather />
  <ForecastList>
    <ForecastCard />
    <ForecastCard />
    <ForecastCard />
  </ForecastList>
</Page>
```

## Performance Optimization

### 1. Code Splitting

Routes are lazy-loaded:

```typescript
const Home = lazy(() => import("./pages/Home"));
const Forecast = lazy(() => import("./pages/Forecast"));
```

### 2. Memoization

Prevent unnecessary re-renders:

```typescript
const WeatherCard = memo(({ data }) => {...});
```

### 3. Data Caching

Cache API responses in Context to avoid redundant calls.

## Error Handling

1. **API Errors** - Handled in service layer with try-catch
2. **Component Errors** - Use Error Boundaries
3. **User Errors** - Display friendly error messages

```typescript
try {
  const data = await weatherApi.getWeather(lat, lon);
} catch (error) {
  console.error("Weather API Error:", error);
  // Display error message to user
}
```

## Deployment Architecture

```
┌─────────────────┐
│   GitHub Repo   │
└────────┬────────┘
         │
    (Push/PR)
         │
    ┌────┴─────┐
    │           │
┌───┴──┐   ┌───┴──┐
│ CI/CD │   │ Lint │
└───┬──┘   └───┬──┘
    │           │
    └─────┬─────┘
          │
    ┌─────┴──────┐
    │   Build    │
    │ Production │
    └─────┬──────┘
          │
    ┌─────┴──────┐
    │   Deploy   │
    │   Server   │
    └────────────┘
```

## Security Considerations

1. **API Keys** - Store in environment variables
2. **CORS** - Configure on backend API
3. **Input Validation** - Validate all user inputs
4. **HTTPS** - Always use HTTPS in production
5. **CSP Headers** - Content Security Policy

## Future Improvements

- [ ] Add Redux for complex state management
- [ ] Implement service workers for offline support
- [ ] Add unit and integration tests
- [ ] Implement error boundaries
- [ ] Add analytics tracking
- [ ] Implement caching strategies
- [ ] Add PWA capabilities

---

For more details, see [Frontend Guidelines](frontend-guidelines.md)
