import { useRef } from 'react';
import { useReveal } from '../../hooks/useReveal';
import './ServicesSection.css';

/* ── Per-service metadata ────────────────────────────────── */
const SERVICES = [
    {
        id: 'audio',
        label: 'Audio',
        tag: '01',
        desc: 'Collection, labelling, voice categorisation, music tagging, and intelligent classification across dozens of languages and dialects.',
        /* Inline SVG used as CSS background — avoids external image dependency */
        bg: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='480' viewBox='0 0 400 480'%3E%3Crect width='400' height='480' fill='%230d2218'/%3E%3Ccircle cx='200' cy='240' r='180' fill='none' stroke='%23133020' stroke-width='1'/%3E%3Ccircle cx='200' cy='240' r='120' fill='none' stroke='%231a3d28' stroke-width='1'/%3E%3Ccircle cx='200' cy='240' r='60' fill='none' stroke='%23214d32' stroke-width='1'/%3E%3Cpath d='M160 200 Q200 160 240 200 Q200 280 160 200Z' fill='%23F5A623' fill-opacity='0.12'/%3E%3Cpath d='M100 240 Q140 180 180 240 Q140 300 100 240Z' fill='%23F5A623' fill-opacity='0.06'/%3E%3Cpath d='M220 240 Q260 180 300 240 Q260 300 220 240Z' fill='%23F5A623' fill-opacity='0.06'/%3E%3Cline x1='60' y1='240' x2='340' y2='240' stroke='%23F5A623' stroke-width='0.5' stroke-opacity='0.3'/%3E%3C/svg%3E")`,
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
            </svg>
        ),
    },
    {
        id: 'image',
        label: 'Image',
        tag: '02',
        desc: 'Collection, labelling, classification, audit, object detection, segmentation, and bounding-box annotation at scale.',
        bg: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='480' viewBox='0 0 400 480'%3E%3Crect width='400' height='480' fill='%230b1d14'/%3E%3Crect x='40' y='60' width='320' height='360' rx='12' fill='none' stroke='%231a3d28' stroke-width='1'/%3E%3Crect x='80' y='100' width='100' height='100' rx='6' fill='%23133020' stroke='%23F5A623' stroke-width='0.8' stroke-opacity='0.4'/%3E%3Crect x='220' y='100' width='100' height='100' rx='6' fill='%23133020' stroke='%23F5A623' stroke-width='0.8' stroke-opacity='0.4'/%3E%3Crect x='80' y='240' width='240' height='130' rx='6' fill='%23133020' stroke='%23F5A623' stroke-width='0.8' stroke-opacity='0.4'/%3E%3Ccircle cx='108' cy='128' r='16' fill='%23F5A623' fill-opacity='0.15'/%3E%3Cpath d='M80 185 L120 145 L155 175 L180 155 L180 200 L80 200Z' fill='%23F5A623' fill-opacity='0.18'/%3E%3C/svg%3E")`,
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2.5" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
            </svg>
        ),
    },
    {
        id: 'video',
        label: 'Video',
        tag: '03',
        desc: 'Frame-level labelling, activity recognition, subtitle generation, live broadcast QA, and multi-track annotation pipelines.',
        bg: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='480' viewBox='0 0 400 480'%3E%3Crect width='400' height='480' fill='%230d1e16'/%3E%3Crect x='40' y='140' width='240' height='200' rx='10' fill='%23133020' stroke='%23214d32' stroke-width='1'/%3E%3Cpolygon points='320,200 280,220 280,260 320,280' fill='%23F5A623' fill-opacity='0.35' stroke='%23F5A623' stroke-width='1' stroke-opacity='0.6'/%3E%3Ccircle cx='160' cy='240' r='40' fill='none' stroke='%23F5A623' stroke-width='0.8' stroke-opacity='0.3'/%3E%3Cpolygon points='148,224 148,256 180,240' fill='%23F5A623' fill-opacity='0.25'/%3E%3Cline x1='40' y1='380' x2='280' y2='380' stroke='%23F5A623' stroke-width='2' stroke-opacity='0.2' stroke-linecap='round'/%3E%3Ccircle cx='110' cy='380' r='4' fill='%23F5A623' fill-opacity='0.5'/%3E%3C/svg%3E")`,
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" />
            </svg>
        ),
    },
    {
        id: 'text',
        label: 'Text',
        tag: '04',
        desc: 'Transcription, utterance collection, sentiment analysis, NER tagging, and multilingual corpus construction for LLM training.',
        bg: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='480' viewBox='0 0 400 480'%3E%3Crect width='400' height='480' fill='%230c1c13'/%3E%3Crect x='60' y='80' width='280' height='16' rx='4' fill='%231a3d28'/%3E%3Crect x='60' y='112' width='220' height='12' rx='3' fill='%231a3d28' fill-opacity='0.7'/%3E%3Crect x='60' y='140' width='260' height='12' rx='3' fill='%231a3d28' fill-opacity='0.7'/%3E%3Crect x='60' y='168' width='180' height='12' rx='3' fill='%231a3d28' fill-opacity='0.5'/%3E%3Crect x='60' y='210' width='280' height='14' rx='4' fill='%23F5A623' fill-opacity='0.18'/%3E%3Crect x='60' y='240' width='240' height='12' rx='3' fill='%231a3d28' fill-opacity='0.6'/%3E%3Crect x='60' y='268' width='200' height='12' rx='3' fill='%231a3d28' fill-opacity='0.6'/%3E%3Crect x='60' y='310' width='140' height='32' rx='6' fill='%23F5A623' fill-opacity='0.2' stroke='%23F5A623' stroke-width='0.8' stroke-opacity='0.5'/%3E%3C/svg%3E")`,
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
        ),
    },
];

export default function ServicesSection() {
    const sectionRef = useRef(null);
    useReveal(sectionRef);

    return (
        <section className="services" id="services" ref={sectionRef}>
            <div className="services-inner wrap">

                {/* ── Header ── */}
                <div className="services-header reveal">
                    <span className="section-eyebrow">
                        <span className="section-dot" /> AI Data Services
                    </span>
                    <div className="services-header-row">
                        <h2 className="services-heading">
                            Data for every<br />AI modality.
                        </h2>
                        <p className="services-sub">
                            From audio to complex video — our specialist teams and
                            proprietary tooling deliver training-ready data across
                            every dimension of AI.
                        </p>
                    </div>
                </div>

                {/* ── Collage grid ── */}
                <div className="services-grid">
                    {SERVICES.map((s, i) => (
                        <div
                            key={s.id}
                            className={`service-tile reveal reveal-delay-${i + 1}`}
                            style={{ '--tile-bg': s.bg }}
                        >
                            {/* Background art */}
                            <div className="service-tile-art" aria-hidden />

                            {/* Always-visible label bar */}
                            <div className="service-tile-label">
                                <span className="service-tile-tag">{s.tag}</span>
                                <span className="service-tile-name">
                                    {s.icon}
                                    {s.label}
                                </span>
                            </div>

                            {/* Hover reveal — description */}
                            <div className="service-tile-hover" aria-hidden="true">
                                <div className="service-tile-hover-inner">
                                    <span className="service-tile-hover-tag">{s.tag}</span>
                                    <p className="service-tile-hover-title">{s.label}</p>
                                    <p className="service-tile-hover-desc">{s.desc}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
