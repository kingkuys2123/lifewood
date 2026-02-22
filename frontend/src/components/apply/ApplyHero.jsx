import './ApplyHero.css';

const BADGES = ['Opportunities', 'Global Projects', 'AI & Data Technology'];

export default function ApplyHero() {
    return (
        <section className="apply-hero">
            <div className="apply-hero__blob" aria-hidden="true" />
            <div className="apply-hero__inner wrap">
                <span className="apply-hero__eyebrow">
                    Careers at Lifewood
                </span>
                <h1 className="apply-hero__title">
                    Join Our <em>Team</em>
                </h1>
                <p className="apply-hero__sub">
                    Apply for an internship and be part of groundbreaking technology
                    projects that are shaping the future.
                </p>
                <div className="apply-hero__badges">
                    {BADGES.map((b) => (
                        <span key={b} className="apply-hero__badge">
                            {b}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}

