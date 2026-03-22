import { useNavigate } from 'react-router-dom';
import { authenticateUser } from '../services/authService';
import { useLoginForm } from '../hooks/useLoginForm';

export default function LoginForm() {
  const navigate = useNavigate();
  const { values, updateField } = useLoginForm();

  return (
    <form
      className="auth-form"
      onSubmit={(event) => {
        event.preventDefault();
        const response = authenticateUser(values);
        if (response.ok) {
          navigate('/portal');
        }
      }}
    >
      <label htmlFor="username">Username or email</label>
      <input
        id="username"
        type="text"
        value={values.username}
        placeholder="you@lifewood.com"
        onChange={(event) => updateField('username', event.target.value)}
        required
      />

      <div className="auth-password-row">
        <button type="button" className="auth-forgot-link">
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

      <button type="submit" className="btn btn-forest auth-submit-btn">
        Sign In
      </button>
    </form>
  );
}
