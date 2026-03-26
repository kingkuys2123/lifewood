import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { motion } from 'framer-motion';

const MotionSection = motion.section;

function renderTooltipContent({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null;
  }

  const entry = payload[0]?.payload;
  const change = entry?.changePercent;
  const changeLabel =
    change == null ? 'No prior point' : `${change > 0 ? '+' : ''}${Number(change).toFixed(2)}% vs previous`;

  return (
    <div className="dashboard-chart-tooltip">
      <p>{label}</p>
      <strong>{entry?.submissions || 0} submissions</strong>
      <small>{changeLabel}</small>
    </div>
  );
}

export default function ApplicantTrendsChart({ data, title = 'Submission Rate' }) {
  return (
    <MotionSection
      className="dashboard-panel chart-panel"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24 }}
    >
      <header>
        <h3>{title}</h3>
      </header>
      <div className="dashboard-chart-wrap">
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8e8ed" />
            <XAxis dataKey="label" />
            <YAxis allowDecimals={false} />
            <Tooltip content={renderTooltipContent} cursor={{ stroke: '#133020', strokeOpacity: 0.2 }} />
            <Area type="monotone" dataKey="submissions" stroke="#133020" fill="rgba(19, 48, 32, 0.15)" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </MotionSection>
  );
}
