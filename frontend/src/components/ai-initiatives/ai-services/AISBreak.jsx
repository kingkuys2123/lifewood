import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useReveal } from '../../../hooks/useReveal';
import './AIServices.css';

export default function AISBreak() {
  const sectionRef = useRef(null);
  useReveal(sectionRef, 0.15);

  return (
    <section className="ais-break" ref={sectionRef}>
      <div className="wrap">
        <p className="ais-break__kicker reveal">
          <span>+</span> Why brands trust us
        </p>
        <h2 className="ais-break__h2 reveal reveal-delay-1">
          Comprehensive<br />Data Solutions
        </h2>
        <Link to="/contact" className="ais-break__cta reveal reveal-delay-2">
          Get started
          <span className="ais-break__arrow" aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
