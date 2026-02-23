import './PhHero.css';
const BADGES = ['Education','Sustainability','Community Growth'];
export default function PhHero() {
    return (
        <section className="ph-hero" id="ph-hero">
            <div className="ph-hero__blob-tr" aria-hidden="true"/>
            <div className="ph-hero__blob-bl" aria-hidden="true"/>
            <div className="ph-hero__grid"    aria-hidden="true"/>
            <div className="ph-hero__inner wrap">
                <h1 className="ph-hero__title">
                    Philanthropy<br/>and <em>Impact</em>
                </h1>
                <div className="ph-hero__accent" aria-hidden="true"/>
                <p className="ph-hero__para">
                    We direct resources into education and developmental projects that create
                    lasting change. Our approach goes beyond giving: it builds sustainable
                    growth and empowers communities for the future.
                </p>
                <div className="ph-hero__badges">
                    {BADGES.map(b=>(
                        <span key={b} className="ph-hero__badge">
                            {b}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}

