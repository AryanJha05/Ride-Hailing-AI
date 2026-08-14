export const ROLES = {
  DRIVER: 'DRIVER',
  ADMIN: 'ADMIN',
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  driverId?: string;
  adminId?: string;
  avatar?: string;
  tier?: string;
}

export const DEMO_USERS: Record<UserRole, UserProfile> = {
  [ROLES.DRIVER]: {
    id: 'usr-driver-2048',
    name: 'Alex Morgan',
    email: 'alex.morgan@rideai.nyc',
    role: ROLES.DRIVER,
    driverId: 'NYC-2048',
    tier: 'Gold Driver',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
  },
  [ROLES.ADMIN]: {
    id: 'usr-admin-101',
    name: 'Ride AI Administrator',
    email: 'admin@rideai.nyc',
    role: ROLES.ADMIN,
    adminId: 'NOC-101',
    tier: 'Fleet Operations Lead',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  },
};
