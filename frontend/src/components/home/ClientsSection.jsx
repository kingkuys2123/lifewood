import { useRef } from 'react';
import { useReveal } from '../../hooks/useReveal';
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
    useReveal(sectionRef);

    return (
        <section className="clients" id="clients" ref={sectionRef}>
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

                {/* ── Centered logo row ── */}
                <div className="clients__logos" aria-label="Client logos">
                    {PARTNERS.map((p, i) => (
                        <div
                            key={p.id}
                            className="clients__logo-item reveal"
                            style={{ '--logo-i': i }}
                        >
                            <img
                                src={p.img}
                                alt={p.name}
                                className="clients__logo"
                                draggable="false"
                            />
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
