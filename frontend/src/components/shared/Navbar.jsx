import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import brandIcon from '../../assets/branding/lifewood-icon.png';
import './Navbar.css';

export const NAV_ITEMS = [
    { label: 'Home', to: '/' },
    {
        label: 'AI Initiatives',
        children: [
            { label: 'AI Projects', to: '/ai-initiatives/projects' },
            { label: 'AI Services', to: '/ai-initiatives/services' },
        ],
    },
    { label: 'Internal News', to: '/internal-news' },
    {
        label: 'Our Company',
        children: [
            { label: 'About Us', to: '/our-company/about' },
            { label: 'Offices', to: '/our-company/offices' },
        ],
    },
    { label: 'Philanthropy & Impact', to: '/philanthropy' },
    {
        label: 'What We Offer',
        children: [
            { label: 'Type A – Data Servicing', to: '/offer/type-a' },
            { label: 'Type B – Horizontal LLM Data', to: '/offer/type-b' },
            { label: 'Type C – Vertical LLM Data', to: '/offer/type-c' },
        ],
    },
    { label: 'Careers', to: '/careers' },
    { label: 'Contact Us', to: '/contact' },
];

/** Detects whether we are currently in the mobile breakpoint */
function useIsMobile(breakpoint = 1100) {
    const [isMobile, setIsMobile] = useState(() => window.innerWidth <= breakpoint);
    useEffect(() => {
        const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
        const handler = (e) => setIsMobile(e.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, [breakpoint]);
    return isMobile;
}

function DropdownItem({ item, closeMobileMenu }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const isMobile = useIsMobile();

    // Close dropdown when clicking outside (desktop only)
    useEffect(() => {
        if (isMobile) return;
        const close = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', close);
        return () => document.removeEventListener('mousedown', close);
    }, [isMobile]);

    // Close accordion when switching to desktop
    useEffect(() => {
        if (!isMobile) setOpen(false);
    }, [isMobile]);

    if (!item.children) {
        return (
            <li className="nav__item">
                <NavLink
                    to={item.to}
                    end
                    className={({ isActive }) =>
                        `nav__link${isActive ? ' nav__link--active' : ''}`
                    }
                    onClick={closeMobileMenu}
                >
                    {item.label}
                </NavLink>
            </li>
        );
    }

    const location = useLocation();
    // Highlight the parent button when any child route is currently active
    const isParentActive = item.children?.some(c => location.pathname === c.to);

    const handleDesktopEnter = () => { if (!isMobile) setOpen(true); };
    const handleDesktopLeave = () => { if (!isMobile) setOpen(false); };
    const handleMobileToggle = (e) => {
        if (isMobile) {
            e.preventDefault();
            e.stopPropagation();
            setOpen((v) => !v);
        }
    };

    return (
        <li
            ref={ref}
            className={`nav__item nav__item--has-drop${open ? ' nav__item--open' : ''}`}
            onMouseEnter={handleDesktopEnter}
            onMouseLeave={handleDesktopLeave}
        >
            <button
                className={`nav__link nav__link--parent${isParentActive ? ' nav__link--active' : ''}`}
                aria-expanded={open}
                aria-haspopup="true"
                onClick={handleMobileToggle}
            >
                {item.label}
                <svg
                    className={`nav__caret${open ? ' nav__caret--open' : ''}`}
                    width="10"
                    height="6"
                    viewBox="0 0 10 6"
                    fill="none"
                    aria-hidden="true"
                >
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
            <div className="nav__dropdown" role="menu" aria-label={item.label}>
                <ul className="nav__drop-list">
                    {item.children.map((c) => (
                        <li key={c.label}>
                            <NavLink
                                to={c.to}
                                end
                                className={({ isActive }) =>
                                    `nav__drop-link${isActive ? ' nav__drop-link--active' : ''}`
                                }
                                role="menuitem"
                                onClick={closeMobileMenu}
                            >
                                {c.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>
        </li>
    );
}

/** Routes where the hero is white — navbar must always be solid */
const ALWAYS_SOLID_PATHS = ['/privacy-policy', '/cookie-policy', '/terms-and-conditions', '/contact', '/apply', '/internal-news', '/philanthropy'];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();

    const isForcedSolid = ALWAYS_SOLID_PATHS.includes(location.pathname);

    const closeMobileMenu = useCallback(() => setMobileOpen(false), []);

    // Close drawer on route change
    useEffect(() => {
        closeMobileMenu();
    }, [location.pathname, closeMobileMenu]);

    // Scroll sentinel
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 16);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Lock body scroll when drawer is open
    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    // Close drawer on Escape key
    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') closeMobileMenu(); };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [closeMobileMenu]);

    return (
        <>
            {/* Backdrop overlay — tap outside to close on mobile */}
            {mobileOpen && (
                <div
                    className="navbar__overlay"
                    aria-hidden="true"
                    onClick={closeMobileMenu}
                />
            )}

            <header className={`navbar${(scrolled || isForcedSolid) ? ' navbar--solid' : ''}${mobileOpen ? ' navbar--menu-open' : ''}`}>
                <div className="navbar__wrap">

                    {/* Brand — left-most */}
                    <Link to="/" className="navbar__brand" aria-label="Lifewood home" onClick={closeMobileMenu} style={{ color: '#133020' }}>
                        <img src={brandIcon} alt="" className="nav-brand-icon" />
                        life<em style={{ color: '#133020', fontStyle: 'normal' }}>wood</em>
                    </Link>

                    {/* Nav drawer */}
                    <nav
                        className={`navbar__nav${mobileOpen ? ' navbar__nav--open' : ''}`}
                        aria-label="Main navigation"
                        id="main-nav"
                    >
                        <ul className="navbar__list" role="list">
                            {NAV_ITEMS.map((item) => (
                                <DropdownItem
                                    key={item.label}
                                    item={item}
                                    closeMobileMenu={closeMobileMenu}
                                />
                            ))}
                            {/* Mobile-only Apply Now */}
                            <li className="nav__item nav__item--mobile-only">
                                <Link
                                    to="/apply"
                                    className="nav__link nav__link--cta"
                                    onClick={closeMobileMenu}
                                >
                                    Apply Now
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    {/* Right cluster — Desktop CTA + Hamburger */}
                    <div className="navbar__end">
                        <Link to="/apply" className="btn btn-saffron navbar__apply">Apply Now</Link>

                        <button
                            className={`navbar__burger${mobileOpen ? ' navbar__burger--x' : ''}`}
                            onClick={() => setMobileOpen((v) => !v)}
                            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
                            aria-expanded={mobileOpen}
                            aria-controls="main-nav"
                        >
                            <span aria-hidden="true" />
                            <span aria-hidden="true" />
                            <span aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </header>
        </>
    );
}
