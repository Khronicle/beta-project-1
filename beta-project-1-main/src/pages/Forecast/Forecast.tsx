import { useState } from 'react';
import SearchBar from '../../components/common/SearchBar';
import ForecastList from '../../components/weather/ForecastList';
import CurrentCard from '../../components/weather/CurrentCard';
import { getWeather, getWeatherByCoordinates } from '../../services/weatherApi';
import { getCurrentLocation } from '../../services/locationApi';
import { addRecentForecast } from '../../services/recentForecasts';
import { useAuth } from '../../context/AuthContext';
import type { Location, WeatherData } from '../../types/weather';

type ForecastRange = 7 | 14;

const Forecast = () => {
  const { currentUser } = useAuth();
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState<ForecastRange>(7);

  const handleResult = (result: WeatherData) => {
    setData(result);
    if (currentUser) {
      addRecentForecast(currentUser.id, result);
    }
  };

  const loadWeather = async (location: Location) => {
    setLoading(true);
    setError(null);
    try {
      handleResult(await getWeather(location, 14));
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
      handleResult(await getWeatherByCoordinates(coords, 14));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not get your location.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Forecast</h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Search a city or use your location to see current conditions and the forecast.
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

          <div className="flex justify-center gap-2">
            <button
              type="button"
              onClick={() => setRange(7)}
              className={`rounded-lg px-4 py-2 font-semibold transition-colors ${
                range === 7
                  ? 'bg-emerald-700 text-white'
                  : 'border border-slate-300/60 text-slate-600 hover:bg-white/40 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10'
              }`}
            >
              7-Day Forecast
            </button>
            <button
              type="button"
              onClick={() => setRange(14)}
              className={`rounded-lg px-4 py-2 font-semibold transition-colors ${
                range === 14
                  ? 'bg-emerald-700 text-white'
                  : 'border border-slate-300/60 text-slate-600 hover:bg-white/40 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10'
              }`}
            >
              14-Day Forecast
            </button>
          </div>

          <ForecastList days={data.daily.slice(0, range)} />
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
