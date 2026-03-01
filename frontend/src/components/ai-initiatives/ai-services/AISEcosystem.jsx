import { useRef, useState, useEffect } from 'react';
import { useReveal } from '../../../hooks/useReveal';
import lifewoodIconText from '../../../assets/branding/lifewood-icon-text.png';
import './AIServices.css';

/* ─────────────────────────────────────────────
   CARD 1 — Data Validation
   Dark card · animated terminal typewriter
───────────────────────────────────────────── */
const TERMINAL_LINES = [
  'Checking schema integrity…',
  'Validating data types…',
  'Applying constraint rules…',
  'No anomalies detected.',
  '✓ Data clean & verified',
];

function ValidationCard() {
  const [lines, setLines] = useState([]);
  const [active, setActive] = useState(false);
  const timerRef = useRef(null);

  const runTerminal = () => {
    if (active) return;
    setActive(true);
    setLines([]);
    TERMINAL_LINES.forEach((txt, i) => {
      timerRef.current = setTimeout(() => {
        setLines(prev => [...prev, txt]);
        if (i === TERMINAL_LINES.length - 1) setActive(false);
      }, i * 500 + 300);
    });
  };

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return (
    <article
      className="eco-card eco-card--validation reveal"
      onMouseEnter={runTerminal}
      tabIndex={0}
      onFocus={runTerminal}
    >

      <div className="eco-val__text">
        <h3 className="eco-card__title">Data Validation</h3>
        <p className="eco-card__body">
          The goal is to create data that is consistent, accurate and complete,
          preventing data loss or errors in transfer, code or configuration.
        </p>
        <p className="eco-card__copy">
          We verify that data conforms to predefined standards, rules or
          constraints, ensuring the information is trustworthy and fit for its
          intended purpose.
        </p>
      </div>

      {/* terminal window */}
      <div className="eco-val__terminal">
        <div className="eco-val__scan-line" aria-hidden="true" />
        <div className="eco-val__output" aria-live="polite">
          {lines.map((l, i) => (
            <div key={i} className={`eco-val__line${i === lines.length - 1 && l.startsWith('✓') ? ' eco-val__line--ok' : ''}`}>
              <span className="eco-val__prompt">{'>'}</span>
              <span>{l}</span>
              {i === lines.length - 1 && active === false && l.startsWith('✓') ? null :
                i === lines.length - 1 ? <span className="eco-val__cursor" /> : null}
            </div>
          ))}
          {lines.length === 0 && (
            <div className="eco-val__line eco-val__line--idle">
              <span className="eco-val__prompt">{'>'}</span>
              <span>Hover to run validation…</span>
              <span className="eco-val__cursor" />
            </div>
          )}
        </div>
      </div>

      <p className="eco-card__copyright">© 2025 Lifewood Data Technology</p>
    </article>
  );
}

/* ─────────────────────────────────────────────
   CARD 2 — Data Collection
   Stacked rotating folder tabs
───────────────────────────────────────────── */
const FOLDERS = [
  { label: 'Text',  color: '#F5A623', icon: '📝' },
  { label: 'Audio', color: '#1a6b3c', icon: '🎙️' },
  { label: 'Video', color: '#F5A623', icon: '🎬' },
  { label: 'Image', color: '#1a6b3c', icon: '🖼️' },
];

function CollectionCard() {
  const [open, setOpen] = useState(null);
  return (
    <article
      className="eco-card eco-card--collection reveal reveal-delay-1"
      onMouseLeave={() => setOpen(null)}
    >
      <h3 className="eco-card__title">Data Collection</h3>
      <p className="eco-card__body">
        Lifewood delivers multi-modal data collection across text, audio,
        image, and video, supported by advanced workflows for categorization,
        labeling, tagging, transcription, sentiment analysis, and subtitle
        generation.
      </p>
      <p className="eco-card__copy">
        Our scalable processes ensure accuracy and cultural nuance across
        30+ languages and regions.
      </p>

      {/* folder stack */}
      <div className="eco-col__folders" aria-hidden="true">
        {FOLDERS.map((f, i) => (
          <button
            key={f.label}
            className={`eco-col__folder${open === i ? ' is-open' : ''}`}
            style={{ '--fc': f.color, '--fi': i }}
            onMouseEnter={() => setOpen(i)}
            tabIndex={-1}
          >
            <span className="eco-col__folder-tab" />
            <span className="eco-col__folder-body">
              <span className="eco-col__folder-icon">{f.icon}</span>
              <span className="eco-col__folder-label">{f.label}</span>
            </span>
          </button>
        ))}
      </div>
    </article>
  );
}

/* ─────────────────────────────────────────────
   CARD 3 — Data Acquisition
   Spinning orbit with real Lifewood logo
───────────────────────────────────────────── */
const ORBIT_ITEMS = [
  { src: 'https://picsum.photos/seed/data1/48/48', alt: 'Dataset 1' },
  { src: 'https://picsum.photos/seed/data2/48/48', alt: 'Dataset 2' },
  { src: 'https://picsum.photos/seed/data3/48/48', alt: 'Dataset 3' },
  { src: 'https://picsum.photos/seed/data4/48/48', alt: 'Dataset 4' },
];

function AcquisitionCard() {
  const [spinning, setSpinning] = useState(true);
  return (
    <article
      className="eco-card eco-card--acquisition reveal reveal-delay-2"
      onMouseEnter={() => setSpinning(false)}
      onMouseLeave={() => setSpinning(true)}
    >
      <h3 className="eco-card__title">Data Acquisition</h3>
      <p className="eco-card__body">
        We provide <strong>end-to-end data acquisition solutions</strong>—
        capturing, processing, and managing large-scale, diverse datasets.
      </p>

      <div className="eco-acq__stage" aria-hidden="true">
        {/* outer dashed ring */}
        <div className={`eco-acq__ring eco-acq__ring--outer${spinning ? ' is-spinning' : ''}`}>
          {ORBIT_ITEMS.map((item, i) => (
            <span
              key={i}
              className="eco-acq__planet"
              style={{ '--pi': i, '--total': ORBIT_ITEMS.length }}
            >
              <img src={item.src} alt={item.alt} className="eco-acq__planet-img" />
            </span>
          ))}
        </div>
        {/* inner solid ring */}
        <div className={`eco-acq__ring eco-acq__ring--inner${spinning ? ' is-spinning-reverse' : ''}`} />
        {/* center hub with real logo */}
        <div className="eco-acq__hub">
          <img src={lifewoodIconText} alt="Lifewood" className="eco-acq__logo" />
        </div>
      </div>
    </article>
  );
}

/* ─────────────────────────────────────────────
   CARD 4 — Data Curation
   Morphing colour-dot constellation
───────────────────────────────────────────── */
const DOT_CFG = [
  { c: 'saffron', size: 38 }, { c: 'saffron', size: 30 },
  { c: 'forest',  size: 34 }, { c: 'saffron', size: 26 },
  { c: 'forest',  size: 38 }, { c: 'saffron', size: 30 },
  { c: 'forest',  size: 34 }, { c: 'forest',  size: 26 },
];

function CurationCard() {
  const [hovered, setHovered] = useState(false);
  return (
    <article
      className="eco-card eco-card--curation reveal reveal-delay-1"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <h3 className="eco-card__title">Data Curation</h3>
      <p className="eco-card__body">
        We sift, select and index data to ensure reliability, accessibility
        and ease of classification.
      </p>
      <p className="eco-card__copy">
        Data can be curated to support business decisions, academic
        research, genealogies, scientific research and more.
      </p>

      <div className={`eco-cur__field${hovered ? ' is-excited' : ''}`} aria-hidden="true">
        {DOT_CFG.map((d, i) => (
          <span
            key={i}
            className={`eco-cur__dot eco-cur__dot--${d.c}`}
            style={{ '--di': i, '--ds': `${d.size}px` }}
          />
        ))}
        {/* connector lines via SVG overlay */}
        <svg className="eco-cur__svg" viewBox="0 0 260 80" preserveAspectRatio="none">
          <polyline points="19,40 57,40 95,40 133,40 171,40 209,40 247,40" className="eco-cur__line" />
          <polyline points="19,40 57,20 133,60 209,20 247,40" className="eco-cur__line eco-cur__line--alt" />
        </svg>
      </div>
    </article>
  );
}

/* ─────────────────────────────────────────────
   CARD 5 — Data Annotation
   Flip card — front has spinning tag icon, back reveals badge
───────────────────────────────────────────── */
function AnnotationCard() {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="eco-ann__wrapper reveal reveal-delay-2">
      <article
        className={`eco-card eco-card--annotation${flipped ? ' is-flipped' : ''}`}
        onMouseEnter={() => setFlipped(true)}
        onMouseLeave={() => setFlipped(false)}
        tabIndex={0}
        onFocus={() => setFlipped(true)}
        onBlur={() => setFlipped(false)}
        aria-label="Data Annotation – hover to reveal"
      >
      <div className="eco-ann__flipper">
        {/* ── FRONT ── */}
        <div className="eco-ann__face eco-ann__front">
          <h3 className="eco-card__title">Data Annotation</h3>
          <p className="eco-card__body">
            In the age of AI, data is the fuel for all analytic and machine
            learning. With our in-depth library of services, we're here to be
            an integral part of your digital strategy, accelerating your
            organization's cognitive systems development.
          </p>
          <div className="eco-ann__tag-wrap" aria-hidden="true">
            <span className="eco-ann__tag-icon">🏷️</span>
          </div>
          <span className="eco-ann__hint">Hover to reveal ↗</span>
        </div>

        {/* ── BACK ── */}
        <div className="eco-ann__face eco-ann__back">
          <div className="eco-ann__back-inner">
            <div className="eco-ann__icon-ring">
              <img src={lifewoodIconText} alt="Lifewood" className="eco-ann__back-logo" />
            </div>
            <p className="eco-ann__back-text">
              Lifewood provides high quality annotation services for a wide
              range of mediums including text, audio and video for both
              computer vision and natural language processing.
            </p>
          </div>
        </div>
      </div>
    </article>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────── */
export default function AISEcosystem() {
  const sectionRef = useRef(null);
  useReveal(sectionRef, 0.08);

  return (
    <section className="ais-eco" ref={sectionRef}>
      <div className="wrap">
        <div className="eco-grid">
          <ValidationCard />
          <CollectionCard />
          <AcquisitionCard />
          <CurationCard />
          <AnnotationCard />
        </div>
      </div>
    </section>
  );
}
