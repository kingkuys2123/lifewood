import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../../app/providers/useToast';
import { forgotPassword } from './services/authService';
import wordmark from '../../assets/branding/lifewood-icon-text.png';
import './styles/AuthPage.css';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const onSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await forgotPassword({ email: email.trim() }, { suppressGlobalErrorToast: true });
      toast.success('If your email exists, a reset link has been sent.');
      setEmail('');
    } catch (err) {
      toast.error(err?.message || 'Unable to request password reset.');
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

          <button type="submit" className="btn btn-forest auth-submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <p className="auth-helper-link-wrap">
          <Link to="/login" className="auth-helper-link">Back to sign in</Link>
        </p>
      </section>
    </main>
  );
}

