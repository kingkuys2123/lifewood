import { fetchApplicants } from '../../../services/applicants/applicantsService';
import { fetchNotifications } from '../../../services/notifications/notificationsService';
import { fetchUsers } from '../../../services/users/usersService';

const FALLBACK_TRENDS = [
  { date: 'Mon', applicants: 0, approved: 0 },
  { date: 'Tue', applicants: 0, approved: 0 },
  { date: 'Wed', applicants: 0, approved: 0 },
  { date: 'Thu', applicants: 0, approved: 0 },
  { date: 'Fri', applicants: 0, approved: 0 },
];

export async function getDashboardData() {
  const [usersPage, applicantsPage, reviewedPage, notificationsPage] = await Promise.all([
    fetchUsers({ pageIndex: 0, pageSize: 1 }),
    fetchApplicants({ reviewed: false, pageIndex: 0, pageSize: 50 }),
    fetchApplicants({ reviewed: true, approved: true, pageIndex: 0, pageSize: 50 }),
    fetchNotifications({ pageIndex: 0, pageSize: 5 }),
  ]);

  const totalUsers = usersPage?.totalElements || 0;
  const pendingApplicants = applicantsPage?.totalElements || 0;
  const approvedApplicants = reviewedPage?.totalElements || 0;

  return {
    metrics: [
      { id: 'total-users', label: 'Total Users', value: String(totalUsers), delta: 'Live' },
      { id: 'active-applicants', label: 'Pending Applicants', value: String(pendingApplicants), delta: 'Live' },
      { id: 'approved-this-month', label: 'Approved Applicants', value: String(approvedApplicants), delta: 'Live' },
      { id: 'avg-review-time', label: 'Avg Review Time', value: 'Tracking', delta: 'Soon' },
    ],
    applicantTrends: FALLBACK_TRENDS,
    notifications: (notificationsPage?.content || []).map((item) => ({
      id: item.id,
      type: item.type,
      message: item.message,
    })),
    reports: [
      { id: 'r1', name: 'Applicant Volume Snapshot', status: 'Ready' },
      { id: 'r2', name: 'Review Decisions Snapshot', status: 'Ready' },
    ],
    settings: [
      { id: 's1', name: 'Notification stream', value: 'Enabled' },
      { id: 's2', name: 'Approval workflow', value: 'Active' },
    ],
  };
}
