export default function SettingsPanel({ controls }) {
  return (
    <section className="settings-card">
      <h2>Portal Settings</h2>
      <div className="settings-list">
        {controls.map((item) => (
          <label key={item.id} className="settings-item">
            <span>{item.label}</span>
            <input type="checkbox" defaultChecked={item.enabled} />
          </label>
        ))}
      </div>
    </section>
  );
}
