export default function ReportsPanel({ reports, settings }) {
  return (
    <section className="dashboard-panel">
      <header>
        <h3>Reports</h3>
      </header>
      <div className="dashboard-list">
        {reports.map((report) => (
          <article key={report.id} className="dashboard-inline-card">
            <p>{report.name}</p>
            <span className="dashboard-badge">{report.status}</span>
          </article>
        ))}
      </div>

      <header className="dashboard-secondary-header">
        <h3>Settings</h3>
      </header>
      <div className="dashboard-list">
        {settings.map((setting) => (
          <article key={setting.id} className="dashboard-inline-card">
            <p>{setting.name}</p>
            <span>{setting.value}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
