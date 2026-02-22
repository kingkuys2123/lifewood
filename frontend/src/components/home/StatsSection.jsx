import { useEffect, useRef } from 'react';
import './StatsSection.css';

const STATS = [
    {
        number: '40+',
        label: 'Global Delivery Centers',
    },
    {
        number: '30+',
        label: 'Countries Across All Continents',
    },
    {
        number: '50+',
        label: 'Language Capabilities and Dialects',
    },
    {
        number: '56,000+',
        label: 'Global Online Resources',
    },
];

export default function StatsSection() {
    const sectionRef = useRef(null);

    useEffect(() => {
        const els = sectionRef.current?.querySelectorAll('.reveal') ?? [];
        if (!els.length) return;
        const obs = new IntersectionObserver(
            (entries) => entries.forEach(e => {
                if (e.isIntersecting) { e.target.classList.add('reveal--visible'); obs.unobserve(e.target); }
            }),
            { threshold: 0.1 }
        );
        els.forEach(el => obs.observe(el));
        return () => obs.disconnect();
    }, []);

    return (
        <section className="stats" id="stats" ref={sectionRef}>
            <div className="stats__inner wrap">

                {/* Header */}
                <div className="stats__header reveal">
                    <span className="section-eyebrow"><span className="section-dot" /> Transforming</span>
                    <p className="stats__sub">
                        By connecting local expertise with our global AI data infrastructure, we create
                        opportunities, empower communities, and drive inclusive growth worldwide.
                    </p>
                </div>

                {/* Cards */}
                <div className="stats__grid">
                    {STATS.map((s, i) => (
                        <div
                            key={s.label}
                            className={`stats__card reveal reveal-delay-${i + 1}`}
                        >
                            <div className="stats__number">{s.number}</div>
                            <div className="stats__label">{s.label}</div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
