import { useState } from 'react';
import type { FormEvent } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';
import { COUNTRIES } from '../../data/countries';
import PasswordInput from '../../components/common/PasswordInput';
import PasswordStrengthMeter from '../../components/common/PasswordStrengthMeter';
import { MIN_PASSWORD_LENGTH } from '../../utils/passwordValidation';

const inputClass =
  'rounded-lg border border-white/40 bg-white/70 px-3 py-2 text-slate-900 outline-none backdrop-blur-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/30 dark:border-white/10 dark:bg-emerald-950/30 dark:text-white';
const labelClass = 'text-sm font-medium text-slate-700 dark:text-slate-300';
const cardClass = 'glass-panel-strong flex flex-col gap-4 rounded-2xl p-6 shadow-lg';

const Settings = () => {
  const { currentUser, updateProfile, changePassword } = useAuth();
  const { showToast } = useToast();
  const { theme, toggleTheme } = useTheme();

  const [profileForm, setProfileForm] = useState({
    firstName: currentUser?.firstName ?? '',
    lastName: currentUser?.lastName ?? '',
    country: currentUser?.country ?? '',
    phone: currentUser?.phone ?? '',
    email: currentUser?.email ?? '',
  });
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSubmitting, setProfileSubmitting] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);

  const newPasswordsMatch = confirmNewPassword.length > 0 && newPassword === confirmNewPassword;
  const newPasswordsMismatched = confirmNewPassword.length > 0 && newPassword !== confirmNewPassword;

  const submitProfile = (event: FormEvent) => {
    event.preventDefault();
    setProfileError(null);
    setProfileSubmitting(true);
    try {
      const result = updateProfile(profileForm);
      if (!result.success) {
        setProfileError(result.error ?? 'Unable to update profile.');
        return;
      }
      showToast('Profile updated successfully.', 'success');
    } finally {
      setProfileSubmitting(false);
    }
  };

  const submitPasswordChange = async (event: FormEvent) => {
    event.preventDefault();
    setPasswordError(null);

    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      setPasswordError(`New password must be at least ${MIN_PASSWORD_LENGTH} characters long.`);
      return;
    }
    if (newPassword !== confirmNewPassword) {
      showToast("Passwords don't match.", 'error');
      setPasswordError('New passwords do not match.');
      return;
    }

    setPasswordSubmitting(true);
    try {
      const result = await changePassword(currentPassword, newPassword);
      if (!result.success) {
        setPasswordError(result.error ?? 'Unable to change password.');
        return;
      }
      showToast('Password changed successfully.', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } finally {
      setPasswordSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Update your profile, password, and appearance preferences.
        </p>
      </header>

      <form onSubmit={submitProfile} className={cardClass}>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Profile</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>First name</label>
            <input
              required
              value={profileForm.firstName}
              onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Last name</label>
            <input
              required
              value={profileForm.lastName}
              onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Country</label>
          <select
            required
            value={profileForm.country}
            onChange={(e) => setProfileForm({ ...profileForm, country: e.target.value })}
            className={inputClass}
          >
            {COUNTRIES.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Phone number</label>
          <input
            type="tel"
            required
            value={profileForm.phone}
            onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Email</label>
          <input
            type="email"
            required
            value={profileForm.email}
            onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
            className={inputClass}
          />
        </div>

        {profileError && (
          <p className="rounded-lg bg-rose-50 px-4 py-3 text-center text-sm text-rose-600 dark:bg-rose-950/40">
            {profileError}
          </p>
        )}

        <button
          type="submit"
          disabled={profileSubmitting}
          className="self-start rounded-lg bg-emerald-700 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {profileSubmitting ? 'Saving…' : 'Save profile'}
        </button>
      </form>

      <form onSubmit={submitPasswordChange} className={cardClass}>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Change password</h2>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Current password</label>
          <PasswordInput
            required
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>New password</label>
          <PasswordInput
            required
            minLength={MIN_PASSWORD_LENGTH}
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={inputClass}
          />
          <PasswordStrengthMeter password={newPassword} />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            For a strong password, use {MIN_PASSWORD_LENGTH}+ characters with a mix of uppercase,
            lowercase, a number, and a special character.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Confirm new password</label>
          <PasswordInput
            required
            autoComplete="new-password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            className={inputClass}
          />
          {newPasswordsMatch && (
            <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">✓ Passwords match</p>
          )}
          {newPasswordsMismatched && (
            <p className="text-xs font-medium text-rose-600 dark:text-rose-400">Passwords don't match.</p>
          )}
        </div>

        {passwordError && (
          <p className="rounded-lg bg-rose-50 px-4 py-3 text-center text-sm text-rose-600 dark:bg-rose-950/40">
            {passwordError}
          </p>
        )}

        <button
          type="submit"
          disabled={passwordSubmitting}
          className="self-start rounded-lg bg-emerald-700 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {passwordSubmitting ? 'Updating…' : 'Change password'}
        </button>
      </form>

      <div className={cardClass}>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Appearance</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            <span>Dark mode</span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={theme === 'dark'}
            onClick={toggleTheme}
            className={`inline-flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition-colors ${
              theme === 'dark' ? 'bg-emerald-700' : 'bg-slate-300'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 shrink-0 rounded-full bg-white shadow transition-transform ${
                theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
