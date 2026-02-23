import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useReveal } from '../../hooks/useReveal';
import './CareersCTA.css';

/* Deterministic particle positions — no random so SSR-safe */
const PARTICLES = [
    { top:'12%', left:'8%',  dur:'7s',  delay:'0s'    },
    { top:'28%', left:'22%', dur:'9s',  delay:'1.2s'  },
    { top:'55%', left:'5%',  dur:'6s',  delay:'2.4s'  },
    { top:'78%', left:'18%', dur:'8s',  delay:'0.6s'  },
    { top:'15%', left:'75%', dur:'10s', delay:'1.8s'  },
    { top:'42%', left:'88%', dur:'7s',  delay:'0.3s'  },
    { top:'68%', left:'70%', dur:'9s',  delay:'2.1s'  },
    { top:'85%', left:'90%', dur:'6s',  delay:'1.5s'  },
    { top:'35%', left:'50%', dur:'11s', delay:'3s'    },
    { top:'60%', left:'40%', dur:'8s',  delay:'0.9s'  },
];

export default function CareersCTA() {
    const sectionRef = useRef(null);
    useReveal(sectionRef, 0.1);

    return (
        <section className="careers-cta" id="careers-cta" ref={sectionRef}>
            {/* Background layers */}
            <div className="careers-cta__blob-tl" aria-hidden="true" />
            <div className="careers-cta__blob-br" aria-hidden="true" />
            <div className="careers-cta__grid"    aria-hidden="true" />
            <div className="careers-cta__particles" aria-hidden="true">
                {PARTICLES.map((p, i) => (
                    <span
                        key={i}
                        className="careers-cta__particle"
                        style={{ top: p.top, left: p.left, '--dur': p.dur, '--delay': p.delay }}
                    />
                ))}
            </div>

            <div className="careers-cta__inner wrap">

                <span className="careers-cta__eyebrow reveal">
                    <span className="careers-cta__eyebrow-dot" aria-hidden="true" />
                    Your Next Chapter
                </span>

                <h2 className="careers-cta__quote reveal reveal-delay-1">
                    The adventure is always<br />
                    <em>before you</em>
                </h2>

                <div className="careers-cta__rule reveal reveal-delay-1" aria-hidden="true" />

                <p className="careers-cta__body reveal reveal-delay-2">
                    If you're looking to turn the page on a new chapter in your career, make
                    contact with us today. At Lifewood, the adventure is always before you —
                    it's why we've been described as{' '}
                    <strong style={{ color: 'rgba(255,255,255,0.75)', fontWeight: 700 }}>
                        "always on, never off."
                    </strong>
                </p>

                <p className="careers-cta__tagline reveal reveal-delay-2">
                    Lifewood · Always On, Never Off
                </p>

                <div className="careers-cta__actions reveal reveal-delay-3">
                    <Link to="/apply" className="careers-cta__btn-primary">
                        Apply Now
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                        </svg>
                    </Link>
                    <Link to="/contact" className="careers-cta__btn-ghost">
                        Get in Touch
                    </Link>
                </div>

            </div>
        </section>
    );
}
