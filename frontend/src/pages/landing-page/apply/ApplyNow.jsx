import ApplyHero from '../../../components/apply/ApplyHero';
import ApplyForm from '../../../components/apply/ApplyForm';

export default function ApplyNow() {
    return (
        <div style={{ background: 'var(--c-white)', minHeight: '100vh' }}>
            <ApplyHero />
            <ApplyForm />
        </div>
    );
}

