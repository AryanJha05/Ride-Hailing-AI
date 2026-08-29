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
  updateProfile: (updates: Partial<UserProfile>) => void;
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
      id: authUser.id || baseDemo.id,
      name: authUser.name || baseDemo.name,
      email: authUser.email || baseDemo.email,
      role: userRole,
      avatar: baseDemo.avatar,
      badge: userRole === UserRole.ADMIN ? 'Fleet Ops Director' : (dp?.status === 'Inactive' ? 'Standard Driver' : 'Gold Tier Driver'),
      vehicle: vehicleStr,
      rating: dp?.rating !== undefined ? dp.rating : baseDemo.rating,
      phone: dp?.phone || baseDemo.phone,
      license_number: dp?.license_number || baseDemo.license_number,
      driver_id: dp?.driver_id || baseDemo.driver_id,
      status: dp?.status || baseDemo.status,
      total_trips: dp?.total_trips !== undefined ? dp.total_trips : baseDemo.total_trips,
      total_earnings: dp?.total_earnings !== undefined ? dp.total_earnings : baseDemo.total_earnings,
      vehicle_make: dp?.vehicle_make || baseDemo.vehicle_make,
      vehicle_model: dp?.vehicle_model || baseDemo.vehicle_model,
      vehicle_plate: dp?.vehicle_plate || baseDemo.vehicle_plate,
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
    return await login('aryan.driver@rideai.demo', 'driver123');
  };

  const loginAsAdmin = async (): Promise<UserProfile> => {
    return await login('suraj.admin@rideai.demo', 'admin123');
  };

  const logout = () => {
    localStorage.removeItem('ride_ai_token');
    localStorage.removeItem('ride_ai_role');
    setToken(null);
    setUser(null);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      if (updates.vehicle_make || updates.vehicle_model || updates.vehicle_plate) {
        const make = updates.vehicle_make || prev.vehicle_make || 'Toyota';
        const model = updates.vehicle_model || prev.vehicle_model || 'Camry Hybrid';
        const plate = updates.vehicle_plate || prev.vehicle_plate || 'NYC-TLC-7782';
        updated.vehicle = `${make} ${model} (${plate})`;
      }
      return updated;
    });
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
        updateProfile,
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
