# Lifewood Frontend (React + Vite)

This project includes a branded public site and an admin portal integrated with the Spring Boot backend using JWT auth, Axios interceptors, and STOMP notifications.

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

## Integration Notes

- API base URL is configured with `VITE_API_BASE_URL`.
- WebSocket base URL is configured with `VITE_WS_URL`.
- JWT access token is attached via Axios interceptors.
- Refresh token flow is handled automatically on 401 responses.
- Real-time notifications subscribe to `/user/queue/notifications`.

## Libraries Used

- `recharts` for dashboard analytics visualization
- `@tanstack/react-table` for advanced table interactivity
- `axios` for centralized API calls with auth interceptors
- `@stomp/stompjs` + `sockjs-client` for real-time notifications
