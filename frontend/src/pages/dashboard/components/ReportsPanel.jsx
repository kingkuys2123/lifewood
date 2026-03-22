import { motion } from 'framer-motion';

const MotionArticle = motion.article;

export default function ReportsPanel({ reports, settings }) {
  return (
    <section className="dashboard-panel">
      <header>
        <h3>Reports</h3>
      </header>
      <div className="dashboard-list">
        {reports.map((report, index) => (
          <MotionArticle
            key={report.id}
            className="dashboard-inline-card"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.2 }}
          >
            <p>{report.name}</p>
            <span className="dashboard-badge">{report.status}</span>
          </MotionArticle>
        ))}
      </div>

      <header className="dashboard-secondary-header">
        <h3>Settings</h3>
      </header>
      <div className="dashboard-list">
        {settings.map((setting, index) => (
          <MotionArticle
            key={setting.id}
            className="dashboard-inline-card"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 + index * 0.05, duration: 0.2 }}
          >
            <p>{setting.name}</p>
            <span>{setting.value}</span>
          </MotionArticle>
        ))}
      </div>
    </section>
  );
}
