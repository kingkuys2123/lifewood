import { useEffect, useState } from 'react';
import ApplicantTrendsChart from './components/ApplicantTrendsChart';
import NotificationsPanel from './components/NotificationsPanel';
import ProfileQuickCard from './components/ProfileQuickCard';
import ReportsPanel from './components/ReportsPanel';
import StatCard from './components/StatCard';
import { useDashboardMetrics } from './hooks/useDashboardMetrics';
import './styles/DashboardPage.css';

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const { metrics, applicantTrends, notifications, reports, settings } =
    useDashboardMetrics();

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 360);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section className="dashboard-page">
      <div className="dashboard-header-grid">
        <ProfileQuickCard />
        <div className="dashboard-stat-grid">
          {isLoading
            ? Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="dashboard-stat-card dashboard-skeleton" />
              ))
            : metrics.map((metric) => <StatCard key={metric.id} {...metric} />)}
        </div>
      </div>

      {isLoading ? (
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
