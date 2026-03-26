import { useRef } from 'react';
import AccordionGallery from './AccordionGallery';
import { useReveal } from '../../hooks/useReveal';
import './ServicesSection.css';

const SERVICE_IMAGES = {
    audio: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1400&q=80',
    image: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1400&q=80',
    video: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1400&q=80',
    text: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1400&q=80',
};

const SERVICES = [
    {
        id: 'audio',
        title: 'Audio',
        tag: '01',
        description: 'Collection, labelling, voice categorisation, music tagging, and intelligent classification across dozens of languages and dialects.',
        image: SERVICE_IMAGES.audio,
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
            </svg>
        ),
    },
    {
        id: 'image',
        title: 'Image',
        tag: '02',
        description: 'Collection, labelling, classification, audit, object detection, segmentation, and bounding-box annotation at scale.',
        image: SERVICE_IMAGES.image,
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
        title: 'Video',
        tag: '03',
        description: 'Frame-level labelling, activity recognition, subtitle generation, live broadcast QA, and multi-track annotation pipelines.',
        image: SERVICE_IMAGES.video,
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" />
            </svg>
        ),
    },
    {
        id: 'text',
        title: 'Text',
        tag: '04',
        description: 'Transcription, utterance collection, sentiment analysis, NER tagging, and multilingual corpus construction for LLM training.',
        image: SERVICE_IMAGES.text,
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

                <AccordionGallery
                    items={SERVICES}
                    ariaLabel="Lifewood AI data services"
                />

            </div>
        </section>
    );
}
