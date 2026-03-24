import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '../../app/providers/useToast';
import { resetPassword } from './services/authService';
import { validatePasswordStrength } from './utils/passwordValidation';
import wordmark from '../../assets/branding/lifewood-icon-text.png';
import './styles/AuthPage.css';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();

  const token = useMemo(() => (searchParams.get('token') || '').trim(), [searchParams]);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!token) {
      toast.error('Reset token is missing or invalid.');
      return;
    }

    const passwordError = validatePasswordStrength(newPassword);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New password and confirmation do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword({ token, newPassword: newPassword.trim() }, { suppressGlobalErrorToast: true });
      toast.success('Password reset successful. Please sign in.');
      navigate('/login', { replace: true });
    } catch (err) {
      toast.error(err?.message || 'Unable to reset password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand-block">
          <img src={wordmark} alt="Lifewood" className="auth-wordmark" />
          <p className="auth-chip">Admin Portal</p>
        </div>

        <h1>Set new password</h1>
        <p>Choose a strong password to protect your account.</p>

        <form className="auth-form" onSubmit={onSubmit}>
          <label htmlFor="new-password">New Password</label>
          <div className="password-input-wrap">
            <input
              id="new-password"
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder="At least 8 characters"
              required
            />
            <button
              type="button"
              className="password-toggle-btn"
              aria-label={showNewPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showNewPassword}
              onClick={() => setShowNewPassword((prev) => !prev)}
            >
              {showNewPassword ? '🙈' : '👁'}
            </button>
          </div>

          <label htmlFor="confirm-password">Confirm New Password</label>
          <div className="password-input-wrap">
            <input
              id="confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Re-enter new password"
              required
            />
            <button
              type="button"
              className="password-toggle-btn"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showConfirmPassword}
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? '🙈' : '👁'}
            </button>
          </div>

          <button type="submit" className="btn btn-forest auth-submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update Password'}
          </button>
        </form>

        <p className="auth-helper-link-wrap">
          <Link to="/login" className="auth-helper-link">Back to sign in</Link>
        </p>
      </section>
    </main>
  );
}

