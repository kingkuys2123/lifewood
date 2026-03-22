import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../providers/useAuth';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const location = useLocation();
  const { bootstrapping, isAuthenticated, hasRole } = useAuth();

  if (bootstrapping) {
    return <div className="portal-loading-state">Loading session...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles.length > 0 && !hasRole(allowedRoles)) {
    return <Navigate to="/portal" replace />;
  }

  return children;
}
