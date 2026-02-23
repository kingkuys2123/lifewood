import { useRef, useEffect } from 'react';
import './PhMountain.css';

const MOUNTAIN_URL = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1800&q=80';

export default function PhMountain() {
    const imgRef     = useRef(null);
    const captionRef = useRef(null);

    useEffect(() => {
        const img = imgRef.current;
        if (!img) return;
        const onScroll = () => {
            const rect = img.closest('.ph-mountain').getBoundingClientRect();
            const progress = -rect.top / (window.innerHeight + rect.height);
            img.style.transform = `translateY(${progress * 14}%)`;
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const el = captionRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { el.classList.add('phm-visible'); obs.unobserve(el); } },
            { threshold: 0.3 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <div className="ph-mountain" role="img" aria-label="Silhouette of people climbing a mountain at sunrise">
            <img ref={imgRef} src={MOUNTAIN_URL} alt="" className="ph-mountain__img" loading="lazy" decoding="async"/>
            <div className="ph-mountain__grad-top" aria-hidden="true"/>
            <div className="ph-mountain__grad-bot" aria-hidden="true"/>
            <div className="ph-mountain__caption" ref={captionRef}>
                <p className="ph-mountain__quote">
                    Climbing higher,<br/>together — <em>for lasting change</em>
                </p>
                <span className="ph-mountain__rule" aria-hidden="true"/>
            </div>
        </div>
    );
}

