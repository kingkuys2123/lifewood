import { useEffect, useRef, useState } from 'react';
import './TypeCVerticalLLMData.css';

const CARDS = [
  {
    id: '01',
    label: 'Autonomous Driving',
    title: '2D, 3D & 4D Data',
    desc: 'High-precision annotation for vehicles, pedestrians, road objects and lane markings across varying real-world conditions.',
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80',
    imageAlt: 'Autonomous vehicle on road',
  },
  {
    id: '02',
    label: 'Smart Cockpit',
    title: 'In-Vehicle Data Collection',
    desc: 'Driver Monitoring System datasets capturing facial landmarks, head pose, gaze direction, and drowsiness indicators.',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
    imageAlt: 'Smart vehicle cockpit interior',
  },
  {
    id: '03',
    label: 'Enterprise LLM',
    title: 'Vertical Industry Datasets',
    desc: 'Specialized data pipelines for maritime, logistics, and industrial verticals — purpose-built for domain-specific AI models.',
    image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80',
    imageAlt: 'Industrial AI data processing',
  },
];

function ShowcaseCard({ card, index }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`tyc-showcase-card tyc-reveal tyc-reveal-d${index + 1}${visible ? ' tyc-visible' : ''}`}
      role="article"
    >
      <img src={card.image} alt={card.imageAlt} className="tyc-showcase-card__img" loading="lazy" />
      <div className="tyc-showcase-card__overlay" aria-hidden="true" />
      <div className="tyc-showcase-card__marker" aria-hidden="true">
        <div className="tyc-showcase-card__marker-line" />
      </div>
      <div className="tyc-showcase-card__content">
        <div className="tyc-showcase-card__num" aria-hidden="true">{card.id}</div>
        <span className="tyc-showcase-card__label">{card.label}</span>
        <h3 className="tyc-showcase-card__title">{card.title}</h3>
        <p className="tyc-showcase-card__desc">{card.desc}</p>
      </div>
    </div>
  );
}

export default function TypeCShowcase() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="tyc-showcase" ref={sectionRef} aria-label="Type C use cases">
      <div className="tyc-showcase__bg-text" aria-hidden="true">VERTICAL</div>
      <div className="tyc-showcase__inner wrap">
        <div className={`tyc-showcase__eyebrow tyc-reveal${visible ? ' tyc-visible' : ''}`}>
          <span className="tyc-showcase__eyebrow-text">The Leading AI Advantage</span>
        </div>
        <h2 className={`tyc-showcase__title tyc-reveal tyc-reveal-d1${visible ? ' tyc-visible' : ''}`}>
          2D, 3D &amp; 4D Data for<br />
          <em>Autonomous Driving</em>
        </h2>
        <div className="tyc-showcase__grid">
          {CARDS.map((card, i) => (
            <ShowcaseCard key={card.id} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

