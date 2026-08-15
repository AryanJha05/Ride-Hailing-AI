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

  // Function to map AuthUser response to UserProfile with UI defaults
  const mapUserToProfile = (authUser: { id: string; name: string; email: string; role: string }): UserProfile => {
    const userRole = authUser.role as UserRole;
    const baseDemo = DEMO_USERS[userRole] || DEMO_USERS[UserRole.DRIVER];
    return {
      id: authUser.id,
      name: authUser.name,
      email: authUser.email,
      role: userRole,
      avatar: baseDemo.avatar,
      badge: baseDemo.badge,
      vehicle: baseDemo.vehicle,
      rating: baseDemo.rating,
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
