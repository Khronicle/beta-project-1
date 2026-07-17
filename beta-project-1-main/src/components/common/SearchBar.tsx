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
          className="flex-1 rounded-lg border border-slate-300 bg-white/90 px-4 py-2.5 text-slate-800 shadow-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />
        <button
          type="button"
          onClick={runSearch}
          disabled={searching || loading}
          className="rounded-lg bg-teal-500 px-4 py-2.5 font-semibold text-slate-900 transition-colors hover:bg-teal-300 disabled:opacity-60"
        >
          {searching ? '…' : 'Search'}
        </button>
        <button
          type="button"
          onClick={onUseLocation}
          disabled={loading}
          className="group rounded-lg border border-slate-300 px-4 py-2.5 font-semibold text-slate-700 transition-all hover:bg-slate-100 disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <MapPinned
            className="text-teal-400 transition-transform group-hover:scale-115"
          />
        </button>
      </div>

      {error && <p className="mt-2 text-sm text-rose-500">{error}</p>}

      {results.length > 0 && (
        <ul className="absolute z-20 mt-2 w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
          {results.map((loc, i) => (
            <li key={`${loc.latitude}-${loc.longitude}-${i}`}>
              <button
                type="button"
                onClick={() => pick(loc)}
                className="block w-full px-4 py-2.5 text-left text-slate-700 transition-colors hover:bg-teal-50 dark:text-slate-200 dark:hover:bg-slate-800"
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
