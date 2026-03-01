import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useReveal } from '../../../hooks/useReveal';
import './AIServices.css';

export default function AISHero() {
  const sectionRef = useRef(null);
  const canvasRef  = useRef(null);
  const cardRef    = useRef(null);
  useReveal(sectionRef, 0.05);

  /* ── particle canvas ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, raf;
    const resize = () => { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);
    const dots = Array.from({ length: 90 }, () => ({
      x: Math.random() * 9999, y: Math.random() * 9999,
      r: Math.random() * 1.6 + 0.2,
      dx: (Math.random() - 0.5) * 0.22, dy: (Math.random() - 0.5) * 0.22,
      o: Math.random() * 0.10 + 0.03,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      dots.forEach(d => {
        ctx.beginPath(); ctx.arc(d.x % W, d.y % H, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(29,29,31,${d.o})`; ctx.fill();
        d.x += d.dx; d.y += d.dy;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  /* ── mouse parallax on right card ── */
  useEffect(() => {
    const section = sectionRef.current;
    const card    = cardRef.current;
    if (!section || !card) return;
    let tiltX = 0, tiltY = 0, raf;
    const onMove = e => {
      const { left, top, width, height } = section.getBoundingClientRect();
      const mx = ((e.clientX - left) / width  - 0.5) * 2;
      const my = ((e.clientY - top)  / height - 0.5) * 2;
      tiltX = my * -6; tiltY = mx * 6;
    };
    const loop = () => {
      card.style.transform = `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(0)`;
      raf = requestAnimationFrame(loop);
    };
    const onLeave = () => { tiltX = 0; tiltY = 0; };
    section.addEventListener('mousemove', onMove);
    section.addEventListener('mouseleave', onLeave);
    loop();
    return () => {
      cancelAnimationFrame(raf);
      section.removeEventListener('mousemove', onMove);
      section.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  const PILLS = ['Multi-modal', 'LiFT Platform', '50+ Languages', 'Global 24/7'];

  return (
    <section className="ais-hero" ref={sectionRef}>
      <canvas ref={canvasRef} className="ais-hero__canvas" aria-hidden="true" />


      {/* saffron glow orb */}
      <div className="ais-hero__orb" aria-hidden="true" />

      <div className="ais-hero__inner wrap">
        <div className="ais-hero__layout">

          {/* ── Left ── */}
          <div className="ais-hero__left">
            <div className="ais-hero__kicker reveal">
              <span className="ais-hero__kicker-dot ais-hero__kicker-dot--filled" />
              <span className="ais-hero__kicker-dot ais-hero__kicker-dot--ring" />
              <div className="ais-hero__kicker-line" />
              <span className="ais-hero__kicker-label">AI Initiatives</span>
            </div>

            <h1 className="ais-hero__h1" aria-label="AI DATA SERVICES">
              {['AI', 'DATA', 'SERVICES'].map((word, i) => (
                <span
                  key={word}
                  className={`ais-hero__word reveal${i > 0 ? ` reveal-delay-${i}` : ''}`}
                >
                  {word}
                </span>
              ))}
            </h1>

            <div className="ais-hero__pills reveal reveal-delay-2">
              {PILLS.map((p, i) => (
                <span key={p} className="ais-hero__pill" style={{ '--pill-i': i }}>{p}</span>
              ))}
            </div>
          </div>

          {/* ── Right card (parallax target) ── */}
          <div className="ais-hero__right">
            <div className="ais-hero__card" ref={cardRef}>
              <div className="ais-hero__card-bar" aria-hidden="true" />

              <p className="ais-hero__lead reveal reveal-delay-2">
                Lifewood delivers end-to-end AI data solutions—from multi-language
                data collection and annotation to model training and generative AI
                content. Leveraging our global workforce, industrialized methodology,
                and proprietary LiFT platform, we enable organizations to scale
                efficiently, reduce costs, and accelerate decision-making with
                high-quality, domain-specific datasets.
              </p>

              <div className="ais-hero__actions reveal reveal-delay-3">
                <Link to="/contact" className="btn btn-saffron">Contact Us</Link>
                <Link to="/contact" className="ais-hero__icon-btn" aria-label="Get in touch">↗</Link>
              </div>

            </div>
          </div>

        </div>
      </div>

    </section>
  );
}
