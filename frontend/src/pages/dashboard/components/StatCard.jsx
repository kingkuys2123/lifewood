import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

const MotionArticle = motion.article;

function getNumericValue(rawValue) {
  const match = String(rawValue).replace(/,/g, '').match(/\d+(\.\d+)?/);
  return match ? Number(match[0]) : null;
}

export default function StatCard({ label, value, delta }) {
  const [displayNumber, setDisplayNumber] = useState(0);
  const numericValue = useMemo(() => getNumericValue(value), [value]);

  useEffect(() => {
    if (numericValue == null) {
      return;
    }

    const duration = 520;
    const startAt = performance.now();

    let frameId = 0;

    const tick = (now) => {
      const progress = Math.min((now - startAt) / duration, 1);
      const next = numericValue * progress;
      setDisplayNumber(next);
      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [numericValue, value]);

  const displayValue = useMemo(() => {
    if (numericValue == null) {
      return value;
    }

    const hasComma = String(value).includes(',');
    const suffix = String(value).replace(/[\d,.\s]/g, '');
    const formatted = hasComma
      ? Math.round(displayNumber).toLocaleString('en-US')
      : (numericValue % 1 ? displayNumber.toFixed(1) : Math.round(displayNumber));
    return `${formatted}${suffix ? ` ${suffix}` : ''}`.trim();
  }, [displayNumber, numericValue, value]);

  return (
    <MotionArticle
      className="dashboard-stat-card"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <p className="dashboard-stat-label">{label}</p>
      <p className="dashboard-stat-value">{displayValue}</p>
      <p className="dashboard-stat-delta">{delta}</p>
    </MotionArticle>
  );
}

