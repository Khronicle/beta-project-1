import type { WeatherData } from '../../types/weather';
import { describeWeather } from '../../types/weather';

interface CurrentCardProps {
  data: WeatherData;
}

const CurrentCard = ({ data }: CurrentCardProps) => {
  const { current, location } = data;
  const { icon, label } = describeWeather(current.weatherCode);

  return (
    <section className="rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 text-white shadow-lg">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">
            {location.name}
            {location.country && <span className="text-slate-400">, {location.country}</span>}
          </h2>
          <p className="text-slate-300">{label}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-6xl leading-none">{icon}</span>
          <span className="text-5xl font-bold">{Math.round(current.temperature)}°</span>
        </div>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg bg-white/10 p-3">
          <dt className="text-xs uppercase tracking-wide text-slate-300">Feels like</dt>
          <dd className="text-lg font-semibold">{Math.round(current.apparentTemperature)}°</dd>
        </div>
        <div className="rounded-lg bg-white/10 p-3">
          <dt className="text-xs uppercase tracking-wide text-slate-300">Humidity</dt>
          <dd className="text-lg font-semibold">{current.humidity}%</dd>
        </div>
        <div className="rounded-lg bg-white/10 p-3">
          <dt className="text-xs uppercase tracking-wide text-slate-300">Wind</dt>
          <dd className="text-lg font-semibold">{Math.round(current.windSpeed)} km/h</dd>
        </div>
        <div className="rounded-lg bg-white/10 p-3">
          <dt className="text-xs uppercase tracking-wide text-slate-300">Condition</dt>
          <dd className="text-lg font-semibold">{current.isDay ? 'Day' : 'Night'}</dd>
        </div>
      </dl>
    </section>
  );
};

export default CurrentCard;
