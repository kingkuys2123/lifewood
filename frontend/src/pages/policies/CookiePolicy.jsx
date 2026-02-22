import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Policy.css';

const TOC = [
    { id: 'what-are-cookies',  label: '1. What Are Cookies?' },
    { id: 'how-we-use',        label: '2. How We Use Cookies' },
    { id: 'third-party',       label: '3. Third-Party Cookies' },
    { id: 'your-choices',      label: '4. Your Cookie Choices' },
    { id: 'managing',          label: '5. Managing Cookies' },
    { id: 'changes',           label: '6. Changes to This Policy' },
    { id: 'contact',           label: '7. Contact Us' },
];

const COOKIE_TYPES = [
    {
        title: 'Session Cookies',
        desc: 'Temporary cookies that expire once you close your browser. Used to track your activity during a single session.',
        icon: 'session',
        badge: null,
    },
    {
        title: 'Persistent Cookies',
        desc: 'Remain on your device until they expire or are deleted, allowing the website to remember your preferences across sessions.',
        icon: 'persistent',
        badge: null,
    },
    {
        title: 'First-Party Cookies',
        desc: 'Cookies set directly by the Lifewood website you are visiting.',
        icon: 'first',
        badge: null,
    },
    {
        title: 'Third-Party Cookies',
        desc: 'Cookies set by a domain other than the website you are visiting, often used for advertising and analytics purposes.',
        icon: 'third',
        badge: null,
    },
];

const COOKIE_CATEGORIES = [
    {
        title: 'Essential Cookies',
        desc: 'Necessary for the website to function properly. Allow you to navigate the site and use its features, such as accessing secure areas and completing transactions.',
        badge: 'Always Active',
        iconType: 'forest',
    },
    {
        title: 'Performance & Analytics',
        desc: 'Help us understand how visitors interact with our website by collecting information on site traffic, page views, and key metrics to improve usability.',
        badge: 'Optional',
        iconType: 'saffron',
    },
    {
        title: 'Functionality Cookies',
        desc: 'Allow the website to remember your preferences and provide enhanced, personalised features such as login details or language settings.',
        badge: 'Optional',
        iconType: 'steel',
    },
    {
        title: 'Targeting & Advertising',
        desc: 'Used to deliver relevant advertisements based on your browsing habits and to measure the effectiveness of our marketing campaigns.',
        badge: 'Optional',
        iconType: 'saffron',
    },
];

const BROWSERS = [
    { name: 'Google Chrome',   path: 'Settings → Privacy and Security → Cookies and other site data' },
    { name: 'Mozilla Firefox', path: 'Options → Privacy & Security → Cookies and Site Data' },
    { name: 'Microsoft Edge',  path: 'Settings → Site Permissions → Cookies and site data' },
    { name: 'Safari',          path: 'Preferences → Privacy → Cookies and website data' },
];

function useActiveSection(ids) {
    const [active, setActive] = useState(ids[0]);
    useEffect(() => {
        const obs = new IntersectionObserver(
            (entries) => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }),
            { rootMargin: '-20% 0px -70% 0px' }
        );
        ids.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
        return () => obs.disconnect();
    }, [ids]);
    return active;
}

/* Inline SVG icons for cookie type cards */
function CookieIcon({ type }) {
    const icons = {
        session: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
        persistent: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /></svg>,
        first: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
        third: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" /></svg>,
    };
    return icons[type] || null;
}

export default function CookiePolicy() {
    const active = useActiveSection(TOC.map(t => t.id));

    return (
        <div className="policy-page">

            <section className="policy-hero">
                <div className="policy-hero-inner wrap">
                    <span className="policy-hero-eyebrow"><span className="policy-hero-dot" />Legal</span>
                    <h1 className="policy-hero-title">Cookie Policy</h1>
                    <div className="policy-hero-meta">
                        <span className="policy-hero-date">Lifewood Data Technology Ltd.</span>
                        <span className="policy-hero-version">v1.0</span>
                    </div>
                </div>
            </section>

            <div className="wrap">
                <div className="policy-layout">

                    <aside className="policy-toc" aria-label="Table of contents">
                        <p className="policy-toc-title">On this page</p>
                        <nav><ul className="policy-toc-list">
                            {TOC.map(({ id, label }) => (
                                <li key={id}><a href={`#${id}`} className={`policy-toc-link${active === id ? ' active' : ''}`}>{label}</a></li>
                            ))}
                        </ul></nav>
                    </aside>

                    <article className="policy-body">

                        {/* Intro */}
                        <div className="policy-callout--saffron policy-callout" style={{ marginBottom: 'var(--s-48)' }}>
                            <span className="policy-callout-label">Overview</span>
                            <p>At Lifewood Data Technology Ltd., we use cookies and similar tracking technologies to enhance your experience, analyze site usage, and personalize content. This Cookie Policy explains what cookies are, how we use them, and how you can manage your preferences.</p>
                        </div>

                        {/* 1. What are cookies */}
                        <section id="what-are-cookies" className="policy-section">
                            <div className="policy-section-header">
                                <span className="policy-section-num">01</span>
                                <h2 className="policy-section-title">What Are Cookies?</h2>
                            </div>
                            <p className="policy-text">Cookies are small text files that are stored on your device (computer, smartphone, or tablet) when you visit a website. They are used to store and track information about your actions and preferences, enabling the website to function properly and deliver a personalized experience.</p>
                            <p className="policy-text">There are several types of cookies:</p>
                            <div className="policy-cookie-grid">
                                {COOKIE_TYPES.map(({ title, desc, icon }) => (
                                    <div key={title} className="policy-cookie-card">
                                        <div className="policy-cookie-card-icon">
                                            <CookieIcon type={icon} />
                                        </div>
                                        <p className="policy-cookie-card-title">{title}</p>
                                        <p className="policy-cookie-card-desc">{desc}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* 2. How we use */}
                        <section id="how-we-use" className="policy-section">
                            <div className="policy-section-header">
                                <span className="policy-section-num">02</span>
                                <h2 className="policy-section-title">How Lifewood Uses Cookies</h2>
                            </div>
                            <p className="policy-text">We use cookies to improve your browsing experience, streamline functionality, and enhance the performance of our website. Specifically, Lifewood uses cookies for the following purposes:</p>
                            <div className="policy-cookie-grid">
                                {COOKIE_CATEGORIES.map(({ title, desc, badge, iconType }) => (
                                    <div key={title} className="policy-cookie-card">
                                        <div className={`policy-cookie-card-icon${iconType === 'saffron' ? ' policy-cookie-card-icon--saffron' : iconType === 'steel' ? ' policy-cookie-card-icon--steel' : ''}`}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
                                            </svg>
                                        </div>
                                        <p className="policy-cookie-card-title">{title}</p>
                                        <p className="policy-cookie-card-desc">{desc}</p>
                                        {badge && (
                                            <span className={`policy-cookie-badge${badge === 'Always Active' ? ' policy-cookie-badge--required' : ''}`}>
                                                {badge}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* 3. Third-party */}
                        <section id="third-party" className="policy-section">
                            <div className="policy-section-header">
                                <span className="policy-section-num">03</span>
                                <h2 className="policy-section-title">Third-Party Cookies</h2>
                            </div>
                            <p className="policy-text">We may allow third-party service providers, such as Google Analytics or social media platforms, to place cookies on your device to track usage, improve site functionality, and deliver targeted ads. These third parties may have access to certain information about your browsing habits but will not be able to identify you personally from this data.</p>
                            <div className="policy-callout">
                                <span className="policy-callout-label">Recommendation</span>
                                <p>We recommend reviewing the privacy policies of these third parties to understand how they handle your data.</p>
                            </div>
                        </section>

                        {/* 4. Your choices */}
                        <section id="your-choices" className="policy-section">
                            <div className="policy-section-header">
                                <span className="policy-section-num">04</span>
                                <h2 className="policy-section-title">Your Cookie Choices</h2>
                            </div>
                            <p className="policy-text">You have the right to accept or reject cookies. When you visit our website for the first time, you will be asked to consent to the use of cookies through a cookie banner. You can also manage or disable cookies by adjusting your browser settings.</p>
                            <p className="policy-text">Here's how you can control cookies in popular browsers:</p>
                            <div className="policy-browser-grid">
                                {BROWSERS.map(({ name, path }) => (
                                    <div key={name} className="policy-browser-item">
                                        <p className="policy-browser-name">{name}</p>
                                        <p className="policy-browser-path">{path}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="policy-callout--saffron policy-callout">
                                <span className="policy-callout-label">Please Note</span>
                                <p>Disabling certain cookies may affect the functionality of our website and limit your ability to use some of its features.</p>
                            </div>
                        </section>

                        {/* 5. Managing */}
                        <section id="managing" className="policy-section">
                            <div className="policy-section-header">
                                <span className="policy-section-num">05</span>
                                <h2 className="policy-section-title">Managing Cookies on Lifewood</h2>
                            </div>
                            <p className="policy-text">You can manage your cookie preferences at any time by clicking on the <strong>"Cookie Settings"</strong> link in the footer of our website. From there, you can opt out of non-essential cookies, such as performance and marketing cookies.</p>
                            <p className="policy-text">If you do not want to receive cookies, you can also modify your browser settings to notify you when cookies are being used or to block cookies altogether. However, please be aware that some parts of our website may not function properly if you block essential cookies.</p>
                        </section>

                        {/* 6. Changes */}
                        <section id="changes" className="policy-section">
                            <div className="policy-section-header">
                                <span className="policy-section-num">06</span>
                                <h2 className="policy-section-title">Changes to This Cookie Policy</h2>
                            </div>
                            <p className="policy-text">We may update this Cookie Policy from time to time to reflect changes in our practices, legal requirements, or the services we offer. We encourage you to review this page periodically to stay informed about how we use cookies.</p>
                            <p className="policy-text">The "Last Updated" date at the top of this policy will reflect the most recent modification date. Continued use of our website after changes are posted constitutes your acceptance of the updated Cookie Policy.</p>
                        </section>

                        {/* 7. Contact */}
                        <section id="contact" className="policy-section">
                            <div className="policy-section-header">
                                <span className="policy-section-num">07</span>
                                <h2 className="policy-section-title">Contact Us</h2>
                            </div>
                            <p className="policy-text">If you have any questions about our use of cookies or how to manage your preferences, please contact us:</p>
                            <div className="policy-contact-card">
                                <p className="policy-contact-heading">Lifewood Data Technology Limited</p>
                                <div className="policy-contact-row">
                                    <svg className="policy-contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                                    <a href="mailto:hr@lifewood.com">hr@lifewood.com</a>
                                </div>
                                <div className="policy-contact-row">
                                    <svg className="policy-contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                                    <span>Unit 19, 9/F, Core C, Cyberport 3, 100 Cyberport Road, Hong Kong</span>
                                </div>
                            </div>
                        </section>

                        <nav className="policy-page-nav" aria-label="Policy navigation">
                            <Link to="/privacy-policy" className="policy-page-nav-link">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10.5 3L5.5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                <div><span className="policy-page-nav-label">Previous</span>Privacy Policy</div>
                            </Link>
                            <Link to="/terms-and-conditions" className="policy-page-nav-link policy-page-nav-link--next">
                                <div><span className="policy-page-nav-label">Next</span>Terms &amp; Conditions</div>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M5.5 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </Link>
                        </nav>

                    </article>
                </div>
            </div>
        </div>
    );
}

