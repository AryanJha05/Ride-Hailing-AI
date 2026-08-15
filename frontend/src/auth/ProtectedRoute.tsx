import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { UserRole, ROLES } from './roles';
import { Permission } from './permissions';
import { ROUTES } from '../routes/routes';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requiredPermission?: Permission;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  requiredPermission,
}) => {
  const { user, role, isAuthenticated, hasPermission } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user || !role) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // Check role authorization if allowedRoles is provided
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    if (role === ROLES.DRIVER) {
      return <Navigate to={ROUTES.DASHBOARD} replace />;
    }
    if (role === ROLES.ADMIN) {
      return <Navigate to={ROUTES.ADMIN} replace />;
    }
  }

  // Check permission authorization if requiredPermission is provided
  if (requiredPermission && !hasPermission(requiredPermission)) {
    if (role === ROLES.DRIVER) {
      return <Navigate to={ROUTES.DASHBOARD} replace />;
    }
    if (role === ROLES.ADMIN) {
      return <Navigate to={ROUTES.ADMIN} replace />;
    }
  }

  return <>{children}</>;
};
