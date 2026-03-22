import { AnimatePresence, motion } from 'framer-motion';
import './ActionModal.css';

const MotionDiv = motion.div;

export default function ActionModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'default',
  onConfirm,
  onClose,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <MotionDiv
          className="action-modal-backdrop"
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <MotionDiv
            className="action-modal"
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, y: 10, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.985 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <h3>{title}</h3>
            {message ? <p>{message}</p> : null}
            <div className="action-modal-actions">
              <button type="button" className="btn btn-ghost" onClick={onClose}>
                {cancelLabel}
              </button>
              <button
                type="button"
                className={`btn ${tone === 'danger' ? 'btn-danger' : 'btn-forest'}`}
                onClick={onConfirm}
              >
                {confirmLabel}
              </button>
            </div>
          </MotionDiv>
        </MotionDiv>
      )}
    </AnimatePresence>
  );
}

