import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useId, useState } from 'react';
import './AccordionGallery.css';

const DESKTOP_HOVER_QUERY = '(hover: hover) and (pointer: fine)';

function getInitialActiveIndex(items) {
  return items.length > 0 ? 0 : -1;
}

export default function AccordionGallery({ items = [], ariaLabel = 'Service gallery' }) {
  const [supportsHover, setSupportsHover] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() => getInitialActiveIndex(items));
  const baseId = useId();

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_HOVER_QUERY);
    const onChange = () => setSupportsHover(media.matches);
    onChange();
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    setActiveIndex(getInitialActiveIndex(items));
  }, [items]);

  const onCardClick = (index) => {
    if (supportsHover) {
      setActiveIndex(index);
      return;
    }

    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  const onCardKeyDown = (event, index) => {
    if (!items.length) {
      return;
    }

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index + 1) % items.length);
      return;
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index - 1 + items.length) % items.length);
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      setActiveIndex(0);
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      setActiveIndex(items.length - 1);
    }
  };

  return (
    <div className="accordion-gallery" role="list" aria-label={ariaLabel}>
      {items.map((item, index) => {
        const isActive = index === activeIndex;
        const panelId = `${baseId}-panel-${index}`;

        return (
          <motion.button
            key={item.id || item.title || index}
            type="button"
            role="listitem"
            layout
            className={`accordion-gallery__card${isActive ? ' is-active' : ''}`}
            onMouseEnter={() => supportsHover && setActiveIndex(index)}
            onClick={() => onCardClick(index)}
            onKeyDown={(event) => onCardKeyDown(event, index)}
            aria-expanded={isActive}
            aria-controls={panelId}
            aria-label={`${item.title}. ${item.description}`}
            animate={{
              flexGrow: supportsHover ? (isActive ? 3.4 : 1) : 1,
            }}
            transition={{ type: 'spring', stiffness: 180, damping: 28, mass: 0.65 }}
          >
            <img
              src={item.image}
              alt={item.title}
              className="accordion-gallery__image"
              loading="lazy"
              decoding="async"
            />

            <div className="accordion-gallery__summary">
              <span className="accordion-gallery__tag">{item.tag}</span>
              <span className="accordion-gallery__title">
                {item.icon ? <span className="accordion-gallery__icon">{item.icon}</span> : null}
                {item.title}
              </span>
            </div>

            <AnimatePresence>
              {isActive ? (
                <motion.div
                  id={panelId}
                  className="accordion-gallery__overlay"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="accordion-gallery__overlay-tag">{item.tag}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </div>
  );
}

