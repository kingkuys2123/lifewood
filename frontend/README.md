# Lifewood Frontend (React + Vite)

This project now includes a branded public site and a static admin portal UI that is ready to connect to the Spring Boot backend.

## Quick Start

```bash
npm install
npm run dev
```

## Build Check

```bash
npm run build
```

## Key Routes

- `/admin` - Portal landing page with login call-to-action
- `/login` - Static login portal (username/email, forgot password, password, sign in)
- `/portal` - Dashboard shell with sidebar, profile dropdown, and logout confirmation modal
- `/portal/users` - User management table (filter, sort, paginate, column visibility, CRUD-like actions)
- `/portal/applicants` - Applicants table (filter, sort, paginate, column visibility, view/approve/deny)
- `/portal/settings` - Static settings and alerts
- `/portal/profile/edit` - Profile edit form with profile picture input

## Libraries Added

- `recharts` for dashboard analytics visualization
- `@tanstack/react-table` for advanced table interactivity
