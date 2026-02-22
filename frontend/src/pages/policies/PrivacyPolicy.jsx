import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Policy.css';

const TOC = [
    { id: 'background',  label: 'Background' },
    { id: 'definitions', label: '1. Definitions' },
    { id: 'collection',  label: '2. Information Collection' },
    { id: 'use',         label: '3. Use of Information' },
    { id: 'sharing',     label: '4. Data Sharing' },
    { id: 'security',    label: '5. Data Security' },
    { id: 'rights',      label: '6. User Rights' },
    { id: 'retention',   label: '7. Data Retention' },
    { id: 'cookies',     label: '8. Cookies & Tracking' },
    { id: 'transfers',   label: '9. International Transfers' },
    { id: 'breach',      label: '10. Data Breach' },
    { id: 'commercial',  label: '11. Commercial Use' },
    { id: 'third-party', label: '12. Third-Party Services' },
    { id: 'children',    label: "13. Children's Privacy" },
    { id: 'updates',     label: '14. Policy Updates' },
    { id: 'compliance',  label: '15. Compliance' },
    { id: 'contact',     label: '16. Contact' },
];

const DEFINITIONS = [
    { term: 'Personal Data', desc: 'Any data, whether true or not, about an individual who can be identified from that data, or from that data and other information to which we have or are likely to have access.' },
    { term: 'Processing', desc: 'Any operation performed on personal data, whether or not by automated means, such as collection, recording, storage, use, disclosure, or destruction.' },
    { term: 'Data Subject', desc: 'An identified or identifiable natural person who is the subject of personal data, including users, customers, website visitors, and employees.' },
    { term: 'Data Controller / Processor', desc: 'Depending on the activity, Lifewood acts either as a data processor when processing data on client instructions, or as an independent controller for its own functions such as HR, recruitment, and marketing.' },
    { term: 'Consent', desc: "Any freely given, specific, informed and unambiguous indication of the data subject's wishes signifying agreement to the processing of personal data." },
    { term: 'Data Breach', desc: 'A breach of security leading to the accidental or unlawful destruction, loss, alteration, unauthorised disclosure of, or access to personal data.' },
    { term: 'Cross-Border Transfer', desc: 'The transfer of personal data from Hong Kong to a jurisdiction outside Hong Kong, whether directly or indirectly.' },
    { term: 'Data Protection Officer (DPO)', desc: 'The individual appointed by the Company to monitor compliance with data protection laws and serve as the primary contact for data protection matters.' },
];

const RETENTION_ROWS = [
    { category: 'Customer & User Account Records', period: 'Life of account + up to 24 months after closure', purpose: 'Audit, security, dispute resolution' },
    { category: 'Customer Support & Communications', period: '24–36 months after resolution', purpose: 'Service history, QA, legal' },
    { category: 'Financial & Tax Records', period: 'At least 7 years', purpose: 'Legal obligation' },
    { category: 'Security & Access Logs', period: '12–24 months', purpose: 'Security, fraud prevention' },
    { category: 'Marketing Preferences', period: 'Until opt-out or no longer needed', purpose: 'Lawful marketing' },
    { category: 'Recruitment Data', period: '12–24 months after process ends', purpose: 'HR compliance' },
    { category: 'AI-Generated / Training Data', period: 'Per controller instructions; anonymised artefacts only for extended use', purpose: 'Audit, model validation' },
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

export default function PrivacyPolicy() {
    const active = useActiveSection(TOC.map(t => t.id));

    return (
        <div className="policy-page">

            <section className="policy-hero">
                <div className="policy-hero-inner wrap">
                    <span className="policy-hero-eyebrow"><span className="policy-hero-dot" />Legal</span>
                    <h1 className="policy-hero-title">Privacy Policy</h1>
                    <div className="policy-hero-meta">
                        <span className="policy-hero-date">Effective: 3 November 2025</span>
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

                        {/* Background */}
                        <section id="background" className="policy-section">
                            <div className="policy-section-header">
                                <span className="policy-section-num">BG</span>
                                <h2 className="policy-section-title">Background</h2>
                            </div>
                            <h3 className="policy-sub-heading">A. Company Operations and Data Processing Context</h3>
                            <p className="policy-text">Lifewood Data Technology Limited operates as a dynamic technology company dedicated to delivering cutting-edge AI and data-driven solutions. Building on a decades-long legacy of innovative global data services and industrialized workflow methodologies, Lifewood specializes in collecting, processing, and securely managing diverse forms of personal data, including text, audio, pictures, videos, and AI-generated content.</p>
                            <p className="policy-text">The Company operates globally through corporate offices, franchise partners, subcontractors, and affiliated entities located in multiple jurisdictions including Hong Kong, Malaysia, China, the United States, the Philippines, Bangladesh, Indonesia, and other countries, and may also engage with participants from European Union member states for specific data collection projects.</p>
                            <p className="policy-text">Leveraging its proprietary cloud-based platform, <strong>LiFT</strong>, Lifewood seamlessly integrates multimedia data annotation, labeling, and quality assurance through this global network of partners and data centers, supporting clients across industries such as autonomous driving, digital media, and enterprise AI development.</p>
                            <h3 className="policy-sub-heading">B. Commitment to Privacy Protection</h3>
                            <p className="policy-text">The Company is committed to protecting the privacy and personal data of all individuals who interact with our services, recognizing that privacy protection is fundamental to maintaining trust and ensuring compliance with applicable data protection laws and regulations.</p>
                            <h3 className="policy-sub-heading">C. Regulatory Compliance Framework</h3>
                            <p className="policy-text">This Privacy Policy has been developed to ensure compliance with Hong Kong privacy laws and regulations, including the Personal Data (Privacy) Ordinance (Cap. 486) and any amendments thereto, as well as applicable privacy and data protection laws in all jurisdictions where the Company operates, including GDPR standards for EU member states.</p>
                            <h3 className="policy-sub-heading">D. Purpose and Scope of Policy</h3>
                            <p className="policy-text">This Privacy Policy serves to:</p>
                            <ul className="policy-list">
                                <li>Inform users about our data handling practices</li>
                                <li>Explain their rights regarding personal data</li>
                                <li>Establish transparent procedures for data collection, use, sharing, security, and retention across all our business operations and technology platforms</li>
                            </ul>
                            <h3 className="policy-sub-heading">E. Business Context and Data Usage</h3>
                            <p className="policy-text">As a technology company operating in the digital economy, Lifewood processes personal data for service delivery, customer support, product development, analytics, AI model training, marketing communications, and other commercial activities essential to its operations.</p>
                            <h3 className="policy-sub-heading">F. International Operations Consideration</h3>
                            <p className="policy-text">Given that Lifewood's business operations may involve cross-border data transfers and international service delivery — including engagement with participants from European Union member states — this Privacy Policy addresses the handling of personal data in compliance with Hong Kong law while considering international data protection standards and transfer mechanisms for global operations.</p>
                        </section>

                        {/* 1. Definitions */}
                        <section id="definitions" className="policy-section">
                            <div className="policy-section-header">
                                <span className="policy-section-num">01</span>
                                <h2 className="policy-section-title">Definitions</h2>
                            </div>
                            <p className="policy-text">The following definitions apply throughout this Privacy Policy:</p>
                            <div className="policy-def-list">
                                {DEFINITIONS.map(({ term, desc }) => (
                                    <div key={term} className="policy-def-item">
                                        <p className="policy-def-term">{term}</p>
                                        <p className="policy-def-desc">{desc}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* 2. Collection */}
                        <section id="collection" className="policy-section">
                            <div className="policy-section-header">
                                <span className="policy-section-num">02</span>
                                <h2 className="policy-section-title">Information Collection</h2>
                            </div>
                            <h3 className="policy-sub-heading">2.1 Types of Personal Data Collected</h3>
                            <ul className="policy-list">
                                <li><strong>Identity &amp; Contact:</strong> Full name, email, telephone, postal address, job title, and company affiliations</li>
                                <li><strong>Account &amp; Authentication:</strong> Usernames, passwords, security questions, and account preferences</li>
                                <li><strong>Technical &amp; Usage:</strong> IP addresses, device identifiers, browser types, and usage patterns</li>
                                <li><strong>Content Data:</strong> Text files, audio recordings, images, videos, and other materials processed through our Services</li>
                                <li><strong>AI-Generated Content:</strong> Data outputs and derivatives created through AI processing</li>
                                <li><strong>Communication Records:</strong> Correspondence, support tickets, feedback, and survey responses</li>
                                <li><strong>Financial Information:</strong> Billing addresses, payment details, and transaction records where applicable</li>
                                <li><strong>Likeness &amp; Performance Rights:</strong> Where datasets capture an individual's image, voice, or performance — the controller is responsible for all necessary consents and rights clearances</li>
                            </ul>
                            <h3 className="policy-sub-heading">2.2 Methods of Data Collection</h3>
                            <ul className="policy-list">
                                <li><strong>Direct Collection:</strong> Through registration forms, account creation, and direct communications</li>
                                <li><strong>Automated Collection:</strong> Through cookies, web beacons, server logs, and tracking technologies</li>
                                <li><strong>Third-Party Sources:</strong> From business partners and publicly available sources with appropriate legal basis</li>
                            </ul>
                            <h3 className="policy-sub-heading">2.4 Legal Basis for Collection</h3>
                            <p className="policy-text">We collect personal data based on legitimate business interests, contractual necessity, legal compliance requirements, and with explicit consent where required by applicable law.</p>
                        </section>

                        {/* 3. Use */}
                        <section id="use" className="policy-section">
                            <div className="policy-section-header">
                                <span className="policy-section-num">03</span>
                                <h2 className="policy-section-title">Use of Information</h2>
                            </div>
                            {[
                                { h: '3.1 Service Provision', t: 'We process personal data to provide, maintain, and improve our Services, including user authentication, account management, and delivery of requested technology solutions. We process data to fulfil contractual obligations, process transactions, and manage billing.' },
                                { h: '3.2 Customer Support', t: 'Personal data is processed to respond to user inquiries, provide technical support, troubleshoot issues, and maintain communication records for quality assurance purposes.' },
                                { h: '3.3 Analytics and Performance', t: 'We process personal data to analyze usage patterns, monitor system performance, and generate statistical reports to enhance our Services. Aggregated and anonymized data may be used for benchmarking and service optimization.' },
                                { h: '3.5 Marketing Communications', t: 'Subject to appropriate consent or legitimate interest, we process personal data to send marketing communications. Non-essential marketing is opt-in where required. We do not sell personal data or engage in cross-context behavioural advertising.' },
                                { h: '3.6 Security and Fraud Prevention', t: 'Personal data is processed to maintain system security, detect and prevent fraud, unauthorized access, and other security threats.' },
                                { h: '3.7 Legal Compliance', t: 'We process personal data to comply with legal obligations, respond to lawful requests from authorities, and meet regulatory requirements applicable to our business operations.' },
                            ].map(({ h, t }) => (<div key={h}><h3 className="policy-sub-heading">{h}</h3><p className="policy-text">{t}</p></div>))}
                            <h3 className="policy-sub-heading">3.4 AI Model Training and Development</h3>
                            <div className="policy-callout">
                                <span className="policy-callout-label">Important</span>
                                <p>Lifewood will <strong>not</strong> use client-provided datasets containing personal data to train, fine-tune, or evaluate models except where (i) the client has provided documented instructions and appropriate lawful basis, or (ii) the data has been irreversibly anonymised. By default, client datasets are siloed to that client's project scope.</p>
                            </div>
                        </section>

                        {/* 4. Sharing */}
                        <section id="sharing" className="policy-section">
                            <div className="policy-section-header">
                                <span className="policy-section-num">04</span>
                                <h2 className="policy-section-title">Data Sharing and Disclosure</h2>
                            </div>
                            <p className="policy-text">We may share your personal data with the following categories of third parties:</p>
                            <ul className="policy-list">
                                <li>Service providers and contractors assisting in our business operations</li>
                                <li>Professional advisors including lawyers, accountants, and auditors</li>
                                <li>Technology partners and cloud service providers</li>
                                <li>Payment processors and financial institutions</li>
                                <li>Affiliates and subsidiary companies within our corporate group</li>
                                <li>Regulatory authorities and courts when required by law</li>
                            </ul>
                            <div className="policy-callout--saffron policy-callout">
                                <span className="policy-callout-label">Our Commitment</span>
                                <p>We do not disclose client-provided personal data to business partners for their own purposes. Any partner access is as our processors/sub-processors under contract, limited to the project purpose, and prohibited from independent reuse. <strong>We do not sell personal data.</strong></p>
                            </div>
                        </section>

                        {/* 5. Security */}
                        <section id="security" className="policy-section">
                            <div className="policy-section-header">
                                <span className="policy-section-num">05</span>
                                <h2 className="policy-section-title">Data Security Measures</h2>
                            </div>
                            <p className="policy-text">The Company implements comprehensive technical and organizational security measures to protect personal data against unauthorized access, disclosure, alteration, destruction, or loss.</p>
                            <ul className="policy-list">
                                <li><strong>Encryption:</strong> SSL/TLS for data in transit; AES-256 for data at rest</li>
                                <li><strong>Access Controls:</strong> Multi-factor authentication, role-based permissions, and regular access reviews</li>
                                <li><strong>Network Security:</strong> Firewalls, intrusion detection systems, and continuous monitoring</li>
                                <li><strong>Physical Security:</strong> Restricted access, surveillance, and environmental controls</li>
                                <li><strong>Employee Training:</strong> Mandatory privacy and security training upon employment and regular updates</li>
                                <li><strong>Third-Party Requirements:</strong> All processors must implement equivalent security measures</li>
                                <li><strong>Security Audits:</strong> Regular vulnerability assessments and security reviews</li>
                            </ul>
                        </section>

                        {/* 6. Rights */}
                        <section id="rights" className="policy-section">
                            <div className="policy-section-header">
                                <span className="policy-section-num">06</span>
                                <h2 className="policy-section-title">User Rights and Controls</h2>
                            </div>
                            <p className="policy-text">All requests must be submitted in writing to the DPO using the contact details in Section 16. Requests are free of charge unless manifestly unfounded or excessive.</p>
                            <div className="policy-clause-list">
                                {[
                                    { num: '6.1', title: 'Right of Access', text: 'Request confirmation of whether we process your personal data, and obtain a copy along with processing details. Response within 30 days (up to 40 days under Hong Kong law).' },
                                    { num: '6.2', title: 'Right to Rectification', text: 'Request correction of inaccurate or completion of incomplete personal data. Corrections made within 30 days where substantiated.' },
                                    { num: '6.3', title: 'Right to Erasure', text: 'Request deletion where data is no longer necessary, consent is withdrawn, or data has been unlawfully processed. Deletion completed within 60 days where granted.' },
                                    { num: '6.4', title: 'Right to Data Portability', text: 'Receive your personal data in a structured, machine-readable format (CSV, JSON, or XML) within 30 days where processing is based on consent or contract.' },
                                    { num: '6.5', title: 'Right to Object', text: 'Object to processing based on legitimate interests, including direct marketing. Marketing objections are acted upon immediately.' },
                                    { num: '6.6', title: 'Right to Restrict Processing', text: 'Request restriction where data accuracy is contested, processing is unlawful, or an objection is pending verification.' },
                                ].map(({ num, title, text }) => (
                                    <div key={num} className="policy-clause-item">
                                        <span className="policy-clause-num">{num}</span>
                                        <div><p className="policy-def-term" style={{ marginBottom: 'var(--s-4)' }}>{title}</p><p className="policy-clause-text">{text}</p></div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* 7. Retention */}
                        <section id="retention" className="policy-section">
                            <div className="policy-section-header">
                                <span className="policy-section-num">07</span>
                                <h2 className="policy-section-title">Data Retention Periods</h2>
                            </div>
                            <p className="policy-text">The Company retains personal data only for as long as necessary to fulfil the stated purposes, comply with legal obligations, maintain security and audit trails, and establish, exercise, or defend legal claims.</p>
                            <div className="policy-table-wrap">
                                <table className="policy-table">
                                    <thead><tr><th>Category</th><th>Retention Period</th><th>Purpose</th></tr></thead>
                                    <tbody>
                                        {RETENTION_ROWS.map(({ category, period, purpose }) => (
                                            <tr key={category}><td>{category}</td><td>{period}</td><td>{purpose}</td></tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* 8. Cookies */}
                        <section id="cookies" className="policy-section">
                            <div className="policy-section-header">
                                <span className="policy-section-num">08</span>
                                <h2 className="policy-section-title">Cookies and Tracking Technologies</h2>
                            </div>
                            <p className="policy-text">We use cookies, web beacons, local storage technologies, and analytics tools. For full details, please review our <Link to="/cookie-policy" style={{ color: 'var(--c-forest)', textDecoration: 'underline', textUnderlineOffset: '3px' }}>Cookie Policy</Link>. Non-essential cookies require opt-in consent. Users can manage preferences through browser settings or our cookie consent management tool.</p>
                        </section>

                        {/* 9. Transfers */}
                        <section id="transfers" className="policy-section">
                            <div className="policy-section-header">
                                <span className="policy-section-num">09</span>
                                <h2 className="policy-section-title">International Data Transfers</h2>
                            </div>
                            <p className="policy-text">Transfers rely on recognised safeguards such as Standard Contractual Clauses, intragroup agreements, or other approved mechanisms. Where a client mandates geographic residency, Lifewood will enforce geographic access controls and contractual flow-down to all subprocessors.</p>
                            <p className="policy-text">Before transferring personal data outside Hong Kong, the Company conducts adequacy assessments. Where adequate protection is not available, additional safeguards are implemented including binding corporate rules and specific contractual obligations.</p>
                        </section>

                        {/* 10. Breach */}
                        <section id="breach" className="policy-section">
                            <div className="policy-section-header">
                                <span className="policy-section-num">10</span>
                                <h2 className="policy-section-title">Data Breach Procedures</h2>
                            </div>
                            <p className="policy-text">The Company maintains continuous monitoring to detect potential data breaches. Upon discovery, a preliminary assessment will be conducted within 24 hours.</p>
                            <ul className="policy-list">
                                <li><strong>Containment:</strong> Immediate measures to prevent further unauthorized access</li>
                                <li><strong>Regulatory Notification:</strong> Notified in accordance with applicable law in each jurisdiction</li>
                                <li><strong>Individual Notification:</strong> Affected data subjects notified without undue delay where there is high risk</li>
                                <li><strong>Documentation:</strong> All breaches documented and retained for a minimum of 7 years</li>
                                <li><strong>Post-Breach Review:</strong> Root cause analysis and improvements implemented</li>
                            </ul>
                        </section>

                        {/* 11. Commercial */}
                        <section id="commercial" className="policy-section">
                            <div className="policy-section-header">
                                <span className="policy-section-num">11</span>
                                <h2 className="policy-section-title">Commercial Use of Data</h2>
                            </div>
                            <p className="policy-text">The Company may use personal data for legitimate commercial purposes including marketing communications (with appropriate consent), product development and innovation, business analytics, and customer relationship management. All commercial use is subject to data minimization principles.</p>
                            <div className="policy-callout--saffron policy-callout">
                                <span className="policy-callout-label">Opt-Out</span>
                                <p>Data subjects may opt out of marketing communications at any time through unsubscribe links, account settings, or by contacting <a href="mailto:hr@lifewood.com" style={{ color: 'inherit', textDecoration: 'underline' }}>hr@lifewood.com</a>.</p>
                            </div>
                        </section>

                        {/* 12. Third Party */}
                        <section id="third-party" className="policy-section">
                            <div className="policy-section-header">
                                <span className="policy-section-num">12</span>
                                <h2 className="policy-section-title">Third-Party Services and Links</h2>
                            </div>
                            <p className="policy-text">Our Services may contain links to third-party websites or services not owned or controlled by the Company. This Privacy Policy does not apply to such third-party services, and we are not responsible for their privacy practices or content.</p>
                            <p className="policy-text">Third-party service providers who assist in delivering our Services are bound by contractual obligations to protect personal data and are subject to equivalent data protection requirements. We strongly encourage users to read the privacy policies of any third-party websites before providing personal data.</p>
                        </section>

                        {/* 13. Children */}
                        <section id="children" className="policy-section">
                            <div className="policy-section-header">
                                <span className="policy-section-num">13</span>
                                <h2 className="policy-section-title">Children's Privacy</h2>
                            </div>
                            <div className="policy-callout">
                                <span className="policy-callout-label">Age Restriction</span>
                                <p>Our Services are not intended for use by individuals under the age of 18 years. We do not knowingly collect personal data from children under 18 without appropriate parental or guardian consent.</p>
                            </div>
                            <p className="policy-text">If we discover that we have collected personal data from a child under 18 without appropriate consent, we will delete such information within 30 days. Parents or guardians may request access, modification, or deletion of their child's personal data at any time using the contact information in Section 16.</p>
                        </section>

                        {/* 14. Updates */}
                        <section id="updates" className="policy-section">
                            <div className="policy-section-header">
                                <span className="policy-section-num">14</span>
                                <h2 className="policy-section-title">Policy Updates and Notifications</h2>
                            </div>
                            <p className="policy-text">The Company reserves the right to modify this Privacy Policy at any time to reflect changes in business practices, legal requirements, or regulatory developments.</p>
                            <ul className="policy-list">
                                <li><strong>Material Changes:</strong> 30 days advance notice via website and email to registered users</li>
                                <li><strong>Non-Material Changes:</strong> Effective immediately upon publication</li>
                                <li><strong>Continued Use:</strong> Continued use after the effective date constitutes acceptance of updated terms</li>
                                <li><strong>Archive:</strong> Previous versions available upon request for 3 years from replacement date</li>
                            </ul>
                        </section>

                        {/* 15. Compliance */}
                        <section id="compliance" className="policy-section">
                            <div className="policy-section-header">
                                <span className="policy-section-num">15</span>
                                <h2 className="policy-section-title">Compliance and Regulatory Framework</h2>
                            </div>
                            <p className="policy-text">This Privacy Policy is governed primarily by the <strong>Personal Data (Privacy) Ordinance (Cap. 486)</strong> of Hong Kong. The Company additionally complies with applicable laws in all jurisdictions where it operates, including:</p>
                            <ul className="policy-list">
                                <li>Malaysia's Personal Data Protection Act</li>
                                <li>Relevant Chinese data protection regulations</li>
                                <li>United States federal and state privacy laws</li>
                                <li>Philippine Data Privacy Act</li>
                                <li>Indonesian data protection regulations</li>
                                <li>EU General Data Protection Regulation (GDPR) for engagement with EU data subjects</li>
                            </ul>
                        </section>

                        {/* 16. Contact */}
                        <section id="contact" className="policy-section">
                            <div className="policy-section-header">
                                <span className="policy-section-num">16</span>
                                <h2 className="policy-section-title">Contact Information and Complaints</h2>
                            </div>
                            <p className="policy-text">All privacy-related inquiries should be directed to our designated privacy contact. We acknowledge receipt within 3 business days and respond substantively within 30 days.</p>
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
                            <h3 className="policy-sub-heading">16.5 Regulatory Authority</h3>
                            <div className="policy-contact-card" style={{ background: 'var(--c-ice)', marginTop: 'var(--s-16)' }}>
                                <p className="policy-contact-heading" style={{ color: 'var(--c-charcoal)' }}>Privacy Commissioner for Personal Data, Hong Kong</p>
                                <div className="policy-contact-row" style={{ color: 'var(--c-steel)' }}>
                                    <svg className="policy-contact-icon" style={{ color: 'var(--c-forest)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                                    <span>12/F, Sunlight Tower, 248 Queen's Road East, Wan Chai, Hong Kong</span>
                                </div>
                                <div className="policy-contact-row" style={{ color: 'var(--c-steel)' }}>
                                    <svg className="policy-contact-icon" style={{ color: 'var(--c-forest)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11.5a19.79 19.79 0 01-3.07-8.63A2 2 0 012 .82h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg>
                                    <span>+852 2827 2827 &nbsp;·&nbsp; <a href="mailto:communications@pcpd.org.hk" style={{ color: 'var(--c-forest)', textDecoration: 'underline' }}>communications@pcpd.org.hk</a></span>
                                </div>
                            </div>
                        </section>

                        <nav className="policy-page-nav" aria-label="Policy navigation">
                            <Link to="/cookie-policy" className="policy-page-nav-link">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10.5 3L5.5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                <div><span className="policy-page-nav-label">Previous</span>Cookie Policy</div>
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

