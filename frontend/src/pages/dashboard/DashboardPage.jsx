import ApplicantTrendsChart from './components/ApplicantTrendsChart';
import ProfileQuickCard from './components/ProfileQuickCard';
import StatCard from './components/StatCard';
import { useDashboardMetrics } from './hooks/useDashboardMetrics';
import './styles/DashboardPage.css';

export default function DashboardPage() {
  const { metrics, applicantTrends, loading, error, reload } = useDashboardMetrics();

  return (
    <section className="dashboard-page">
      {error ? (
        <div className="dashboard-error-banner">
          <p>{error}</p>
          <button type="button" className="btn btn-ghost" onClick={reload}>
            Retry
          </button>
        </div>
      ) : null}

      <div className="dashboard-header-grid">
        <ProfileQuickCard />
        <div className="dashboard-stat-grid">
          {loading
            ? Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="dashboard-stat-card dashboard-skeleton" />
              ))
            : metrics.map((metric) => <StatCard key={metric.id} {...metric} />)}
        </div>
      </div>

      {loading ? (
        <div className="dashboard-loading-grid">
          <div className="dashboard-panel dashboard-skeleton dashboard-skeleton--lg" />
        </div>
      ) : (
        <div className="dashboard-content-grid">
          <ApplicantTrendsChart data={applicantTrends} />
        </div>
      )}
    </section>
  );
}
