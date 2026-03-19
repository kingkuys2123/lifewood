export default function StatCard({ label, value, delta }) {
  return (
    <article className="dashboard-stat-card">
      <p className="dashboard-stat-label">{label}</p>
      <p className="dashboard-stat-value">{value}</p>
      <p className="dashboard-stat-delta">{delta}</p>
    </article>
  );
}

