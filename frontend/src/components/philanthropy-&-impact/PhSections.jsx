import { useRef } from 'react';
import { useReveal } from '../../hooks/useReveal';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import pni1 from '../../assets/images/pni-1.avif';
import pni2 from '../../assets/images/pni-2.avif';
import pni3 from '../../assets/images/pni-3.avif';
import './PhSections.css';

/* ── Fix default Leaflet icon paths broken by Vite bundling ── */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

/* Custom forest-green DivIcon */
function makePin() {
    return L.divIcon({
        className: '',
        html: `<div class="ph-pin-wrap">
                 <div class="ph-pin-dot"><div class="ph-pin-ring"></div></div>
               </div>`,
        iconSize:   [14, 14],
        iconAnchor: [7, 7],
    });
}

const COUNTRIES = [
    { name:'Bangladesh', lat: 23.685, lng: 90.356, continent: 'Asia' },
    { name:'Egypt', lat: 26.820, lng: 30.802, continent: 'Africa' },
    { name:'Niger', lat: 17.607, lng: 8.081, continent: 'Africa' },
    { name:'Sierra Leone', lat: 8.460, lng: -11.779, continent: 'Africa' },
    { name:'Liberia', lat: 6.428, lng: -9.429, continent: 'Africa' },
    { name:'Ivory Coast', lat: 7.540, lng: -5.547, continent: 'Africa' },
    { name:'Ghana', lat: 7.946, lng: -1.023, continent: 'Africa' },
    { name:'Benin', lat: 9.307, lng: 2.315, continent: 'Africa' },
    { name:'Nigeria', lat: 9.082, lng: 8.675, continent: 'Africa' },
    { name:'Republic of the Congo', lat: -0.228, lng: 15.827, continent: 'Africa' },
    { name:'Dem. Republic of the Congo', lat: -4.038, lng: 21.759, continent: 'Africa' },
    { name:'Zambia', lat: -13.133, lng: 27.849, continent: 'Africa' },
    { name:'Zimbabwe', lat: -19.015, lng: 29.154, continent: 'Africa' },
    { name:'Namibia', lat: -22.957, lng: 18.491, continent: 'Africa' },
    { name:'South Africa', lat: -30.559, lng: 22.937, continent: 'Africa' },
    { name:'Madagascar', lat: -18.766, lng: 46.869, continent: 'Africa' },
    { name:'Ethiopia', lat: 9.145, lng: 40.489, continent: 'Africa' },
    { name:'Uganda', lat: 1.373, lng: 32.290, continent: 'Africa' },
    { name:'Kenya', lat: -0.023, lng: 37.906, continent: 'Africa' },
    { name:'Tanzania', lat: -6.369, lng: 34.889, continent: 'Africa' },
];


export function PhVision() {
    const ref = useRef(null);
    useReveal(ref, 0.15);
    return (
        <section className="ph-vision" ref={ref} id="ph-vision">
            <div className="ph-vision__blob" aria-hidden="true"/>
            <div className="ph-vision__inner wrap">
                <span className="ph-vision__eyebrow reveal">
                    Our Vision
                </span>
                <div className="ph-vision__rule-top reveal reveal-delay-1" aria-hidden="true"/>
                <p className="ph-vision__statement reveal reveal-delay-2">
                    Our vision is of a world where financial investment plays a central role in
                    solving the social and environmental challenges facing the global community,
                    specifically in <em>Africa</em> and the <em>Indian sub-continent</em>.
                </p>
                <div className="ph-vision__rule-bot reveal reveal-delay-3" aria-hidden="true"/>
            </div>
        </section>
    );
}

/* ══════════════════════════════════════════════════════════
   SECTION 4 — MAP
══════════════════════════════════════════════════════════ */
export function PhMap() {
    const ref = useRef(null);
    useReveal(ref, 0.08);
    const pin = makePin();

    return (
        <section className="ph-map-section" ref={ref} id="ph-map">
            <div className="ph-map-section__inner wrap">
                <div className="ph-map-section__header reveal">
                    <span className="section-eyebrow">
                        <span className="section-dot"/>
                        Global Reach
                    </span>
                    <h2 className="ph-map-section__heading">
                        Transforming <em>Communities</em><br/>Worldwide
                    </h2>

                    {/* Sub-text — plain paragraph, badge moved onto map */}
                    <div className="ph-map-section__sub-row reveal reveal-delay-1">
                        <p className="ph-map-section__sub">
                            Lifewood's impact spans {COUNTRIES.length} countries across Africa and Asia,
                            delivering education and development programmes that create lasting change.
                        </p>
                    </div>

                    <div className="ph-map-section__accent"/>
                </div>

                <div className="ph-map-card reveal reveal-delay-2">

                    {/* Rotating "Be Amazed" badge — top-right corner of map */}
                    <div className="ph-be-amazed-circle" aria-hidden="true">
                        <svg className="ph-be-amazed-circle__svg" viewBox="0 0 96 96">
                            <defs>
                                <path
                                    id="ph-circle-path"
                                    d="M 48,48 m -34,0 a 34,34 0 1,1 68,0 a 34,34 0 1,1 -68,0"
                                />
                            </defs>
                            <text>
                                <textPath href="#ph-circle-path" startOffset="0%">
                                    BE AMAZED · BE AMAZED · BE AMAZED ·
                                </textPath>
                            </text>
                        </svg>
                        <span className="ph-be-amazed-circle__dot" />
                    </div>


                    {/* Country count badge */}
                    <div className="ph-map-count" aria-label={`${COUNTRIES.length} countries`}>
                        <span className="ph-map-count-dot" aria-hidden="true"/>
                        {COUNTRIES.length} Countries
                    </div>

                    <div className="ph-map-highlight" aria-hidden="true" />

                    <MapContainer
                        center={[5, 20]}
                        zoom={3}
                        scrollWheelZoom={false}
                        zoomControl={true}
                        attributionControl={true}
                        style={{ width:'100%', height:'100%' }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {COUNTRIES.map(c => (
                            <Marker key={c.name} position={[c.lat, c.lng]} icon={pin}>
                                <Popup>
                                    <strong style={{fontFamily:'var(--font-display)',fontSize:'13px',color:'var(--c-forest)'}}>
                                        {c.name}
                                    </strong>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            </div>
        </section>
    );
}

/* ══════════════════════════════════════════════════════════
   SECTION 5 — IMPACT ROWS
══════════════════════════════════════════════════════════ */
const ROWS = [
    {
        label:   'Our Impact',
        heading: 'Creating Lasting Change',
        body:    'Lifewood directs financial and human resources into communities that need them most. From funding schools in sub-Saharan Africa to supporting vocational training in South Asia, every project is designed to leave a self-sustaining legacy. We measure success not by dollars spent, but by lives permanently transformed.',
        img:     pni1,
        imgAlt:  'Children in a classroom in Africa',
        reverse: false,
    },
    {
        label:   'Partnership',
        heading: 'Amplifying Impact Together',
        body:    'We believe the greatest change comes from collaboration. Lifewood partners with NGOs, governments, local leaders, and global corporations to pool expertise and resources. Our partnership model ensures that every contribution is multiplied, reaching further and creating deeper roots within communities.',
        img:     pni2,
        imgAlt:  'Diverse partners collaborating around a table',
        reverse: true,
    },
    {
        label:   'Application',
        heading: 'Expanding Opportunity',
        body:    'Our programmes focus on practical application — equipping individuals with digital skills, financial literacy, and entrepreneurial tools that open doors to economic independence. From mobile learning platforms in rural Kenya to micro-financing circles in Nigeria, we build bridges from potential to progress.',
        img:     pni3,
        imgAlt:  'Young person using a laptop to learn new skills',
        reverse: false,
    },
];

export function PhImpact() {
    const ref = useRef(null);
    useReveal(ref, 0.08);
    return (
        <section className="ph-impact" ref={ref} id="ph-impact">
            <div className="ph-impact__inner wrap">
                <div className="ph-impact__section-head reveal">
                    <span className="section-eyebrow"><span className=""/>Impact &amp; Partnership</span>
                    <h2 className="ph-impact__section-title">
                        Stories of <em>Transformation</em>
                    </h2>
                    <p className="ph-impact__section-sub">
                        From grassroots education to global partnerships — here is how Lifewood makes a difference.
                    </p>
                </div>

                {ROWS.map((row, i) => (
                    <div
                        key={row.label}
                        className={`ph-impact__row${row.reverse ? ' ph-impact__row--reverse' : ''} reveal reveal-delay-${(i % 4) + 1}`}
                    >
                        <div className="ph-impact__text">
                            <span className="ph-impact__label">
                                <span className="ph-impact__label-dot" aria-hidden="true"/>
                                {row.label}
                            </span>
                            <h3 className="ph-impact__heading">{row.heading}</h3>
                            <p className="ph-impact__body">{row.body}</p>
                        </div>
                        <div className="ph-impact__img-card">
                            <img
                                src={row.img} alt={row.imgAlt}
                                className="ph-impact__img"
                                loading="lazy" decoding="async"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

/* ══════════════════════════════════════════════════════════
   SECTION 6 — CLOSING CTA
══════════════════════════════════════════════════════════ */
import { Link } from 'react-router-dom';

export function PhCTA() {
    const ref = useRef(null);
    useReveal(ref, 0.1);
    return (
        <section className="ph-cta" ref={ref} id="ph-cta">
            <div className="ph-cta__blob-tl" aria-hidden="true"/>
            <div className="ph-cta__blob-br" aria-hidden="true"/>
            <div className="ph-cta__inner wrap">
                <span className="ph-cta__eyebrow reveal">
                    Join the Mission
                </span>
                <h2 className="ph-cta__heading reveal reveal-delay-1">
                    Working with new <em>intelligence</em><br/>for a better world.
                </h2>
                <div className="ph-cta__rule reveal reveal-delay-1" aria-hidden="true"/>
                <p className="ph-cta__body reveal reveal-delay-2">
                    Together we can build a future where technology and compassion work hand in
                    hand — empowering communities, protecting the planet, and creating opportunity
                    for all.
                </p>
                <div className="ph-cta__actions reveal reveal-delay-3">
                    <Link to="/contact" className="ph-cta__btn-primary">
                        Get Involved
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <line x1="5" y1="12" x2="19" y2="12"/>
                            <polyline points="12 5 19 12 12 19"/>
                        </svg>
                    </Link>
                    <Link to="/apply" className="ph-cta__btn-ghost">
                        Join Our Team
                    </Link>
                </div>
            </div>
        </section>
    );
}

