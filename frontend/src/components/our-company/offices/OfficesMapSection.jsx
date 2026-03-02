import { useRef } from 'react';
import { useReveal } from '../../../hooks/useReveal';
import OfficesMap from './OfficesMap';
import './OfficesMapSection.css';

export default function OfficesMapSection() {
    const ref = useRef(null);
    useReveal(ref, 0.05);

    return (
        <section
            className="of-mapsec"
            id="offices-map"
            ref={ref}
            aria-labelledby="of-mapsec-heading"
        >
            <div className="of-mapsec__inner wrap">
                {/* Section label */}
                <div className="of-mapsec__eyebrow reveal">
                    <span className="section-eyebrow">
                        <span className="section-dot" />
                        Global Presence
                    </span>
                </div>

                {/* Heading */}
                <h2
                    id="of-mapsec-heading"
                    className="of-mapsec__heading reveal reveal-delay-1"
                >
                    Where we operate
                </h2>

                {/* Map */}
                <div className="of-mapsec__body reveal reveal-delay-2">
                    <OfficesMap />
                </div>
            </div>
        </section>
    );
}
