import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { UserRole, ROLES } from './roles';
import { ROUTES } from '../routes/routes';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, role, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user || !role) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(role)) {
    // Role-based redirect if unauthorized
    if (role === ROLES.DRIVER) {
      // Driver trying to access admin routes gets redirected to driver dashboard
      return <Navigate to={ROUTES.DASHBOARD} replace />;
    }
    if (role === ROLES.ADMIN) {
      // Admin trying to access driver-only routes gets redirected to admin operations
      return <Navigate to={ROUTES.ADMIN} replace />;
    }
  }

  return <>{children}</>;
};
