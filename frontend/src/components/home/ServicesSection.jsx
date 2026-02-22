import { useEffect, useRef, useState } from 'react';
import './ServicesSection.css';

const SERVICES = [
    {
        id: 'audio',
        label: 'Audio',
        icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
            </svg>
        ),
        desc: 'Collection, labelling, voice categorization, music categorization, intelligent cs',
    },
    {
        id: 'image',
        label: 'Image',
        icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2.5" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
            </svg>
        ),
        desc: 'Collection, labelling, classification, audit, object detection and tagging',
    },
    {
        id: 'video',
        label: 'Video',
        icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" />
            </svg>
        ),
        desc: 'Collection, labelling, audit, live broadcast, subtitle generation',
    },
    {
        id: 'text',
        label: 'Text',
        icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
        ),
        desc: 'Text, collection, labelling, transcription, utterance collection, sentiment analysis',
    },
];

export default function ServicesSection() {
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
        <section className="services" id="services" ref={sectionRef}>
            <div className="services__inner wrap">

                {/* Header */}
                <div className="services__header reveal">
                    <span className="section-eyebrow"><span className="section-dot" /> AI DATA SERVICES</span>
                    <h2 className="services__heading">
                        Data for every<br />AI modality.
                    </h2>
                    <p className="services__sub">
                        From audio to complex video — our specialist teams and proprietary tooling deliver
                        training-ready data across every dimension of AI.
                    </p>
                </div>

                {/* Glassmorphism hover cards */}
                <div className="services__grid">
                    {SERVICES.map((s, i) => (
                        <div key={s.id} className={`svc-card reveal reveal-delay-${i + 1}`}>
                            {/* Default face */}
                            <div className="svc-card__front">
                                <div className="svc-card__icon">{s.icon}</div>
                                <span className="svc-card__label">{s.label}</span>
                            </div>
                            {/* Hover face */}
                            <div className="svc-card__back">
                                <div className="svc-card__back-icon">{s.icon}</div>
                                <span className="svc-card__back-label">{s.label}</span>
                                <p className="svc-card__desc">{s.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
