export default function NotificationsPanel({ notifications }) {
  return (
    <section className="dashboard-panel">
      <header>
        <h3>Notifications</h3>
      </header>
      <div className="dashboard-list">
        {notifications.map((item) => (
          <article key={item.id} className="dashboard-alert">
            <p className="dashboard-alert-type">{item.type}</p>
            <p>{item.message}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
