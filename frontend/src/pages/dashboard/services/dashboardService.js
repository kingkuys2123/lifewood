import { fetchApplicants } from '../../../services/applicants/applicantsService';
import { fetchUsers } from '../../../services/users/usersService';

const FALLBACK_TRENDS = [
  { date: 'Mon', applicants: 0, approved: 0 },
  { date: 'Tue', applicants: 0, approved: 0 },
  { date: 'Wed', applicants: 0, approved: 0 },
  { date: 'Thu', applicants: 0, approved: 0 },
  { date: 'Fri', applicants: 0, approved: 0 },
];

export async function getDashboardData() {
  const [usersPage, applicantsPage, reviewedPage] = await Promise.all([
    fetchUsers({ pageIndex: 0, pageSize: 1 }),
    fetchApplicants({ reviewed: false, pageIndex: 0, pageSize: 50 }),
    fetchApplicants({ reviewed: true, approved: true, pageIndex: 0, pageSize: 50 }),
  ]);

  const totalUsers = usersPage?.totalElements || 0;
  const pendingApplicants = applicantsPage?.totalElements || 0;
  const approvedApplicants = reviewedPage?.totalElements || 0;

  return {
    metrics: [
      { id: 'total-users', label: 'Total Users', value: String(totalUsers), delta: 'Live' },
      { id: 'active-applicants', label: 'Pending Applicants', value: String(pendingApplicants), delta: 'Live' },
      { id: 'approved-this-month', label: 'Approved Applicants', value: String(approvedApplicants), delta: 'Live' },
    ],
    applicantTrends: FALLBACK_TRENDS,
  };
}
