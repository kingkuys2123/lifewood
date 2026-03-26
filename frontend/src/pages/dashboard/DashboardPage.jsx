import ApplicantTrendsChart from './components/ApplicantTrendsChart';
import AdminPerformanceCard from './components/AdminPerformanceCard';
import MonthlySubmissionsPanel from './components/MonthlySubmissionsPanel';
import ProfileQuickCard from './components/ProfileQuickCard';
import StatCard from './components/StatCard';
import { useDashboardMetrics } from './hooks/useDashboardMetrics';
import './styles/DashboardPage.css';

export default function DashboardPage() {
  const {
    metrics,
    submissionRateSeries,
    monthlySubmissionsSeries,
    monthlySubmissionsMeta,
    adminPerformance,
    filters,
    loading,
    error,
    reload,
    updateFilters,
  } = useDashboardMetrics();

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
        <div className="dashboard-panel applicants-overview-panel">
          <header>
            <h3>Applicants Overview</h3>
          </header>
          <div className="dashboard-stat-grid">
            {loading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="dashboard-stat-card dashboard-skeleton" />
                ))
              : metrics.map((metric) => <StatCard key={metric.id} {...metric} />)}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="dashboard-loading-grid">
          <div className="dashboard-panel dashboard-skeleton dashboard-skeleton--lg" />
          <div className="dashboard-panel dashboard-skeleton dashboard-skeleton--sm" />
          <div className="dashboard-panel dashboard-skeleton dashboard-skeleton--lg" />
        </div>
      ) : (
        <div className="dashboard-content-grid">
          <ApplicantTrendsChart data={submissionRateSeries} title="Submission Rate" />
          <AdminPerformanceCard data={adminPerformance} />
          <MonthlySubmissionsPanel
            data={monthlySubmissionsSeries}
            meta={monthlySubmissionsMeta}
            filters={filters}
            onFiltersChange={updateFilters}
          />
        </div>
      )}
    </section>
  );
}
