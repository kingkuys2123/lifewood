# Dashboard Analytics

This dashboard now reads analytics from backend aggregated endpoints and renders interactive charts.

## Backend endpoints

- `GET /applicant/dashboard/overview`
- `GET /applicant/dashboard/submission-rate?days=14`
- `GET /applicant/dashboard/submissions?from=YYYY-MM-DD&to=YYYY-MM-DD&granularity=day|week|month`
- `GET /applicant/dashboard/submissions?month=YYYY-MM&granularity=day|week|month`
- `GET /applicant/dashboard/admin-performance`

All endpoints require an authenticated admin.

## Frontend wiring

- Data adapter: `src/pages/dashboard/services/dashboardService.js`
- Stateful hook: `src/pages/dashboard/hooks/useDashboardMetrics.js`
- UI: `src/pages/dashboard/DashboardPage.jsx`
- Charts: `src/pages/dashboard/components/ApplicantTrendsChart.jsx`,
  `src/pages/dashboard/components/MonthlySubmissionsPanel.jsx`,
  `src/pages/dashboard/components/AdminPerformanceCard.jsx`

## Quick verify

1. Start backend and frontend locally.
2. Sign in as an admin user.
3. Open `/portal/dashboard` and test date range/month/granularity filters.
4. Approve/deny applicants and confirm the admin donut updates.

