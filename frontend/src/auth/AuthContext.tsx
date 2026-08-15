import React, { createContext, useContext, useState } from 'react';
import { UserProfile, UserRole, ROLES, DEMO_USERS } from './roles';
import { Permission, hasPermission as checkPermission } from './permissions';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  loginAsDriver: () => void;
  loginAsAdmin: () => void;
  logout: () => void;
  hasRole: (allowedRole: UserRole | UserRole[]) => boolean;
  hasPermission: (permission: Permission) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const savedRole = localStorage.getItem('ride_ai_role') as UserRole | null;
    if (savedRole === ROLES.ADMIN) return DEMO_USERS.ADMIN;
    if (savedRole === ROLES.DRIVER) return DEMO_USERS.DRIVER;
    // Default to DRIVER for initial demo state if none saved
    return DEMO_USERS.DRIVER;
  });

  const role = user?.role || null;

  const loginAsDriver = () => {
    setUser(DEMO_USERS.DRIVER);
    localStorage.setItem('ride_ai_role', ROLES.DRIVER);
  };

  const loginAsAdmin = () => {
    setUser(DEMO_USERS.ADMIN);
    localStorage.setItem('ride_ai_role', ROLES.ADMIN);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ride_ai_role');
  };

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
        isAuthenticated: !!user,
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
