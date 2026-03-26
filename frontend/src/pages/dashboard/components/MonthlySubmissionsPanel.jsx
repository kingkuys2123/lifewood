import { motion } from 'framer-motion';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const MotionSection = motion.section;

function getChangeLabel(value) {
  if (value == null) {
    return 'No prior period';
  }
  const numeric = Number(value);
  return `${numeric > 0 ? '+' : ''}${numeric.toFixed(2)}%`;
}

function renderTooltipContent({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null;
  }

  const point = payload[0].payload;
  return (
    <div className="dashboard-chart-tooltip">
      <p>{label}</p>
      <strong>{point.submissions} submissions</strong>
      <small>{getChangeLabel(point.changePercent)} vs previous</small>
    </div>
  );
}

export default function MonthlySubmissionsPanel({ data, meta, filters, onFiltersChange }) {
  return (
    <MotionSection
      className="dashboard-panel dashboard-panel--wide"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, delay: 0.08 }}
    >
      <header className="dashboard-panel-header">
        <div>
          <h3>Monthly Submissions</h3>
          <p className="dashboard-panel-subtitle">
            {meta?.from || '--'} to {meta?.to || '--'} ({meta?.totalSubmissions || 0} total)
          </p>
        </div>
        <div className="dashboard-filter-row">
          <label>
            From
            <input
              type="date"
              value={filters.from || ''}
              onChange={(event) => onFiltersChange({ from: event.target.value, month: '' })}
            />
          </label>
          <label>
            To
            <input
              type="date"
              value={filters.to || ''}
              onChange={(event) => onFiltersChange({ to: event.target.value, month: '' })}
            />
          </label>
          <label>
            Month
            <input
              type="month"
              value={filters.month || ''}
              onChange={(event) => onFiltersChange({ month: event.target.value })}
            />
          </label>
          <label>
            Granularity
            <select
              value={filters.granularity || 'day'}
              onChange={(event) => onFiltersChange({ granularity: event.target.value })}
            >
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
            </select>
          </label>
        </div>
      </header>

      <div className="dashboard-chart-wrap">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8e8ed" />
            <XAxis dataKey="label" />
            <YAxis allowDecimals={false} />
            <Tooltip content={renderTooltipContent} />
            <Line type="monotone" dataKey="submissions" stroke="#f5a623" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </MotionSection>
  );
}

