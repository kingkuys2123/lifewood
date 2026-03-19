import { Link } from 'react-router-dom';
import LandingHighlights from './components/LandingHighlights';
import { useBrandMessage } from './hooks/useBrandMessage';
import { getLandingHighlights } from './services/landingService';
import lifewoodText from '../../assets/branding/lifewood-text.png';
import './styles/LandingPage.css';

export default function LandingPage() {
  const brandMessage = useBrandMessage();
  const highlights = getLandingHighlights();

  return (
    <main className="portal-landing">
      <section className="portal-landing-card">
        <img src={lifewoodText} alt="Lifewood" className="portal-landing-logo" />
        <p className="portal-landing-eyebrow">Admin Operations Portal</p>
        <h1>One place to manage users, applicants, and insights.</h1>
        <p>
          This static portal UI mirrors the backend structure and is ready for API wiring.
        </p>
        <p className="portal-landing-brand-message">{brandMessage}</p>
        <LandingHighlights items={highlights} />
        <Link to="/login" className="btn btn-forest portal-landing-login">
          Open Login Portal
        </Link>
      </section>
    </main>
  );
}
