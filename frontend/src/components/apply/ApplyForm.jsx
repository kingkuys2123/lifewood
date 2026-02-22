import { useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import './ApplyForm.css';

/* ─────────────────────────────────────────────────────────
   Constants
───────────────────────────────────────────────────────── */
const PROJECTS = [
    'Select a project…',
    'AI Data Annotation',
    'LLM Training Datasets',
    'Computer Vision',
    'Natural Language Processing',
    'Autonomous Driving Data',
    'Voice & Audio AI',
    'Enterprise AI Development',
    'Other / General Internship',
];

const ACCEPT = '.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document';

const INITIAL = {
    firstName: '', lastName: '', age: '',
    email: '', degree: '', project: '',
    experience: '', resume: null,
};

/* ─────────────────────────────────────────────────────────
   Validation
───────────────────────────────────────────────────────── */
function validate(f) {
    const e = {};
    if (!f.firstName.trim())              e.firstName = 'First name is required';
    if (!f.lastName.trim())               e.lastName  = 'Last name is required';
    if (f.age && (isNaN(f.age) || +f.age < 16 || +f.age > 60))
                                           e.age       = 'Enter a valid age (16–60)';
    if (!f.email.trim())                  e.email     = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email))
                                           e.email     = 'Enter a valid email address';
    if (!f.project || f.project === PROJECTS[0])
                                           e.project   = 'Please select a project';
    return e;
}

/* ─────────────────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────────────────── */
function ErrorIcon() {
    return (
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 5v4M8 11v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

function Field({ id, label, required, error, touched, children }) {
    return (
        <div className="apply-form__group">
            <label htmlFor={id} className="apply-form__label">
                {label}
                {required && <span className="apply-form__required" aria-hidden="true">*</span>}
            </label>
            {children}
            {touched && error && (
                <span className="apply-form__error" role="alert">
                    <ErrorIcon /> {error}
                </span>
            )}
        </div>
    );
}

/* ─────────────────────────────────────────────────────────
   Main component
───────────────────────────────────────────────────────── */
export default function ApplyForm() {
    const [fields, setFields]     = useState(INITIAL);
    const [touched, setTouched]   = useState({});
    const [submitted, setSubmitted] = useState(false);
    const fileRef = useRef(null);

    const errors  = validate(fields);
    const isValid = Object.keys(errors).length === 0;

    /* Helpers */
    const inputCls = useCallback((name, base) => {
        const err  = touched[name] && errors[name];
        const good = touched[name] && !errors[name] && fields[name]?.toString().trim();
        return `${base}${err ? ` ${base}--error` : ''}${good ? ` ${base}--valid` : ''}`;
    }, [touched, errors, fields]);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFields(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleBlur = useCallback((e) => {
        setTouched(prev => ({ ...prev, [e.target.name]: true }));
    }, []);

    const handleFile = useCallback((e) => {
        const file = e.target.files?.[0] ?? null;
        setFields(prev => ({ ...prev, resume: file }));
    }, []);

    const clearFile = useCallback(() => {
        setFields(prev => ({ ...prev, resume: null }));
        if (fileRef.current) fileRef.current.value = '';
    }, []);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        setTouched({ firstName: true, lastName: true, age: true, email: true, project: true, degree: true, experience: true });
        if (!isValid) return;

        /* Build mailto link */
        const subject = encodeURIComponent(`Internship Application – ${fields.firstName} ${fields.lastName}`);
        const body = encodeURIComponent(
            `First Name: ${fields.firstName}\n` +
            `Last Name: ${fields.lastName}\n` +
            `Age: ${fields.age || 'Not provided'}\n` +
            `Email: ${fields.email}\n` +
            `Degree / Field of Study: ${fields.degree || 'Not provided'}\n` +
            `Project Applied For: ${fields.project}\n\n` +
            `Relevant Experience:\n${fields.experience || 'Not provided'}\n\n` +
            `Resume: ${fields.resume ? fields.resume.name : 'Not attached — please attach manually'}`
        );
        window.location.href = `mailto:lifewoodph@gmail.com?subject=${subject}&body=${body}`;
        setSubmitted(true);
    }, [isValid, fields]);

    const handleReset = useCallback(() => {
        setFields(INITIAL);
        setTouched({});
        setSubmitted(false);
        if (fileRef.current) fileRef.current.value = '';
    }, []);

    /* ── Success screen ── */
    if (submitted) {
        return (
            <section className="apply-form-section">
                <div className="apply-form-wrap">
                    <div className="apply-form-card">
                        <div className="apply-form__success">
                            <div className="apply-form__success-icon" aria-hidden="true">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </div>
                            <h2 className="apply-form__success-title">Application Submitted!</h2>
                            <p className="apply-form__success-body">
                                Your email client should have opened with your application pre-filled.
                                We review all applications carefully and will be in touch within 5–7 business days.
                            </p>
                            <button className="apply-form__reset-btn" onClick={handleReset}>
                                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"
                                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                                    <path d="M2 8a6 6 0 1 0 1.06-3.36" />
                                    <path d="M2 2v4h4" />
                                </svg>
                                Submit another application
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    /* ── Form screen ── */
    return (
        <section className="apply-form-section">
            <div className="apply-form-wrap">
                <div className="apply-form-card">

                    {/* Header */}
                    <div className="apply-form-card__header">
                        <div className="apply-form-card__eyebrow">
                            Application Form
                        </div>
                        <p className="apply-form-card__sub">
                            Fields marked <span>*</span> are required. We'll get back to you within 5–7 business days.
                        </p>
                    </div>

                    {/* Form */}
                    <form className="apply-form" onSubmit={handleSubmit} noValidate aria-label="Internship application form">

                        {/* Row 1 — First / Last name */}
                        <div className="apply-form__row">
                            <Field id="firstName" label="First Name" required error={errors.firstName} touched={touched.firstName}>
                                <input
                                    id="firstName" name="firstName" type="text"
                                    autoComplete="given-name" placeholder="Jane"
                                    value={fields.firstName}
                                    onChange={handleChange} onBlur={handleBlur}
                                    className={inputCls('firstName', 'apply-form__input')}
                                    aria-required="true"
                                />
                            </Field>

                            <Field id="lastName" label="Last Name" required error={errors.lastName} touched={touched.lastName}>
                                <input
                                    id="lastName" name="lastName" type="text"
                                    autoComplete="family-name" placeholder="Smith"
                                    value={fields.lastName}
                                    onChange={handleChange} onBlur={handleBlur}
                                    className={inputCls('lastName', 'apply-form__input')}
                                    aria-required="true"
                                />
                            </Field>
                        </div>

                        {/* Row 2 — Age / Email */}
                        <div className="apply-form__row">
                            <Field id="age" label="Age" error={errors.age} touched={touched.age}>
                                <input
                                    id="age" name="age" type="number"
                                    min="16" max="60" placeholder="22"
                                    value={fields.age}
                                    onChange={handleChange} onBlur={handleBlur}
                                    className={inputCls('age', 'apply-form__input')}
                                />
                            </Field>

                            <Field id="email" label="Email Address" required error={errors.email} touched={touched.email}>
                                <input
                                    id="email" name="email" type="email"
                                    autoComplete="email" placeholder="jane@example.com"
                                    value={fields.email}
                                    onChange={handleChange} onBlur={handleBlur}
                                    className={inputCls('email', 'apply-form__input')}
                                    aria-required="true"
                                />
                            </Field>
                        </div>

                        {/* Degree */}
                        <Field id="degree" label="Degree / Field of Study">
                            <input
                                id="degree" name="degree" type="text"
                                placeholder="e.g. BSc Computer Science, Data Engineering…"
                                value={fields.degree}
                                onChange={handleChange} onBlur={handleBlur}
                                className="apply-form__input"
                            />
                        </Field>

                        {/* Project dropdown */}
                        <Field id="project" label="Project Applied For" required error={errors.project} touched={touched.project}>
                            <div className="apply-form__select-wrap">
                                <select
                                    id="project" name="project"
                                    value={fields.project}
                                    onChange={handleChange} onBlur={handleBlur}
                                    className={inputCls('project', 'apply-form__select')}
                                    aria-required="true"
                                >
                                    {PROJECTS.map((p) => (
                                        <option key={p} value={p} disabled={p === PROJECTS[0]}>
                                            {p}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </Field>

                        {/* Experience textarea */}
                        <Field id="experience" label="Relevant Experience">
                            <textarea
                                id="experience" name="experience"
                                placeholder="Describe any relevant skills, projects, coursework, or work experience…"
                                value={fields.experience}
                                onChange={handleChange} onBlur={handleBlur}
                                className="apply-form__textarea"
                            />
                        </Field>

                        {/* Resume upload */}
                        <div className="apply-form__group">
                            <span className="apply-form__label">
                                Resume / CV
                                <span style={{ marginLeft: 4, fontSize: 'var(--t-11)', fontWeight: 'var(--fw-medium)', textTransform: 'none', letterSpacing: 0, color: 'var(--c-steel)', opacity: 0.7 }}>
                                    (PDF, DOC, DOCX)
                                </span>
                            </span>

                            <label
                                htmlFor="resume"
                                className={`apply-form__file-label${fields.resume ? ' apply-form__file-label--active' : ''}`}
                            >
                                {/* Hidden real input */}
                                <input
                                    ref={fileRef}
                                    id="resume" name="resume" type="file"
                                    accept={ACCEPT}
                                    onChange={handleFile}
                                    className="apply-form__file-input"
                                    aria-label="Upload resume"
                                />

                                {/* Icon */}
                                <span className="apply-form__file-icon" aria-hidden="true">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                        <polyline points="14 2 14 8 20 8" />
                                        <line x1="12" y1="18" x2="12" y2="12" />
                                        <line x1="9" y1="15" x2="15" y2="15" />
                                    </svg>
                                </span>

                                {/* Text */}
                                <span className="apply-form__file-text">
                                    <span className="apply-form__file-main">
                                        {fields.resume ? fields.resume.name : 'Click to upload your resume'}
                                    </span>
                                    <span className="apply-form__file-hint">
                                        {fields.resume
                                            ? `${(fields.resume.size / 1024).toFixed(0)} KB`
                                            : 'PDF, DOC or DOCX — max 5 MB'}
                                    </span>
                                </span>

                                {/* Clear button */}
                                {fields.resume && (
                                    <button
                                        type="button"
                                        className="apply-form__file-clear"
                                        onClick={(e) => { e.preventDefault(); clearFile(); }}
                                        aria-label="Remove file"
                                    >
                                        ×
                                    </button>
                                )}
                            </label>
                        </div>

                        {/* Divider */}
                        <div className="apply-form__divider" role="separator" />

                        {/* Submit */}
                        <button
                            type="submit"
                            className="apply-form__submit"
                            disabled={Object.keys(touched).length > 0 && !isValid && Object.keys(errors).length > 0}
                        >
                            Submit Application
                            <svg className="apply-form__submit-icon" width="18" height="18"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <line x1="22" y1="2" x2="11" y2="13" />
                                <polygon points="22 2 15 22 11 13 2 9 22 2" />
                            </svg>
                        </button>

                        <p className="apply-form__privacy">
                            Your information is handled in accordance with our{' '}
                            <Link to="/privacy-policy">Privacy Policy</Link>.
                        </p>

                    </form>
                </div>
            </div>
        </section>
    );
}

