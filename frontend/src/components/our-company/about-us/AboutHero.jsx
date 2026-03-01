import './AboutHero.css';

export default function AboutHero() {
    return (
        <section className="au-hero" id="about-hero" aria-labelledby="au-hero-heading">


            {/* Floating orbs */}
            <div className="au-hero__orb au-hero__orb--1" aria-hidden="true" />
            <div className="au-hero__orb au-hero__orb--2" aria-hidden="true" />
            <div className="au-hero__orb au-hero__orb--3" aria-hidden="true" />

            <div className="au-hero__inner wrap">

                {/* Eyebrow */}
                <div className="au-hero__eyebrow au-hero__anim au-hero__anim--0" aria-label="Section: Our Company">
                    <span className="au-hero__dot" />
                    <span className="au-hero__dot au-hero__dot--outline" />
                    <span className="au-hero__dash" aria-hidden="true" />
                    <span className="section-eyebrow">Our Company</span>
                </div>

                {/* Heading */}
                <h1
                    id="au-hero-heading"
                    className="au-hero__heading au-hero__anim au-hero__anim--1"
                >
                    About our<br />
                    <span className="au-hero__heading-em">company</span>
                </h1>

                {/* Body */}
                <p className="au-hero__body au-hero__anim au-hero__anim--2">
                    <span className="au-hero__body-accent">
                        While we are motivated by business and economic objectives,
                    </span>{' '}
                    we remain committed to our core business beliefs{' '}
                    <span className="au-hero__body-forest">
                        that shape our corporate and individual behaviour around the world.
                    </span>
                </p>

                {/* Decorative rule */}
                <div className="au-hero__rule au-hero__anim au-hero__anim--3" aria-hidden="true" />

            </div>
        </section>
    );
}

