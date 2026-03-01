import { useRef, useEffect } from 'react';
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

/* Simple drag-to-scroll */
function useDragScroll(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let isDown = false, startX, scrollLeft;
    const down  = e => { isDown = true; startX = e.pageX - el.offsetLeft; scrollLeft = el.scrollLeft; };
    const up    = ()  => { isDown = false; };
    const move  = e  => { if (!isDown) return; e.preventDefault(); el.scrollLeft = scrollLeft - (e.pageX - el.offsetLeft - startX); };
    el.addEventListener('mousedown', down);
    el.addEventListener('mouseleave', up);
    el.addEventListener('mouseup', up);
    el.addEventListener('mousemove', move);
    return () => {
      el.removeEventListener('mousedown', down);
      el.removeEventListener('mouseleave', up);
      el.removeEventListener('mouseup', up);
      el.removeEventListener('mousemove', move);
    };
  }, [ref]);
}

export default function AISModal() {
  const sectionRef = useRef(null);
  const trackRef   = useRef(null);
  useReveal(sectionRef, 0.1);
  useDragScroll(trackRef);

  return (
    <section className="ais-modal" ref={sectionRef}>
      <div className="ais-modal__track-wrap">
        <div className="ais-modal__track" ref={trackRef}>
          {[...CARDS, ...CARDS].map((c, i) => (
            <article key={i} className="ais-modal__card">
              <h3 className="ais-modal__card-title">{c.title}</h3>
              <p className="ais-modal__card-body">{c.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
