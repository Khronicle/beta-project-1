import { useState } from 'react';
import type { Location } from '../../types/weather';
import { getLocationBySearch } from '../../services/locationApi';
import { MapPinned } from 'lucide-react';

interface SearchBarProps {
  onSelect: (location: Location) => void;
  onUseLocation: () => void;
  loading?: boolean;
}

const SearchBar = ({ onSelect, onUseLocation, loading }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Location[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runSearch = async () => {
    if (!query.trim()) return;
    setSearching(true);
    setError(null);
    try {
      const found = await getLocationBySearch(query);
      setResults(found);
      if (found.length === 0) setError('No locations found.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed.');
    } finally {
      setSearching(false);
    }
  };

  const pick = (loc: Location) => {
    onSelect(loc);
    setResults([]);
    setQuery('');
  };

  return (
    <div className="relative w-full max-w-xl">
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && runSearch()}
          placeholder="Search for a city…"
          className="flex-1 rounded-lg border border-white/40 bg-white/70 px-4 py-2.5 text-slate-800 shadow-sm outline-none backdrop-blur-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/40 dark:border-white/10 dark:bg-emerald-950/30 dark:text-slate-100"
        />
        <button
          type="button"
          onClick={runSearch}
          disabled={searching || loading}
          className="rounded-lg bg-emerald-700 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-emerald-600 disabled:opacity-60"
        >
          {searching ? '…' : 'Search'}
        </button>
        <button
          type="button"
          onClick={onUseLocation}
          disabled={loading}
          className="group rounded-lg border border-white/40 bg-white/70 px-4 py-2.5 font-semibold text-slate-700 backdrop-blur-sm transition-all hover:bg-white/90 disabled:opacity-60 dark:border-white/10 dark:bg-emerald-950/30 dark:text-slate-200 dark:hover:bg-emerald-950/50"
        >
          <MapPinned
            className="text-emerald-600 transition-transform group-hover:scale-115 dark:text-emerald-400"
          />
        </button>
      </div>

      {error && <p className="mt-2 text-sm text-rose-500">{error}</p>}

      {results.length > 0 && (
        <ul className="glass-panel-strong absolute z-20 mt-2 w-full overflow-hidden rounded-lg shadow-lg">
          {results.map((loc, i) => (
            <li key={`${loc.latitude}-${loc.longitude}-${i}`}>
              <button
                type="button"
                onClick={() => pick(loc)}
                className="block w-full px-4 py-2.5 text-left text-slate-700 transition-colors hover:bg-emerald-50 dark:text-slate-200 dark:hover:bg-emerald-950/40"
              >
                {loc.name}
                <span className="text-slate-400"> {loc.admin1 ? `, ${loc.admin1}` : ''}, {loc.country}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
