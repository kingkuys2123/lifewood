import { useRef, useEffect } from 'react';
import './CareersImage.css';

/* Uses a free Unsplash-compatible photo URL — swap for a local asset if preferred */
const MEETING_IMG = 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80';

export default function CareersImage() {
    const imgRef     = useRef(null);
    const captionRef = useRef(null);

    /* Subtle parallax on scroll */
    useEffect(() => {
        const img = imgRef.current;
        if (!img) return;
        const onScroll = () => {
            const rect = img.closest('.careers-image').getBoundingClientRect();
            const progress = -rect.top / (window.innerHeight + rect.height);
            img.style.transform = `translateY(${progress * 12}%)`;
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    /* Fade-in caption when section enters viewport */
    useEffect(() => {
        const el = captionRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { el.classList.add('ci-visible'); obs.unobserve(el); } },
            { threshold: 0.3 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <div className="careers-image" role="img" aria-label="Lifewood team collaborating in a meeting">
            <img
                ref={imgRef}
                src={MEETING_IMG}
                alt=""
                className="careers-image__img"
                loading="lazy"
                decoding="async"
            />
            <div className="careers-image__grad-top" aria-hidden="true" />
            <div className="careers-image__grad-bot" aria-hidden="true" />

            <div className="careers-image__caption" ref={captionRef}>
                <p className="careers-image__quote">
                    A culture built on <em>trust,</em><br />
                    driven by <em>innovation</em>
                </p>
                <span className="careers-image__rule" aria-hidden="true" />
                <span className="careers-image__sub">Lifewood · Global Team</span>
            </div>
        </div>
    );
}

