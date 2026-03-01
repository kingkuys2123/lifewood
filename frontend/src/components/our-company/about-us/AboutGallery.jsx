import { useRef, useState, useCallback } from 'react';
import { useReveal } from '../../../hooks/useReveal';
import './AboutGallery.css';

const GALLERY_ITEMS = [
    {
        id: 1,
        src: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80',
        alt: 'Team collaborating in a modern office',
        caption: 'Team Collaboration',
        size: 'large',
    },
    {
        id: 2,
        src: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80',
        alt: 'AI brain visualization — futuristic technology',
        caption: 'AI Innovation',
        size: 'small',
    },
    {
        id: 3,
        src: 'https://images.unsplash.com/photo-1616161560417-6e77afe1f1a5?w=600&q=80',
        alt: 'Self-driving car with computer vision overlay',
        caption: 'Autonomous Systems',
        size: 'small',
    },
    {
        id: 4,
        src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80',
        alt: 'Developer working on laptop with code',
        caption: 'Data Engineering',
        size: 'medium',
    },
    {
        id: 5,
        src: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&q=80',
        alt: 'Team celebrating project success',
        caption: 'Our Culture',
        size: 'medium',
    },
    {
        id: 6,
        src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
        alt: 'Data analytics dashboard on screen',
        caption: 'Data Solutions',
        size: 'small',
    },
    {
        id: 7,
        src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
        alt: 'Mountain landscape — sustainability and impact',
        caption: 'Global Impact',
        size: 'large',
    },
];

export default function AboutGallery() {
    const ref = useRef(null);
    useReveal(ref, 0.05);
    const [lightbox, setLightbox] = useState(null);

    const openLightbox = useCallback((item) => setLightbox(item), []);
    const closeLightbox = useCallback(() => setLightbox(null), []);

    const handleKeyDown = useCallback((e, item) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openLightbox(item);
        }
    }, [openLightbox]);

    const handleLightboxKey = useCallback((e) => {
        if (e.key === 'Escape') closeLightbox();
    }, [closeLightbox]);

    return (
        <section className="au-gallery" id="about-gallery" ref={ref} aria-labelledby="au-gallery-heading">

            {/* Header */}
            <div className="au-gallery__header wrap">
                <div className="au-gallery__eyebrow reveal">
                    <span className="section-eyebrow">
                        <span className="section-dot" />
                        Gallery
                    </span>
                </div>
                <h2 id="au-gallery-heading" className="au-gallery__heading reveal reveal-delay-1">
                    Life at <span className="au-gallery__heading-em">Lifewood</span>
                </h2>
                <p className="au-gallery__sub reveal reveal-delay-2">
                    A curated look at our work, culture, and the communities we serve.
                </p>
            </div>

            {/* Masonry grid */}
            <div className="au-gallery__grid wrap">
                {GALLERY_ITEMS.map((item, i) => (
                    <button
                        key={item.id}
                        className={`au-gallery__item au-gallery__item--${item.size} reveal reveal-delay-${(i % 5) + 1}`}
                        onClick={() => openLightbox(item)}
                        onKeyDown={(e) => handleKeyDown(e, item)}
                        aria-label={`View image: ${item.alt}`}
                        tabIndex={0}
                    >
                        <img
                            src={item.src}
                            alt={item.alt}
                            loading="lazy"
                            className="au-gallery__img"
                        />
                        <div className="au-gallery__overlay" aria-hidden="true">
                            <div className="au-gallery__overlay-content">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                                    <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
                                </svg>
                                <span>{item.caption}</span>
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            {/* Lightbox */}
            {lightbox && (
                <div
                    className="au-gallery__lightbox"
                    role="dialog"
                    aria-modal="true"
                    aria-label={lightbox.alt}
                    onClick={closeLightbox}
                    onKeyDown={handleLightboxKey}
                    tabIndex={-1}
                >
                    <div
                        className="au-gallery__lightbox-inner"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={lightbox.src}
                            alt={lightbox.alt}
                            className="au-gallery__lightbox-img"
                        />
                        <div className="au-gallery__lightbox-caption">
                            <span>{lightbox.caption}</span>
                        </div>
                        <button
                            className="au-gallery__lightbox-close"
                            onClick={closeLightbox}
                            aria-label="Close image viewer"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                        </button>
                    </div>
                </div>
            )}

        </section>
    );
}

