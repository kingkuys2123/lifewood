import useScrollProgress from '../../hooks/useScrollProgress';
import './ScrollProgressBar.css';

/**
 * ScrollProgressBar
 *
 * A 3px fixed bar pinned to the very top of the viewport that fills
 * left-to-right as the user scrolls. Uses CSS transform: scaleX()
 * instead of animating width — scaleX is composited on the GPU and
 * never triggers layout or paint.
 *
 * Mounts above the navbar (z-index: 101) and is hidden at progress 0
 * so it doesn't appear as a hairline on fresh page loads.
 */
export default function ScrollProgressBar() {
    const progress = useScrollProgress();

    return (
        <div
            className="scroll-progress"
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Page scroll progress"
        >
            <div
                className="scroll-progress__bar"
                style={{ '--progress': (progress / 100).toFixed(4) }}
            />
        </div>
    );
}

