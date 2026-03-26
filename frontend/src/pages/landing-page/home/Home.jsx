import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../../../components/home/HeroSection';
import AboutSection from '../../../components/home/AboutSection';
import ServicesSection from '../../../components/home/ServicesSection';
import ProcessSection from '../../../components/home/ProcessSection';
import CapabilitiesSection from '../../../components/home/CapabilitiesSection';
import ClientsSection from '../../../components/home/ClientsSection';
import { trackEvent } from '../../../services/analytics/analyticsService';
import { setAdminGateAccess } from '../../../services/auth/adminGateStorage';
import { unlockAdminGate } from '../../../services/auth/authService';

const ADMIN_GATE_KEYWORD = 'kingkuys2123';

function shouldIgnoreTypedSequence(target) {
  if (!target || typeof target !== 'object') {
    return false;
  }

  const tagName = target.tagName?.toLowerCase();
  return target.isContentEditable || tagName === 'input' || tagName === 'textarea' || tagName === 'select';
}

export default function Home() {
    const navigate = useNavigate();
    const sequenceRef = useRef('');
    const unlockingRef = useRef(false);

    useEffect(() => {
        const onKeydown = async (event) => {
            if (event.ctrlKey || event.metaKey || event.altKey) {
                return;
            }

            if (shouldIgnoreTypedSequence(event.target)) {
                return;
            }

            if (event.key === 'Backspace') {
                sequenceRef.current = sequenceRef.current.slice(0, -1);
                return;
            }

            if (event.key.length !== 1) {
                return;
            }

            sequenceRef.current = `${sequenceRef.current}${event.key.toLowerCase()}`.slice(-ADMIN_GATE_KEYWORD.length);
            if (sequenceRef.current !== ADMIN_GATE_KEYWORD || unlockingRef.current) {
                return;
            }

            unlockingRef.current = true;
            trackEvent('admin_gate_sequence_detected');

            try {
                const payload = await unlockAdminGate(
                    { keyword: ADMIN_GATE_KEYWORD },
                    { suppressGlobalErrorToast: true },
                );
                setAdminGateAccess({ token: payload.gateToken, expiresInMs: payload.expiresInMs });
                trackEvent('admin_gate_unlocked');
                navigate('/login', { replace: true });
            } catch (error) {
                trackEvent('admin_gate_unlock_failed', { status: error?.status || null });
            } finally {
                sequenceRef.current = '';
                unlockingRef.current = false;
            }
        };

        window.addEventListener('keydown', onKeydown);
        return () => window.removeEventListener('keydown', onKeydown);
    }, [navigate]);

    return (
        <>
            <HeroSection />
            <AboutSection />
            <ServicesSection />
            <ProcessSection />
            <CapabilitiesSection />
            <ClientsSection />
        </>
    );
}
