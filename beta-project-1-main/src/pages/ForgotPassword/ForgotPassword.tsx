import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Reset your password</h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Enter your email and we'll send you a link to reset your password.
        </p>
      </header>

      <div className="glass-panel-strong flex flex-col gap-4 rounded-2xl p-6 shadow-lg">
        {submitted ? (
          <p className="rounded-lg bg-emerald-50 px-4 py-3 text-center text-sm text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
            If an account exists for {email}, a password reset link has been sent.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                className="rounded-lg border border-white/40 bg-white/70 px-3 py-2 text-slate-900 outline-none backdrop-blur-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/30 dark:border-white/10 dark:bg-emerald-950/30 dark:text-white"
                placeholder="you@example.com"
              />
            </div>

            <button
              type="submit"
              className="mt-2 rounded-lg bg-emerald-700 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-emerald-600"
            >
              Send reset link
            </button>
          </form>
        )}

        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          <Link to="/login" className="font-medium text-emerald-700 hover:text-emerald-600 dark:text-emerald-400">
            Back to log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
