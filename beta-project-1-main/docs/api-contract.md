# 🔌 API Contract

Detailed API integration specifications for the Weather Dashboard.

## Overview

The application integrates with multiple external APIs to provide weather data and location services:

1. **Weather API** - Real-time weather data and forecasts
2. **Geolocation API** - User's current location (browser)
3. **Location Search API** - Search for locations by name

## Weather API

### Base URL

```
https://api.openweathermap.org/data/2.5
https://api.openweathermap.org/data/3.0
```

### Authentication

Add your API key to environment variables:

```env
VITE_WEATHER_API_KEY=your_api_key_here
```

### Endpoints

#### 1. Current Weather

**Endpoint:** `/weather`

**Method:** `GET`

**Parameters:**

| Parameter | Type   | Required | Description                                         |
| --------- | ------ | -------- | --------------------------------------------------- |
| `lat`     | number | Yes      | Latitude                                            |
| `lon`     | number | Yes      | Longitude                                           |
| `appid`   | string | Yes      | API key                                             |
| `units`   | string | No       | `metric` (°C) or `imperial` (°F), default: `kelvin` |

**Request:**

```bash
GET https://api.openweathermap.org/data/2.5/weather?lat=40.7128&lon=-74.0060&appid=API_KEY&units=metric
```

**Response:**

```json
{
  "coord": {
    "lon": -74.006,
    "lat": 40.7128
  },
  "weather": [
    {
      "id": 800,
      "main": "Clear",
      "description": "clear sky",
      "icon": "01d"
    }
  ],
  "main": {
    "temp": 22.5,
    "feels_like": 21.8,
    "temp_min": 19.2,
    "temp_max": 25.1,
    "pressure": 1013,
    "humidity": 65
  },
  "visibility": 10000,
  "wind": {
    "speed": 4.5,
    "deg": 230
  },
  "clouds": {
    "all": 10
  },
  "dt": 1689234567,
  "sys": {
    "country": "US",
    "sunrise": 1689194567,
    "sunset": 1689248567
  },
  "timezone": -14400,
  "id": 5128581,
  "name": "New York",
  "cod": 200
}
```

#### 2. 5-Day Forecast

**Endpoint:** `/forecast`

**Method:** `GET`

**Parameters:**

| Parameter | Type   | Required | Description                            |
| --------- | ------ | -------- | -------------------------------------- |
| `lat`     | number | Yes      | Latitude                               |
| `lon`     | number | Yes      | Longitude                              |
| `appid`   | string | Yes      | API key                                |
| `units`   | string | No       | `metric` or `imperial`                 |
| `cnt`     | number | No       | Number of forecast items (default: 40) |

**Request:**

```bash
GET https://api.openweathermap.org/data/2.5/forecast?lat=40.7128&lon=-74.0060&appid=API_KEY&units=metric&cnt=40
```

**Response:**

```json
{
  "cod": "200",
  "message": 0,
  "cnt": 40,
  "list": [
    {
      "dt": 1689234567,
      "main": {
        "temp": 22.5,
        "feels_like": 21.8,
        "temp_min": 19.2,
        "temp_max": 25.1,
        "pressure": 1013,
        "humidity": 65
      },
      "weather": [
        {
          "id": 800,
          "main": "Clear",
          "description": "clear sky",
          "icon": "01d"
        }
      ],
      "clouds": {
        "all": 10
      },
      "wind": {
        "speed": 4.5,
        "deg": 230
      },
      "visibility": 10000,
      "pop": 0.1,
      "sys": {
        "pod": "d"
      }
    }
    // ... more forecasts
  ],
  "city": {
    "id": 5128581,
    "name": "New York",
    "coord": {
      "lat": 40.7128,
      "lon": -74.006
    },
    "country": "US",
    "population": 8000000,
    "timezone": -14400,
    "sunrise": 1689194567,
    "sunset": 1689248567
  }
}
```

#### 3. Search by City Name

**Endpoint:** `/find`

**Method:** `GET`

**Parameters:**

| Parameter | Type   | Required | Description            |
| --------- | ------ | -------- | ---------------------- |
| `q`       | string | Yes      | City name              |
| `appid`   | string | Yes      | API key                |
| `units`   | string | No       | `metric` or `imperial` |

**Request:**

```bash
GET https://api.openweathermap.org/data/2.5/find?q=London&appid=API_KEY&units=metric
```

**Response:**

```json
{
  "message": "",
  "cod": "200",
  "count": 1,
  "list": [
    {
      "id": 2643743,
      "name": "London",
      "coord": {
        "lat": 51.5085,
        "lon": -0.1257
      },
      "main": {
        "temp": 18.5,
        "feels_like": 17.9
      },
      "weather": [
        {
          "id": 801,
          "main": "Clouds",
          "description": "few clouds",
          "icon": "02d"
        }
      ],
      "wind": {
        "speed": 3.2,
        "deg": 180
      },
      "clouds": {
        "all": 20
      },
      "country": "GB",
      "sys": {
        "sunrise": 1689194567,
        "sunset": 1689248567
      }
    }
  ]
}
```

### Error Responses

```json
{
  "cod": "404",
  "message": "city not found"
}
```

**HTTP Status Codes:**

| Code | Meaning                        |
| ---- | ------------------------------ |
| 200  | OK                             |
| 400  | Bad Request                    |
| 401  | Unauthorized (invalid API key) |
| 404  | Not Found                      |
| 429  | Too Many Requests (rate limit) |
| 500  | Server Error                   |

## Geolocation API (Browser)

### Get Current Position

**Method:** `navigator.geolocation.getCurrentPosition()`

**JavaScript:**

```javascript
navigator.geolocation.getCurrentPosition(
  (position) => {
    const { latitude, longitude } = position.coords;
    console.log(`Lat: ${latitude}, Lon: ${longitude}`);
  },
  (error) => {
    console.error("Geolocation error:", error);
  },
);
```

**Response:**

```javascript
{
  coords: {
    latitude: 40.7128,
    longitude: -74.0060,
    altitude: null,
    accuracy: 50,
    altitudeAccuracy: null,
    heading: null,
    speed: null
  },
  timestamp: 1689234567000
}
```

**Error Codes:**

| Code | Message              |
| ---- | -------------------- |
| 1    | PERMISSION_DENIED    |
| 2    | POSITION_UNAVAILABLE |
| 3    | TIMEOUT              |

## Location API Integration

### Service Implementation

```typescript
// src/services/locationApi.ts

export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export interface LocationData {
  name: string;
  country: string;
  state?: string;
  latitude: number;
  longitude: number;
}

// Get current user location
export async function getCurrentLocation(): Promise<LocationCoords> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(new Error(`Geolocation error: ${error.message}`));
      },
    );
  });
}

// Get location data from coordinates
export async function getLocationByCoordinates(
  latitude: number,
  longitude: number,
): Promise<LocationData> {
  // Use reverse geocoding API or OpenWeather API
  const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&appid=${import.meta.env.VITE_WEATHER_API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();

  return {
    name: data[0].name,
    country: data[0].country,
    state: data[0].state,
    latitude,
    longitude,
  };
}

// Search locations by name
export async function searchLocations(query: string): Promise<LocationData[]> {
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&appid=${import.meta.env.VITE_WEATHER_API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();

  return data.map((location: any) => ({
    name: location.name,
    country: location.country,
    state: location.state,
    latitude: location.lat,
    longitude: location.lon,
  }));
}
```

## Rate Limiting

**OpenWeather API Limits:**

- Free tier: 1,000 calls/day
- Professional: 60 calls/minute
- Check `X-RateLimit-*` headers in response

**Best Practices:**

1. Cache API responses
2. Avoid redundant calls
3. Implement request debouncing
4. Use background refresh for updates

## Error Handling

### Common Errors

```typescript
// Invalid API key
{
  "cod": 401,
  "message": "Invalid API key. Please see http://openweathermap.org/faq#error401 for more info."
}

// Rate limit exceeded
HTTP 429 Too Many Requests

// Geolocation permission denied
{
  "code": 1,
  "message": "User denied geolocation"
}
```

### Handling Errors

```typescript
try {
  const weather = await weatherApi.getWeather(lat, lon);
} catch (error) {
  if (error instanceof TypeError) {
    // Network error
    console.error("Network error");
  } else if (error.message.includes("429")) {
    // Rate limit
    console.error("Too many requests");
  } else {
    // Other error
    console.error("API error:", error.message);
  }
}
```

## Caching Strategy

### Cache Current Weather

```typescript
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

interface CachedWeather {
  data: Weather;
  timestamp: number;
}

const weatherCache: Record<string, CachedWeather> = {};

export async function getCachedWeather(
  lat: number,
  lon: number,
): Promise<Weather> {
  const key = `${lat},${lon}`;
  const cached = weatherCache[key];

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  const data = await getWeather(lat, lon);
  weatherCache[key] = { data, timestamp: Date.now() };
  return data;
}
```

## Type Definitions

```typescript
// types/weather.ts

export interface Weather {
  coord: {
    lon: number;
    lat: number;
  };
  weather: WeatherCondition[];
  main: MainWeatherData;
  visibility: number;
  wind: Wind;
  clouds: { all: number };
  dt: number;
  sys: SystemData;
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface MainWeatherData {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
}

export interface Wind {
  speed: number;
  deg: number;
  gust?: number;
}

export interface SystemData {
  country: string;
  sunrise: number;
  sunset: number;
}

export interface Forecast {
  cod: string;
  message: number;
  cnt: number;
  list: ForecastItem[];
  city: CityData;
}

export interface ForecastItem {
  dt: number;
  main: MainWeatherData;
  weather: WeatherCondition[];
  clouds: { all: number };
  wind: Wind;
  visibility: number;
  pop: number;
  sys: { pod: string };
}

export interface CityData {
  id: number;
  name: string;
  coord: { lat: number; lon: number };
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;
}
```

## Testing API Calls

### Mock API Response

```typescript
// __mocks__/weatherApi.ts
export const mockWeather = {
  coord: { lon: -74.006, lat: 40.7128 },
  weather: [{ id: 800, main: "Clear", description: "clear sky", icon: "01d" }],
  main: {
    temp: 22.5,
    feels_like: 21.8,
    temp_min: 19.2,
    temp_max: 25.1,
    pressure: 1013,
    humidity: 65,
  },
  wind: { speed: 4.5, deg: 230 },
  name: "New York",
};

export const getWeather = jest.fn().mockResolvedValue(mockWeather);
```

---

For implementation details, see [Frontend Guidelines](frontend-guidelines.md)
