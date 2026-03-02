import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useReveal } from '../../../hooks/useReveal';
import './TypeADataServicing.css';

const HIGHLIGHTS = [
  {
    id: 'genealogy',
    tag: 'Heritage & Archives',
    heading: 'Multi-language genealogy documents, newspapers & archives',
    body: 'Facilitating global ancestry research by digitizing, extracting, and structuring multi-language records from historical documents, newspapers, and archival sources worldwide.',
    accent: 'var(--c-forest)',
    num: '01',
  },
  {
    id: 'qqmusic',
    tag: 'Music & Media',
    heading: 'QQ Music — millions of non-Chinese songs & lyrics',
    body: "Processing QQ Music's vast international catalog: transcribing, categorizing, and annotating lyrics and metadata for millions of non-Chinese tracks across dozens of languages and genres.",
    accent: 'var(--c-saffron)',
    num: '02',
  },
];

export default function TypeAHighlights() {
  const sectionRef = useRef(null);
  useReveal(sectionRef, 0.1);

  return (
    <section className="tya-highlights" ref={sectionRef}>
      <div className="wrap">
        <div className="tya-highlights__header reveal">
          <p className="tya-highlights__eyebrow">Featured Projects</p>
          <h2 className="tya-highlights__h2 reveal reveal-delay-1">
            Real-World<br />Impact
          </h2>
        </div>

        <div className="tya-highlights__grid">
          {HIGHLIGHTS.map((h, i) => (
            <article
              key={h.id}
              className={`tya-hl-card reveal${i > 0 ? ' reveal-delay-1' : ''}`}
              style={{ '--accent': h.accent }}
            >
              <div className="tya-hl-card__bar" aria-hidden="true" />
              <span className="tya-hl-card__num" aria-hidden="true">{h.num}</span>
              <span className="tya-hl-card__tag">{h.tag}</span>
              <h3 className="tya-hl-card__heading">{h.heading}</h3>
              <p className="tya-hl-card__body">{h.body}</p>
              <Link to="/contact" className="tya-hl-card__link">
                Learn more
                <span className="tya-hl-card__link-arrow" aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>

        {/* Second Contact Us CTA */}
        <div className="tya-highlights__cta reveal reveal-delay-2">
          <Link to="/contact" className="btn btn-saffron tya-highlights__btn">
            Contact Us
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

