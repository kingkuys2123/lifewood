import { Navigate, useLocation } from 'react-router-dom';
import { trackEvent } from '../../services/analytics/analyticsService';
import { hasAdminGateAccess } from '../../services/auth/adminGateStorage';

export default function AdminGateRoute({ children }) {
  const location = useLocation();

  if (!hasAdminGateAccess()) {
    trackEvent('admin_gate_route_blocked', { path: location.pathname });
    return <Navigate to="/" replace />;
  }

  return children;
}

