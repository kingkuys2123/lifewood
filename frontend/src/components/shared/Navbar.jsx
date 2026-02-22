import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
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

function DropdownItem({ item }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', close);
        return () => document.removeEventListener('mousedown', close);
    }, []);

    if (!item.children) {
        return (
            <li className="nav__item">
                <Link to={item.to} className="nav__link">{item.label}</Link>
            </li>
        );
    }

    return (
        <li
            ref={ref}
            className={`nav__item nav__item--has-drop${open ? ' nav__item--open' : ''}`}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            <button className="nav__link nav__link--parent" aria-expanded={open}>
                {item.label}
                <svg className="nav__caret" width="10" height="6" viewBox="0 0 10 6" fill="none">
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
            <div className="nav__dropdown" role="menu">
                <ul className="nav__drop-list">
                    {item.children.map((c) => (
                        <li key={c.label}>
                            <Link to={c.to} className="nav__drop-link" role="menuitem">{c.label}</Link>
                        </li>
                    ))}
                </ul>
            </div>
        </li>
    );
}

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 16);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    return (
        <header className={`navbar${scrolled ? ' navbar--solid' : ''}`}>
            <div className="navbar__wrap">

                {/* Brand — left-most */}
                <Link to="/" className="navbar__brand" aria-label="lifewood home" style={{ color: '#133020' }}>
                    <img src={brandIcon} alt="" className="nav-brand-icon" />
                    life<em style={{ color: '#133020', fontStyle: 'normal' }}>wood</em>
                </Link>

                {/* Nav — center */}
                <nav className={`navbar__nav${mobileOpen ? ' navbar__nav--open' : ''}`} aria-label="Main">
                    <ul className="navbar__list">
                        {NAV_ITEMS.map((item) => (
                            <DropdownItem key={item.label} item={item} />
                        ))}
                        {/* Mobile-only Apply Now in menu */}
                        <li className="nav__item nav__item--mobile-only">
                            <Link to="/apply" className="nav__link nav__link--cta" onClick={() => setMobileOpen(false)}>Apply Now</Link>
                        </li>
                    </ul>
                </nav>

                {/* Right — Desktop Apply Now & Mobile Toggle */}
                <div className="navbar__end">
                    <Link to="/apply" className="btn btn-saffron navbar__apply">Apply Now</Link>

                    {/* Mobile toggle moved inside end cluster for right-most positioning */}
                    <button
                        className={`navbar__burger${mobileOpen ? ' navbar__burger--x' : ''}`}
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle navigation"
                    >
                        <span /><span /><span />
                    </button>
                </div>
            </div>
        </header>
    );
}
