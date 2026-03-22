import { motion } from 'framer-motion';

const MotionArticle = motion.article;

export default function NotificationsPanel({ notifications }) {
  return (
    <section className="dashboard-panel">
      <header>
        <h3>Notifications</h3>
      </header>
      <div className="dashboard-list">
        {notifications.map((item, index) => (
          <MotionArticle
            key={item.id}
            className="dashboard-alert"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.2 }}
          >
            <p className="dashboard-alert-type">{item.type}</p>
            <p>{item.message}</p>
          </MotionArticle>
        ))}
      </div>
    </section>
  );
}
