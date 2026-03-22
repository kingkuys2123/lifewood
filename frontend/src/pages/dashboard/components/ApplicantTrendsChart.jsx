import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { motion } from 'framer-motion';

const MotionSection = motion.section;

export default function ApplicantTrendsChart({ data }) {
  return (
    <MotionSection
      className="dashboard-panel chart-panel"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24 }}
    >
      <header>
        <h3>Applicant Trends by Date</h3>
      </header>
      <div className="dashboard-chart-wrap">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8e8ed" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: '1px solid rgba(0, 0, 0, 0.12)' }}
              cursor={{ stroke: '#133020', strokeOpacity: 0.2 }}
            />
            <Line type="monotone" dataKey="applicants" stroke="#133020" strokeWidth={3} />
            <Line type="monotone" dataKey="approved" stroke="#f5a623" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </MotionSection>
  );
}
