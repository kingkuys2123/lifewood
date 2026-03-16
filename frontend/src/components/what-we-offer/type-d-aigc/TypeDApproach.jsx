import { useRef } from 'react';
import { useReveal } from '../../../hooks/useReveal';
import aigm1 from '../../../assets/images/aigm-1.avif';
import aigm2 from '../../../assets/images/aigm-2.avif';
import aigm3 from '../../../assets/images/aigm-3.avif';

export default function TypeDApproach() {
  const sectionRef = useRef(null);
  useReveal(sectionRef, 0.1);

  return (
    <section className="tyd-approach" ref={sectionRef} aria-labelledby="tyd-approach-title">
      <div className="wrap tyd-approach__layout">

        {/* ── Left: text ── */}
        <div className="tyd-approach__content">
          <h2 id="tyd-approach-title" className="tyd-approach__title reveal">
            Our Approach
          </h2>
          <p className="tyd-approach__copy tyd-gradient-text reveal reveal-delay-1">
            Our motivation is to express the personality of your brand in a
            compelling and distinctive way. We specialize in story-driven content,
            for companies looking to join the communication revolution.
          </p>
        </div>

        {/* ── Right: scattered fan cards ── */}
        <div className="tyd-approach__fan reveal reveal-delay-2" aria-hidden="true">
          <figure className="tyd-approach__fan-card tyd-approach__fan-card--c">
            <img src={aigm3} alt="" loading="lazy" />
          </figure>
          <figure className="tyd-approach__fan-card tyd-approach__fan-card--b">
            <img src={aigm2} alt="" loading="lazy" />
          </figure>
          <figure className="tyd-approach__fan-card tyd-approach__fan-card--a">
            <img src={aigm1} alt="" loading="lazy" />
          </figure>
        </div>

      </div>
    </section>
  );
}
