import { useRef } from 'react';
import { useReveal } from '../../../hooks/useReveal';
import pniTech1 from '../../../assets/images/pni-tech-1.avif';
import pniTech2 from '../../../assets/images/pni-tech-2.avif';
import pniTech3 from '../../../assets/images/pni-tech-3.avif';
import pniTech4 from '../../../assets/images/pni-tech-4.avif';
import pniTech5 from '../../../assets/images/pni-tech-5.avif';

export default function TypeDReach() {
  const sectionRef = useRef(null);
  useReveal(sectionRef, 0.1);

  return (
    <section className="tyd-reach" ref={sectionRef}>
      <div className="wrap tyd-reach__outer">

        {/* ── Left: text block ── */}
        <div className="tyd-reach__text">
          <span className="tyd-reach__symbol reveal" aria-hidden="true">&#x221e;</span>
          <p className="tyd-reach__body reveal reveal-delay-1">
            We use advanced film, video and editing techniques, combined with
            generative AI, to create cinematic worlds for your videos,
            advertisements and corporate communications.
          </p>
          <hr className="tyd-reach__rule reveal reveal-delay-2" aria-hidden="true" />
        </div>

        {/* ── Right: 12-col bento grid ── */}
        <div className="tyd-reach__bento reveal reveal-delay-2">

          {/* Row 1 – three equal images */}
          <div className="tyd-reach__cell tyd-reach__cell--r1a">
            <img src={pniTech1} alt="Professional video editing suite" loading="lazy" />
          </div>
          <div className="tyd-reach__cell tyd-reach__cell--r1b">
            <img src={pniTech2} alt="Creative storyboarding session" loading="lazy" />
          </div>
          <div className="tyd-reach__cell tyd-reach__cell--r1c">
            <img src={pniTech3} alt="Node-based compositing workflow" loading="lazy" />
          </div>

          {/* Row 2 – large with text overlay */}
          <div className="tyd-reach__cell tyd-reach__cell--large">
            <img src={pniTech4} alt="Global content review and localisation team" loading="lazy" />
            <div className="tyd-reach__caption">
              <span className="tyd-reach__caption-em">We can quickly adjust</span>
              <span className="tyd-reach__caption-body">
                the culture and language of your video to suit different world markets.
              </span>
            </div>
          </div>

          {/* Row 2 – microphone / multiple languages */}
          <div className="tyd-reach__cell tyd-reach__cell--mic">
            <img src={pniTech5} alt="Professional studio microphone for multi-language voiceover" loading="lazy" />
            <div className="tyd-reach__mic-lbl" aria-label="Multiple Languages">
              <p>Multiple</p>
              <p>Languages</p>
            </div>
          </div>

          {/* Row 2 – floating stat card */}
          <div className="tyd-reach__cell tyd-reach__cell--stat" aria-label="Available in over 100 countries">
            <p className="tyd-reach__stat-num">100<span>+</span></p>
            <p className="tyd-reach__stat-lbl">Countries</p>
          </div>

        </div>
      </div>
    </section>
  );
}
