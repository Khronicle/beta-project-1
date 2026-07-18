export const MIN_PASSWORD_LENGTH = 8;

// A "secure" password: 8+ chars, at least one lowercase, one uppercase,
// one digit, and one special character. Shown to users as guidance; only
// the minimum length is actually enforced at submit time.
export const SECURE_PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export type PasswordStrength = 'empty' | 'weak' | 'fair' | 'good' | 'strong';

export interface PasswordStrengthResult {
  score: number; // 0-4
  strength: PasswordStrength;
  label: string;
}

export function getPasswordStrength(password: string): PasswordStrengthResult {
  if (!password) {
    return { score: 0, strength: 'empty', label: '' };
  }

  let score = 0;
  if (password.length >= MIN_PASSWORD_LENGTH) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const clamped = Math.min(score, 4);
  const levels: { strength: PasswordStrength; label: string }[] = [
    { strength: 'weak', label: 'Weak' },
    { strength: 'weak', label: 'Weak' },
    { strength: 'fair', label: 'Fair' },
    { strength: 'good', label: 'Good' },
    { strength: 'strong', label: 'Strong' },
  ];

  return { score: clamped, ...levels[clamped] };
}
