import type { DailyForecast } from '../../types/weather';
import { describeWeather } from '../../types/weather';

interface ForecastListProps {
  days: DailyForecast[];
}

const formatDay = (date: string) => {
  const d = new Date(`${date}T00:00:00`);
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
};

const ForecastList = ({ days }: ForecastListProps) => (
  <section className="glass-panel rounded-2xl p-4 shadow-sm">
    <h3 className="mb-3 text-lg font-semibold text-slate-800 dark:text-slate-100">Forecast</h3>
    <ul className="divide-y divide-slate-200/60 dark:divide-white/10">
      {days.map((day) => {
        const { icon, label } = describeWeather(day.code);
        return (
          <li key={day.date} className="flex items-center justify-between py-3">
            <span className="w-28 text-slate-600 dark:text-slate-300">{formatDay(day.date)}</span>
            <span className="flex items-center gap-2">
              <span className="text-2xl">{icon}</span>
              <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
            </span>
            <span className="font-semibold">
              {Math.round(day.temperatureMax)}° <span className="text-slate-400">/ {Math.round(day.temperatureMin)}°</span>
            </span>
          </li>
        );
      })}
    </ul>
  </section>
);

export default ForecastList;
