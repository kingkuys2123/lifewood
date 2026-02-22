/**
 * useReveal — attaches an IntersectionObserver to a ref and adds
 * `reveal--visible` to every child element that carries the `reveal` class.
 *
 * @param {React.RefObject} ref      - ref attached to the section element
 * @param {number}          threshold - 0–1, default 0.1
 */
import { useEffect } from 'react';

export function useReveal(ref, threshold = 0.1) {
    useEffect(() => {
        const root = ref.current;
        if (!root) return;

        const els = root.querySelectorAll('.reveal');
        if (!els.length) return;

        const obs = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) {
                        e.target.classList.add('reveal--visible');
                        obs.unobserve(e.target);
                    }
                });
            },
            { threshold, rootMargin: '0px 0px -40px 0px' }
        );

        els.forEach((el) => obs.observe(el));
        return () => obs.disconnect();
    }, [ref, threshold]);
}

