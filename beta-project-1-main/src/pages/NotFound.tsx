import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
    <span className="text-6xl">🛰️</span>
    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Page not found</h1>
    <p className="text-slate-500 dark:text-slate-400">
      The page you are looking for doesn’t exist.
    </p>
    <Link
      to="/"
      className="rounded-lg bg-emerald-700 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-emerald-600"
    >
      Back to home
    </Link>
  </div>
);

export default NotFound;
