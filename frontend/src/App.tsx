import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { theme } from './theme/theme';
import { AuthProvider } from './auth/AuthContext';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { ROLES } from './auth/roles';
import { ROUTES } from './routes/routes';
import { LoginPage } from './pages/LoginPage';
import { DriverDashboard } from './pages/DriverDashboard';
import { LiveDemandMap } from './pages/LiveDemandMap';
import { AIAssistant } from './pages/AIAssistant';
import { ForecastAnalytics } from './pages/ForecastAnalytics';
import { DriverProfile } from './pages/DriverProfile';
import { Trips } from './pages/Trips';
import { Settings } from './pages/Settings';
import { Support } from './pages/Support';
import { AdminDashboard } from './pages/AdminDashboard';

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
              {/* Authentication Routes */}
              <Route path={ROUTES.ROOT} element={<LoginPage />} />
              <Route path={ROUTES.LOGIN} element={<LoginPage />} />

              {/* Driver Protected Routes */}
              <Route
                path={ROUTES.DASHBOARD}
                element={
                  <ProtectedRoute allowedRoles={[ROLES.DRIVER]}>
                    <DriverDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.AI_ASSISTANT}
                element={
                  <ProtectedRoute allowedRoles={[ROLES.DRIVER]}>
                    <AIAssistant />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.TRIPS}
                element={
                  <ProtectedRoute allowedRoles={[ROLES.DRIVER]}>
                    <Trips />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.PROFILE}
                element={
                  <ProtectedRoute allowedRoles={[ROLES.DRIVER]}>
                    <DriverProfile />
                  </ProtectedRoute>
                }
              />

              {/* Shared Protected Routes (Driver & Admin) */}
              <Route
                path={ROUTES.LIVE_MAP}
                element={
                  <ProtectedRoute allowedRoles={[ROLES.DRIVER, ROLES.ADMIN]}>
                    <LiveDemandMap />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.ANALYTICS}
                element={
                  <ProtectedRoute allowedRoles={[ROLES.DRIVER, ROLES.ADMIN]}>
                    <ForecastAnalytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.SETTINGS}
                element={
                  <ProtectedRoute allowedRoles={[ROLES.DRIVER, ROLES.ADMIN]}>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.SUPPORT}
                element={
                  <ProtectedRoute allowedRoles={[ROLES.DRIVER, ROLES.ADMIN]}>
                    <Support />
                  </ProtectedRoute>
                }
              />

              {/* Admin Protected Routes */}
              <Route
                path={ROUTES.ADMIN}
                element={
                  <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all Fallback Redirect */}
              <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};
