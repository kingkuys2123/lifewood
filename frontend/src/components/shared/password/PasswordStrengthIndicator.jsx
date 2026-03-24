import { getPasswordStrength } from '../../../pages/auth/utils/passwordValidation';
import './PasswordStrengthIndicator.css';

export default function PasswordStrengthIndicator({ password = '', idPrefix = 'password-strength' }) {
  const strength = getPasswordStrength(password);
  const isEmpty = !password.trim();

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
    </div>
  );
}

