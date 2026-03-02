import { useEffect, useRef, useState } from 'react';
import './TypeCVerticalLLMData.css';

/* ── Animated counting number ─────────────────────────────── */
function CountUp({ to, suffix = '', duration = 1600 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const observed = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !observed.current) {
        observed.current = true;
        const start = performance.now();
        const tick = (now) => {
          const p = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          setVal(Math.round(ease * to));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [to, duration]);

  return <span ref={ref}>{val}{suffix}</span>;
}

/* ── Step data ─────────────────────────────────────────────── */
const STEPS = [
  {
    id: '01',
    label: 'Target',
    title: 'Precision Annotation for Autonomous Vehicles',
    body: 'Annotate vehicles, pedestrians, and road objects with 2D & 3D techniques to enable accurate object detection for autonomous driving. Self-driving cars rely on precise visual training to detect, classify, and respond safely in real-world conditions.',
    stats: [
      { num: 99,  suffix: '%', label: 'Accuracy Target' },
      { num: 2,   suffix: '',  label: 'Annotation Dims' },
      { num: 150, suffix: '+', label: 'Object Classes' },
    ],
    accent: 'var(--c-saffron)',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=900&q=80',
    imageAlt: 'Autonomous vehicle driving at night',
  },
  {
    id: '02',
    label: 'Solutions',
    title: 'Dedicated Process Engineering & AI Workflows',
    body: 'Dedicated Process Engineering team for analysis and optimization. AI-enhanced workflow with multi-level quality checks. Scalable global delivery through crowdsourced workforce management.',
    stats: [
      { num: 100, suffix: '+', label: 'Annotators (MY)' },
      { num: 150, suffix: '+', label: 'Annotators (ID)' },
      { num: 3,   suffix: '',  label: 'QA Levels' },
    ],
    accent: 'var(--c-forest)',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=900&q=80',
    imageAlt: 'Team working on AI annotation project',
  },
  {
    id: '03',
    label: 'Results',
    title: 'On-Time Delivery with Exceptional Accuracy',
    body: 'Achieved 25% production in Month 1 with 95% accuracy (Target: 90%) and 50% production in Month 2 with 99% accuracy (Target: 95%). Maintained an overall accuracy of 99% with on-time delivery. Successfully expanded operations to Malaysia and Indonesia.',
    stats: [
      { num: 99,  suffix: '%', label: 'Overall Accuracy' },
      { num: 2,   suffix: '',  label: 'Months Ramp-Up' },
      { num: 250, suffix: '+', label: 'Annotators Deployed' },
    ],
    accent: 'var(--c-saffron)',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&q=80',
    imageAlt: 'Data results analytics chart',
  },
];

export default function TypeCTimeline() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef(null);
  const [sectionVisible, setSectionVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setSectionVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="tyc-timeline" ref={sectionRef} aria-label="Type C project breakdown">
      <div className="wrap">

        {/* Header */}
        <div className={`tyc-timeline__header tyc-reveal${sectionVisible ? ' tyc-visible' : ''}`}>
          <span className="tyc-timeline__eyebrow">Type C — Vertical LLM Data</span>
          <div className="tyc-timeline__rule" aria-hidden="true" />
        </div>

        {/* Horizontal accordion */}
        <div
          className={`tyc-accordion tyc-reveal tyc-reveal-d1${sectionVisible ? ' tyc-visible' : ''}`}
          role="tablist"
          aria-label="Project stages"
        >
          {STEPS.map((step, i) => (
            <div
              key={step.id}
              className={`tyc-panel${active === i ? ' tyc-panel--active' : ''}`}
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              role="tab"
              aria-selected={active === i}
              aria-label={`${step.id} ${step.label}`}
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActive(i); }}
            >
              {/* Background image */}
              <img
                src={step.image}
                alt={step.imageAlt}
                className="tyc-panel__img"
                loading="lazy"
              />
              <div className="tyc-panel__overlay" aria-hidden="true" />

              {/* Collapsed label */}
              <div className="tyc-panel__collapsed-label" aria-hidden={active === i}>
                <div className="tyc-panel__collapsed-label-inner">
                  <span className="tyc-panel__collapsed-num">{step.id}</span>
                  <span>{step.label}</span>
                </div>
              </div>

              {/* Expanded content */}
              <div
                className="tyc-panel__content"
                role="tabpanel"
                aria-hidden={active !== i}
              >
                <div className="tyc-panel__step">
                  <span className="tyc-panel__step-num">{step.id}</span>
                  <span className="tyc-panel__step-label">{step.label}</span>
                </div>
                <h3 className="tyc-panel__title">{step.title}</h3>
                <p className="tyc-panel__body">{step.body}</p>
                <div className="tyc-panel__stats">
                  {step.stats.map((s) => (
                    <div key={s.label} className="tyc-panel__stat">
                      <span className="tyc-panel__stat-num">
                        {active === i
                          ? <CountUp to={s.num} suffix={s.suffix} duration={1200} />
                          : `0${s.suffix}`}
                      </span>
                      <span className="tyc-panel__stat-label">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation dots */}
        <div className="tyc-timeline__dots" role="tablist" aria-label="Navigate stages">
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              className={`tyc-timeline__dot${active === i ? ' tyc-timeline__dot--active' : ''}`}
              onClick={() => setActive(i)}
              aria-label={`Go to ${s.label}`}
              aria-selected={active === i}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

