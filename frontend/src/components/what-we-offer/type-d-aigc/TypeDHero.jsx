import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useReveal } from '../../../hooks/useReveal';

export default function TypeDHero() {
  const sectionRef = useRef(null);
  useReveal(sectionRef, 0.1);

  return (
    <section className="tyd-hero" ref={sectionRef} aria-labelledby="tyd-hero-title">
      <div className="tyd-hero__bg" aria-hidden="true" />

      <div className="tyd-hero__inner wrap">
        <p className="tyd-hero__eyebrow reveal">Type D - What We Offer</p>

        <h1 id="tyd-hero-title" className="tyd-hero__title reveal reveal-delay-1">
          AI Generated Content (AIGC)
        </h1>

        <p className="tyd-hero__copy reveal reveal-delay-2">
          Lifewood&apos;s early adoption of AI tools has seen the company rapidly evolve
          the use of AI generated content, integrated into video production for
          communication requirements. This success, combining text, voice, image and
          video skills with traditional production methods and story development,
          is now being sought by other companies.
        </p>

        <div className="tyd-hero__actions reveal reveal-delay-3">
          <Link to="/contact" className="btn btn-forest">Contact Us</Link>
        </div>
      </div>
    </section>
  );
}

