import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../app/providers/useAuth';
import { useToast } from '../../../app/providers/useToast';
import { useLoginForm } from '../hooks/useLoginForm';

export default function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const toast = useToast();
  const { values, updateField } = useLoginForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await login(values, { suppressGlobalErrorToast: true });
      toast.success('Login successful. Redirecting...');
      const redirectPath = location.state?.from?.pathname || '/portal';
      navigate(redirectPath, { replace: true });
    } catch (err) {
      toast.error(err?.message || 'Wrong Username/Password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={onSubmit}>
      <label htmlFor="username">Username or Email</label>
      <input
        id="username"
        type="text"
        value={values.username}
        placeholder="your.username or name@company.com"
        onChange={(event) => updateField('username', event.target.value)}
        required
      />

      <div className="auth-password-row">
        <Link to="/forgot-password" className="auth-forgot-link">
          Forgot password?
        </Link>
      </div>

      <label htmlFor="password">Password</label>
      <div className="password-input-wrap">
        <input
          id="password"
          type={showPassword ? 'text' : 'password'}
          value={values.password}
          placeholder="Enter password"
          onChange={(event) => updateField('password', event.target.value)}
          required
        />
        <button
          type="button"
          className="password-toggle-btn"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          aria-pressed={showPassword}
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? '🙈' : '👁'}
        </button>
      </div>

      <button type="submit" className="btn btn-forest auth-submit-btn" disabled={isSubmitting}>
        {isSubmitting ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}
