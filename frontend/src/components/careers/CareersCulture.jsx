import { useRef, useEffect } from 'react';
import { useReveal } from '../../hooks/useReveal';
import './CareersCulture.css';

const BRICKS = [
    /* row 1 */
    { label: 'Supportive',      variant: 'forest'   },
    { label: 'Collaborative',   variant: 'charcoal' },
    { label: 'Innovative',      variant: 'saffron'  },
    { label: 'Flexible',        variant: 'forest'   },
    { label: 'Supportive',      variant: 'charcoal' },
    { label: 'Collaborative',   variant: 'saffron'  },
    /* row 2 */
    { label: 'Transparent',     variant: 'saffron'  },
    { label: 'Engaging',        variant: 'forest'   },
    { label: 'Diverse',         variant: 'charcoal' },
    { label: 'Purpose-driven',  variant: 'forest'   },
    { label: 'Transparent',     variant: 'charcoal' },
    { label: 'Engaging',        variant: 'saffron'  },
    /* row 3 */
    { label: 'Balanced',        variant: 'charcoal' },
    { label: 'Trustworthy',     variant: 'forest'   },
    { label: 'Professional',    variant: 'saffron'  },
    { label: 'Reliable',        variant: 'forest'   },
    { label: 'Innovative',      variant: 'charcoal' },
    { label: 'Balanced',        variant: 'saffron'  },
];

export default function CareersCulture() {
    const sectionRef = useRef(null);
    const bricksRef  = useRef(null);

    useReveal(sectionRef, 0.08);

    /* Stagger-animate individual bricks */
    useEffect(() => {
        const wrap = bricksRef.current;
        if (!wrap) return;
        const bricks = wrap.querySelectorAll('.cc-brick');
        const obs = new IntersectionObserver(
            ([e]) => {
                if (!e.isIntersecting) return;
                bricks.forEach((b, i) => {
                    setTimeout(() => b.classList.add('cb-visible'), i * 45);
                });
                obs.unobserve(e.target);
            },
            { threshold: 0.1 }
        );
        obs.observe(wrap);
        return () => obs.disconnect();
    }, []);

    return (
        <section className="careers-culture" id="careers-culture" ref={sectionRef}>
            <div className="careers-culture__inner wrap">

                {/* ── Text block ── */}
                <div className="careers-culture__text">

                    <div className="careers-culture__left reveal">
                        <span className="section-eyebrow">
                            <span className="section-dot" />
                            Our Culture
                        </span>
                        <h2 className="careers-culture__heading">
                            It means motivating<br />
                            and <em>growing teams</em>
                        </h2>
                        <div className="careers-culture__accent" aria-hidden="true" />
                    </div>

                    <div className="careers-culture__right">
                        <p className="careers-culture__body reveal reveal-delay-1">
                            Teams that can initiate and learn on the run in order to deliver
                            evolving technologies and targets. It's a big challenge, but
                            innovation, especially across borders, has never been the easy path.
                        </p>

                        {/* ── Values bricks ── */}
                        <div className="careers-culture__values-wrap reveal reveal-delay-2">
                            <span className="careers-culture__values-label">
                                <span className="careers-culture__values-label-dot" aria-hidden="true" />
                                Our Values
                            </span>

                            <div className="careers-culture__bricks" ref={bricksRef} role="list" aria-label="Lifewood culture values">
                                {BRICKS.map(({ label, variant }, i) => (
                                    <span
                                        key={`${label}-${i}`}
                                        className={`cc-brick cc-brick--${variant}`}
                                        role="listitem"
                                    >
                                        <span className="cc-brick__dot" aria-hidden="true" />
                                        {label}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
}

