import { useState, useRef } from 'react';
import { useReveal } from '../../../hooks/useReveal';
import './TypeADataServicing.css';

const FEATURES = [
  { id: 'auto-crop',  label: 'Auto Crop',             desc: 'Automatically detects and crops document borders, removing margins and aligning content for consistent framing across all scanned assets.' },
  { id: 'deskew',     label: 'Auto De-skew',           desc: 'Corrects angular distortion and rotation in scanned documents, ensuring straight, clean alignment for downstream data extraction.' },
  { id: 'blur',       label: 'Blur Detection',         desc: 'Identifies and flags blurry or low-quality image regions, triggering re-scan requests to maintain high fidelity in every captured document.' },
  { id: 'foreign',    label: 'Foreign Object Detection', desc: 'Detects and removes extraneous elements—staples, stickers, shadows, and smudges—that could compromise extraction accuracy.' },
  { id: 'ai-extract', label: 'AI Data Extraction',     desc: 'Leverages trained neural models to extract structured data fields—dates, names, amounts, identifiers—from unstructured document layouts with high precision.' },
];

const PANELS = [
  {
    id: '01',
    label: 'Objective',
    heading: '01 Objective',
    body: 'Scan document for preservation, extract data and structure into database.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80',
    imageAlt: 'Document scanner with light streak',
  },
  {
    id: '02',
    label: 'Key Features',
    heading: '02 Key Features',
    body: 'Features include Auto Crop, Auto De-skew, Blur Detection, Foreign Object Detection, and AI Data Extraction.',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=900&q=80',
    imageAlt: 'Data interfaces and light beams',
  },
  {
    id: '03',
    label: 'Results',
    heading: '03 Results',
    body: 'Accurate and precise data ensured through validation and quality assurance. Scalable multi-language, multi-format processing with structured AI-ready output.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80',
    imageAlt: 'Data analytics network visualization',
  },
];

export default function TypeAShowcase() {
  const sectionRef = useRef(null);
  const [activePanel, setActivePanel] = useState('01');
  const [activeFeature, setActiveFeature] = useState(null);
  useReveal(sectionRef, 0.08);

  return (
    <section className="tya-showcase" ref={sectionRef}>
      <div className="wrap">

        {/* Section label */}
        <div className="tya-showcase__header reveal">
          <span className="tya-showcase__eyebrow">Type A — Data Servicing</span>
        </div>

        {/* ── Horizontal accordion ── */}
        <div
          className="tya-accordion"
          role="tablist"
          aria-label="Data Servicing Sections"
        >
          {PANELS.map((panel) => {
            const isActive = activePanel === panel.id;
            return (
              <div
                key={panel.id}
                className={`tya-accordion__panel${isActive ? ' tya-accordion__panel--active' : ''}`}
                role="tab"
                aria-selected={isActive}
                aria-label={panel.label}
                tabIndex={0}
                onMouseEnter={() => setActivePanel(panel.id)}
                onFocus={() => setActivePanel(panel.id)}
              >
                {/* collapsed vertical label */}
                <div className="tya-accordion__vert-label" aria-hidden="true">
                  <span className="tya-accordion__vert-num">{panel.id}</span>
                  <span className="tya-accordion__vert-text">{panel.label.toUpperCase()}</span>
                </div>

                {/* expanded content */}
                <div className="tya-accordion__content" role="tabpanel">
                  <div className="tya-accordion__img-wrap">
                    <img
                      src={panel.image}
                      alt={panel.imageAlt}
                      className="tya-accordion__img"
                      loading="lazy"
                    />
                    {/* bottom-right label badge */}
                    <div className="tya-accordion__badge">
                      <span className="tya-accordion__badge-num">{panel.id}</span>
                      <span className="tya-accordion__badge-label">{panel.label}</span>
                    </div>
                  </div>

                  <div className="tya-accordion__text">
                    <h3 className="tya-accordion__heading">{panel.heading}</h3>
                    <p className="tya-accordion__body">{panel.body}</p>

                    {/* Feature expandables — only in panel 02 */}
                    {panel.id === '02' && (
                      <ul className="tya-features" aria-label="Key features">
                        {FEATURES.map((f) => (
                          <li key={f.id} className={`tya-feature${activeFeature === f.id ? ' tya-feature--open' : ''}`}>
                            <button
                              className="tya-feature__toggle"
                              onClick={() => setActiveFeature(prev => prev === f.id ? null : f.id)}
                              aria-expanded={activeFeature === f.id}
                            >
                              <span className="tya-feature__label">{f.label}</span>
                              <span className="tya-feature__icon" aria-hidden="true">+</span>
                            </button>
                            <div className="tya-feature__drawer" role="region">
                              <p className="tya-feature__desc">{f.desc}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* inactive panel arrows */}
                {!isActive && (
                  <div className="tya-accordion__arrows" aria-hidden="true">
                    <span className="tya-accordion__arrow">←</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

