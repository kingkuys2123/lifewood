import { useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useReveal } from '../../../hooks/useReveal';
import './TypeADataServicing.css';

/* ── Draggable 3-D blob shapes ─────────────────────────── */
const BLOBS = [
  { id: 0, x: 58, y: 12, size: 140, shape: 'blob-a', delay: 0 },
  { id: 1, x: 78, y: 52, size: 180, shape: 'blob-b', delay: 0.2 },
  { id: 2, x: 65, y: 68, size: 110, shape: 'blob-c', delay: 0.4 },
];

function DraggableBlob({ blob, containerRef }) {
  const blobRef = useRef(null);
  const drag = useRef({ active: false, ox: 0, oy: 0, bx: 0, by: 0 });
  const [pos, setPos] = useState({ x: blob.x, y: blob.y });
  const [grabbed, setGrabbed] = useState(false);

  const onPointerDown = useCallback((e) => {
    e.preventDefault();
    const el = blobRef.current;
    if (!el) return;
    drag.current = {
      active: true,
      ox: e.clientX,
      oy: e.clientY,
      bx: pos.x,
      by: pos.y,
    };
    setGrabbed(true);
    el.setPointerCapture(e.pointerId);
  }, [pos]);

  const onPointerMove = useCallback((e) => {
    if (!drag.current.active) return;
    const container = containerRef.current;
    if (!container) return;
    const { width, height } = container.getBoundingClientRect();
    const dx = ((e.clientX - drag.current.ox) / width) * 100;
    const dy = ((e.clientY - drag.current.oy) / height) * 100;
    setPos({
      x: Math.max(0, Math.min(90, drag.current.bx + dx)),
      y: Math.max(0, Math.min(85, drag.current.by + dy)),
    });
  }, [containerRef]);

  const onPointerUp = useCallback(() => {
    drag.current.active = false;
    setGrabbed(false);
  }, []);

  return (
    <div
      ref={blobRef}
      className={`tya-blob ${blob.shape} ${grabbed ? 'tya-blob--grabbed' : ''}`}
      style={{
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        width: blob.size,
        height: blob.size,
        animationDelay: `${blob.delay}s`,
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      role="img"
      aria-label="Decorative 3D shape"
      tabIndex={-1}
    />
  );
}

export default function TypeAHero() {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  useReveal(sectionRef, 0.05);

  const PILLS = ['Document Capture', 'Multi-Language', 'Data Annotation', 'QA'];

  return (
    <section className="tya-hero" ref={sectionRef}>
      {/* Subtle particle canvas */}
      <div className="tya-hero__bg" aria-hidden="true" />

      <div className="tya-hero__inner wrap">
        <div className="tya-hero__layout">

          {/* ── Left content ── */}
          <div className="tya-hero__left">
            <h1 className="tya-hero__h1 reveal reveal-delay-1">
              <span className="tya-hero__h1-sub">Type A –</span>
              <span className="tya-hero__h1-main">Data<br />Servicing</span>
            </h1>

            <p className="tya-hero__lead reveal reveal-delay-2">
              End-to-end data services specializing in multi-language datasets,
              including document capture, data collection and preparation,
              extraction, cleaning, labeling, annotation, quality assurance,
              and formatting.
            </p>

            <div className="tya-hero__pills reveal reveal-delay-2">
              {PILLS.map((p, i) => (
                <span key={p} className="tya-hero__pill" style={{ '--pi': i }}>{p}</span>
              ))}
            </div>
          </div>

          {/* ── Right: draggable blob canvas ── */}
          <div className="tya-hero__right" ref={containerRef} aria-hidden="true">
            <div className="tya-hero__blobs-wrap">
              {BLOBS.map(b => (
                <DraggableBlob key={b.id} blob={b} containerRef={containerRef} />
              ))}
            </div>
            <p className="tya-hero__drag-hint">drag to interact</p>
          </div>

        </div>
      </div>

      {/* Highlights strip below hero */}
      <div className="tya-hero__strip wrap reveal reveal-delay-3">
        <p className="tya-hero__strip-item">Multi-language genealogy documents, newspapers, and archives to facilitate global ancestry research</p>
        <span className="tya-hero__strip-sep" aria-hidden="true" />
        <p className="tya-hero__strip-item">QQ Music of over millions non-Chinese songs and lyrics</p>
      </div>
    </section>
  );
}

