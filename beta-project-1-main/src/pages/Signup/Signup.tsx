import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { COUNTRIES } from '../../data/countries';
import { COUNTRY_DIAL_CODES } from '../../data/countryCodes';
import PasswordInput from '../../components/common/PasswordInput';
import PasswordStrengthMeter from '../../components/common/PasswordStrengthMeter';
import { MIN_PASSWORD_LENGTH } from '../../utils/passwordValidation';

const Signup = () => {
  const { signup } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [country, setCountry] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const hasMismatchedConfirm = confirmPassword.length > 0 && password !== confirmPassword;
  const lastMismatchToastRef = useRef(0);

  const handleConfirmBlur = () => {
    if (hasMismatchedConfirm) {
      const now = Date.now();
      if (now - lastMismatchToastRef.current > 2000) {
        lastMismatchToastRef.current = now;
        showToast("Passwords don't match.", 'error');
      }
    }
  };

  const handleCountryChange = (value: string) => {
    const previousCode = COUNTRY_DIAL_CODES[country];
    const nextCode = COUNTRY_DIAL_CODES[value];
    setCountry(value);

    if (!nextCode) return;
    setPhone((prev) => {
      const trimmed = prev.trim();
      // Only auto-fill when the field is empty or still holds nothing but the
      // previously auto-inserted dial code — never clobber a number the user
      // has actually started typing.
      if (trimmed.length === 0 || trimmed === previousCode) {
        return `${nextCode} `;
      }
      return prev;
    });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`);
      return;
    }
    if (password !== confirmPassword) {
      showToast("Passwords don't match.", 'error');
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      const result = await signup({ firstName, lastName, country, phone, email, password });
      if (!result.success) {
        setError(result.error ?? 'Unable to create account.');
        return;
      }
      showToast('Account created successfully. Welcome!', 'success');
      navigate('/', { replace: true });
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'rounded-lg border border-white/40 bg-white/70 px-3 py-2 text-slate-900 outline-none backdrop-blur-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/30 dark:border-white/10 dark:bg-emerald-950/30 dark:text-white';
  const labelClass = 'text-sm font-medium text-slate-700 dark:text-slate-300';

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Create an account</h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          New accounts start with standard user access.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="glass-panel-strong flex flex-col gap-4 rounded-2xl p-6 shadow-lg"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="firstName" className={labelClass}>
              First name
            </label>
            <input
              id="firstName"
              required
              autoComplete="given-name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={inputClass}
              placeholder="Jane"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="lastName" className={labelClass}>
              Last name
            </label>
            <input
              id="lastName"
              required
              autoComplete="family-name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={inputClass}
              placeholder="Doe"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="country" className={labelClass}>
            Country
          </label>
          <select
            id="country"
            required
            autoComplete="country-name"
            value={country}
            onChange={(e) => handleCountryChange(e.target.value)}
            className={inputClass}
          >
            <option value="" disabled>
              Select your country
            </option>
            {COUNTRIES.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className={labelClass}>
            Phone number
          </label>
          <input
            id="phone"
            type="tel"
            required
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputClass}
            placeholder="+1 555 123 4567"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className={labelClass}>
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
          <label htmlFor="password" className={labelClass}>
            Password
          </label>
          <PasswordInput
            id="password"
            required
            minLength={MIN_PASSWORD_LENGTH}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
          />
          <PasswordStrengthMeter password={password} />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            For a strong password, use {MIN_PASSWORD_LENGTH}+ characters with a mix of uppercase,
            lowercase, a number, and a special character.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="confirmPassword" className={labelClass}>
            Confirm password
          </label>
          <div className="relative">
            <PasswordInput
              id="confirmPassword"
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={handleConfirmBlur}
              className={inputClass}
              placeholder="Re-enter your password"
            />
            {passwordsMatch && (
              <Check className="pointer-events-none absolute right-9 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-600 dark:text-emerald-400" />
            )}
          </div>
          {hasMismatchedConfirm && (
            <p className="text-xs font-medium text-rose-600 dark:text-rose-400">
              Passwords don't match.
            </p>
          )}
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
          {submitting ? 'Creating account…' : 'Sign up'}
        </button>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-emerald-700 hover:text-emerald-600 dark:text-emerald-400">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
