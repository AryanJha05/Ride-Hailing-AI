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
  phone?: string;
  license_number?: string;
  driver_id?: string;
  status?: string;
  total_trips?: number;
  total_earnings?: number;
  vehicle_make?: string;
  vehicle_model?: string;
  vehicle_plate?: string;
}

export const DEMO_USERS: Record<UserRole, UserProfile> = {
  [UserRole.DRIVER]: {
    id: 'user-driver-001',
    name: 'Aryan Jha',
    email: 'aryan.driver@rideai.demo',
    role: UserRole.DRIVER,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    rating: 4.94,
    badge: 'Gold Tier Driver',
    vehicle: 'Toyota Camry Hybrid (NYC-TLC-7782)',
    phone: '+1 (555) 234-5678',
    license_number: 'NYC-TLC-99821',
    driver_id: 'NYC-DRV-001',
    status: 'Active',
    total_trips: 1284,
    total_earnings: 7480.00,
    vehicle_make: 'Toyota',
    vehicle_model: 'Camry Hybrid',
    vehicle_plate: 'NYC-TLC-7782',
  },
  [UserRole.ADMIN]: {
    id: 'user-admin-001',
    name: 'Suraj Panigrahi',
    email: 'suraj.admin@rideai.demo',
    role: UserRole.ADMIN,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    badge: 'Fleet Ops Director',
    vehicle: 'Fleet Operation Center (NYC NOC)',
  },
};
