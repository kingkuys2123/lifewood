import { useRef } from 'react';
import { useReveal } from '../../../hooks/useReveal';
import './AIServices.css';

const CARDS = [
  {
    title: 'Audio',
    body: 'Collection, labelling, voice categorization, music categorization, intelligent customer service data, and accent / dialect annotation.',
  },
  {
    title: 'Text',
    body: 'Text collection, labelling, transcription, utterance collection, sentiment analysis, NER, and domain-specific corpus building.',
  },
  {
    title: 'Video',
    body: 'Collection, labelling, audit, live broadcast annotation, subtitle generation, and frame-level object tracking.',
  },
  {
    title: 'Image',
    body: 'Collection, labelling, classification, audit, object detection and tagging, bounding-box and polygon annotation.',
  },
];

export default function AISModal() {
  const sectionRef = useRef(null);
  useReveal(sectionRef, 0.1);

  /* Render two identical sets so the marquee loops seamlessly */
  const allCards = [...CARDS, ...CARDS, ...CARDS, ...CARDS];

  return (
    <section className="ais-modal" ref={sectionRef}>
      <div className="ais-modal__track-wrap">
        {/* aria-hidden on the duplicate strip so screen readers only see one set */}
        <div className="ais-modal__marquee" aria-label="Modality services">
          <div className="ais-modal__strip">
            {allCards.map((c, i) => (
              <article key={i} className="ais-modal__card" tabIndex={i < CARDS.length ? 0 : -1}>
                <h3 className="ais-modal__card-title">{c.title}</h3>
                <p className="ais-modal__card-body">{c.body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
