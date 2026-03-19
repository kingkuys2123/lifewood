export function getDashboardData() {
  return {
    metrics: [
      { id: 'total-users', label: 'Total Users', value: '1,284', delta: '+9.4%' },
      { id: 'active-applicants', label: 'Active Applicants', value: '326', delta: '+5.2%' },
      { id: 'approved-this-month', label: 'Approved This Month', value: '188', delta: '+11.1%' },
      { id: 'avg-review-time', label: 'Avg Review Time', value: '2.4 days', delta: '-0.8 days' },
    ],
    applicantTrends: [
      { date: 'Mar 10', applicants: 22, approved: 15 },
      { date: 'Mar 11', applicants: 28, approved: 16 },
      { date: 'Mar 12', applicants: 34, approved: 21 },
      { date: 'Mar 13', applicants: 29, approved: 19 },
      { date: 'Mar 14', applicants: 36, approved: 24 },
      { date: 'Mar 15', applicants: 40, approved: 26 },
      { date: 'Mar 16', applicants: 38, approved: 23 },
    ],
    notifications: [
      { id: 1, type: 'System', message: 'Scheduled maintenance tonight at 11:30 PM.' },
      { id: 2, type: 'Action', message: '12 new users imported from the HR sync job.' },
      { id: 3, type: 'Security', message: 'Password policy updated for all admin accounts.' },
    ],
    reports: [
      { id: 'r1', name: 'Monthly Applicants Summary', status: 'Ready' },
      { id: 'r2', name: 'Reviewer Productivity Report', status: 'Generating' },
      { id: 'r3', name: 'User Access Audit', status: 'Ready' },
    ],
    settings: [
      { id: 's1', name: 'Applicant auto-tagging', value: 'Enabled' },
      { id: 's2', name: 'Weekly digest email', value: 'Enabled' },
      { id: 's3', name: 'Approval workflow', value: '2-level review' },
    ],
  };
}

