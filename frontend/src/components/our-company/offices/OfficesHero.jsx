import { useRef } from 'react';
import { useReveal } from '../../../hooks/useReveal';
import OfficesRotatingBadge from './OfficesRotatingBadge';
import './OfficesHero.css';

export default function OfficesHero() {
    const ref = useRef(null);
    useReveal(ref, 0.05);

    return (
        <section className="of-hero" id="offices-hero" ref={ref} aria-labelledby="of-hero-heading">

            {/* Decorative orbs */}
            <div className="of-hero__orb of-hero__orb--1" aria-hidden="true" />
            <div className="of-hero__orb of-hero__orb--2" aria-hidden="true" />

            <div className="of-hero__inner wrap">
                <div className="of-hero__text">
                    {/* Eyebrow */}
                    <div className="of-hero__eyebrow reveal" aria-label="Section: Our Company">
                        <span className="of-hero__dot" />
                        <span className="of-hero__dot of-hero__dot--outline" />
                        <span className="of-hero__dash" aria-hidden="true" />
                        <span className="section-eyebrow">Our Company</span>
                    </div>

                    {/* Heading */}
                    <h1
                        id="of-hero-heading"
                        className="of-hero__heading reveal reveal-delay-1"
                    >
                        Largest Global<br />
                        <span className="of-hero__heading-em">Data Collection</span><br />
                        Resources Distribution
                    </h1>

                    {/* Body */}
                    <p className="of-hero__body reveal reveal-delay-2">
                        Lifewood operates across{' '}
                        <strong>30+ countries</strong> and{' '}
                        <strong>40+ centers</strong>{' '}
                        worldwide, harnessing a vast network of{' '}
                        <strong>56,788 online resources</strong>{' '}
                        to power next-generation AI data solutions.
                    </p>

                    {/* Rule */}
                    <div className="of-hero__rule reveal reveal-delay-3" aria-hidden="true" />
                </div>

                {/* Rotating badge */}
                <div className="of-hero__badge-wrap reveal reveal-delay-2">
                    <OfficesRotatingBadge />
                </div>
            </div>
        </section>
    );
}

