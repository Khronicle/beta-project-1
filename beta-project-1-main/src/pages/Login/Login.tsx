import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import PasswordInput from '../../components/common/PasswordInput';

interface LocationState {
  from?: { pathname: string };
}

const inputClass =
  'rounded-lg border border-white/40 bg-white/70 px-3 py-2 text-slate-900 outline-none backdrop-blur-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/30 dark:border-white/10 dark:bg-emerald-950/30 dark:text-white';

const Login = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const result = await login(email, password);
      if (!result.success) {
        setError(result.error ?? 'Unable to log in.');
        return;
      }
      showToast('Logged in successfully.', 'success');
      const state = location.state as LocationState | null;
      navigate(state?.from?.pathname ?? '/', { replace: true });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Log in</h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Welcome back. Enter your details to continue.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="glass-panel-strong flex flex-col gap-4 rounded-2xl p-6 shadow-lg"
      >
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="you@example.com"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Password
          </label>
          <PasswordInput
            id="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            placeholder="••••••••"
          />
          <Link
            to="/forgot-password"
            className="self-end text-sm font-medium text-emerald-700 hover:text-emerald-600 dark:text-emerald-400"
          >
            Forgot password?
          </Link>
        </div>

        {error && (
          <p className="rounded-lg bg-rose-50 px-4 py-3 text-center text-sm text-rose-600 dark:bg-rose-950/40">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded-lg bg-emerald-700 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Logging in…' : 'Log in'}
        </button>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-emerald-700 hover:text-emerald-600 dark:text-emerald-400">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
