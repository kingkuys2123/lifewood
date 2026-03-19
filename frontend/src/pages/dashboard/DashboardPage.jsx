import ApplicantTrendsChart from './components/ApplicantTrendsChart';
import NotificationsPanel from './components/NotificationsPanel';
import ProfileQuickCard from './components/ProfileQuickCard';
import ReportsPanel from './components/ReportsPanel';
import StatCard from './components/StatCard';
import { useDashboardMetrics } from './hooks/useDashboardMetrics';
import './styles/DashboardPage.css';

export default function DashboardPage() {
  const { metrics, applicantTrends, notifications, reports, settings } =
    useDashboardMetrics();

  return (
    <section className="dashboard-page">
      <div className="dashboard-header-grid">
        <ProfileQuickCard />
        <div className="dashboard-stat-grid">
          {metrics.map((metric) => (
            <StatCard key={metric.id} {...metric} />
          ))}
        </div>
      </div>

      <div className="dashboard-content-grid">
        <ApplicantTrendsChart data={applicantTrends} />
        <NotificationsPanel notifications={notifications} />
        <ReportsPanel reports={reports} settings={settings} />
      </div>
    </section>
  );
}
