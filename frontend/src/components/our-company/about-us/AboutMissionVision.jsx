import { useRef, useState } from 'react';
import { useReveal } from '../../../hooks/useReveal';
import './AboutMissionVision.css';

const TABS = [
    {
        id: 'mission',
        label: 'Mission',
        heading: 'Our Mission',
        body: 'To develop and deploy cutting-edge AI technologies that solve real-world problems, empower communities, and advance sustainable practices. We are committed to fostering a culture of innovation, collaborating with stakeholders across sectors, and making a meaningful impact on society and the environment.',
        img1: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=900&q=80',
        img2: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=900&q=80',
        img1Alt: 'Team presenting in a modern boardroom',
        img2Alt: 'Hands joining together in unity',
    },
    {
        id: 'vision',
        label: 'Vision',
        heading: 'Our Vision',
        body: 'To be the global champion in AI data solutions, igniting a culture of innovation and sustainability that enriches lives and transforms communities worldwide.',
        img1: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&q=80',
        img2: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=900&q=80',
        img1Alt: 'High-rise building symbolizing ambition and growth',
        img2Alt: 'Person in red sweater with child — care and community',
    },
];

export default function AboutMissionVision() {
    const ref = useRef(null);
    useReveal(ref, 0.05);
    const [active, setActive] = useState('mission');

    const current = TABS.find(t => t.id === active);

    return (
        <section className="au-mv" id="about-mission-vision" ref={ref} aria-labelledby="au-mv-heading">

            {/* Heading */}
            <div className="au-mv__header wrap">
                <h2 id="au-mv-heading" className="au-mv__heading reveal">
                    What drives us today,{' '}
                    <span className="au-mv__heading-em">and what inspires us for tomorrow</span>
                </h2>
            </div>

            {/* Body */}
            <div className="au-mv__body wrap">

                {/* Image mosaic (left) */}
                <div className="au-mv__images" key={active + '-imgs'}>
                    <div className="au-mv__img-main">
                        <img src={current.img1} alt={current.img1Alt} loading="lazy" />
                    </div>
                    <div className="au-mv__img-accent">
                        <img src={current.img2} alt={current.img2Alt} loading="lazy" />
                    </div>
                </div>

                {/* Content panel (right) */}
                <div className="au-mv__panel">

                    {/* Tab switcher */}
                    <div className="au-mv__tabs" role="tablist" aria-label="Mission and Vision">
                        {TABS.map(t => (
                            <button
                                key={t.id}
                                role="tab"
                                aria-selected={active === t.id}
                                aria-controls={`au-mv-panel-${t.id}`}
                                id={`au-mv-tab-${t.id}`}
                                className={`au-mv__tab${active === t.id ? ' au-mv__tab--active' : ''}`}
                                onClick={() => setActive(t.id)}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>

                    {/* Content area */}
                    <div
                        className="au-mv__content"
                        id={`au-mv-panel-${active}`}
                        role="tabpanel"
                        aria-labelledby={`au-mv-tab-${active}`}
                        key={active}
                    >
                        <h3 className="au-mv__content-heading">{current.heading}</h3>
                        <p className="au-mv__content-body">{current.body}</p>
                    </div>

                </div>
            </div>

            {/* Decorative background */}
            <div className="au-mv__bg-accent" aria-hidden="true" />
        </section>
    );
}

