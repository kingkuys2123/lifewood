import { useEffect, useRef, useState } from 'react';
import './StatsSection.css';

const STATS = [
    {
        raw: 40,
        suffix: '+',
        label: 'Global Delivery Centers',
        desc: 'Lifewood operates 40+ secure centers worldwide, spanning Africa, Asia, Europe, and the Americas — providing region-specific datasets with strict compliance standards.',
    },
    {
        raw: 30,
        suffix: '+',
        label: 'Countries Across All Continents',
        desc: "Lifewood's global footprint enables access to diverse cultural and linguistic datasets, ensuring authenticity and representation across every major region.",
    },
    {
        raw: 50,
        suffix: '+',
        label: 'Language Capabilities and Dialects',
        desc: 'Providing data services in 50+ languages for LLMs, voice AI, and enterprise applications — from widely spoken tongues to rare and underrepresented dialects.',
    },
    {
        raw: 56000,
        suffix: '+',
        label: 'Global Online Resources',
        desc: 'With over 56,000 specialists worldwide, Lifewood delivers scalable 24/7 data collection, annotation, and QA operations at any volume.',
    },
];

/* Format number with comma separators */
function formatNum(n) {
    return n >= 1000 ? n.toLocaleString('en-US') : String(n);
}

/* Count-up hook — animates from 0 → target over `duration` ms */
function useCountUp(target, duration = 1600, active = false) {
    const [count, setCount] = useState(0);
    const rafRef = useRef(null);

    useEffect(() => {
        if (!active) return;
        const start = performance.now();
        const step = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out quart
            const eased = 1 - Math.pow(1 - progress, 4);
            setCount(Math.round(eased * target));
            if (progress < 1) rafRef.current = requestAnimationFrame(step);
        };
        rafRef.current = requestAnimationFrame(step);
        return () => cancelAnimationFrame(rafRef.current);
    }, [active, target, duration]);

    return count;
}

/* Individual stat card with its own count-up trigger */
function StatCard({ stat, delay }) {
    const cardRef = useRef(null);
    const [active, setActive] = useState(false);

    useEffect(() => {
        const el = cardRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setActive(true);
                    obs.unobserve(el);
                }
            },
            { threshold: 0.25 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    const count = useCountUp(stat.raw, 1400, active);

    return (
        <div
            ref={cardRef}
            className={`stats__card reveal reveal-delay-${delay}`}
            style={{ '--card-delay': `${delay * 80}ms` }}
        >
            <div className="stats__number">
                {formatNum(count)}{stat.suffix}
            </div>
            <div className="stats__label">{stat.label}</div>
            <div className="stats__divider" aria-hidden />
            <p className="stats__desc">{stat.desc}</p>
        </div>
    );
}

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
                        <StatCard key={s.label} stat={s} delay={i + 1} />
                    ))}
                </div>

            </div>
        </section>
    );
}
