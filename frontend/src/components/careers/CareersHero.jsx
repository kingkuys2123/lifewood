import { Link } from 'react-router-dom';
import './CareersHero.css';

export default function CareersHero() {
    return (
        <section className="careers-hero" id="careers-hero">
            <div className="ch-blob-tl" aria-hidden="true" />
            <div className="ch-blob-br" aria-hidden="true" />
            <div className="ch-noise"   aria-hidden="true" />

            <div className="careers-hero__inner wrap">

                <span className="careers-hero__eyebrow">
                    Careers in Lifewood
                </span>

                <h1 className="careers-hero__title">
                    Shape the Future<br />
                    of <em>AI &amp; Data</em>
                </h1>

                <p className="careers-hero__para">
                    Innovation, adaptability and the rapid development of new services separates
                    companies that constantly deliver at the highest level from their competitors.
                </p>

                <div className="careers-hero__cta">
                    <Link to="/apply" className="careers-hero__btn-primary">
                        Apply Now
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                        </svg>
                    </Link>
                    <Link to="/contact" className="careers-hero__btn-ghost">
                        Get in Touch
                    </Link>
                </div>

                <div className="careers-hero__scroll" aria-hidden="true">
                    <span className="careers-hero__scroll-label">Scroll</span>
                    <span className="careers-hero__scroll-line" />
                </div>

            </div>
        </section>
    );
}

