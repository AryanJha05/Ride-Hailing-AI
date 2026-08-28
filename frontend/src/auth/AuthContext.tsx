import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole, ROLES, DEMO_USERS } from './roles';
import { Permission, hasPermission as checkPermission } from './permissions';
import { rideApi } from '../services/api';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<UserProfile>;
  loginAsDriver: () => Promise<UserProfile>;
  loginAsAdmin: () => Promise<UserProfile>;
  logout: () => void;
  hasRole: (allowedRole: UserRole | UserRole[]) => boolean;
  hasPermission: (permission: Permission) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('ride_ai_token'));
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Function to map AuthUser response to UserProfile with dynamic backend details
  const mapUserToProfile = (authUser: any): UserProfile => {
    const userRole = authUser.role as UserRole;
    const baseDemo = DEMO_USERS[userRole] || DEMO_USERS[UserRole.DRIVER];
    const dp = authUser.driver_profile;

    let vehicleStr = baseDemo.vehicle;
    if (dp && (dp.vehicle_make || dp.vehicle_model || dp.vehicle_plate)) {
      vehicleStr = `${dp.vehicle_make || 'Toyota'} ${dp.vehicle_model || 'Camry'} (${dp.vehicle_plate || 'NYC-TLC'})`;
    }

    return {
      id: authUser.id,
      name: authUser.name,
      email: authUser.email,
      role: userRole,
      avatar: baseDemo.avatar,
      badge: userRole === UserRole.ADMIN ? 'Fleet Ops Director' : (dp?.status === 'Active' ? 'Gold Driver' : 'Standard Driver'),
      vehicle: vehicleStr,
      rating: dp?.rating !== undefined ? dp.rating : (userRole === UserRole.ADMIN ? 5.0 : 5.0),
      phone: dp?.phone || undefined,
      license_number: dp?.license_number || undefined,
      driver_id: dp?.driver_id || undefined,
      status: dp?.status || 'Active',
      total_trips: dp?.total_trips !== undefined ? dp.total_trips : 0,
      total_earnings: dp?.total_earnings !== undefined ? dp.total_earnings : 0.0,
      vehicle_make: dp?.vehicle_make || undefined,
      vehicle_model: dp?.vehicle_model || undefined,
      vehicle_plate: dp?.vehicle_plate || undefined,
    };
  };

  // Restore authenticated session on initial load if token exists
  useEffect(() => {
    const initSession = async () => {
      const storedToken = localStorage.getItem('ride_ai_token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }
      try {
        const authUser = await rideApi.getMe();
        const profile = mapUserToProfile(authUser);
        setUser(profile);
        localStorage.setItem('ride_ai_role', profile.role);
      } catch (err) {
        // Token invalid or expired
        localStorage.removeItem('ride_ai_token');
        localStorage.removeItem('ride_ai_role');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    initSession();
  }, []);

  const login = async (email: string, password: string): Promise<UserProfile> => {
    const response = await rideApi.login({ email, password });
    localStorage.setItem('ride_ai_token', response.access_token);
    localStorage.setItem('ride_ai_role', response.user.role);
    setToken(response.access_token);
    const profile = mapUserToProfile(response.user);
    setUser(profile);
    return profile;
  };

  const loginAsDriver = async (): Promise<UserProfile> => {
    return await login('alex.morgan@rideai.nyc', 'driver123');
  };

  const loginAsAdmin = async (): Promise<UserProfile> => {
    return await login('admin@rideai.nyc', 'admin123');
  };

  const logout = () => {
    localStorage.removeItem('ride_ai_token');
    localStorage.removeItem('ride_ai_role');
    setToken(null);
    setUser(null);
  };

  const role = user?.role || null;

  const hasRole = (allowedRole: UserRole | UserRole[]): boolean => {
    if (!role) return false;
    if (Array.isArray(allowedRole)) {
      return allowedRole.includes(role);
    }
    return role === allowedRole;
  };

  const hasPermission = (permission: Permission): boolean => {
    return checkPermission(role, permission);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        loginAsDriver,
        loginAsAdmin,
        logout,
        hasRole,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
