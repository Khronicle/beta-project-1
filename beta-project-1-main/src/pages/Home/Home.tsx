import { useState } from 'react';
import SearchBar from '../../components/common/SearchBar';
import CurrentCard from '../../components/weather/CurrentCard';
import ForecastList from '../../components/weather/ForecastList';
import { getWeather, getWeatherByCoordinates } from '../../services/weatherApi';
import { getCurrentLocation } from '../../services/locationApi';
import type { Location, WeatherData } from '../../types/weather';

const Home = () => {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadWeather = async (location: Location) => {
    setLoading(true);
    setError(null);
    try {
      setData(await getWeather(location));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load weather.');
    } finally {
      setLoading(false);
    }
  };

  const useMyLocation = async () => {
    setLoading(true);
    setError(null);
    try {
      const coords = await getCurrentLocation();
      setData(await getWeatherByCoordinates(coords));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not get your location.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Weather Dashboard</h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Search a city or use your location to see current conditions and the forecast.
        </p>
      </header>

      <div className="flex justify-center">
        <SearchBar onSelect={loadWeather} onUseLocation={useMyLocation} loading={loading} />
      </div>

      {loading && <p className="text-center text-slate-500">Loading weather…</p>}
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
          No location selected yet.
        </div>
      )}
    </div>
  );
};

export default Home;
