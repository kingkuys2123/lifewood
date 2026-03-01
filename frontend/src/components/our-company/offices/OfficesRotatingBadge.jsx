import './OfficesRotatingBadge.css';

/**
 * OfficesRotatingBadge
 * Animated circular text: ". be . amazed . be . amazed"
 * with a glowing saffron dot in the centre.
 */
export default function OfficesRotatingBadge() {
    const text = '. be . amazed . be . amazed ';

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
                    <textPath href="#of-badge-circle" startOffset="0%">
                        {text}
                    </textPath>
                </text>
            </svg>

            {/* Centre glow dot */}
            <div className="of-badge__centre" aria-hidden="true">
                <div className="of-badge__dot" />
                <div className="of-badge__pulse" />
            </div>

            {/* Arrow pointer */}
            <div className="of-badge__arrow" aria-hidden="true">
                <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
                    <path d="M8 2v20M2 16l6 6 6-6" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        </div>
    );
}

