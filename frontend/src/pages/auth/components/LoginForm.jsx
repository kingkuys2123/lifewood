import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../app/providers/useAuth';
import { useLoginForm } from '../hooks/useLoginForm';

export default function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { values, updateField } = useLoginForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await login(values);
      const redirectPath = location.state?.from?.pathname || '/portal';
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err?.message || 'Invalid username or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={onSubmit}>
      <label htmlFor="username">Username</label>
      <input
        id="username"
        type="text"
        value={values.username}
        placeholder="your.username"
        onChange={(event) => updateField('username', event.target.value)}
        required
      />

      <div className="auth-password-row">
        <button type="button" className="auth-forgot-link" disabled>
          Forgot password?
        </button>
      </div>

      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        value={values.password}
        placeholder="Enter password"
        onChange={(event) => updateField('password', event.target.value)}
        required
      />

      {error ? <p className="auth-error-message">{error}</p> : null}

      <button type="submit" className="btn btn-forest auth-submit-btn" disabled={isSubmitting}>
        {isSubmitting ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}
