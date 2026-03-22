import LoginForm from './components/LoginForm';
import wordmark from '../../assets/branding/lifewood-icon-text.png';
import './styles/AuthPage.css';

export default function LoginPage() {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand-block">
          <img src={wordmark} alt="Lifewood" className="auth-wordmark" />
          <p className="auth-chip">Admin Portal</p>
        </div>
        <h1>Sign in to Lifewood Admin</h1>
        <p>Use your organization account to continue.</p>
        <LoginForm />
      </section>
    </main>
  );
}

