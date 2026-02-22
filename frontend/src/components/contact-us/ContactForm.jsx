import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './ContactForm.css';

const MAX_MESSAGE = 1200;

const INITIAL = { name: '', email: '', subject: '', message: '' };

function validate(fields) {
    const errors = {};
    if (!fields.name.trim())                         errors.name    = 'Name is required';
    if (!fields.email.trim())                        errors.email   = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))
                                                     errors.email   = 'Enter a valid email address';
    if (!fields.subject.trim())                      errors.subject = 'Subject is required';
    if (!fields.message.trim())                      errors.message = 'Message cannot be empty';
    else if (fields.message.length > MAX_MESSAGE)    errors.message = `Maximum ${MAX_MESSAGE} characters`;
    return errors;
}

/* ── Reusable field component ──────────────────────────── */
function Field({ id, label, required, error, touched, children }) {
    return (
        <div className="contact-form__group">
            <label htmlFor={id} className="contact-form__label">
                {label}
                {required && <span className="contact-form__required" aria-hidden="true">*</span>}
            </label>
            {children}
            {touched && error && (
                <span className="contact-form__error-msg" role="alert">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M8 5v4M8 11v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    {error}
                </span>
            )}
        </div>
    );
}

/* ── Info sidebar ──────────────────────────────────────── */
function ContactInfoPanel() {
    return (
        <aside className="contact-info" aria-label="Contact information">

            <div className="contact-info__card">
                <p className="contact-info__card-title">Reach Us Directly</p>

                <div className="contact-info__row">
                    <div className="contact-info__icon-wrap" style={{ marginRight: '12px' }}>
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                            <polyline points="22,6 12,13 2,6"/>
                        </svg>
                    </div>
                    <div className="contact-info__text">
                        <span className="contact-info__label">Email</span>
                        <span className="contact-info__value">
                            <a href="mailto:hr@lifewood.com">hr@lifewood.com</a>
                        </span>
                    </div>
                </div>
            </div>

            <div className="contact-info__badge-card">
                <span className="contact-info__badge-eyebrow">Response Time</span>
                <p className="contact-info__badge-title">
                    We reply within 1–2 business days
                </p>
                <p className="contact-info__badge-body">
                    Our team reviews every message carefully.
                    For urgent matters, email us directly.
                </p>
            </div>

        </aside>
    );
}

/* ── Main form ─────────────────────────────────────────── */
export default function ContactForm() {
    const [fields, setFields]   = useState(INITIAL);
    const [touched, setTouched] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const errors = validate(fields);
    const isValid = Object.keys(errors).length === 0;

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFields(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleBlur = useCallback((e) => {
        setTouched(prev => ({ ...prev, [e.target.name]: true }));
    }, []);

    const handleSubmit = useCallback((e) => {
        // Mark all fields as touched to show any remaining errors
        setTouched({ name: true, email: true, subject: true, message: true });
        if (!isValid) {
            e.preventDefault();
            return;
        }
        // mailto: will open the native email client
        // Let the default href action proceed (form uses method="get" mailto)
        setSubmitted(true);
    }, [isValid]);

    const handleReset = useCallback(() => {
        setFields(INITIAL);
        setTouched({});
        setSubmitted(false);
    }, []);

    /* ── Input class helper ── */
    const cls = (name, base) => {
        const hasErr  = touched[name] && errors[name];
        const isGood  = touched[name] && !errors[name] && fields[name].trim();
        return `${base}${hasErr ? ` ${base}--error` : ''}${isGood ? ` ${base}--valid` : ''}`;
    };

    /* Build mailto href */
    const mailtoHref = `mailto:lifewoodph@gmail.com?subject=${encodeURIComponent(fields.subject)}&body=${encodeURIComponent(`Name: ${fields.name}\nEmail: ${fields.email}\n\n${fields.message}`)}`;

    return (
        <section className="contact-form-section">
            <div className="contact-form-layout wrap">

                {/* ── Form card ── */}
                <div className="contact-form-card">
                    {submitted ? (
                        /* Success state */
                        <div className="contact-form__success">
                            <div className="contact-form__success-icon" aria-hidden="true">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"/>
                                </svg>
                            </div>
                            <h2 className="contact-form__success-title">Message Sent!</h2>
                            <p className="contact-form__success-body">
                                Your email client should have opened. We'll get back to you within
                                1–2 business days.
                            </p>
                            <button className="contact-form__reset" onClick={handleReset}>
                                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"
                                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                                    <path d="M2 8a6 6 0 1 0 1.06-3.36"/>
                                    <path d="M2 2v4h4"/>
                                </svg>
                                Send another message
                            </button>
                        </div>
                    ) : (
                        <>
                            <h2 className="contact-form-card__heading">Send Us a Message</h2>
                            <p className="contact-form-card__sub">
                                All fields marked with <span style={{ color: 'var(--c-saffron)' }}>*</span> are required.
                            </p>

                            <form
                                className="contact-form"
                                onSubmit={handleSubmit}
                                noValidate
                                aria-label="Contact form"
                            >
                                {/* Name + Email row */}
                                <div className="contact-form__row">
                                    <Field id="name" label="Full Name" required
                                        error={errors.name} touched={touched.name}>
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            autoComplete="name"
                                            placeholder="Jane Smith"
                                            value={fields.name}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className={cls('name', 'contact-form__input')}
                                            aria-required="true"
                                            aria-describedby={touched.name && errors.name ? 'name-error' : undefined}
                                        />
                                    </Field>

                                    <Field id="email" label="Email Address" required
                                        error={errors.email} touched={touched.email}>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            placeholder="jane@example.com"
                                            value={fields.email}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className={cls('email', 'contact-form__input')}
                                            aria-required="true"
                                        />
                                    </Field>
                                </div>

                                {/* Subject */}
                                <Field id="subject" label="Subject" required
                                    error={errors.subject} touched={touched.subject}>
                                    <input
                                        id="subject"
                                        name="subject"
                                        type="text"
                                        placeholder="How can we help you?"
                                        value={fields.subject}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={cls('subject', 'contact-form__input')}
                                        aria-required="true"
                                    />
                                </Field>

                                {/* Message */}
                                <Field id="message" label="Message" required
                                    error={errors.message} touched={touched.message}>
                                    <textarea
                                        id="message"
                                        name="message"
                                        placeholder="Tell us about your project, question, or inquiry…"
                                        value={fields.message}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={cls('message', 'contact-form__textarea')}
                                        aria-required="true"
                                        maxLength={MAX_MESSAGE}
                                    />
                                    <span className={`contact-form__char-count${fields.message.length > MAX_MESSAGE * 0.9 ? ' contact-form__char-count--warn' : ''}`}>
                                        {fields.message.length} / {MAX_MESSAGE}
                                    </span>
                                </Field>

                                {/* Submit — uses mailto href on valid, prevents default on invalid */}
                                <a
                                    href={isValid ? mailtoHref : undefined}
                                    onClick={handleSubmit}
                                    className="contact-form__submit"
                                    role="button"
                                    aria-disabled={!isValid}
                                    style={{ textDecoration: 'none' }}
                                >
                                    Send Message
                                    <svg className="contact-form__submit-icon" width="17" height="17"
                                        viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                        aria-hidden="true">
                                        <line x1="22" y1="2" x2="11" y2="13"/>
                                        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                                    </svg>
                                </a>

                                <p className="contact-form__privacy">
                                    Your information is handled in accordance with our{' '}
                                    <Link to="/privacy-policy">Privacy Policy</Link>.
                                </p>
                            </form>
                        </>
                    )}
                </div>

                {/* ── Sidebar info ── */}
                <ContactInfoPanel />

            </div>
        </section>
    );
}

