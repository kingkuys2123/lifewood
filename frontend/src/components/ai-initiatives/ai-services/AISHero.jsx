import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useReveal } from '../../../hooks/useReveal';
import './AIServices.css';

export default function AISHero() {
  const sectionRef = useRef(null);
  const canvasRef  = useRef(null);
  useReveal(sectionRef, 0.05);

  /* floating dot particles */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, raf;

    const resize = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const dots = Array.from({ length: 60 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.8 + 0.3,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      o: Math.random() * 0.18 + 0.04,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      dots.forEach(d => {
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(29,29,31,${d.o})`;
        ctx.fill();
        d.x += d.dx; d.y += d.dy;
        if (d.x < 0 || d.x > W) d.dx *= -1;
        if (d.y < 0 || d.y > H) d.dy *= -1;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <section className="ais-hero" ref={sectionRef}>
      <canvas ref={canvasRef} className="ais-hero__bg-canvas" aria-hidden="true" />

      <div className="ais-hero__inner wrap">
        {/* animated kicker */}
        <div className="ais-hero__kicker reveal">
          <div className="ais-hero__kicker-dots">
            <span />
            <span />
          </div>
          <div className="ais-hero__kicker-line" />
        </div>

        <h1 className="ais-hero__h1 reveal reveal-delay-1">
          AI DATA SERVICES
        </h1>

        <p className="ais-hero__lead reveal reveal-delay-2">
          Lifewood delivers end-to-end AI data solutions—from multi-language
          data collection and annotation to model training and generative AI
          content. Leveraging our global workforce, industrialized methodology,
          and proprietary LiFT platform, we enable organizations to scale
          efficiently, reduce costs, and accelerate decision-making with
          high-quality, domain-specific datasets.
        </p>

        <div className="ais-hero__actions reveal reveal-delay-3">
          <Link to="/contact" className="btn btn-saffron">
            Contact Us
          </Link>
          <Link to="/contact" className="ais-hero__cta-icon" aria-label="Get in touch">
            ↗
          </Link>
        </div>
      </div>
    </section>
  );
}
