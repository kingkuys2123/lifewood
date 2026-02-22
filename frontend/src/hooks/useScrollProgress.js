import { useState, useEffect, useCallback } from 'react';

/**
 * useScrollProgress
 *
 * Returns a scroll progress value between 0 and 100.
 * - Uses requestAnimationFrame throttling so the scroll listener
 *   never blocks the main thread.
 * - Cleans up on unmount.
 * - Handles edge cases: zero-height documents, SSR guard.
 */
export default function useScrollProgress() {
    const [progress, setProgress] = useState(0);

    const calculate = useCallback(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        // Guard against zero-height documents (e.g. initial render)
        const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        setProgress(Math.min(100, Math.max(0, pct)));
    }, []);

    useEffect(() => {
        let rafId = null;

        const onScroll = () => {
            if (rafId) return; // already scheduled — skip
            rafId = requestAnimationFrame(() => {
                calculate();
                rafId = null;
            });
        };

        // Set initial value on mount
        calculate();

        window.addEventListener('scroll', onScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', onScroll);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, [calculate]);

    return progress;
}

