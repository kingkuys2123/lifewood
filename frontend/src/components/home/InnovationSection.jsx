import { useEffect, useRef } from 'react';
import { useReveal } from '../../hooks/useReveal';
import './InnovationSection.css';

export default function InnovationSection() {
    const sectionRef = useRef(null);
    const videoRef   = useRef(null);

    useReveal(sectionRef);

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
            <div className="innov__inner wrap">

                {/* Text */}
                <div className="innov__text">
                    <span className="section-eyebrow reveal"><span className="section-dot" /> Innovation</span>

                    <h2 className="innov__heading reveal reveal-delay-1">
                        Constant Innovation:<br />
                        <span className="innov__heading-em">Unlimited Possibilities.</span>
                    </h2>

                    <p className="innov__body reveal reveal-delay-2">
                        No matter the industry, size or the type of data involved, our solutions
                        are capable of satisfying any AI-data processing requirement.
                    </p>
                </div>

                {/* Video card */}
                <div className="innov__card reveal reveal-delay-2">
                    <video
                        ref={videoRef}
                        className="innov__video"
                        autoPlay
                        muted
                        loop
                        playsInline
                        src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
                    />
                    <div className="innov__card-overlay" />
                    <div className="innov__card-badge">
                        <span>Innovation</span>
                        <span className="innov__card-badge-dot" />
                        <span>2026</span>
                    </div>
                </div>

            </div>
        </section>
    );
}
