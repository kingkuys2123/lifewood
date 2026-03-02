import { useRef, useState, useEffect, useCallback } from 'react';
import { useReveal } from '../../hooks/useReveal';
import './ProcessSection.css';

const STEPS = [
    {
        id: 'collect',
        title: 'Data Collection',
        tags: ['Audio', 'Image', 'Video', 'Text', 'Sensor'],
    },
    {
        id: 'annotate',
        title: 'Annotation & Labelling',
        tags: ['Bounding Box', 'Segmentation', 'NER', 'Transcription'],
    },
    {
        id: 'quality',
        title: 'Quality Assurance',
        tags: ['Human Review', 'Automated QA', 'Consensus Check'],
    },
    {
        id: 'deliver',
        title: 'Delivery & Integration',
        tags: ['API Export', 'Custom Pipeline', 'Model-Ready Datasets'],
    },
];

export default function ProcessSection() {
    const sectionRef  = useRef(null);
    const trackRef    = useRef(null);
    const [activeIdx, setActiveIdx] = useState(0);
    const [trackH,    setTrackH]    = useState(0);

    useReveal(sectionRef, 0.08);

    /* Measure the SVG track height so the progress line scales correctly */
    useEffect(() => {
        const el = trackRef.current;
        if (!el) return;
        const update = () => setTrackH(el.clientHeight);
        update();
        const ro = new ResizeObserver(update);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const progressPct = ((activeIdx + 1) / STEPS.length);

    const handleKey = useCallback((e, idx) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setActiveIdx(idx);
        }
    }, []);

    return (
        <section className="ps" id="process" ref={sectionRef}>
            <div className="ps__inner wrap">

                {/* ── Left: sticky heading ── */}
                <div className="ps__header reveal">
                    <div className="ps__eyebrow">
                        <span className="section-eyebrow">
                            <span className="section-dot" />
                            How We Work
                        </span>
                    </div>
                    <h2 className="ps__heading">
                        From raw data<br />
                        to <span className="ps__heading-em">model-ready.</span>
                    </h2>
                    <div className="ps__rule" aria-hidden="true" />
                </div>

                {/* ── Right: interactive steps ── */}
                <div className="ps__steps reveal reveal-delay-1">

                    {/* SVG vertical connector track */}
                    <svg
                        ref={trackRef}
                        className="ps__track"
                        aria-hidden="true"
                        style={{ height: trackH || '100%' }}
                        preserveAspectRatio="none"
                    >
                        {/* Base grey line */}
                        <line
                            className="ps__track-line"
                            x1="1" y1="0"
                            x2="1" y2={trackH || 400}
                        />
                        {/* Forest green progress fill */}
                        <line
                            className="ps__track-progress"
                            x1="1" y1="0"
                            x2="1" y2={trackH || 400}
                            style={{
                                strokeDasharray: 1,
                                strokeDashoffset: 1 - progressPct,
                                pathLength: 1,
                            }}
                        />
                    </svg>

                    {STEPS.map((step, idx) => (
                        <div
                            key={step.id}
                            className={`ps__step${activeIdx === idx ? ' ps__step--active' : ''}`}
                            onClick={() => setActiveIdx(idx)}
                            onKeyDown={(e) => handleKey(e, idx)}
                            role="button"
                            tabIndex={0}
                            aria-expanded={activeIdx === idx}
                            aria-label={step.title}
                        >
                            {/* Node */}
                            <div className="ps__node" aria-hidden="true">
                                <span className="ps__node-num">
                                    {String(idx + 1).padStart(2, '0')}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="ps__content">
                                <p className="ps__step-title">{step.title}</p>

                                <div className="ps__step-body" aria-hidden={activeIdx !== idx}>
                                    <div className="ps__step-body-inner">
                                        <div className="ps__step-tags">
                                            {step.tags.map((t) => (
                                                <span key={t} className="ps__step-tag">{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="ps__step-bar" aria-hidden="true" />
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}

