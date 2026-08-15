import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { theme } from './theme/theme';
import { AuthProvider } from './auth/AuthContext';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { UserRole, ROLES } from './auth/roles';
import { Permission } from './auth/permissions';
import { ROUTES } from './routes/routes';
import { MainLayout } from './layouts/MainLayout';
import {
  LoginPage,
  DriverDashboard,
  DriverProfile,
  Trips,
  AIAssistant,
  AdminDashboard,
  LiveDemandMap,
  ForecastAnalytics,
  Settings,
  Support,
} from './pages';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Authentication Routes */}
              <Route path={ROUTES.ROOT} element={<LoginPage />} />
              <Route path={ROUTES.LOGIN} element={<LoginPage />} />

              {/* Shared MainLayout Application Shell (Protected) */}
              <Route
                element={
                  <ProtectedRoute allowedRoles={[ROLES.DRIVER, ROLES.ADMIN]}>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                {/* Driver-Specific Protected Routes */}
                <Route
                  path={ROUTES.DASHBOARD}
                  element={
                    <ProtectedRoute
                      allowedRoles={[ROLES.DRIVER]}
                      requiredPermission={Permission.VIEW_DRIVER_DASHBOARD}
                    >
                      <DriverDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={ROUTES.AI_ASSISTANT}
                  element={
                    <ProtectedRoute
                      allowedRoles={[ROLES.DRIVER]}
                      requiredPermission={Permission.USE_AI_ASSISTANT}
                    >
                      <AIAssistant />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={ROUTES.TRIPS}
                  element={
                    <ProtectedRoute
                      allowedRoles={[ROLES.DRIVER]}
                      requiredPermission={Permission.VIEW_TRIPS}
                    >
                      <Trips />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={ROUTES.PROFILE}
                  element={
                    <ProtectedRoute
                      allowedRoles={[ROLES.DRIVER]}
                      requiredPermission={Permission.VIEW_PROFILE}
                    >
                      <DriverProfile />
                    </ProtectedRoute>
                  }
                />

                {/* Common / Shared Module Routes */}
                <Route
                  path={ROUTES.LIVE_MAP}
                  element={
                    <ProtectedRoute requiredPermission={Permission.VIEW_LIVE_MAP}>
                      <LiveDemandMap />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={ROUTES.ANALYTICS}
                  element={
                    <ProtectedRoute requiredPermission={Permission.VIEW_ANALYTICS}>
                      <ForecastAnalytics />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={ROUTES.SETTINGS}
                  element={
                    <ProtectedRoute requiredPermission={Permission.VIEW_SETTINGS}>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={ROUTES.SUPPORT}
                  element={
                    <ProtectedRoute requiredPermission={Permission.VIEW_SUPPORT}>
                      <Support />
                    </ProtectedRoute>
                  }
                />

                {/* Admin-Specific Protected Routes */}
                <Route
                  path={ROUTES.ADMIN}
                  element={
                    <ProtectedRoute
                      allowedRoles={[ROLES.ADMIN]}
                      requiredPermission={Permission.VIEW_ADMIN_DASHBOARD}
                    >
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={ROUTES.FLEET}
                  element={
                    <ProtectedRoute
                      allowedRoles={[ROLES.ADMIN]}
                      requiredPermission={Permission.VIEW_FLEET}
                    >
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={ROUTES.MODELS}
                  element={
                    <ProtectedRoute
                      allowedRoles={[ROLES.ADMIN]}
                      requiredPermission={Permission.VIEW_MODEL_HEALTH}
                    >
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={ROUTES.ALERTS}
                  element={
                    <ProtectedRoute
                      allowedRoles={[ROLES.ADMIN]}
                      requiredPermission={Permission.VIEW_ALERTS}
                    >
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
              </Route>

              {/* Catch-all Fallback Redirect */}
              <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};
