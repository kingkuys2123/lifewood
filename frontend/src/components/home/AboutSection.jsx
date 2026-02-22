import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './AboutSection.css';

export default function AboutSection() {
    const sectionRef = useRef(null);

    useEffect(() => {
        const els = sectionRef.current?.querySelectorAll('.reveal') ?? [];
        if (!els.length) return;
        const obs = new IntersectionObserver(
            (entries) => entries.forEach(e => {
                if (e.isIntersecting) { e.target.classList.add('reveal--visible'); obs.unobserve(e.target); }
            }),
            { threshold: 0.15 }
        );
        els.forEach(el => obs.observe(el));
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
                    {/* Left */}
                    <div className="about__left reveal">
                        <h2 className="about__heading">Who we are</h2>
                        <div className="about__accent-line" aria-hidden />
                    </div>

                    {/* Right */}
                    <div className="about__right">
                        <p className="about__body reveal reveal-delay-1">
                            At Lifewood we empower our company and our clients to realize the
                            transformative power of AI: bringing big data to life; launching new
                            ways of thinking, learning and doing; for the good of humankind.
                        </p>
                        <p className="about__sub reveal reveal-delay-2">
                            Headquartered in Asia with a global footprint, we blend deep domain
                            expertise with cutting-edge machine learning to turn raw information
                            into strategic advantage.
                        </p>
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
