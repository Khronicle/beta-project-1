import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getRecentForecasts } from '../../services/recentForecasts';
import { describeWeather } from '../../types/weather';

const formatViewedAt = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

const Dashboard = () => {
  const { currentUser } = useAuth();
  const recent = currentUser ? getRecentForecasts(currentUser.id) : [];

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Welcome back, {currentUser?.firstName}
        </h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Here's a quick look at the locations you've checked recently.
        </p>
      </header>

      {recent.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-400 dark:border-slate-700">
          You haven't looked up a forecast yet.{' '}
          <Link to="/forecast" className="font-medium text-emerald-700 hover:text-emerald-600 dark:text-emerald-400">
            Search a location
          </Link>{' '}
          to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recent.map((entry) => {
            const { icon, label } = describeWeather(entry.weatherCode);
            return (
              <div
                key={`${entry.locationName}-${entry.country}`}
                className="glass-panel rounded-2xl p-5 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {entry.locationName}
                    </h3>
                    {entry.country && (
                      <p className="text-sm text-slate-500 dark:text-slate-400">{entry.country}</p>
                    )}
                  </div>
                  <span className="text-3xl">{icon}</span>
                </div>
                <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
                  {Math.round(entry.temperature)}°
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
                <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
                  Viewed {formatViewedAt(entry.viewedAt)}
                </p>
              </div>
            );
          })}
        </div>
      )}

      <div>
        <Link
          to="/forecast"
          className="inline-block rounded-lg bg-emerald-700 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-emerald-600"
        >
          Search a new forecast
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
