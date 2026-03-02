import './OfficesGlobe.css';

/**
 * OfficesGlobe
 * A decorative animated SVG pseudo-globe with orbiting arcs,
 * a gradient sphere, latitude/longitude grid, and pulsing hot-spot dots.
 * Pure SVG + CSS — zero extra dependencies.
 */
export default function OfficesGlobe() {
    const R = 130; // sphere radius
    const cx = 170;
    const cy = 170;

    /* Generate latitude arc paths */
    const latLines = [-75, -55, -35, -15, 0, 15, 35, 55, 75].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const r = R * Math.cos(rad);
        const yOff = R * Math.sin(rad);
        // ellipse arc for latitude on a sphere projection
        return `M ${cx - r},${cy + yOff} a ${r},${r * 0.28} 0 0 1 ${r * 2},0`;
    });

    /* Generate longitude arc paths */
    const lonLines = [0, 30, 60, 90, 120, 150].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const rx = R * Math.abs(Math.cos(rad));
        return `M ${cx},${cy - R} a ${rx},${R} 0 0 1 0,${R * 2} a ${rx},${R} 0 0 1 0,-${R * 2}`;
    });

    /* Hot-spot dots (projected x,y on the sphere face) */
    const dots = [
        { x: cx + 30,  y: cy - 40, cls: 'of-globe__dot',          key: 'us'   },
        { x: cx - 60,  y: cy + 20, cls: 'of-globe__dot--forest',   key: 'sa'   },
        { x: cx + 80,  y: cy - 10, cls: 'of-globe__dot',           key: 'as1'  },
        { x: cx + 60,  y: cy + 50, cls: 'of-globe__dot--forest',   key: 'as2'  },
        { x: cx - 20,  y: cy - 55, cls: 'of-globe__dot',           key: 'eu'   },
        { x: cx + 10,  y: cy + 60, cls: 'of-globe__dot--forest',   key: 'af'   },
        { x: cx - 90,  y: cy - 20, cls: 'of-globe__dot',           key: 'us2'  },
        { x: cx + 100, y: cy - 40, cls: 'of-globe__dot--forest',   key: 'jp'   },
    ];

    /* Connector lines between adjacent dots */
    const connectors = [
        [0, 4], [4, 2], [2, 3], [3, 5], [5, 1], [6, 4], [7, 2],
    ];

    return (
        <div className="of-globe" aria-hidden="true">
            <svg
                className="of-globe__svg"
                viewBox="0 0 340 340"
                width="340"
                height="340"
            >
                <defs>
                    <radialGradient id="of-globe-grad" cx="38%" cy="35%" r="65%">
                        <stop offset="0%"   stopColor="rgba(255,255,255,1)"      />
                        <stop offset="55%"  stopColor="rgba(210,237,227,1)"      />
                        <stop offset="100%" stopColor="rgba(4,98,65,0.15)"       />
                    </radialGradient>
                    <clipPath id="of-globe-clip">
                        <circle cx={cx} cy={cy} r={R} />
                    </clipPath>
                </defs>

                {/* Sphere base */}
                <circle className="of-globe__sphere" cx={cx} cy={cy} r={R} />

                {/* Lat/lon grid clipped inside sphere */}
                <g clipPath="url(#of-globe-clip)" className="of-globe__grid">
                    {latLines.map((d, i) => <path key={`lat-${i}`} d={d} />)}
                    {lonLines.map((d, i) => <path key={`lon-${i}`} d={d} />)}
                </g>

                {/* Rim */}
                <circle className="of-globe__rim" cx={cx} cy={cy} r={R} />

                {/* Orbit 1 — tilted ellipse */}
                <ellipse
                    className="of-globe__orbit of-globe__orbit--1"
                    cx={cx} cy={cy}
                    rx={R + 18} ry={(R + 18) * 0.35}
                    transform={`rotate(-25 ${cx} ${cy})`}
                />

                {/* Orbit 2 — opposite tilt */}
                <ellipse
                    className="of-globe__orbit of-globe__orbit--2"
                    cx={cx} cy={cy}
                    rx={R + 30} ry={(R + 30) * 0.30}
                    transform={`rotate(55 ${cx} ${cy})`}
                />

                {/* Orbit 3 — wide */}
                <ellipse
                    className="of-globe__orbit of-globe__orbit--3"
                    cx={cx} cy={cy}
                    rx={R + 10} ry={(R + 10) * 0.55}
                    transform={`rotate(10 ${cx} ${cy})`}
                />

                {/* Connector lines */}
                {connectors.map(([a, b], i) => (
                    <line
                        key={`con-${i}`}
                        className="of-globe__connector"
                        x1={dots[a].x} y1={dots[a].y}
                        x2={dots[b].x} y2={dots[b].y}
                    />
                ))}

                {/* Hot-spot dots */}
                {dots.map((d) => (
                    <circle
                        key={d.key}
                        className={`of-globe__dot ${d.cls}`}
                        cx={d.x} cy={d.y}
                        r={3}
                    />
                ))}
            </svg>
        </div>
    );
}

