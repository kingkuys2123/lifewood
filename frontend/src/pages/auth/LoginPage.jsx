import LoginForm from './components/LoginForm';
import './styles/AuthPage.css';

export default function LoginPage() {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>Sign in to Lifewood Admin</h1>
        <p>Use your organization account to continue.</p>
        <LoginForm />
      </section>
    </main>
  );
}

