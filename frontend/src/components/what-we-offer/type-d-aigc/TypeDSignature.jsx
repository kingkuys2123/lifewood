import { useRef } from 'react';
import { useReveal } from '../../../hooks/useReveal';

export default function TypeDSignature() {
  const sectionRef = useRef(null);
  useReveal(sectionRef, 0.1);

  return (
    <section className="tyd-signature" ref={sectionRef}>
      <div className="wrap">
        <blockquote className="tyd-signature__block reveal">
          <p className="tyd-signature__text tyd-gradient-text">
            &ldquo;We understand that your customers spend hours looking at screens:
            so finding the one, most important thing, on which to build your message
            is integral to our approach, as we seek to deliver surprise and originality.&rdquo;
          </p>
          <cite className="tyd-signature__cite">&#x2013;&nbsp;Lifewood&nbsp;&#x2013;</cite>
        </blockquote>
      </div>
    </section>
  );
}
