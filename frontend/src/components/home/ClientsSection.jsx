import { useEffect, useRef } from 'react';
import './ClientsSection.css';

const CLIENTS = [
    'Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'OpenAI',
    'Anthropic', 'NVIDIA', 'IBM', 'Oracle', 'Salesforce', 'Adobe',
    'Palantir', 'Scale AI', 'Appen', 'Surge AI', 'DataAnnotation',
    'Toloka', 'Remotasks', 'Defined.ai',
];

export default function ClientsSection() {
    const sectionRef = useRef(null);

    useEffect(() => {
        const els = sectionRef.current?.querySelectorAll('.reveal') ?? [];
        if (!els.length) return;
        const obs = new IntersectionObserver(
            (entries) => entries.forEach(e => {
                if (e.isIntersecting) { e.target.classList.add('reveal--visible'); obs.unobserve(e.target); }
            }),
            { threshold: 0.1 }
        );
        els.forEach(el => obs.observe(el));
        return () => obs.disconnect();
    }, []);

    const doubled = [...CLIENTS, ...CLIENTS];

    return (
        <section className="clients" id="clients" ref={sectionRef}>

            <div className="clients__header wrap">
                <div className="reveal">
                    <span className="section-eyebrow"><span className="section-dot" /> Our Clients And Partners</span>
                </div>
                <p className="clients__body reveal reveal-delay-1">
                    We are proud to partner with some of the world's most innovative companies —
                    from global technology leaders to pioneering AI research organisations —
                    delivering the data that powers their most ambitious AI initiatives.
                </p>
            </div>

            {/* Infinite ticker */}
            <div className="clients__ticker-wrap" aria-hidden>
                <div className="clients__ticker">
                    {doubled.map((name, i) => (
                        <span key={`${name}-${i}`} className="clients__pill">{name}</span>
                    ))}
                </div>
            </div>

        </section>
    );
}
