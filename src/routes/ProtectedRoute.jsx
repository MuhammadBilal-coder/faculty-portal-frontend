import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function ProtectedRoute() {
  const { isAuthenticated, user, session } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    if (user && session && !session.twoFactorVerified) {
      return <Navigate to="/auth/verify-2fa" replace state={{ from: location.pathname }} />;
    }
    return <Navigate to="/auth/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
