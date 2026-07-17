import type {
  Coordinates,
  CurrentWeather,
  DailyForecast,
  Location,
  WeatherData,
} from '../types/weather';

interface OpenMeteoCurrent {
  temperature_2m: number;
  apparent_temperature: number;
  relative_humidity_2m: number;
  is_day: number;
  weather_code: number;
  wind_speed_10m: number;
  time: string;
}

interface OpenMeteoDaily {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
}

const mapDaily = (daily: OpenMeteoDaily): DailyForecast[] =>
  daily.time.map((date, i) => ({
    date,
    code: daily.weather_code[i],
    temperatureMax: daily.temperature_2m_max[i],
    temperatureMin: daily.temperature_2m_min[i],
  }));

export const getWeather = async (
  location: Location,
  forecastDays = 7,
): Promise<WeatherData> => {
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', String(location.latitude));
  url.searchParams.set('longitude', String(location.longitude));
  url.searchParams.set('current', [
    'temperature_2m',
    'apparent_temperature',
    'relative_humidity_2m',
    'is_day',
    'weather_code',
    'wind_speed_10m',
  ].join(','));
  url.searchParams.set('daily', [
    'weather_code',
    'temperature_2m_max',
    'temperature_2m_min',
  ].join(','));
  url.searchParams.set('timezone', 'auto');
  url.searchParams.set('forecast_days', String(forecastDays));

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Weather fetch failed: ${response.status}`);
  }

  const data = (await response.json()) as {
    current: OpenMeteoCurrent;
    daily: OpenMeteoDaily;
  };

  const current: CurrentWeather = {
    temperature: data.current.temperature_2m,
    apparentTemperature: data.current.apparent_temperature,
    humidity: data.current.relative_humidity_2m,
    windSpeed: data.current.wind_speed_10m,
    weatherCode: data.current.weather_code,
    isDay: data.current.is_day === 1,
    time: data.current.time,
  };

  return {
    location,
    current,
    daily: mapDaily(data.daily),
  };
};

export const getWeatherByCoordinates = async (
  coords: Coordinates,
  forecastDays = 7,
): Promise<WeatherData> => {
  const location: Location = {
    name: 'Your location',
    country: '',
    latitude: coords.latitude,
    longitude: coords.longitude,
  };
  return getWeather(location, forecastDays);
};
