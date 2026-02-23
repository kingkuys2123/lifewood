import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useReveal } from '../../hooks/useReveal';
import './NewsSpotlight.css';

/* RootsTech 2026 official recap / promo — swap video ID to update */
const YT_VIDEO_ID = 'VkLDMayoJsA';

export default function NewsSpotlight() {
    const sectionRef = useRef(null);
    useReveal(sectionRef, 0.08);

    return (
        <div className="internal-news-page">
            {/* Background geometry */}
            <div className="ns-bg-blob-tr" aria-hidden="true" />
            <div className="ns-bg-blob-bl" aria-hidden="true" />
            <div className="ns-bg-grid"    aria-hidden="true" />

            <section
                className="news-spotlight"
                ref={sectionRef}
                id="news-spotlight"
                aria-labelledby="ns-heading"
            >
                <div className="news-spotlight__inner">

                    {/* ── Eyebrow row ── */}
                    <div className="ns-eyebrow-row reveal">
                        <span className="ns-eyebrow">
                            Internal News
                        </span>
                    </div>

                    {/* ── Main heading ── */}
                    <h1 className="ns-heading reveal reveal-delay-1" id="ns-heading">
                        Roots<em>Tech</em>{' '}
                        <span className="ns-heading-year">2026</span>
                    </h1>

                    {/* ── "Coming Soon!" sub-heading ── */}
                    <p className="ns-subheading reveal reveal-delay-2">
                        Coming Soon!
                    </p>

                    {/* ── Body copy ── */}
                    <p className="ns-body reveal reveal-delay-3">
                        Lifewood is gearing up for RootsTech 2026 the world's largest family
                        history and technology conference. Stay tuned for announcements, highlights,
                        and everything we have in store.
                    </p>

                    {/* ── CTA row ── */}
                    <div className="ns-cta-row reveal reveal-delay-3">
                        <Link to="/contact" className="ns-btn-primary">
                            Contact Us
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2"
                                strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <line x1="5" y1="12" x2="19" y2="12" />
                                <polyline points="12 5 19 12 12 19" />
                            </svg>
                        </Link>
                        <Link to="/apply" className="ns-btn-ghost">
                            Join Our Team
                        </Link>
                    </div>

                    {/* ── Decorative rule ── */}
                    <div className="ns-section-rule reveal" aria-hidden="true" />

                    {/* ── YouTube video ── */}
                    <div className="ns-video-wrap reveal reveal-delay-1">
                        <span className="ns-video-label">
                            <span className="ns-video-label-line" aria-hidden="true" />
                            Watch the Highlights
                            <span className="ns-video-label-line" aria-hidden="true" />
                        </span>

                        <div className="ns-video-card">
                            <div className="ns-video-ratio">
                                <iframe
                                    src={`https://www.youtube.com/embed/ccyrQ87EJag?si=OFw6v1JUaDQThdoh`}
                                    title="RootsTech 2026 — Lifewood Highlights"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                    loading="lazy"
                                />
                            </div>
                        </div>

                        <p className="ns-video-caption">
                            RootsTech 2026 · Lifewood Data Technology
                        </p>
                    </div>

                </div>
            </section>
        </div>
    );
}

