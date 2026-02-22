import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import heroVideo from '../../assets/videos/light-and-shadows-on-folded-papers.mp4';
import './HeroSection.css';

export default function HeroSection() {
    const videoRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        const obs = new IntersectionObserver(
            ([e]) => { e.isIntersecting ? video.play().catch(() => { }) : video.pause(); },
            { threshold: 0.1 }
        );
        obs.observe(video);
        return () => obs.disconnect();
    }, []);

    return (
        <section className="hero" id="hero">
            <div className="hero__media">
                <video
                    ref={videoRef}
                    className="hero__video"
                    autoPlay
                    muted
                    loop
                    playsInline
                    src={heroVideo}
                />
                <div className="hero__overlay" />
            </div>

            {/* Content */}
            <div className="hero__body wrap">
                <div className="hero__content">
                    <h1 className="hero__h1">
                        The world's leading<br />
                        provider of AI-powered<br />
                        <span className="hero__h1-em">data solutions.</span>
                    </h1>

                    <div className="hero__actions">
                        <Link to="/contact" className="btn btn-saffron hero__cta">
                            Contact Us
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                                <path d="M3.5 8h9M9 4.5 12.5 8 9 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Scroll cue */}
            <div className="hero__scroll" aria-hidden>
                <div className="hero__scroll-track">
                    <div className="hero__scroll-thumb" />
                </div>
            </div>
        </section>
    );
}
