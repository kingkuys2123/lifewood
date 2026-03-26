import httpClient from '../../../services/api/httpClient';
import { unwrapApiResponse } from '../../../services/api/apiResponse';

function normalizeSeries(payload) {
  const points = payload?.points || [];
  return points.map((point) => ({
    label: point.label,
    submissions: point.submissions,
    changePercent: point.changePercent,
  }));
}

export async function fetchApplicantsOverview() {
  const response = await httpClient.get('/applicant/dashboard/overview');
  return unwrapApiResponse(response);
}

export async function fetchSubmissionRate(days = 14) {
  const response = await httpClient.get('/applicant/dashboard/submission-rate', {
    params: { days },
  });
  return unwrapApiResponse(response);
}

export async function fetchMonthlySubmissions({ from, to, month, granularity = 'day' } = {}) {
  const response = await httpClient.get('/applicant/dashboard/submissions', {
    params: {
      from: from || undefined,
      to: to || undefined,
      month: month || undefined,
      granularity,
    },
  });
  return unwrapApiResponse(response);
}

export async function fetchAdminPerformance() {
  const response = await httpClient.get('/applicant/dashboard/admin-performance');
  return unwrapApiResponse(response);
}

export async function getDashboardData(filters) {
  const [overview, submissionRate, monthlySubmissions, adminPerformance] = await Promise.all([
    fetchApplicantsOverview(),
    fetchSubmissionRate(14),
    fetchMonthlySubmissions(filters),
    fetchAdminPerformance(),
  ]);

  return {
    metrics: [
      {
        id: 'today-new',
        label: "Today's New Applicants",
        value: String(overview?.todayNewApplicants || 0),
        delta: 'Today',
      },
      {
        id: 'pending',
        label: 'Pending Applications',
        value: String(overview?.pendingApplications || 0),
        delta: 'Waiting review',
      },
      {
        id: 'approved',
        label: 'Approved Applications',
        value: String(overview?.approvedApplications || 0),
        delta: 'Reviewed',
      },
      {
        id: 'denied',
        label: 'Denied Applications',
        value: String(overview?.deniedApplications || 0),
        delta: 'Reviewed',
      },
    ],
    submissionRateSeries: normalizeSeries(submissionRate),
    monthlySubmissionsSeries: normalizeSeries(monthlySubmissions),
    monthlySubmissionsMeta: {
      from: monthlySubmissions?.from,
      to: monthlySubmissions?.to,
      totalSubmissions: monthlySubmissions?.totalSubmissions || 0,
    },
    adminPerformance: {
      adminUsername: adminPerformance?.adminUsername,
      approvedCount: adminPerformance?.approvedCount || 0,
      deniedCount: adminPerformance?.deniedCount || 0,
      totalReviewed: adminPerformance?.totalReviewed || 0,
    },
  };
}
