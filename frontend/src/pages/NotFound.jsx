import { Link, useLocation } from 'react-router-dom';
import './NotFound.css';

const QUICK_LINKS = [
    { label: 'Home',              to: '/' },
    { label: 'Contact Us',        to: '/contact' },
    { label: 'Apply Now',         to: '/apply' },
    { label: 'Privacy Policy',    to: '/privacy-policy' },
];

export default function NotFound() {
    const { pathname } = useLocation();

    return (
        <div className="nf-page">
            {/* Ambient blobs */}
            <div className="nf-blob-tr" aria-hidden="true" />
            <div className="nf-blob-bl" aria-hidden="true" />

            <div className="nf-content">

                {/* Big 404 */}
                <p className="nf-code" aria-label="Error 404">
                    4<em>0</em>4
                </p>

                {/* Text */}
                <div className="nf-body">
                    <h1 className="nf-title">Page not found</h1>
                    <p className="nf-subtitle">
                        Looks like this page doesn't exist or has been moved.
                        Double-check the URL or head back to somewhere familiar.
                    </p>

                    {/* Show the bad path */}
                    <span className="nf-path" aria-label={`Requested path: ${pathname}`}>
                        <span className="nf-path-label">404</span>
                        {pathname}
                    </span>
                </div>

                {/* Primary actions */}
                <div className="nf-actions">
                    <Link to="/" className="nf-btn-primary">
                        Go to Homepage
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M3 12L12 3l9 9" />
                            <path d="M9 21V12h6v9" />
                        </svg>
                    </Link>

                    <Link to="/contact" className="nf-btn-secondary">
                        Contact Support
                    </Link>
                </div>

            </div>
        </div>
    );
}

