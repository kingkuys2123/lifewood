import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '../../app/providers/useToast';
import PasswordStrengthIndicator from '../../components/shared/password/PasswordStrengthIndicator';
import { resetPassword, validateResetToken } from './services/authService';
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
  const [isCheckingToken, setIsCheckingToken] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkToken() {
      if (!token) {
        if (mounted) {
          setIsTokenValid(false);
          setIsCheckingToken(false);
        }
        return;
      }

      try {
        const valid = await validateResetToken(token, { suppressGlobalErrorToast: true });
        if (mounted) {
          setIsTokenValid(Boolean(valid));
        }
      } catch {
        if (mounted) {
          setIsTokenValid(false);
        }
      } finally {
        if (mounted) {
          setIsCheckingToken(false);
        }
      }
    }

    checkToken();
    return () => {
      mounted = false;
    };
  }, [token]);

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!token || !isTokenValid) {
      toast.error('Reset link is invalid or expired. Please request a new one.');
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
      toast.error(err?.isTimeout ? 'Reset request timed out. Please try again.' : (err?.message || 'Unable to reset password.'));
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

        {isCheckingToken ? (
          <p>Validating your reset link...</p>
        ) : !isTokenValid ? (
          <>
            <p>This reset link is invalid or expired.</p>
            <p className="auth-helper-link-wrap">
              <Link to="/forgot-password" className="auth-helper-link">Request a new reset link</Link>
            </p>
          </>
        ) : (
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
            <PasswordStrengthIndicator password={newPassword} idPrefix="reset-new-password" />

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
        )}

        <p className="auth-helper-link-wrap">
          <Link to="/login" className="auth-helper-link">Back to sign in</Link>
        </p>
      </section>
    </main>
  );
}
