import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useReveal } from '../../hooks/useReveal';
import './CareersCTA.css';

export default function CareersCTA() {
    const sectionRef = useRef(null);
    useReveal(sectionRef, 0.1);

    return (
        <section className="careers-cta" id="careers-cta" ref={sectionRef}>
            <div className="careers-cta__blob-tl" aria-hidden="true" />
            <div className="careers-cta__blob-br" aria-hidden="true" />

            <div className="careers-cta__inner wrap">

                <span className="careers-cta__eyebrow reveal">
                    Your Next Chapter
                </span>

                <h2 className="careers-cta__quote reveal reveal-delay-1">
                    The adventure is always<br />
                    <em>before you</em>
                </h2>

                <div className="careers-cta__rule reveal reveal-delay-1" aria-hidden="true" />

                <p className="careers-cta__body reveal reveal-delay-2">
                    If you're looking to turn the page on a new chapter in your career, make
                    contact with us today. At Lifewood, the adventure is always before you —
                    it's why we've been described as <strong style={{ color: 'rgba(255,255,255,0.75)', fontWeight: 700 }}>"always on, never off."</strong>
                </p>

            </div>
        </section>
    );
}

