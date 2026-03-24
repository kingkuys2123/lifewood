import { useEffect, useRef, useState } from 'react';
import { useReveal } from '../../hooks/useReveal';
import './InnovationSection.css';

export default function InnovationSection() {
    const sectionRef = useRef(null);
    const videoRef   = useRef(null);
    const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

    useReveal(sectionRef);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const preloadObserver = new IntersectionObserver(
            ([entry], obs) => {
                if (entry.isIntersecting) {
                    setShouldLoadVideo(true);
                    obs.disconnect();
                }
            },
            { rootMargin: '280px 0px', threshold: 0.01 }
        );

        preloadObserver.observe(section);
        return () => preloadObserver.disconnect();
    }, []);

    /* Play / pause based on viewport visibility — saves CPU when off-screen */
    useEffect(() => {
        const video = videoRef.current;
        if (!video || !shouldLoadVideo) return;
        const obs = new IntersectionObserver(
            ([e]) => { e.isIntersecting ? video.play().catch(() => {}) : video.pause(); },
            { threshold: 0.1 }
        );
        obs.observe(video);
        return () => obs.disconnect();
    }, [shouldLoadVideo]);

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
                        preload="none"
                        src={shouldLoadVideo ? '/videos/futuristic-data-stream-in-motion.mp4' : undefined}
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
