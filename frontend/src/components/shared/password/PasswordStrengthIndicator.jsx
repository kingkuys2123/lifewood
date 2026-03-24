import { getPasswordStrength } from '../../../pages/auth/utils/passwordValidation';
import './PasswordStrengthIndicator.css';

const REQUIREMENTS = [
  { key: 'minLength', label: '8 or more characters' },
  { key: 'hasLetter', label: 'At least one letter (A-Z)' },
  { key: 'hasDigit', label: 'At least one number (0-9)' },
  { key: 'hasUppercase', label: 'Uppercase letter (recommended)' },
  { key: 'hasSymbol', label: 'Special character (recommended)' },
];

export default function PasswordStrengthIndicator({
  password = '',
  idPrefix = 'password-strength',
  showWhenEmpty = true,
}) {
  const strength = getPasswordStrength(password);
  const isEmpty = !password.trim();

  if (!showWhenEmpty && isEmpty) {
    return null;
  }

  return (
    <div className="password-strength" aria-live="polite">
      <div className="password-strength-header">
        <span>Password strength</span>
        <span className={`password-strength-label password-strength-label--${strength.tone}`}>
          {strength.label}
        </span>
      </div>

      <div className="password-strength-bars" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((index) => (
          <span
            key={`${idPrefix}-${index}`}
            className={`password-strength-bar ${index <= strength.score && !isEmpty ? `password-strength-bar--${strength.tone}` : ''}`}
          />
        ))}
      </div>

      <p className="password-strength-hint">
        Use 8+ characters with letters and numbers; uppercase and symbols make it stronger.
      </p>

      <ul className="password-strength-checklist" aria-label="Password requirements">
        {REQUIREMENTS.map((requirement) => {
          const isMet = Boolean(strength.checks[requirement.key]);
          return (
            <li
              key={`${idPrefix}-${requirement.key}`}
              className={`password-strength-check ${isMet ? 'password-strength-check--met' : 'password-strength-check--miss'}`}
            >
              <span className="password-strength-check-icon" aria-hidden="true">
                {isMet ? '[x]' : '[ ]'}
              </span>
              <span>{requirement.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

