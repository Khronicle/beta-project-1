import SearchBar from '../../components/common/SearchBar';
import ForecastList from '../../components/weather/ForecastList';
import CurrentCard from '../../components/weather/CurrentCard';
import { getWeather, getWeatherByCoordinates } from '../../services/weatherApi';
import { getCurrentLocation } from '../../services/locationApi';
import type { Location, WeatherData } from '../../types/weather';
import { useState } from 'react';

const Forecast = () => {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadWeather = async (location: Location) => {
    setLoading(true);
    setError(null);
    try {
      setData(await getWeather(location, 14));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load forecast.');
    } finally {
      setLoading(false);
    }
  };

  const useMyLocation = async () => {
    setLoading(true);
    setError(null);
    try {
      const coords = await getCurrentLocation();
      setData(await getWeatherByCoordinates(coords, 14));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not get your location.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">14-Day Forecast</h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Pick a location to view the extended outlook.
        </p>
      </header>

      <div className="flex justify-center">
        <SearchBar onSelect={loadWeather} onUseLocation={useMyLocation} loading={loading} />
      </div>

      {loading && <p className="text-center text-slate-500">Loading forecast…</p>}
      {error && (
        <p className="rounded-lg bg-rose-50 px-4 py-3 text-center text-rose-600 dark:bg-rose-950/40">
          {error}
        </p>
      )}

      {data && !loading && (
        <div className="flex flex-col gap-6">
          <CurrentCard data={data} />
          <ForecastList days={data.daily} />
        </div>
      )}

      {!data && !loading && !error && (
        <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-400 dark:border-slate-700">
          Select a location to see the forecast.
        </div>
      )}
    </div>
  );
};

export default Forecast;
