import { useMemo, useRef } from 'react';
import './TypeCVerticalLLMData.css';

/* ── Annotation viewport (right side) ─────────────────────── */
function AnnotationViewport() {
  const meshRef = useRef(null);
  const particles = useMemo(
    () => Array.from({ length: 28 }, (_, index) => ({
      id: index,
      x: (index * 37) % 100,
      y: (index * 19) % 100,
      size: 2 + (index % 4),
      delay: `${(index % 7) * 0.22}s`,
    })),
    [],
  );

  const onPointerMove = (event) => {
    const node = meshRef.current;
    if (!node) {
      return;
    }

    const bounds = node.getBoundingClientRect();
    const px = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
    const py = ((event.clientY - bounds.top) / bounds.height) * 2 - 1;
    node.style.setProperty('--mx', px.toFixed(3));
    node.style.setProperty('--my', py.toFixed(3));
  };

  const onPointerLeave = () => {
    const node = meshRef.current;
    if (!node) {
      return;
    }
    node.style.setProperty('--mx', '0');
    node.style.setProperty('--my', '0');
  };

  return (
    <div className="tyc-hero__right">
      <div
        className="tyc-vp tyc-vp--mesh"
        ref={meshRef}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      >
        <div className="tyc-vp__mesh-bg" aria-hidden="true" />
        <div className="tyc-vp__sphere" aria-hidden="true" />
        <div className="tyc-vp__ring tyc-vp__ring--one" aria-hidden="true" />
        <div className="tyc-vp__ring tyc-vp__ring--two" aria-hidden="true" />

        <div className="tyc-vp__particles" aria-hidden="true">
          {particles.map((particle) => (
            <span
              key={particle.id}
              className="tyc-vp__particle"
              style={{
                '--x': `${particle.x}%`,
                '--y': `${particle.y}%`,
                '--size': `${particle.size}px`,
                '--delay': particle.delay,
              }}
            />
          ))}
        </div>

        <div className="tyc-vp__annotation-card" aria-hidden="true">
          <p className="tyc-vp__annotation-title">Semantic Intelligence Mesh</p>
          <p className="tyc-vp__annotation-sub">3D Vertical Dataset Fusion</p>
        </div>

        <div className="tyc-vp__label-bar">
          <span className="tyc-vp__label-text">Interactive 3D Cognition Node</span>
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
                Vertical{' '}
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

