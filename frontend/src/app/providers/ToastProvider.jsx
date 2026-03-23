import { useCallback, useEffect, useMemo, useState } from 'react';
import { ToastContext } from './useToast';
import { setGlobalApiErrorListener } from '../../services/api/apiEvents';
import './ToastProvider.css';

const DEFAULT_TTL = 4200;

let seed = 0;

function nextId() {
  seed += 1;
  return `toast-${seed}`;
}

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const showToast = useCallback((payload) => {
    const tone = payload?.tone || 'info';
    const message = payload?.message || 'Something went wrong. Please try again.';
    const id = nextId();
    const ttl = Number(payload?.ttl ?? DEFAULT_TTL);

    setToasts((prev) => [...prev, { id, tone, message }]);
    window.setTimeout(() => dismissToast(id), ttl);
    return id;
  }, [dismissToast]);

  const value = useMemo(() => ({
    showToast,
    success: (message, options = {}) => showToast({ ...options, message, tone: 'success' }),
    error: (message, options = {}) => showToast({ ...options, message, tone: 'error' }),
    info: (message, options = {}) => showToast({ ...options, message, tone: 'info' }),
  }), [showToast]);

  useEffect(() => {
    setGlobalApiErrorListener((error) => {
      if (!error?.message) {
        return;
      }
      showToast({ message: error.message, tone: 'error' });
    });
    return () => setGlobalApiErrorListener(null);
  }, [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-stack" aria-live="polite" aria-atomic="true">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast--${toast.tone}`} role="status">
            <span>{toast.message}</span>
            <button type="button" onClick={() => dismissToast(toast.id)} aria-label="Dismiss notification">
              x
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

