import { useRef, useEffect, useCallback } from 'react';
import './OfficesParallaxBanner.css';

/**
 * OfficesParallaxBanner
 * A full-width dark strip with floating geometric shapes that shift on
 * mouse-move (multi-layer parallax), pulsing rings, and scanline sweep.
 * Three key stats are centred — purely visual, no extra text.
 */
export default function OfficesParallaxBanner() {
    const layer1Ref = useRef(null);
    const layer2Ref = useRef(null);
    const layer3Ref = useRef(null);
    const bannerRef = useRef(null);
    const rafRef    = useRef(null);

    const handleMouseMove = useCallback((e) => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
            const el = bannerRef.current;
            if (!el) return;
            const { left, top, width, height } = el.getBoundingClientRect();
            const mx = ((e.clientX - left) / width  - 0.5); // -0.5 → 0.5
            const my = ((e.clientY - top)  / height - 0.5);

            if (layer1Ref.current)
                layer1Ref.current.style.transform = `translate(${mx * -18}px, ${my * -12}px)`;
            if (layer2Ref.current)
                layer2Ref.current.style.transform = `translate(${mx * 28}px, ${my * 18}px)`;
            if (layer3Ref.current)
                layer3Ref.current.style.transform = `translate(${mx * -8}px, ${my * 6}px)`;
        });
    }, []);

    const handleMouseLeave = useCallback(() => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        [layer1Ref, layer2Ref, layer3Ref].forEach((r) => {
            if (r.current) r.current.style.transform = '';
        });
    }, []);

    /* Cleanup RAF on unmount */
    useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

    return (
        <div
            ref={bannerRef}
            className="of-pb"
            aria-hidden="true"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* Horizontal rules */}
            <div className="of-pb__line of-pb__line--1" />
            <div className="of-pb__line of-pb__line--2" />

            {/* Layer 1 — slow / far */}
            <div ref={layer1Ref} className="of-pb__layer">
                <div className="of-pb__shape of-pb__shape--orb-1" />
                <div className="of-pb__shape of-pb__shape--sq of-pb__shape--sq-1" />
                <div className="of-pb__shape of-pb__shape--dot of-pb__shape--dot-3" />
            </div>

            {/* Layer 2 — medium */}
            <div ref={layer2Ref} className="of-pb__layer">
                <div className="of-pb__shape of-pb__shape--orb-2" />
                <div className="of-pb__shape of-pb__shape--sq of-pb__shape--sq-2" />
                <div className="of-pb__shape of-pb__shape--dot of-pb__shape--dot-2" />
            </div>

            {/* Layer 3 — fast / near */}
            <div ref={layer3Ref} className="of-pb__layer">
                <div className="of-pb__shape of-pb__shape--sq of-pb__shape--sq-3" />
                <div className="of-pb__shape of-pb__shape--dot of-pb__shape--dot-1" />
                <div className="of-pb__ring of-pb__ring--a" />
                <div className="of-pb__ring of-pb__ring--b" />
                <div className="of-pb__ring of-pb__ring--c" />
            </div>

            {/* Centre metrics */}
            <div className="of-pb__content">
                <div className="of-pb__metric">
                    <p className="of-pb__metric-num">56<span>,</span>788</p>
                    <p className="of-pb__metric-label">Online Resources</p>
                </div>
                <div className="of-pb__divider" />
                <div className="of-pb__metric">
                    <p className="of-pb__metric-num">30<span>+</span></p>
                    <p className="of-pb__metric-label">Countries</p>
                </div>
                <div className="of-pb__divider" />
                <div className="of-pb__metric">
                    <p className="of-pb__metric-num">40<span>+</span></p>
                    <p className="of-pb__metric-label">Centers</p>
                </div>
            </div>
        </div>
    );
}

