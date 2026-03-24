import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../../app/providers/useToast';
import { forgotPassword } from './services/authService';
import wordmark from '../../assets/branding/lifewood-icon-text.png';
import './styles/AuthPage.css';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const toast = useToast();

  useEffect(() => {
    if (cooldownSeconds <= 0) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setCooldownSeconds((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [cooldownSeconds]);

  const onSubmit = async (event) => {
    event.preventDefault();
    if (cooldownSeconds > 0 || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      await forgotPassword({ email: email.trim() }, { suppressGlobalErrorToast: true });
      toast.success('If your email exists, a reset link has been sent.');
      setEmail('');
    } catch (err) {
      if (err?.status === 429) {
        const retryAfter = Number.isFinite(err?.retryAfterSeconds) ? err.retryAfterSeconds : 60;
        setCooldownSeconds(retryAfter);
        toast.error(`Too many requests. Try again in ${retryAfter}s.`);
      } else {
        toast.error(err?.message || 'Unable to request password reset.');
      }
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

        <h1>Forgot password</h1>
        <p>Enter your work email to receive a secure reset link.</p>

        <form className="auth-form" onSubmit={onSubmit}>
          <label htmlFor="forgot-email">Email</label>
          <input
            id="forgot-email"
            type="email"
            value={email}
            placeholder="name@company.com"
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <button
            type="submit"
            className="btn btn-forest auth-submit-btn"
            disabled={isSubmitting || cooldownSeconds > 0}
          >
            {isSubmitting
              ? 'Sending...'
              : cooldownSeconds > 0
                ? `Try again in ${cooldownSeconds}s`
                : 'Send Reset Link'}
          </button>
        </form>

        <p className="auth-helper-link-wrap">
          <Link to="/login" className="auth-helper-link">Back to sign in</Link>
        </p>
      </section>
    </main>
  );
}

