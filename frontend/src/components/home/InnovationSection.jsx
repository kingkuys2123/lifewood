import { useEffect, useRef } from 'react';
import { useReveal } from '../../hooks/useReveal';
import dataStreamVideo from '../../assets/videos/futuristic-data-stream-in-motion.mp4';
import './InnovationSection.css';

export default function InnovationSection() {
    const sectionRef = useRef(null);
    const videoRef   = useRef(null);

    useReveal(sectionRef);

    /* Play / pause based on viewport visibility — saves CPU when off-screen */
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        const obs = new IntersectionObserver(
            ([e]) => { e.isIntersecting ? video.play().catch(() => {}) : video.pause(); },
            { threshold: 0.1 }
        );
        obs.observe(video);
        return () => obs.disconnect();
    }, []);

    return (
        <section className="innov" id="innovation" ref={sectionRef}>
            <div className="innov-inner wrap">

                {/* ── Text column ── */}
                <div className="innov-text">
                    <span className="section-eyebrow reveal">
                        <span className="section-dot" /> Innovation
                    </span>

                    <h2 className="innov-heading reveal reveal-delay-1">
                        Constant Innovation:<br />
                        <span className="innov-heading-em">Unlimited Possibilities.</span>
                    </h2>

                    <p className="innov-body reveal reveal-delay-2">
                        No matter the industry, size, or the type of data involved, our solutions
                        are capable of satisfying any AI-data processing requirement.
                    </p>

                    {/* Subtle stat strip */}
                    <div className="innov-stats reveal reveal-delay-3">
                        <div className="innov-stat">
                            <span className="innov-stat-value">50+</span>
                            <span className="innov-stat-label">Languages</span>
                        </div>
                        <div className="innov-stat-divider" aria-hidden />
                        <div className="innov-stat">
                            <span className="innov-stat-value">40+</span>
                            <span className="innov-stat-label">Delivery Centres</span>
                        </div>
                        <div className="innov-stat-divider" aria-hidden />
                        <div className="innov-stat">
                            <span className="innov-stat-value">24/7</span>
                            <span className="innov-stat-label">Operations</span>
                        </div>
                    </div>
                </div>

                {/* ── Video card column ── */}
                <div className="innov-card reveal reveal-delay-2">
                    {/* Decorative glow ring behind the card */}
                    <div className="innov-card-glow" aria-hidden />

                    <video
                        ref={videoRef}
                        className="innov-video"
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        src={dataStreamVideo}
                    />
                    <div className="innov-card-overlay" />

                    <div className="innov-card-badge">
                        <span className="innov-card-badge-dot" aria-hidden />
                        <span>Live Innovation</span>
                        <span className="innov-card-badge-year">2026</span>
                    </div>
                </div>

            </div>
        </section>
    );
}
