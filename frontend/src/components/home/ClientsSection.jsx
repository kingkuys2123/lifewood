import { useEffect, useRef } from 'react';
import googleImg from '../../assets/partners/google.avif';
import byuImg    from '../../assets/partners/byu-pathway-worldwide.avif';
import mooreImg  from '../../assets/partners/moore-foundation.avif';
import './ClientsSection.css';

const PARTNERS = [
    { id: 'google', name: 'Google',           img: googleImg },
    { id: 'byu',    name: 'BYU Pathway',      img: byuImg    },
    { id: 'moore',  name: 'Moore Foundation', img: mooreImg  },
];

export default function ClientsSection() {
    const sectionRef = useRef(null);

    useEffect(() => {
        const els = sectionRef.current?.querySelectorAll('.reveal') ?? [];
        if (!els.length) return;
        const obs = new IntersectionObserver(
            entries => entries.forEach(e => {
                if (e.isIntersecting) { e.target.classList.add('reveal--visible'); obs.unobserve(e.target); }
            }),
            { threshold: 0.1 }
        );
        els.forEach(el => obs.observe(el));
        return () => obs.disconnect();
    }, []);

    return (
        <section className="clients" id="clients" ref={sectionRef}>
            <div className="clients__inner wrap">

                {/* Eyebrow */}
                <div className="clients__eyebrow reveal">
                    <span className="section-eyebrow">
                        <span className="section-dot" />
                        Our Clients &amp; Partners
                    </span>
                </div>

                {/* Heading */}
                <h2 className="clients__heading reveal reveal-delay-1">
                    Trusted by the world's most<br className="clients__br" /> ambitious organisations
                </h2>

                {/* Body copy */}
                <p className="clients__body reveal reveal-delay-2">
                    We are proud to partner and work with leading organisations worldwide in
                    transforming data into meaningful solutions. Lifewood's commitment to innovation
                    and excellence has earned the trust of global brands across industries. Here are
                    some of the valued clients and partners we've collaborated with:
                </p>

                {/* Divider */}
                <div className="clients__rule reveal reveal-delay-3" aria-hidden />

                {/* Logos */}
                <div className="clients__logos reveal reveal-delay-3" aria-label="Client logos">
                    {PARTNERS.map((p, i) => (
                        <div
                            key={p.id}
                            className="clients__logo-item"
                            style={{ '--logo-i': i }}
                        >
                            <img
                                src={p.img}
                                alt={p.name}
                                className="clients__logo"
                                loading="lazy"
                                draggable="false"
                            />
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
