import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useReveal } from '../../../hooks/useReveal';
import './TypeBHorizontalLLMData.css';

/* ── Animated waveform bars ─────────────────────────────── */
const BAR_COUNT = 48;

function AudioWave() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H;

    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const bars = Array.from({ length: BAR_COUNT }, (_, i) => ({
      phase: (i / BAR_COUNT) * Math.PI * 2,
      speed: 0.018 + Math.random() * 0.014,
      amp: 0.18 + Math.random() * 0.32,
      base: 0.06 + Math.random() * 0.08,
    }));

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const bw = W / BAR_COUNT;
      const gap = bw * 0.22;

      bars.forEach((b, i) => {
        const norm = Math.sin(t * b.speed * 60 + b.phase) * 0.5 + 0.5;
        const heightFrac = b.base + norm * b.amp;
        const bh = H * heightFrac;
        const x = i * bw + gap / 2;
        const y = (H - bh) / 2;
        const w = bw - gap;

        // gradient per bar: saffron at peak, forest at base
        const grad = ctx.createLinearGradient(0, y, 0, y + bh);
        grad.addColorStop(0, 'rgba(245,166,35,0.90)');
        grad.addColorStop(0.5, 'rgba(4,98,65,0.55)');
        grad.addColorStop(1, 'rgba(4,98,65,0.18)');

        ctx.beginPath();
        ctx.roundRect(x, y, w, bh, w / 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });

      t += 0.016;
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="tyb-wave"
      aria-hidden="true"
    />
  );
}

/* ── Floating stat chip ─────────────────────────────────── */
function StatChip({ num, label, style }) {
  return (
    <div className="tyb-chip" style={style}>
      <span className="tyb-chip__num">{num}</span>
      <span className="tyb-chip__label">{label}</span>
    </div>
  );
}

/* ── Marquee tag strip ──────────────────────────────────── */
const TAGS = ['Voice', 'Image', 'Text', 'LLM', 'Deep Learning', 'Multimodal', 'Annotation', 'QA', 'NLP'];

export default function TypeBHero() {
  const sectionRef = useRef(null);
  useReveal(sectionRef, 0.05);

  return (
    <section className="tyb-hero" ref={sectionRef}>
      {/* green accent glow */}
      <div className="tyb-hero__glow" aria-hidden="true" />

      <div className="tyb-hero__inner wrap">
        <div className="tyb-hero__layout">

          {/* ── Left ── */}
          <div className="tyb-hero__left">

            <h1 className="tyb-hero__h1">
              <span className="tyb-hero__h1-pre reveal">Type B —</span>
              <span className="tyb-hero__h1-line reveal reveal-delay-1">Horizontal</span>
              <span className="tyb-hero__h1-line reveal reveal-delay-2">
                LLM
                <span className="tyb-hero__h1-accent"> Data</span>
              </span>
            </h1>

            <p className="tyb-hero__desc reveal reveal-delay-2">
              Comprehensive AI data solutions that cover the entire spectrum from
              data collection and annotation to model testing. Creating multimodal
              datasets for deep learning, large language models.
            </p>
          </div>

          {/* ── Right: waveform + chips ── */}
          <div className="tyb-hero__right reveal reveal-delay-1">
            <div className="tyb-hero__wave-wrap">
              <AudioWave />
              {/* overlapping stat chips */}
              <StatChip num="50+" label="Language Sets"  style={{ top: '8%',  left: '-6%' }} />
              <StatChip num="23"  label="Countries"      style={{ top: '55%', right: '-4%' }} />
              <StatChip num="6"   label="Project Types"  style={{ bottom: '10%', left: '8%' }} />
            </div>

            {/* highlight strip */}
            <div className="tyb-hero__highlights">
              <p className="tyb-hero__hl">Voice, image and text for Apple Intelligence</p>
              <span className="tyb-hero__hl-sep" aria-hidden="true" />
              <p className="tyb-hero__hl">Provided over 50 language sets</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

