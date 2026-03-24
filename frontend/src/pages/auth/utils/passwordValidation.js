export function validatePasswordStrength(password) {
  const value = (password || '').trim();

  if (value.length < 8 || value.length > 72) {
    return 'Password must be between 8 and 72 characters.';
  }

  const hasLetter = /[A-Za-z]/.test(value);
  const hasDigit = /\d/.test(value);

  if (!hasLetter || !hasDigit) {
    return 'Password must include at least one letter and one number.';
  }

  return '';
}

export function getPasswordStrength(password) {
  const value = (password || '').trim();
  const checks = {
    minLength: value.length >= 8,
    hasLetter: /[A-Za-z]/.test(value),
    hasDigit: /\d/.test(value),
    hasUppercase: /[A-Z]/.test(value),
    hasSymbol: /[^A-Za-z0-9]/.test(value),
  };

  const score = Number(checks.minLength)
    + Number(checks.hasLetter)
    + Number(checks.hasDigit)
    + Number(checks.hasUppercase)
    + Number(checks.hasSymbol);

  if (!value) {
    return {
      score: 0,
      label: 'Not set',
      tone: 'neutral',
      checks,
    };
  }

  if (score <= 2) {
    return {
      score,
      label: 'Weak',
      tone: 'weak',
      checks,
    };
  }

  if (score <= 4) {
    return {
      score,
      label: 'Medium',
      tone: 'medium',
      checks,
    };
  }

  return {
    score,
    label: 'Strong',
    tone: 'strong',
    checks,
  };
}

