import { useEffect, useRef, useState } from 'react';
import { useReveal } from '../../../hooks/useReveal';
import './TypeBHorizontalLLMData.css';

/* ── Animated counting number ──────────────────────────── */
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

/* ── Step data ──────────────────────────────────────────── */
const STEPS = [
  {
    id: '01',
    label: 'Target',
    title: 'Capture & Transcribe Globally',
    body: 'Capture and transcribe recordings from native speakers across 23 countries — Netherlands, Spain, Norway, France, Germany, Poland, Russia, Italy, Japan, South Korea, Mexico, UAE, Saudi Arabia, Egypt, and more.',
    detail: 'Voice content spans 6 project types and 9 data domains.',
    stats: [
      { num: 25400, suffix: '', label: 'Valid Hours' },
      { num: 23,    suffix: '',  label: 'Countries' },
      { num: 9,     suffix: '',  label: 'Data Domains' },
    ],
    accent: 'var(--c-saffron)',
    image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&q=80',
    imageAlt: 'Microphone recording in studio',
  },
  {
    id: '02',
    label: 'Solutions',
    title: 'Industrial-Scale Human Resources',
    body: '30,000+ native-speaking human resources from more than 30 countries were mobilized. Flexible industrial processes continuously optimized throughout the project lifecycle.',
    detail: 'PBI used to track daily collection and transcription progress in real time — analyzing and improving results continuously.',
    stats: [
      { num: 30000, suffix: '+', label: 'Native Speakers' },
      { num: 30,    suffix: '+', label: 'Countries' },
      { num: 100,   suffix: '%', label: 'Real-Time Tracking' },
    ],
    accent: 'var(--c-forest)',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80',
    imageAlt: 'Global human resources collaboration',
  },
  {
    id: '03',
    label: 'Results',
    title: 'On Time. On Quality.',
    body: '5 months to complete the voice collection and annotation of 25,400 valid hours — delivered on schedule and meeting all quality benchmarks.',
    detail: 'A benchmark in scalable, multilingual audio data delivery for large language model training.',
    stats: [
      { num: 5,     suffix: '',  label: 'Months Delivered' },
      { num: 25400, suffix: '',  label: 'Hours Annotated' },
      { num: 6,     suffix: '',  label: 'Project Types' },
    ],
    accent: 'var(--c-saffron)',
    image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80',
    imageAlt: 'Data results and analytics',
  },
];

/* ── Single step row ────────────────────────────────────── */
function StepRow({ step, index }) {
  const rowRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const isEven = index % 2 === 0;

  return (
    <div
      ref={rowRef}
      className={`tyb-step${visible ? ' tyb-step--visible' : ''}${isEven ? ' tyb-step--even' : ' tyb-step--odd'}`}
      style={{ '--step-accent': step.accent, '--step-delay': `${index * 80}ms` }}
    >
      {/* vertical connector line */}
      <div className="tyb-step__connector" aria-hidden="true">
        <div className="tyb-step__connector-line" />
        <div className="tyb-step__connector-dot" />
      </div>

      {/* text side */}
      <div className="tyb-step__text">
        <div className="tyb-step__num-wrap">
          <span className="tyb-step__num">{step.id}</span>
          <span className="tyb-step__label">{step.label}</span>
        </div>
        <h3 className="tyb-step__title">{step.title}</h3>
        <p className="tyb-step__body">{step.body}</p>
        <p className="tyb-step__detail">{step.detail}</p>

        {/* stat pills */}
        <div className="tyb-step__stats">
          {step.stats.map((s) => (
            <div key={s.label} className="tyb-step__stat">
              <span className="tyb-step__stat-num">
                {visible ? <CountUp to={s.num} suffix={s.suffix} duration={1400} /> : '0'}
              </span>
              <span className="tyb-step__stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* image side */}
      <div className="tyb-step__img-wrap">
        <div className="tyb-step__img-frame">
          <img
            src={step.image}
            alt={step.imageAlt}
            className="tyb-step__img"
            loading="lazy"
          />
          {/* accent corner tag */}
          <div className="tyb-step__img-tag">
            <span className="tyb-step__img-tag-num">{step.id}</span>
            <span className="tyb-step__img-tag-label">{step.label}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TypeBTimeline() {
  const sectionRef = useRef(null);
  useReveal(sectionRef, 0.05);

  return (
    <section className="tyb-timeline" ref={sectionRef}>
      <div className="wrap">

        {/* header */}
        <div className="tyb-timeline__header reveal">
          <span className="tyb-timeline__eyebrow">Type B — AI Data Project (Audio)</span>
          <div className="tyb-timeline__header-rule" aria-hidden="true" />
        </div>

        {/* steps */}
        <div className="tyb-timeline__steps">
          {STEPS.map((step, i) => (
            <StepRow key={step.id} step={step} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
}

