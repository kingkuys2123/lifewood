import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Policy.css';

const TOC = [
    { id: 'acceptance',    label: '1. Acceptance of Terms' },
    { id: 'who-we-are',   label: '2. Who We Are' },
    { id: 'changes',       label: '3. Changes' },
    { id: 'eligibility',   label: '4. Eligibility' },
    { id: 'permitted-use', label: '5. Permitted Use' },
    { id: 'prohibited',    label: '6. Prohibited Use' },
    { id: 'ip',            label: '7. Intellectual Property' },
    { id: 'scraping',      label: '8. Scraping & AI/ML' },
    { id: 'submissions',   label: '9. Submissions & Feedback' },
    { id: 'third-party',   label: '10. Third-Party Links' },
    { id: 'privacy',       label: '11. Privacy & Cookies' },
    { id: 'disclaimers',   label: '12. Disclaimers' },
    { id: 'liability',     label: '13. Limitation of Liability' },
    { id: 'indemnity',     label: '14. Indemnity' },
    { id: 'termination',   label: '15. Suspension & Termination' },
    { id: 'general',       label: '16. General Terms' },
    { id: 'governing-law', label: '17. Governing Law' },
    { id: 'contact',       label: '18. Contact' },
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

/* Reusable clause list item */
function Clause({ num, children }) {
    return (
        <div className="policy-clause-item">
            <span className="policy-clause-num">{num}</span>
            <p className="policy-clause-text">{children}</p>
        </div>
    );
}

export default function TermsConditions() {
    const active = useActiveSection(TOC.map(t => t.id));

    return (
        <div className="policy-page">

            <section className="policy-hero">
                <div className="policy-hero-inner wrap">
                    <span className="policy-hero-eyebrow"><span className="policy-hero-dot" />Legal</span>
                    <h1 className="policy-hero-title">Terms and Conditions</h1>
                    <div className="policy-hero-meta">
                        <span className="policy-hero-date">lifewood.com</span>
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

                        {/* 1. Acceptance */}
                        <section id="acceptance" className="policy-section">
                            <div className="policy-section-header">
                                <span className="policy-section-num">01</span>
                                <h2 className="policy-section-title">Acceptance of these Terms</h2>
                            </div>
                            <div className="policy-clause-list">
                                <Clause num="1.1">These Terms govern your access to and use of <strong>lifewood.com</strong> (the "Site") and any content, features or functionality made available through it (together, the "Services").</Clause>
                                <Clause num="1.2">By accessing or using the Site, you agree to be bound by these Terms. If you do not agree, do not use the Site.</Clause>
                                <Clause num="1.3">If you are using the Site on behalf of a company or other organisation, you represent and warrant that you have authority to bind that entity to these Terms. In that case, "you" and "your" refers to that entity.</Clause>
                            </div>
                        </section>

                        {/* 2. Who we are */}
                        <section id="who-we-are" className="policy-section">
                            <div className="policy-section-header">
                                <span className="policy-section-num">02</span>
                                <h2 className="policy-section-title">Who We Are and How to Contact Us</h2>
                            </div>
                            <div className="policy-clause-list">
                                <Clause num="2.1">The Site is operated by <strong>Lifewood Data Technology Limited</strong> ("Lifewood", "we", "us", "our").</Clause>
                                <Clause num="2.2">Contact: <a href="mailto:hr@lifewood.com" style={{ color: 'var(--c-forest)', textDecoration: 'underline' }}>hr@lifewood.com</a> (or via our Contact Us page). Postal address: Lifewood Data Technology Limited, Unit 19, 9/F, Core C, Cyberport 3, 100 Cyberport Road, Hong Kong. For IP complaints, see clause 9.4.</Clause>
                            </div>
                        </section>

                        {/* 3. Changes */}
                        <section id="changes" className="policy-section">
                            <div className="policy-section-header">
                                <span className="policy-section-num">03</span>
                                <h2 className="policy-section-title">Changes to these Terms and the Site</h2>
                            </div>
                            <div className="policy-clause-list">
                                <Clause num="3.1">We may update these Terms from time to time. The "Last updated" date indicates when changes were made. Your continued use of the Site after changes become effective means you accept the updated Terms.</Clause>
                                <Clause num="3.2">We may update, suspend, withdraw or restrict availability of all or any part of the Site for business, operational, legal or security reasons.</Clause>
                            </div>
                        </section>

                        {/* 4. Eligibility */}
                        <section id="eligibility" className="policy-section">
                            <div className="policy-section-header">
                                <span className="policy-section-num">04</span>
                                <h2 className="policy-section-title">Eligibility</h2>
                            </div>
                            <div className="policy-clause-list">
                                <Clause num="4.1">The Site is intended for business and professional audiences. If you are under the age of majority in your jurisdiction, you may use the Site only with permission and supervision of a parent or legal guardian.</Clause>
                            </div>
                        </section>

                        {/* 5. Permitted use */}
                        <section id="permitted-use" className="policy-section">
                            <div className="policy-section-header">
                                <span className="policy-section-num">05</span>
                                <h2 className="policy-section-title">Your Permitted Use</h2>
                            </div>
                            <div className="policy-clause-list">
                                <Clause num="5.1">You may view, download and print copies of pages from the Site solely for your internal, lawful, non-commercial reference purposes (e.g., evaluating Lifewood's capabilities or services).</Clause>
                                <Clause num="5.2">You may share links (URLs) to the Site, provided you do so fairly and legally, and do not misrepresent your relationship with Lifewood.</Clause>
                            </div>
                        </section>

                        {/* 6. Prohibited */}
                        <section id="prohibited" className="policy-section">
                            <div className="policy-section-header">
                                <span className="policy-section-num">06</span>
                                <h2 className="policy-section-title">Prohibited Use and Acceptable Use Rules</h2>
                            </div>
                            <p className="policy-text">You must not use the Site:</p>
                            <ul className="policy-list">
                                <li>In any way that breaches any applicable law or regulation</li>
                                <li>To infringe, misappropriate or violate our rights or the rights of any third party</li>
                                <li>To transmit or upload malware, or to interfere with or disrupt the Site or connected systems</li>
                                <li>To attempt to gain unauthorised access to the Site, our servers, or any user accounts</li>
                                <li>To impersonate another person or entity, or misrepresent your affiliation</li>
                            </ul>
                            <p className="policy-text" style={{ marginTop: 'var(--s-16)' }}>You must not:</p>
                            <ul className="policy-list">
                                <li>Reproduce, duplicate, copy, sell, trade, resell or exploit any portion of the Site or Content except as expressly permitted</li>
                                <li>Remove, obscure or alter any proprietary notices including copyright and trademark notices</li>
                                <li>Use the Site in a way that could damage, disable, overburden or impair it</li>
                            </ul>
                        </section>

                        {/* 7. IP */}
                        <section id="ip" className="policy-section">
                            <div className="policy-section-header">
                                <span className="policy-section-num">07</span>
                                <h2 className="policy-section-title">Intellectual Property Rights</h2>
                            </div>
                            <div className="policy-clause-list">
                                <Clause num="7.1">"Content" means all materials on the Site, including text, software, code, layout, design, graphics, photographs, audio, video, logos, trademarks, service marks, and compilations.</Clause>
                                <Clause num="7.2">We (and/or our licensors) own all right, title and interest in and to the Site and Content, including all intellectual property rights. All rights are reserved.</Clause>
                                <Clause num="7.3">Nothing in these Terms grants you any right to use any of our trademarks, logos or brand features without our prior written permission.</Clause>
                                <Clause num="7.4">Any proprietary platforms, processes or technologies referenced on the Site (including the LiFT platform) are protected by intellectual property laws and are not licensed to you by virtue of your use of the Site.</Clause>
                            </div>
                        </section>

                        {/* 8. Scraping */}
                        <section id="scraping" className="policy-section">
                            <div className="policy-section-header">
                                <span className="policy-section-num">08</span>
                                <h2 className="policy-section-title">Restrictions on Scraping, Text and Data Mining, and AI/ML Use</h2>
                            </div>
                            <div className="policy-callout">
                                <span className="policy-callout-label">Important Restriction</span>
                                <p>You must not access the Site or Content using any automated means (including robots, spiders, scrapers, data-mining tools) except where required for normal browser functionality or you have our prior written permission.</p>
                            </div>
                            <div className="policy-clause-list" style={{ marginTop: 'var(--s-20)' }}>
                                <Clause num="8.2">To the maximum extent permitted by applicable law, you must not perform text and data mining, web harvesting, or systematic extraction of Content; or use any Content (including any portion, excerpt, screenshot, dataset, or derivative) to train, develop, benchmark, fine-tune, evaluate or validate any artificial intelligence or machine learning model, without our prior written consent.</Clause>
                                <Clause num="8.3">You must not bypass or circumvent any measures used to prevent or restrict access to the Site including rate limits, robots.txt, or other access controls.</Clause>
                            </div>
                        </section>

                        {/* 9. Submissions */}
                        <section id="submissions" className="policy-section">
                            <div className="policy-section-header">
                                <span className="policy-section-num">09</span>
                                <h2 className="policy-section-title">Submissions, Feedback, and IP Complaints</h2>
                            </div>
                            <div className="policy-clause-list">
                                <Clause num="9.1">If you submit information through the Site, you agree that: (a) you will not submit confidential information unless we have agreed in writing to receive it on a confidential basis; and (b) you are responsible for the accuracy and legality of your submissions.</Clause>
                                <Clause num="9.2">Any ideas, suggestions or feedback you provide about the Site or our services ("Feedback") may be used by us without restriction and without compensation to you. You grant us a worldwide, perpetual, irrevocable, royalty-free licence to use, reproduce, modify, distribute and otherwise exploit Feedback for any purpose.</Clause>
                                <Clause num="9.4">If you believe Content on the Site infringes your intellectual property rights, please notify us at <a href="mailto:hr@lifewood.com" style={{ color: 'var(--c-forest)', textDecoration: 'underline' }}>hr@lifewood.com</a> with sufficient detail to identify the material, evidence of your rights, and your contact details and a statement of good faith belief.</Clause>
                                <Clause num="9.5">We may remove or disable access to material we reasonably believe may infringe third-party rights.</Clause>
                            </div>
                        </section>

                        {/* 10. Third party links */}
                        <section id="third-party" className="policy-section">
                            <div className="policy-section-header">
                                <span className="policy-section-num">10</span>
                                <h2 className="policy-section-title">Third-Party Links and Resources</h2>
                            </div>
                            <div className="policy-clause-list">
                                <Clause num="10.1">The Site may include links to third-party websites or resources. These links are provided for convenience only.</Clause>
                                <Clause num="10.2">We do not control and are not responsible for the content, availability, security or practices of third-party sites. Your use of third-party sites is at your own risk and subject to their terms.</Clause>
                            </div>
                        </section>

                        {/* 11. Privacy */}
                        <section id="privacy" className="policy-section">
                            <div className="policy-section-header">
                                <span className="policy-section-num">11</span>
                                <h2 className="policy-section-title">Privacy and Cookies</h2>
                            </div>
                            <div className="policy-clause-list">
                                <Clause num="11.1">Our collection and use of personal information is described in our <Link to="/privacy-policy" style={{ color: 'var(--c-forest)', textDecoration: 'underline' }}>Privacy Policy</Link> and <Link to="/cookie-policy" style={{ color: 'var(--c-forest)', textDecoration: 'underline' }}>Cookie Policy</Link>, which form part of these Terms by reference.</Clause>
                            </div>
                        </section>

                        {/* 12. Disclaimers */}
                        <section id="disclaimers" className="policy-section">
                            <div className="policy-section-header">
                                <span className="policy-section-num">12</span>
                                <h2 className="policy-section-title">Disclaimers</h2>
                            </div>
                            <div className="policy-clause-list">
                                <Clause num="12.1">The Site and Content are provided for general information only and do not constitute professional advice (including legal, regulatory, technical, or investment advice).</Clause>
                                <Clause num="12.2">While we aim to keep the Site accurate and up to date, we make no warranties or representations that the Site or Content is accurate, complete, reliable, available, secure or error-free.</Clause>
                                <Clause num="12.3">To the fullest extent permitted by law, the Site is provided on an "as is" and "as available" basis and we disclaim all warranties and conditions, whether express, implied or statutory, including implied warranties of merchantability, fitness for a particular purpose and non-infringement.</Clause>
                            </div>
                        </section>

                        {/* 13. Liability */}
                        <section id="liability" className="policy-section">
                            <div className="policy-section-header">
                                <span className="policy-section-num">13</span>
                                <h2 className="policy-section-title">Limitation of Liability</h2>
                            </div>
                            <div className="policy-callout">
                                <span className="policy-callout-label">Note</span>
                                <p>Nothing in these Terms excludes or limits liability that cannot be excluded or limited by law (including liability for death or personal injury caused by negligence, fraud or fraudulent misrepresentation).</p>
                            </div>
                            <div className="policy-clause-list" style={{ marginTop: 'var(--s-20)' }}>
                                <Clause num="13.2">Subject to clause 13.1, to the fullest extent permitted by law, Lifewood and its affiliates will not be liable for any indirect, incidental, special, consequential or punitive damages, or for loss of profits, revenue, business, goodwill, anticipated savings, data, or business interruption, arising out of or in connection with your use of (or inability to use) the Site.</Clause>
                                <Clause num="13.3">Subject to clause 13.1, our total aggregate liability to you arising out of or in connection with these Terms or the Site will not exceed <strong>USD 1,000</strong>.</Clause>
                            </div>
                        </section>

                        {/* 14. Indemnity */}
                        <section id="indemnity" className="policy-section">
                            <div className="policy-section-header">
                                <span className="policy-section-num">14</span>
                                <h2 className="policy-section-title">Indemnity</h2>
                            </div>
                            <div className="policy-clause-list">
                                <Clause num="14.1">You agree to indemnify and hold harmless Lifewood, its affiliates, officers, directors, employees and agents from and against any claims, damages, liabilities, losses and expenses (including reasonable legal fees) arising out of or relating to: (a) your breach of these Terms; (b) your misuse of the Site; or (c) your infringement or misappropriation of any third-party rights.</Clause>
                            </div>
                        </section>

                        {/* 15. Termination */}
                        <section id="termination" className="policy-section">
                            <div className="policy-section-header">
                                <span className="policy-section-num">15</span>
                                <h2 className="policy-section-title">Suspension and Termination</h2>
                            </div>
                            <div className="policy-clause-list">
                                <Clause num="15.1">We may suspend, restrict or terminate your access to the Site at any time if we reasonably believe you have breached these Terms or your use poses a security, legal or reputational risk.</Clause>
                            </div>
                        </section>

                        {/* 16. General */}
                        <section id="general" className="policy-section">
                            <div className="policy-section-header">
                                <span className="policy-section-num">16</span>
                                <h2 className="policy-section-title">General Terms</h2>
                            </div>
                            <div className="policy-clause-list">
                                <Clause num="16.1 Assignment">We may assign or transfer our rights and obligations under these Terms. You may not assign or transfer your rights or obligations without our prior written consent.</Clause>
                                <Clause num="16.2 Severability">If any provision is found unenforceable, the remaining provisions will remain in full force and effect.</Clause>
                                <Clause num="16.3 No waiver">Our failure to enforce any provision is not a waiver of our right to do so later.</Clause>
                                <Clause num="16.4 Entire agreement">These Terms (together with the Privacy Policy and Cookie Policy) constitute the entire agreement between you and us regarding your use of the Site, and supersede any prior understandings relating to the Site.</Clause>
                            </div>
                        </section>

                        {/* 17. Governing law */}
                        <section id="governing-law" className="policy-section">
                            <div className="policy-section-header">
                                <span className="policy-section-num">17</span>
                                <h2 className="policy-section-title">Governing Law and Jurisdiction</h2>
                            </div>
                            <div className="policy-callout--saffron policy-callout">
                                <span className="policy-callout-label">Jurisdiction</span>
                                <p>These Terms and any dispute or claim arising out of or in connection with them (including non-contractual disputes or claims) are governed by the <strong>laws of Hong Kong Special Administrative Region</strong>. The courts of Hong Kong shall have exclusive jurisdiction to settle any dispute or claim arising out of or in connection with these Terms or your use of the Site.</p>
                            </div>
                        </section>

                        {/* 18. Contact */}
                        <section id="contact" className="policy-section">
                            <div className="policy-section-header">
                                <span className="policy-section-num">18</span>
                                <h2 className="policy-section-title">Contact</h2>
                            </div>
                            <p className="policy-text">If you have questions about these Terms, please contact us:</p>
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
                            <Link to="/cookie-policy" className="policy-page-nav-link policy-page-nav-link--next">
                                <div><span className="policy-page-nav-label">Also See</span>Cookie Policy</div>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M5.5 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </Link>
                        </nav>

                    </article>
                </div>
            </div>
        </div>
    );
}

