import { useRef, useState, useEffect } from 'react';
import { useReveal } from '../../hooks/useReveal';
import './CapabilitiesSection.css';

/* ── Metrics ─────────────────────────────────────────────── */
const METRICS = [
    { raw: 56788, suffix: '+', label: 'Online Resources' },
    { raw: 30,    suffix: '+', label: 'Countries'        },
    { raw: 40,    suffix: '+', label: 'Delivery Centers' },
    { raw: 50,    suffix: '+', label: 'Languages'        },
];

function useCountUp(target, active, duration = 1600) {
    const [val, setVal] = useState(0);
    const raf = useRef(null);
    useEffect(() => {
        if (!active) return;
        const start = performance.now();
        const tick = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 4);
            setVal(Math.round(eased * target));
            if (p < 1) raf.current = requestAnimationFrame(tick);
        };
        raf.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf.current);
    }, [active, target, duration]);
    return val;
}

function MetricCard({ raw, suffix, label, active, delay }) {
    const count = useCountUp(raw, active);
    return (
        <div
            className="cap__metric-card reveal"
            style={{ transitionDelay: `${delay}ms` }}
        >
            <p className="cap__metric-num">
                {count >= 1000 ? count.toLocaleString('en-US') : count}
                <span className="cap__metric-suf">{suffix}</span>
            </p>
            <p className="cap__metric-label">{label}</p>
        </div>
    );
}

/* ── Signal diagram nodes (cx, cy, label, saffron?) ─────── */
const NODES = [
    { cx: 230, cy: 80,  label: 'Audio',  saffron: false },
    { cx: 360, cy: 155, label: 'Image',  saffron: true  },
    { cx: 360, cy: 305, label: 'Video',  saffron: false },
    { cx: 230, cy: 380, label: 'Text',   saffron: true  },
    { cx: 100, cy: 305, label: 'Data',   saffron: false },
    { cx: 100, cy: 155, label: 'QA',     saffron: true  },
];

const CX = 230;
const CY = 230;

export default function CapabilitiesSection() {
    const sectionRef = useRef(null);
    const [active, setActive] = useState(false);
    useReveal(sectionRef, 0.08);

    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setActive(true); obs.disconnect(); } },
            { threshold: 0.2 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <section className="cap" id="capabilities" ref={sectionRef}>
            <div className="cap__inner wrap">

                {/* ── Left: metrics ── */}
                <div className="cap__metrics">
                    <div>
                        <div className="cap__eyebrow-row reveal">
                            <span className="cap__eyebrow-dot" />
                            <span className="cap__eyebrow-text">Scale &amp; Reach</span>
                        </div>
                        <h2 className="cap__heading reveal reveal-delay-1">
                            Global scale,<br />
                            <span className="cap__heading-em">local precision.</span>
                        </h2>
                    </div>

                    <div className="cap__grid">
                        {METRICS.map((m, i) => (
                            <MetricCard
                                key={m.label}
                                {...m}
                                active={active}
                                delay={i * 80}
                            />
                        ))}
                    </div>
                </div>

                {/* ── Right: SVG signal diagram ── */}
                <div className="cap__diagram reveal reveal-delay-2" aria-hidden="true">
                    <svg
                        className="cap__svg"
                        viewBox="0 0 460 460"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {/* Connection lines from center to each node */}
                        {NODES.map((n, i) => (
                            <line
                                key={`conn-${i}`}
                                className={`cap__conn${n.saffron ? ' cap__conn--saffron' : ''}`}
                                x1={CX} y1={CY}
                                x2={n.cx} y2={n.cy}
                                style={{ animationDelay: `${i * 0.25}s` }}
                            />
                        ))}

                        {/* Pulsing rings at center */}
                        <circle className="cap__pulse-ring"          cx={CX} cy={CY} r={18} />
                        <circle className="cap__pulse-ring cap__pulse-ring--2" cx={CX} cy={CY} r={18} />
                        <circle className="cap__pulse-ring cap__pulse-ring--3" cx={CX} cy={CY} r={18} />

                        {/* Outer nodes */}
                        {NODES.map((n, i) => (
                            <g key={`node-${i}`}>
                                <circle
                                    className="cap__node-outer"
                                    cx={n.cx} cy={n.cy} r={34}
                                />
                                <circle
                                    className={`cap__node-dot${n.saffron ? ' cap__node-dot--saffron' : ''}`}
                                    cx={n.cx} cy={n.cy} r={5}
                                    style={{ animationDelay: `${i * 0.4}s` }}
                                />
                                <text
                                    className="cap__node-label"
                                    x={n.cx} y={n.cy + 18}
                                >
                                    {n.label}
                                </text>
                            </g>
                        ))}

                        {/* Center node */}
                        <circle className="cap__center-ring" cx={CX} cy={CY} r={26} />
                        <circle className="cap__center-ring" cx={CX} cy={CY} r={18} style={{ strokeOpacity: 0.5 }} />
                        <circle className="cap__center-core" cx={CX} cy={CY} r={8} />
                    </svg>
                </div>

            </div>
        </section>
    );
}

