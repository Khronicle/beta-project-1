import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import CurrentCard from '../../components/weather/CurrentCard';
import { getWeather } from '../../services/weatherApi';
import type { Location, WeatherData } from '../../types/weather';

const SAMPLE_LOCATION: Location = {
  name: 'Accra',
  country: 'Ghana',
  latitude: 5.6037,
  longitude: -0.187,
};

const HOW_IT_WORKS = [
  {
    step: '1',
    title: 'Create your free account',
    description: 'Sign up with a few details and you are ready to go — every new account starts as a standard user.',
  },
  {
    step: '2',
    title: 'Search any location',
    description: 'Look up a city by name or use your current location once you are logged in.',
  },
  {
    step: '3',
    title: 'View 7-day or 14-day forecasts',
    description: 'Switch between a short-range and extended outlook right from the forecast page.',
  },
  {
    step: '4',
    title: 'Track your history',
    description: 'Your dashboard keeps a list of the locations you checked most recently.',
  },
];

const TRUSTED_SOURCES = [
  'Ghana Meteorological Agency',
  'World Meteorological Organization',
  'UK Met Office',
  'National Weather Service (NOAA)',
  'European Centre for Medium-Range Weather Forecasts',
];

const Home = () => {
  const { currentUser } = useAuth();
  const [sampleWeather, setSampleWeather] = useState<WeatherData | null>(null);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getWeather(SAMPLE_LOCATION)
      .then((result) => {
        if (!cancelled) setSampleWeather(result);
      })
      .catch((err) => {
        if (!cancelled) {
          setWeatherError(err instanceof Error ? err.message : 'Failed to load weather.');
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex flex-col gap-16">
      <section className="text-center">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white sm:text-5xl">
          Weather Guard
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-500 dark:text-slate-400">
          Reliable current conditions and multi-day forecasts for any location in the world,
          with an account that remembers what you've checked.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {currentUser ? (
            <>
              <Link
                to="/forecast"
                className="rounded-lg bg-emerald-700 px-6 py-3 font-semibold text-white transition-colors hover:bg-emerald-600"
              >
                Go to Forecast
              </Link>
              <Link
                to="/dashboard"
                className="rounded-lg border border-emerald-700/40 px-6 py-3 font-semibold text-slate-700 transition-colors hover:bg-emerald-50 dark:border-emerald-400/30 dark:text-slate-200 dark:hover:bg-emerald-950/40"
              >
                My Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/signup"
                className="rounded-lg bg-emerald-700 px-6 py-3 font-semibold text-white transition-colors hover:bg-emerald-600"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="rounded-lg border border-emerald-700/40 px-6 py-3 font-semibold text-slate-700 transition-colors hover:bg-emerald-50 dark:border-emerald-400/30 dark:text-slate-200 dark:hover:bg-emerald-950/40"
              >
                Log in
              </Link>
            </>
          )}
        </div>

        <div className="mx-auto mt-8 max-w-xl">
          {weatherError && (
            <p className="rounded-lg bg-rose-50 px-4 py-3 text-center text-sm text-rose-600 dark:bg-rose-950/40">
              {weatherError}
            </p>
          )}
          {sampleWeather && !weatherError && (
            <div className="flex flex-col gap-2">
              <CurrentCard data={sampleWeather} />
              <p className="text-center text-xs text-slate-400 dark:text-slate-500">
                Live sample. Sign up to search any location and save your forecast history.
              </p>
            </div>
          )}
          {!sampleWeather && !weatherError && (
            <p className="text-center text-sm text-slate-400">Loading a live sample…</p>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-center text-2xl font-bold text-slate-900 dark:text-white">
          How it works
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {HOW_IT_WORKS.map((item) => (
            <div key={item.step} className="glass-panel rounded-2xl p-5 shadow-sm">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-700 font-bold text-white">
                {item.step}
              </span>
              <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">{item.title}</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-center text-2xl font-bold text-slate-900 dark:text-white">
          Trusted weather data sources
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-sm text-slate-500 dark:text-slate-400">
          Sample of the meteorological organizations Weather Guard's forecasting approach is
          inspired by. Shown for illustration only — not a claim of formal partnership.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          {TRUSTED_SOURCES.map((name) => (
            <span
              key={name}
              className="glass-panel rounded-full px-5 py-2.5 text-sm font-medium text-slate-600 shadow-sm dark:text-slate-300"
            >
              {name}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
