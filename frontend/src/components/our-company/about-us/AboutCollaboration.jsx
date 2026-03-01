import { useRef, useState } from 'react';
import { useReveal } from '../../../hooks/useReveal';
import { Link } from 'react-router-dom';
import './AboutCollaboration.css';

export default function AboutCollaboration() {
    const ref = useRef(null);
    useReveal(ref, 0.1);
    const [hovered, setHovered] = useState(false);

    return (
        <section
            className="au-collab"
            id="about-collaboration"
            ref={ref}
            aria-labelledby="au-collab-heading"
        >
            <div className="au-collab__inner wrap">

                {/* ── Large image card (left) ── */}
                <div
                    className={`au-collab__card au-collab__card--main${hovered ? ' au-collab__card--hovered' : ''}`}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    role="img"
                    aria-label="Business professionals collaborating in a modern office"
                >
                    {/* Placeholder gradient replaced by real image via CSS background */}
                    <div className="au-collab__card-media" />

                    {/* Hover overlay */}
                    <div className="au-collab__card-overlay" aria-hidden="true">
                        <div className="au-collab__card-overlay-inner">
                            <svg className="au-collab__card-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                            <span>Meet our team</span>
                        </div>
                    </div>
                </div>

                {/* ── Right column ── */}
                <div className="au-collab__right">

                    {/* Small image card (top-right) */}
                    <div
                        className="au-collab__card au-collab__card--small"
                        role="img"
                        aria-label="Team in a collaborative meeting room"
                    >
                        <div className="au-collab__card-media au-collab__card-media--small" />
                    </div>

                    {/* "Let's collaborate" text block */}
                    <div className="au-collab__text reveal reveal-delay-2">
                        <h2 id="au-collab-heading" className="au-collab__heading">
                            Let's <em>collaborate</em>
                        </h2>
                        <p className="au-collab__sub">
                            Partnership, ideas, and shared ambitions — this is how we move forward together.
                        </p>
                        <Link to="/contact" className="btn btn-forest au-collab__btn">
                            Get in touch
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                                <path d="M3.5 8h9M9 4.5 12.5 8 9 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </Link>
                    </div>
                </div>

            </div>

            {/* Decorative background shape */}
            <div className="au-collab__bg-shape" aria-hidden="true" />
        </section>
    );
}

