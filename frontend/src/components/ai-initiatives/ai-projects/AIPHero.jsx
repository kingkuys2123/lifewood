import { useRef } from 'react';
import { useReveal } from '../../../hooks/useReveal';
import './AIProjects.css';

export default function AIPHero() {
  const ref = useRef(null);
  useReveal(ref, 0.1);

  return (
    <section className="aip-hero" ref={ref}>
      <span className="aip-hero__orb aip-hero__orb--1" aria-hidden="true" />
      <span className="aip-hero__orb aip-hero__orb--2" aria-hidden="true" />
      <div className="aip-hero__inner wrap">
        <div className="aip-hero__kicker reveal">
          <span className="aip-hero__kicker-dot" />
          <span>AI Initiatives</span>
        </div>
        <h1 className="aip-hero__h1 reveal reveal-delay-1">AI Projects</h1>
        <p className="aip-hero__lead reveal reveal-delay-2">
          From building AI datasets in diverse languages and environments, to
          developing platforms that enhance productivity and open new
          opportunities in under-resourced economies, you&apos;ll see how Lifewood
          is shaping the future with{' '}
          <em>innovation, integrity and a focus on people.</em>
        </p>
      </div>
    </section>
  );
}
