import { useRef } from 'react';
import { Link } from 'react-router-dom';
import './TypeCVerticalLLMData.css';

/* ── Annotation viewport (right side) ─────────────────────── */
function AnnotationViewport() {
  return (
    <div className="tyc-hero__right">
      <div className="tyc-vp">
        <img
          src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=900&q=80"
          alt="Autonomous driving AI annotation"
          className="tyc-vp__img"
          loading="eager"
        />
        <div className="tyc-vp__overlay" />

        {/* Corner annotations */}
        <div className="tyc-vp__corner tyc-vp__corner--tl" />
        <div className="tyc-vp__corner tyc-vp__corner--tr" />
        <div className="tyc-vp__corner tyc-vp__corner--bl" />
        <div className="tyc-vp__corner tyc-vp__corner--br" />

        {/* Moving scan line */}
        <div className="tyc-vp__scan" aria-hidden="true" />

        {/* Simulated bounding boxes */}
        <div
          className="tyc-vp__bbox"
          style={{ top: '22%', left: '30%', width: '22%', height: '32%' }}
          aria-hidden="true"
        >
          <span className="tyc-vp__bbox-label">Vehicle · 97.4%</span>
        </div>
        <div
          className="tyc-vp__bbox"
          style={{ top: '38%', left: '62%', width: '14%', height: '24%',
            animationDelay: '1.4s',
            borderColor: 'rgba(4,98,65,0.85)'
          }}
          aria-hidden="true"
        >
          <span className="tyc-vp__bbox-label" style={{ color: 'rgba(4,200,130,0.95)' }}>Pedestrian · 93.1%</span>
        </div>

        {/* Bottom info bar */}
        <div className="tyc-vp__label-bar">
          <span className="tyc-vp__label-text">Live Annotation Feed</span>
          <span className="tyc-vp__label-dot" />
        </div>
      </div>

      {/* Floating stat chips */}
      <div className="tyc-chip" style={{ top: '6%', right: '-4%' }}>
        <span className="tyc-chip__num">99%</span>
        <span className="tyc-chip__label">Accuracy</span>
      </div>
      <div className="tyc-chip" style={{ bottom: '18%', left: '-6%' }}>
        <span className="tyc-chip__num">2D+3D</span>
        <span className="tyc-chip__label">Techniques</span>
      </div>
    </div>
  );
}

const TAGS = [
  '2D & 3D Object Annotation',
  'Autonomous Driving Datasets',
  'In-Vehicle Data Collection',
];

export default function TypeCHero() {
  const sectionRef = useRef(null);

  return (
    <section className="tyc-hero" ref={sectionRef} aria-label="Type C – Vertical LLM Data">
      {/* Subtle bg decorations */}
      <div className="tyc-hero__scanlines" aria-hidden="true" />
      <div className="tyc-hero__grid" aria-hidden="true" />

      <div className="tyc-hero__inner wrap">
        <div className="tyc-hero__layout">

          {/* ── Left ── */}
          <div className="tyc-hero__left">

            <h1 className="tyc-hero__h1">
              <span className="tyc-hero__h1-sub">Type C –</span>
              <span className="tyc-hero__h1-main">
                Vertical<br />
                <span className="tyc-hero__h1-accent">LLM</span> Data
              </span>
            </h1>

            <p className="tyc-hero__lead">
              AI data solutions across specific industry verticals including
              autonomous driving data annotation, in-vehicle data collection,
              and specialized data services for industry, enterprise, or private LLM.
            </p>

            <ul className="tyc-hero__tags" aria-label="Capabilities">
              {TAGS.map((t) => (
                <li key={t} className="tyc-hero__tag">
                  <span className="tyc-hero__tag-bullet" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* ── Right ── */}
          <AnnotationViewport />

        </div>
      </div>

      {/* Highlights strip */}
      <div className="tyc-hero__strip wrap" aria-label="Key highlights">
        <p className="tyc-hero__strip-item">
          Autonomous driving and Smart cockpit datasets for Driver Monitoring System
        </p>
        <span className="tyc-hero__strip-sep" aria-hidden="true" />
        <p className="tyc-hero__strip-item">
          China Merchants Group: Enterprise-grade dataset for building "ShipGPT"
        </p>
      </div>
    </section>
  );
}

