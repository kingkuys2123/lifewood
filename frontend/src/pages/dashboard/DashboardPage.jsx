import ApplicantTrendsChart from './components/ApplicantTrendsChart';
import NotificationsPanel from './components/NotificationsPanel';
import ProfileQuickCard from './components/ProfileQuickCard';
import ReportsPanel from './components/ReportsPanel';
import StatCard from './components/StatCard';
import { useDashboardMetrics } from './hooks/useDashboardMetrics';
import './styles/DashboardPage.css';

export default function DashboardPage() {
  const { metrics, applicantTrends, notifications, reports, settings, loading, error, reload } =
    useDashboardMetrics();

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
          <div className="dashboard-panel dashboard-skeleton dashboard-skeleton--sm" />
          <div className="dashboard-panel dashboard-skeleton dashboard-skeleton--sm" />
        </div>
      ) : (
        <div className="dashboard-content-grid">
          <ApplicantTrendsChart data={applicantTrends} />
          <NotificationsPanel notifications={notifications} />
          <ReportsPanel reports={reports} settings={settings} />
        </div>
      )}
    </section>
  );
}
