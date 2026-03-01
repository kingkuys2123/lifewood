import { useRef } from 'react';
import { useReveal } from '../../../hooks/useReveal';
import './AIServices.css';

export default function AISVideo() {
  const sectionRef = useRef(null);
  useReveal(sectionRef, 0.15);

  return (
    <section className="ais-video" ref={sectionRef}>
      <div className="wrap">
        <div
          className="ais-video__frame reveal"
          role="region"
          aria-label="Lifewood Services video"
        >
          <div className="ais-video__embed">
            <iframe
              title="Lifewood Services 4k"
              src="https://www.youtube.com/embed/AtyK1JY4m0E"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
