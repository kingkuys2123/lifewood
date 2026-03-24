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

