import { useEffect, useRef } from 'react';
import { useReveal } from '../../hooks/useReveal';
import ancestryImg from '../../assets/partners/ancestry.avif';
import appleImg    from '../../assets/partners/apple.avif';
import googleImg from '../../assets/partners/google.avif';
import byuImg    from '../../assets/partners/byu-pathway-worldwide.avif';
import familySearchImg from '../../assets/partners/family-search.avif';
import microsoftImg from '../../assets/partners/microsoft.avif';
import mooreImg  from '../../assets/partners/moore-foundation.avif';
import './ClientsSection.css';

const PARTNERS = [
    { id: 'apple',   name: 'Apple',            img: appleImg },
    { id: 'microsoft', name: 'Microsoft',      img: microsoftImg },
    { id: 'google', name: 'Google',           img: googleImg },
    { id: 'ancestry', name: 'Ancestry',        img: ancestryImg },
    { id: 'family-search', name: 'FamilySearch', img: familySearchImg },
    { id: 'byu',    name: 'BYU Pathway',      img: byuImg    },
    { id: 'moore',  name: 'Moore Foundation', img: mooreImg  },
];

export default function ClientsSection() {
    const sectionRef = useRef(null);
    const pointerRafRef = useRef(null);
    useReveal(sectionRef);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;
        section.style.setProperty('--mx', '50%');
        section.style.setProperty('--my', '50%');
    }, []);

    const handlePointerMove = (event) => {
        if (pointerRafRef.current) return;
        const { clientX, clientY } = event;
        pointerRafRef.current = window.requestAnimationFrame(() => {
            const section = sectionRef.current;
            if (!section) return;
            const rect = section.getBoundingClientRect();
            section.style.setProperty('--mx', `${Math.round(clientX - rect.left)}px`);
            section.style.setProperty('--my', `${Math.round(clientY - rect.top)}px`);
            pointerRafRef.current = null;
        });
    };

    const handlePointerLeave = () => {
        const section = sectionRef.current;
        if (!section) return;
        section.style.setProperty('--mx', '50%');
        section.style.setProperty('--my', '50%');
    };

    return (
        <section
            className="clients"
            id="clients"
            ref={sectionRef}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
        >
            <div className="clients__inner wrap">

                {/* ── Left-aligned text block ── */}
                <div className="clients__text">
                    <div className="clients__eyebrow reveal">
                        <span className="section-eyebrow">
                            <span className="section-dot" />
                            Our Clients &amp; Partners
                        </span>
                    </div>

                    <h2 className="clients__heading reveal reveal-delay-1">
                        Trusted by the world's most<br className="clients__br" />ambitious organisations
                    </h2>

                    <p className="clients__body reveal reveal-delay-2">
                        We are proud to partner and work with leading organisations worldwide in
                        transforming data into meaningful solutions. Lifewood's commitment to
                        innovation and excellence has earned the trust of global brands across
                        industries. Here are some of the valued clients and partners we've
                        collaborated with:
                    </p>

                    <div className="clients__rule reveal reveal-delay-3" aria-hidden />
                </div>

                {/* ── Marquee logo rail ── */}
                <div className="clients__logos reveal" aria-label="Client logos">
                    <div className="clients__marquee">
                        <div className="clients__track">
                            {[...PARTNERS, ...PARTNERS].map((p, i) => {
                                const clone = i >= PARTNERS.length;
                                return (
                                    <div
                                        key={`${p.id}-${clone ? 'clone' : 'base'}`}
                                        className="clients__logo-item"
                                        style={{ '--logo-i': i }}
                                        aria-hidden={clone ? 'true' : undefined}
                                    >
                                        <img
                                            src={p.img}
                                            alt={clone ? '' : p.name}
                                            className="clients__logo"
                                            draggable="false"
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
