export enum UserRole {
  DRIVER = 'DRIVER',
  ADMIN = 'ADMIN',
}

// Backward compatibility map
export const ROLES = {
  DRIVER: UserRole.DRIVER,
  ADMIN: UserRole.ADMIN,
} as const;

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  rating?: number;
  badge?: string;
  vehicle?: string;
}

export const DEMO_USERS: Record<UserRole, UserProfile> = {
  [UserRole.DRIVER]: {
    id: 'driver-001',
    name: 'Alex Morgan',
    email: 'alex.morgan@rideai.com',
    role: UserRole.DRIVER,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    rating: 4.92,
    badge: 'Gold Driver',
    vehicle: 'Tesla Model Y (NYC-2048)',
  },
  [UserRole.ADMIN]: {
    id: 'admin-001',
    name: 'Ride AI Administrator',
    email: 'admin@rideai.com',
    role: UserRole.ADMIN,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    badge: 'Fleet Ops Director',
    vehicle: 'Fleet Operation Center (NYC NOC)',
  },
};
