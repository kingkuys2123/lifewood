import { motion } from 'framer-motion';

const MotionListItem = motion.li;

export default function SettingsNotifications({ notifications }) {
  return (
    <section className="settings-card">
      <h2>Alerts</h2>
      <ul className="settings-alert-list">
        {notifications.map((text, idx) => (
          <MotionListItem
            key={idx}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.06 }}
          >
            {text}
          </MotionListItem>
        ))}
      </ul>
    </section>
  );
}
