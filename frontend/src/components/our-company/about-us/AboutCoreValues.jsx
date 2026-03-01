import { useRef, useState } from 'react';
import { useReveal } from '../../../hooks/useReveal';
import './AboutCoreValues.css';

const VALUES = [
    {
        letter: 'D',
        label: 'Diversity',
        body: 'We celebrate differences in belief, philosophy, and ways of life, because they bring unique perspectives and ideas that encourage everyone to move forward.',
        icon: (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
        ),
        color: '#133020',
        accent: 'rgba(19,48,32,0.08)',
    },
    {
        letter: 'C',
        label: 'Caring',
        body: 'We care for every person deeply and equally, because without care work becomes meaningless.',
        icon: (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
        ),
        color: '#1a3d28',
        accent: 'rgba(26,61,40,0.07)',
    },
    {
        letter: 'I',
        label: 'Innovation',
        body: 'Innovation is at the heart of all we do, enriching our lives and challenging us to continually improve ourselves and our service.',
        icon: (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
            </svg>
        ),
        color: '#F5A623',
        accent: 'rgba(245,166,35,0.08)',
    },
    {
        letter: 'I',
        label: 'Integrity',
        body: 'We are dedicated to act ethically and sustainably in everything we do. More than just the bare minimum, it is the basis of our existence as a company.',
        icon: (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
        ),
        color: '#133020',
        accent: 'rgba(19,48,32,0.08)',
    },
];

export default function AboutCoreValues() {
    const ref = useRef(null);
    useReveal(ref, 0.05);
    const [activeIdx, setActiveIdx] = useState(null);

    return (
        <section className="au-values" id="about-values" ref={ref} aria-labelledby="au-values-heading">

            {/* Top stripe accent */}
            <div className="au-values__stripe" aria-hidden="true" />

            <div className="au-values__inner wrap">

                {/* ── Left column: heading + intro ── */}
                <div className="au-values__left">
                    <div className="au-values__eyebrow reveal">
                        <span className="section-eyebrow">
                            <span className="section-dot" />
                            Core Values
                        </span>
                    </div>

                    <div className="au-values__title-block reveal reveal-delay-1">
                        <h2 id="au-values-heading" className="au-values__heading">
                            CORE{' '}
                            <span className="au-values__heading-highlight">VALUE</span>
                        </h2>
                    </div>

                    <p className="au-values__intro reveal reveal-delay-2">
                        At Lifewood we empower our company and our clients to realise the transformative
                        power of AI: Bringing big data to life, launching new ways of thinking,
                        innovating, learning, and doing.
                    </p>

                    {/* DCII acronym visual */}
                    <div className="au-values__acronym reveal reveal-delay-3" aria-hidden="true">
                        {VALUES.map((v, i) => (
                            <span
                                key={i}
                                className={`au-values__acronym-letter${activeIdx === i ? ' au-values__acronym-letter--active' : ''}`}
                                style={{ '--val-color': v.color }}
                            >
                                {v.letter}
                            </span>
                        ))}
                    </div>
                </div>

                {/* ── Right column: value cards ── */}
                <div className="au-values__cards">
                    {VALUES.map((v, i) => (
                        <article
                            key={i}
                            className={`au-values__card au-values__card--entry-${i + 1}${activeIdx === i ? ' au-values__card--active' : ''}`}
                            style={{ '--val-color': v.color, '--val-accent': v.accent }}
                            onMouseEnter={() => setActiveIdx(i)}
                            onMouseLeave={() => setActiveIdx(null)}
                            tabIndex={0}
                            onFocus={() => setActiveIdx(i)}
                            onBlur={() => setActiveIdx(null)}
                            aria-label={`${v.label}: ${v.body}`}
                        >
                            {/* Letter badge */}
                            <div className="au-values__badge" aria-hidden="true">
                                <span className="au-values__badge-letter">{v.letter}</span>
                            </div>

                            {/* Content */}
                            <div className="au-values__card-content">
                                <div className="au-values__card-header">
                                    <div className="au-values__card-icon">{v.icon}</div>
                                    <span className="au-values__card-label">{v.label.toUpperCase()}</span>
                                </div>
                                <div className="au-values__card-divider" aria-hidden="true" />
                                <p className="au-values__card-body">{v.body}</p>
                            </div>

                            {/* Hover glow */}
                            <div className="au-values__card-glow" aria-hidden="true" />
                        </article>
                    ))}
                </div>

            </div>
        </section>
    );
}

