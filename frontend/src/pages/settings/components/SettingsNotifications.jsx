export default function SettingsNotifications({ notifications }) {
  return (
    <section className="settings-card">
      <h2>Alerts</h2>
      <ul className="settings-alert-list">
        {notifications.map((text, idx) => (
          <li key={idx}>{text}</li>
        ))}
      </ul>
    </section>
  );
}
