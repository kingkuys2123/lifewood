import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useReveal } from '../../hooks/useReveal';
import './AboutSection.css';

// ── Stats config ─────────────────────────────────────────────
const STATS = [
    { value: 50,  suffix: 'M+', label: 'Data points processed' },
    { value: 150, suffix: '+',  label: 'Enterprise clients'     },
    { value: 15,  suffix: '+',  label: 'Countries served'       },
];

// ── Count-up hook ─────────────────────────────────────────────
function useCountUp(target, { active, duration = 1500, delay = 0 } = {}) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!active) return;
        let startTime = null;
        let rafId;

        const step = (ts) => {
            if (startTime === null) startTime = ts + delay;
            const elapsed = Math.max(0, ts - startTime);
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - (1 - progress) ** 4;        // ease-out quart
            setCount(Math.round(eased * target));
            if (progress < 1) rafId = requestAnimationFrame(step);
        };

        rafId = requestAnimationFrame(step);
        return () => cancelAnimationFrame(rafId);
    }, [active, target, duration, delay]);

    return count;
}

// ── Single stat with count-up ─────────────────────────────────
function StatItem({ value, suffix, label, active, delay }) {
    const count = useCountUp(value, { active, delay });

    return (
        <div
            className={`about__stat${active ? ' about__stat--visible' : ''}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            <span className="about__stat-value">
                {count}
                <span className="about__stat-suffix">{suffix}</span>
            </span>
            <span className="about__stat-label">{label}</span>
        </div>
    );
}

// ── Section ───────────────────────────────────────────────────
export default function AboutSection() {
    const sectionRef = useRef(null);
    const statsRef   = useRef(null);
    const [statsActive, setStatsActive] = useState(false);

    useReveal(sectionRef, 0.12);

    // Activate counters when the stats block enters the viewport
    useEffect(() => {
        const el = statsRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setStatsActive(true);
                    obs.disconnect();
                }
            },
            { threshold: 0.35 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <section className="about" id="about" ref={sectionRef}>
            <div className="about__inner wrap">

                {/* Eyebrow */}
                <div className="about__label-row reveal">
                    <span className="section-eyebrow">
                        <span className="section-dot" />
                        About us
                    </span>
                </div>

                {/* Grid */}
                <div className="about__grid">

                    {/* ── Left column ── */}
                    <div className="about__left reveal">

                        {/* Word-by-word heading reveal */}
                        <h2 className="about__heading" aria-label="Who we are">
                            {['Who', 'we', 'are'].map((word, i) => (
                                <span key={word} className="about__word-clip">
                                    <span
                                        className="about__heading-word"
                                        style={{ '--wi': i }}
                                    >
                                        {word}
                                    </span>
                                </span>
                            ))}
                        </h2>

                        {/* Accent line + shimmer */}
                        <div className="about__accent-line" aria-hidden />

                        {/* Animated stat counters */}
                        <div className="about__stats" ref={statsRef}>
                            {STATS.map((stat, i) => (
                                <StatItem
                                    key={stat.label}
                                    {...stat}
                                    active={statsActive}
                                    delay={i * 160}
                                />
                            ))}
                        </div>
                    </div>

                    {/* ── Right column ── */}
                    <div className="about__right">

                        {/* Primary body text card */}
                        <div className="about__card reveal reveal-delay-1">
                            <p className="about__body">
                                At Lifewood we empower our company and our clients to realize the
                                transformative power of AI: bringing big data to life; launching new
                                ways of thinking, learning and doing; for the good of humankind.
                            </p>
                        </div>

                        {/* Secondary sub-text card */}
                        <div className="about__card about__card--sub reveal reveal-delay-2">
                            <p className="about__sub">
                                Headquartered in Asia with a global footprint, we blend deep domain
                                expertise with cutting-edge machine learning to turn raw information
                                into strategic advantage.
                            </p>
                        </div>

                        {/* CTA */}
                        <div className="about__footer reveal reveal-delay-3">
                            <Link to="/our-company/about" className="btn btn-forest about__btn">
                                Know Us Better
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                                    <path d="M3.5 8h9M9 4.5 12.5 8 9 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
