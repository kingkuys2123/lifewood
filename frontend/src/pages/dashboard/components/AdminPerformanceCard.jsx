import { motion } from 'framer-motion';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const MotionSection = motion.section;
const COLORS = ['#1c6a42', '#9d2333'];

function renderTooltip({ active, payload }) {
  if (!active || !payload?.length) {
    return null;
  }

  const entry = payload[0];
  return (
    <div className="dashboard-chart-tooltip">
      <p>{entry.name}</p>
      <strong>{entry.value} decisions</strong>
    </div>
  );
}

export default function AdminPerformanceCard({ data }) {
  const chartData = [
    { name: 'Approved', value: data?.approvedCount || 0 },
    { name: 'Denied', value: data?.deniedCount || 0 },
  ];

  return (
    <MotionSection
      className="dashboard-panel dashboard-admin-performance"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, delay: 0.05 }}
    >
      <header>
        <h3>Admin Performance</h3>
        <p className="dashboard-panel-subtitle">
          {data?.adminUsername || 'Current admin'} reviewed {data?.totalReviewed || 0} applicants
        </p>
      </header>
      <div className="dashboard-chart-wrap dashboard-chart-wrap--sm">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
            >
              {chartData.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={renderTooltip} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="dashboard-admin-legend">
        <span>Approved: {data?.approvedCount || 0}</span>
        <span>Denied: {data?.deniedCount || 0}</span>
      </div>
    </MotionSection>
  );
}

