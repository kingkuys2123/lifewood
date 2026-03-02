import './OfficesRotatingBadge.css';

/**
 * OfficesRotatingBadge
 * Animated circular text: 4× "· BE AMAZED" evenly spaced around a full circle
 * with a glowing saffron dot in the centre.
 */
export default function OfficesRotatingBadge() {
    const segment = '\u00B7 BE AMAZED ';

    return (
        <div className="of-badge" aria-label="Be amazed" role="img">
            <svg
                className="of-badge__ring"
                viewBox="0 0 160 160"
                width="160"
                height="160"
                aria-hidden="true"
            >
                <defs>
                    <path
                        id="of-badge-circle"
                        d="M 80,80 m -62,0 a 62,62 0 1,1 124,0 a 62,62 0 1,1 -124,0"
                    />
                </defs>
                <text className="of-badge__text">
                    <textPath href="#of-badge-circle" startOffset="0%">{segment}</textPath>
                    <textPath href="#of-badge-circle" startOffset="25%">{segment}</textPath>
                    <textPath href="#of-badge-circle" startOffset="50%">{segment}</textPath>
                    <textPath href="#of-badge-circle" startOffset="75%">{segment}</textPath>
                </text>
            </svg>

            {/* Centre glow dot */}
            <div className="of-badge__centre" aria-hidden="true">
                <div className="of-badge__dot" />
                <div className="of-badge__pulse" />
            </div>
        </div>
    );
}

