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
        <div className="aip-hero__stats reveal reveal-delay-3">
          {[
            { value: '7+',  label: 'Active Projects' },
            { value: '50+', label: 'Languages' },
            { value: '20+', label: 'Countries' },
            { value: '56k+', label: 'Contributors' },
          ].map((s) => (
            <div className="aip-hero__stat" key={s.label}>
              <span className="aip-hero__stat-value">{s.value}</span>
              <span className="aip-hero__stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
