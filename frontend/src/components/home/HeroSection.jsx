import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './HeroSection.css';

const POINTER_DELTA_THRESHOLD_PX = 3;

export default function HeroSection() {
    const heroRef = useRef(null);
    const rafRef = useRef(null);
    const timeoutIdsRef = useRef(new Set());
    const pointerRef = useRef({ x: null, y: null });
    const parallaxRef = useRef({ x: 0, y: 0 });
    const [interactiveEnabled, setInteractiveEnabled] = useState(false);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
    const [showScrollCue, setShowScrollCue] = useState(true);
    const [ripples, setRipples] = useState([]);
    const particles = useMemo(
        () => Array.from({ length: 20 }, (_, idx) => {
            const depth = idx % 3 === 0 ? 'near' : idx % 3 === 1 ? 'mid' : 'far';
            const x = 5 + ((idx * 19) % 90);
            const y = 8 + ((idx * 23) % 78);
            const size = 5 + (idx % 5) * 1.7;
            const delay = (idx % 8) * 0.32;
            const duration = 5.5 + (idx % 6) * 0.8;
            const driftX = ((idx % 7) - 3) * 2.8;
            const driftY = 8 + (idx % 4) * 3;
            const opacity = 0.2 + (idx % 4) * 0.08;

            return {
                id: `p-${idx}`,
                depth,
                style: {
                    '--x': `${x}%`,
                    '--y': `${y}%`,
                    '--s': `${size.toFixed(1)}px`,
                    '--d': `${delay.toFixed(2)}s`,
                    '--dur': `${duration.toFixed(2)}s`,
                    '--dx': `${driftX.toFixed(1)}px`,
                    '--dy': `${driftY.toFixed(1)}px`,
                    '--o': opacity.toFixed(2),
                },
            };
        }),
        []
    );

    const trackHeroEvent = (eventName, meta = {}) => {
        const payload = {
            event: eventName,
            section: 'home_hero',
            ts: Date.now(),
            ...meta,
        };

        window.dispatchEvent(new CustomEvent('lifewood:hero-engagement', { detail: payload }));
        if (Array.isArray(window.dataLayer)) {
            window.dataLayer.push(payload);
        }
    };

    useEffect(() => {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        const finePointer = window.matchMedia('(pointer: fine)');
        const syncInteractionMode = () => {
            setPrefersReducedMotion(reduceMotion.matches);
            setInteractiveEnabled(finePointer.matches && !reduceMotion.matches);
        };

        syncInteractionMode();
        reduceMotion.addEventListener('change', syncInteractionMode);
        finePointer.addEventListener('change', syncInteractionMode);

        return () => {
            reduceMotion.removeEventListener('change', syncInteractionMode);
            finePointer.removeEventListener('change', syncInteractionMode);
            timeoutIdsRef.current.forEach((id) => window.clearTimeout(id));
            timeoutIdsRef.current.clear();
            if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
        };
    }, []);

    useEffect(() => {
        let frameId = null;
        const updateScrollCue = () => {
            const isShortViewport = window.innerHeight < 700;
            const pastFirstFold = window.scrollY > window.innerHeight * 0.75;
            const shouldShow = !(isShortViewport || pastFirstFold);
            setShowScrollCue((prev) => (prev === shouldShow ? prev : shouldShow));
            frameId = null;
        };

        const handleViewportOrScroll = () => {
            if (frameId) return;
            frameId = window.requestAnimationFrame(updateScrollCue);
        };

        updateScrollCue();
        window.addEventListener('scroll', handleViewportOrScroll, { passive: true });
        window.addEventListener('resize', handleViewportOrScroll);

        return () => {
            window.removeEventListener('scroll', handleViewportOrScroll);
            window.removeEventListener('resize', handleViewportOrScroll);
            if (frameId) window.cancelAnimationFrame(frameId);
        };
    }, []);

    const setPointerGlow = (clientX, clientY) => {
        const hero = heroRef.current;
        if (!hero) return;
        const rect = hero.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        if (
            pointerRef.current.x !== null
            && pointerRef.current.y !== null
            && Math.abs(x - pointerRef.current.x) < POINTER_DELTA_THRESHOLD_PX
            && Math.abs(y - pointerRef.current.y) < POINTER_DELTA_THRESHOLD_PX
        ) {
            return;
        }

        const nextX = Math.round(x);
        const nextY = Math.round(y);
        if (nextX === pointerRef.current.x && nextY === pointerRef.current.y) return;

        pointerRef.current = { x: nextX, y: nextY };
        hero.style.setProperty('--mx', `${x}px`);
        hero.style.setProperty('--my', `${y}px`);

        const parallaxX = Number((((nextX / rect.width) - 0.5) * 24).toFixed(2));
        const parallaxY = Number((((nextY / rect.height) - 0.5) * 20).toFixed(2));
        if (parallaxX !== parallaxRef.current.x) {
            parallaxRef.current.x = parallaxX;
            hero.style.setProperty('--px', `${parallaxX}px`);
        }
        if (parallaxY !== parallaxRef.current.y) {
            parallaxRef.current.y = parallaxY;
            hero.style.setProperty('--py', `${parallaxY}px`);
        }
    };

    const createRipple = (clientX, clientY, source = 'pointer') => {
        const hero = heroRef.current;
        if (!hero) return;

        const rect = hero.getBoundingClientRect();
        const x = ((clientX - rect.left) / rect.width) * 100;
        const y = ((clientY - rect.top) / rect.height) * 100;
        const id = window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;

        setRipples((prev) => [...prev.slice(-3), { id, x, y }]);
        trackHeroEvent('hero_interaction_ripple', { source, x: Number(x.toFixed(2)), y: Number(y.toFixed(2)) });

        const timeoutId = window.setTimeout(() => {
            setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
            timeoutIdsRef.current.delete(timeoutId);
        }, 900);

        timeoutIdsRef.current.add(timeoutId);
    };

    const handlePointerMove = (event) => {
        if (!interactiveEnabled) return;
        if (rafRef.current) return;
        const { clientX, clientY } = event;
        rafRef.current = window.requestAnimationFrame(() => {
            setPointerGlow(clientX, clientY);
            rafRef.current = null;
        });
    };

    const handlePointerLeave = () => {
        if (!interactiveEnabled) return;
        const hero = heroRef.current;
        if (!hero) return;
        pointerRef.current = { x: null, y: null };
        parallaxRef.current = { x: 0, y: 0 };
        hero.style.setProperty('--mx', '50%');
        hero.style.setProperty('--my', '50%');
        hero.style.setProperty('--px', '0px');
        hero.style.setProperty('--py', '0px');
    };

    const handleClick = (event) => {
        if (!interactiveEnabled) return;
        createRipple(event.clientX, event.clientY, 'pointer_click');
    };

    const createCenterPulse = (source) => {
        const hero = heroRef.current;
        if (!hero) return;
        const rect = hero.getBoundingClientRect();
        createRipple(rect.left + rect.width / 2, rect.top + rect.height / 2, source);
    };

    const handleHeroKeyDown = (event) => {
        if (!interactiveEnabled) return;
        if (event.target !== event.currentTarget) return;
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        createCenterPulse('keyboard_section');
    };

    const handleCtaKeyDown = (event, ctaType) => {
        if (!interactiveEnabled) return;
        if (event.key !== 'Enter' && event.key !== ' ') return;
        const rect = event.currentTarget.getBoundingClientRect();
        createRipple(rect.left + rect.width / 2, rect.top + rect.height / 2, `keyboard_${ctaType}`);
    };

    const handleCtaClick = (ctaType) => {
        trackHeroEvent(`hero_cta_${ctaType}_click`);
    };

    const handleScrollCueClick = () => {
        const hero = heroRef.current;
        if (!hero) return;
        const top = hero.offsetTop + hero.offsetHeight - 56;
        window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        trackHeroEvent('hero_scroll_cue_click');
    };

    return (
        <section
            className={`hero${prefersReducedMotion ? ' hero--reduced-motion' : ''}`}
            id="hero"
            ref={heroRef}
            tabIndex={0}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            onClick={handleClick}
            onKeyDown={handleHeroKeyDown}
        >
            <div className="hero__media" aria-hidden>
                <div className="hero__aurora" />
                <div className="hero__mesh" />
                <div className="hero__particles">
                    {particles.map((particle) => (
                        <span
                            key={particle.id}
                            className={`hero__particle hero__particle--${particle.depth}`}
                            style={particle.style}
                        />
                    ))}
                </div>
                {ripples.map((ripple) => (
                    <span
                        key={ripple.id}
                        className="hero__ripple"
                        style={{ '--x': `${ripple.x}%`, '--y': `${ripple.y}%` }}
                    />
                ))}
                <div className="hero__overlay" />
            </div>

            <div className="hero__body wrap">
                <div className="hero__content">
                    <h1 className="hero__h1">
                        The world's leading provider of AI-powered <span className="hero__h1-em">data solutions.</span>
                    </h1>
                    <p className="hero__lead">
                        Lifewood combines precision operations and trusted AI workflows to unlock
                        high-value, production-ready data at global scale.
                    </p>

                    <div className="hero__actions">
                        <Link
                            to="/contact"
                            className="btn btn-saffron hero__cta"
                            onClick={() => handleCtaClick('primary')}
                            onKeyDown={(event) => handleCtaKeyDown(event, 'primary')}
                        >
                            Contact Us
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                                <path d="M3.5 8h9M9 4.5 12.5 8 9 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Link>
                        <Link
                            to="/ai-initiatives/services"
                            className="btn btn-ghost hero__cta hero__cta-secondary"
                            onClick={() => handleCtaClick('secondary')}
                            onKeyDown={(event) => handleCtaKeyDown(event, 'secondary')}
                        >
                            Explore Services
                        </Link>
                    </div>
                </div>
            </div>

            {showScrollCue && (
                <button
                    type="button"
                    className="hero__scroll"
                    onClick={handleScrollCueClick}
                    aria-label="Scroll to next section"
                >
                    <span className="hero__scroll-track" aria-hidden>
                        <span className="hero__scroll-thumb" />
                    </span>
                </button>
            )}
        </section>
    );
}
