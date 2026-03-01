import { useRef, useEffect, useState } from 'react';
import './OfficesDataPanel.css';

function useCountUp(target, duration = 1800, start = false) {
    const [value, setValue] = useState(0);
    useEffect(() => {
        if (!start) return;
        let startTime = null;
        const step = (ts) => {
            if (!startTime) startTime = ts;
            const progress = Math.min((ts - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [start, target, duration]);
    return value;
}

function StatItem({ value, suffix = '', label, delay = 0, started }) {
    const count = useCountUp(value, 1800 + delay, started);
    return (
        <div className="of-panel__stat">
            <p className="of-panel__stat-value">
                {count.toLocaleString()}
                {suffix && <span className="of-panel__stat-suffix">{suffix}</span>}
            </p>
            <p className="of-panel__stat-label">{label}</p>
        </div>
    );
}

export default function OfficesDataPanel() {
    const ref = useRef(null);
    const [started, setStarted] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setStarted(true); obs.disconnect(); } },
            { threshold: 0.4 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <aside ref={ref} className="of-panel" aria-label="Global data statistics">
            <StatItem value={56788} label="Online Resources" delay={0} started={started} />
            <div className="of-panel__divider" aria-hidden="true" />
            <StatItem value={30} suffix=" +" label="Countries" delay={200} started={started} />
            <div className="of-panel__divider" aria-hidden="true" />
            <StatItem value={40} suffix=" +" label="Centers" delay={400} started={started} />
        </aside>
    );
}
