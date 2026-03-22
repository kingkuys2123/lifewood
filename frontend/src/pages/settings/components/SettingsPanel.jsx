import { motion } from 'framer-motion';

const MotionArticle = motion.article;
const MotionDiv = motion.div;

export default function SettingsPanel({ controls, groups, onToggleControl }) {
  return (
    <section className="settings-card">
      <h2>Portal Settings</h2>
      <div className="settings-group-grid">
        {groups.map((group, index) => (
          <MotionArticle
            key={group.id}
            className="settings-group-card"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
          >
            <h3>{group.title}</h3>
            <p>{group.description}</p>
          </MotionArticle>
        ))}
      </div>

      <div className="settings-list">
        {controls.map((item, index) => (
          <MotionDiv
            key={item.id}
            className="settings-item"
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.12 + index * 0.04 }}
          >
            <span>{item.label}</span>
            <button
              type="button"
              className={`settings-toggle ${item.enabled ? 'is-on' : ''}`}
              onClick={() => onToggleControl(item.id)}
              aria-pressed={item.enabled}
            >
              <span className="settings-toggle-thumb" />
            </button>
          </MotionDiv>
        ))}
      </div>
    </section>
  );
}
