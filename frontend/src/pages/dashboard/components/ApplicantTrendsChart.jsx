import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export default function ApplicantTrendsChart({ data }) {
  return (
    <section className="dashboard-panel chart-panel">
      <header>
        <h3>Applicant Trends by Date</h3>
      </header>
      <div className="dashboard-chart-wrap">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8e8ed" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="applicants" stroke="#133020" strokeWidth={3} />
            <Line type="monotone" dataKey="approved" stroke="#f5a623" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
