import { useEffect, useRef, useState } from 'react';
import { useReveal } from '../../hooks/useReveal';
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
function useCountUp(target, duration = 1400, active = false) {
    const [count, setCount] = useState(0);
    const rafRef = useRef(null);

    useEffect(() => {
        if (!active) return;
        setCount(0);
        const start = performance.now();
        const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
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
function StatCard({ stat, index }) {
    const cardRef = useRef(null);
    const [visible, setVisible] = useState(false);
    const count = useCountUp(stat.raw, 1400, visible);

    useEffect(() => {
        const el = cardRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    obs.unobserve(el);
                }
            },
            { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <div
            ref={cardRef}
            className="stats__card"
            data-visible={visible}
            style={{ '--card-i': index }}
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
    useReveal(sectionRef);

    return (
        <section className="stats" id="stats" ref={sectionRef}>
            <div className="stats__inner wrap">

                {/* Header */}
                <div className="stats__header reveal">
                    <span className="section-eyebrow">
                        <span className="section-dot" /> Transforming
                    </span>
                    <p className="stats__sub">
                        By connecting local expertise with our global AI data infrastructure, we create
                        opportunities, empower communities, and drive inclusive growth worldwide.
                    </p>
                </div>

                {/* Cards */}
                <div className="stats__grid">
                    {STATS.map((s, i) => (
                        <StatCard key={s.label} stat={s} index={i} />
                    ))}
                </div>

            </div>
        </section>
    );
}
