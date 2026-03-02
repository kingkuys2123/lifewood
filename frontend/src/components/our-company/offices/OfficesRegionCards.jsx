import { useRef, useCallback } from 'react';
import { useReveal } from '../../../hooks/useReveal';
import './OfficesRegionCards.css';

/* ── Minimal SVG icons (stroke-based, no fill) ────────────── */
const IconGlobe = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
);
const IconMountain = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 20l7-12 4 6 3-4 4 10H3z" />
    </svg>
);
const IconLeaf = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M17 8C8 10 5.9 16.17 3.82 19.99" />
        <path d="M20.5 3c0 0-7 0-14 7 2.5 2.5 5 5 7.5 7.5C21 10.5 21 3 21 3h-.5z" />
    </svg>
);
const IconCompass = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
);
const IconSun = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1"  x2="12" y2="3"  />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22"  x2="5.64" y2="5.64"  />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1"  y1="12" x2="3"  y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
);
const IconMap = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true">
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
        <line x1="8" y1="2" x2="8" y2="18" />
        <line x1="16" y1="6" x2="16" y2="22" />
    </svg>
);
const IconAnchor = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="5" r="3" />
        <line x1="12" y1="8" x2="12" y2="22" />
        <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
    </svg>
);

const REGIONS = [
    {
        id: 'americas',
        Icon: IconGlobe,
        region: 'Americas',
        tags: ['United States', 'Brazil'],
    },
    {
        id: 'europe',
        Icon: IconCompass,
        region: 'Europe',
        tags: ['United Kingdom', 'Germany', 'Finland'],
    },
    {
        id: 'mena',
        Icon: IconSun,
        region: 'Middle East & Africa',
        tags: ['Middle East', 'Africa', 'South Africa', 'Madagascar'],
    },
    {
        id: 'south-asia',
        Icon: IconMountain,
        region: 'South Asia',
        tags: ['India', 'Bangladesh'],
    },
    {
        id: 'sea',
        Icon: IconLeaf,
        region: 'Southeast Asia',
        tags: ['Philippines', 'Vietnam', 'Thailand', 'Malaysia', 'Indonesia'],
    },
    {
        id: 'ea',
        Icon: IconMap,
        region: 'East Asia',
        tags: ['Japan', 'China', 'Hong Kong'],
    },
    {
        id: 'oceania',
        Icon: IconAnchor,
        region: 'Oceania',
        tags: ['Australia'],
    },
];

/** 3D tilt on mouse-move */
function TiltCard({ children, className = '' }) {
    const cardRef = useRef(null);

    const handleMouseMove = useCallback((e) => {
        const el = cardRef.current;
        if (!el) return;
        const { left, top, width, height } = el.getBoundingClientRect();
        const x = ((e.clientX - left) / width  - 0.5) * 12;
        const y = ((e.clientY - top)  / height - 0.5) * -12;
        el.style.transform = `perspective(700px) rotateY(${x}deg) rotateX(${y}deg) translateY(-6px) scale(1.015)`;
    }, []);

    const handleMouseLeave = useCallback(() => {
        const el = cardRef.current;
        if (!el) return;
        el.style.transform = '';
    }, []);

    return (
        <div
            ref={cardRef}
            className={`of-rcard ${className}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {children}
        </div>
    );
}

export default function OfficesRegionCards() {
    const sectionRef = useRef(null);
    useReveal(sectionRef, 0.05);

    return (
        <section
            ref={sectionRef}
            className="of-regions"
            aria-label="Regions we operate in"
        >
            {/* Animated SVG connector network */}
            <svg
                className="of-regions__net"
                viewBox="0 0 1200 500"
                preserveAspectRatio="xMidYMid slice"
                aria-hidden="true"
            >
                <path className="of-regions__net-line" d="M 100 80 Q 300 200 600 120 T 1100 180" />
                <path className="of-regions__net-line" d="M 0 300 Q 400 100 700 350 T 1200 280" style={{ animationDelay: '0.4s' }} />
                <path className="of-regions__net-line" d="M 200 450 Q 500 300 800 400 T 1200 380" style={{ animationDelay: '0.8s' }} />
                <path className="of-regions__net-line" d="M 600 0 Q 700 250 600 500"              style={{ animationDelay: '0.2s' }} />
                <path className="of-regions__net-line" d="M 100 200 L 400 150 L 750 250 L 1100 200" style={{ animationDelay: '1s' }} />
            </svg>

            <div className="of-regions__inner wrap">
                <span className="section-eyebrow reveal">
                    <span className="section-dot" />
                    Global Regions
                </span>
                <h2 className="of-regions__heading reveal reveal-delay-1">
                    Where we're rooted
                </h2>

                <div className="of-regions__grid">
                    {REGIONS.map((r, i) => (
                        <TiltCard
                            key={r.id}
                            className={`reveal reveal-delay-${Math.min(i + 1, 5)}`}
                        >
                            <div className="of-rcard__icon" aria-hidden="true">
                                <r.Icon />
                            </div>
                            <p className="of-rcard__region">{r.region}</p>
                            <div className="of-rcard__tags" aria-label={`Countries: ${r.tags.join(', ')}`}>
                                {r.tags.map((t) => (
                                    <span key={t} className="of-rcard__tag">{t}</span>
                                ))}
                            </div>
                            <div className="of-rcard__bar" aria-hidden="true" />
                        </TiltCard>
                    ))}
                </div>
            </div>
        </section>
    );
}
