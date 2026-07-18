import { getPasswordStrength } from '../../utils/passwordValidation';

interface PasswordStrengthMeterProps {
  password: string;
}

const BAR_COLORS: Record<string, string> = {
  empty: 'bg-slate-200 dark:bg-slate-700',
  weak: 'bg-rose-500',
  fair: 'bg-amber-500',
  good: 'bg-emerald-500',
  strong: 'bg-emerald-700',
};

const LABEL_COLORS: Record<string, string> = {
  empty: 'text-slate-400',
  weak: 'text-rose-600 dark:text-rose-400',
  fair: 'text-amber-600 dark:text-amber-400',
  good: 'text-emerald-600 dark:text-emerald-400',
  strong: 'text-emerald-700 dark:text-emerald-300',
};

const PasswordStrengthMeter = ({ password }: PasswordStrengthMeterProps) => {
  const { score, strength, label } = getPasswordStrength(password);
  if (!password) return null;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-1">
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i < score ? BAR_COLORS[strength] : BAR_COLORS.empty
            }`}
          />
        ))}
      </div>
      <span className={`text-xs font-medium ${LABEL_COLORS[strength]}`}>
        Password strength: {label}
      </span>
    </div>
  );
};

export default PasswordStrengthMeter;
