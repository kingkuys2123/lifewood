import ContactHero from '../../../components/contact-us/ContactHero';
import ContactForm from '../../../components/contact-us/ContactForm';

export default function ContactUs() {
    return (
        <div style={{ background: 'var(--c-white)', minHeight: '100vh' }}>
            <ContactHero />
            <ContactForm />
        </div>
    );
}

