import { UserRole } from './roles';

export enum Permission {
  // Driver Permissions
  VIEW_DRIVER_DASHBOARD = 'VIEW_DRIVER_DASHBOARD',
  VIEW_LIVE_MAP = 'VIEW_LIVE_MAP',
  USE_AI_ASSISTANT = 'USE_AI_ASSISTANT',
  VIEW_ANALYTICS = 'VIEW_ANALYTICS',
  VIEW_PROFILE = 'VIEW_PROFILE',
  VIEW_TRIPS = 'VIEW_TRIPS',

  // Admin Permissions
  VIEW_ADMIN_DASHBOARD = 'VIEW_ADMIN_DASHBOARD',
  VIEW_FLEET = 'VIEW_FLEET',
  VIEW_MODEL_HEALTH = 'VIEW_MODEL_HEALTH',
  VIEW_ALERTS = 'VIEW_ALERTS',

  // Common/Shared Permissions
  VIEW_SETTINGS = 'VIEW_SETTINGS',
  VIEW_SUPPORT = 'VIEW_SUPPORT',
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.DRIVER]: [
    Permission.VIEW_DRIVER_DASHBOARD,
    Permission.VIEW_LIVE_MAP,
    Permission.USE_AI_ASSISTANT,
    Permission.VIEW_ANALYTICS,
    Permission.VIEW_PROFILE,
    Permission.VIEW_TRIPS,
    Permission.VIEW_SETTINGS,
    Permission.VIEW_SUPPORT,
  ],
  [UserRole.ADMIN]: [
    Permission.VIEW_ADMIN_DASHBOARD,
    Permission.VIEW_FLEET,
    Permission.VIEW_MODEL_HEALTH,
    Permission.VIEW_ALERTS,
    Permission.VIEW_LIVE_MAP,
    Permission.VIEW_ANALYTICS,
    Permission.VIEW_SETTINGS,
    Permission.VIEW_SUPPORT,
  ],
};

/**
 * Checks if a given role possesses a specific permission.
 */
export function hasPermission(role: UserRole | string | null | undefined, permission: Permission): boolean {
  if (!role) return false;
  const userRole = role as UserRole;
  const permissions = ROLE_PERMISSIONS[userRole];
  if (!permissions) return false;
  return permissions.includes(permission);
}
