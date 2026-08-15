import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { theme } from './theme/theme';
import { AuthProvider } from './auth/AuthContext';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { ROLES } from './auth/roles';
import { ROUTES } from './routes/routes';
import { MainLayout } from './layouts/MainLayout';
import {
  LoginPage,
  DriverDashboard,
  DriverProfile,
  Trips,
  AIAssistant,
  DriverEarningsPage,
  AdminDashboard,
  AdminFleetPage,
  AdminDriversPage,
  AdminForecastPage,
  AdminModelHealthPage,
  AdminAIRecommendationsPage,
  AdminAlertsPage,
  AdminSystemStatusPage,
  AdminUsersPage,
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
              <Route path={ROUTES.ROOT} element={<Navigate to={ROUTES.LOGIN} replace />} />
              <Route path={ROUTES.LOGIN} element={<LoginPage />} />

              {/* Driver Route Namespace (/driver/*) */}
              <Route
                path="/driver"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.DRIVER]}>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to={ROUTES.DRIVER.DASHBOARD} replace />} />
                <Route path="dashboard" element={<DriverDashboard />} />
                <Route path="demand" element={<LiveDemandMap />} />
                <Route path="assistant" element={<AIAssistant />} />
                <Route path="earnings" element={<DriverEarningsPage />} />
                <Route path="trips" element={<Trips />} />
                <Route path="analytics" element={<ForecastAnalytics />} />
                <Route path="profile" element={<DriverProfile />} />
                <Route path="settings" element={<Settings />} />
                <Route path="support" element={<Support />} />
              </Route>

              {/* Legacy Driver Route Namespace (/user/*) for Backwards Compatibility */}
              <Route
                path="/user"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.DRIVER]}>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to={ROUTES.DRIVER.DASHBOARD} replace />} />
                <Route path="dashboard" element={<DriverDashboard />} />
                <Route path="live-map" element={<LiveDemandMap />} />
                <Route path="ai-assistant" element={<AIAssistant />} />
                <Route path="analytics" element={<ForecastAnalytics />} />
                <Route path="profile" element={<DriverProfile />} />
                <Route path="trips" element={<Trips />} />
                <Route path="settings" element={<Settings />} />
                <Route path="support" element={<Support />} />
              </Route>

              {/* Admin Route Namespace (/admin/*) */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to={ROUTES.ADMIN.DASHBOARD} replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="fleet" element={<AdminFleetPage />} />
                <Route path="drivers" element={<AdminDriversPage />} />
                <Route path="demand" element={<LiveDemandMap />} />
                <Route path="forecast" element={<AdminForecastPage />} />
                <Route path="forecasting" element={<AdminForecastPage />} />
                <Route path="models" element={<AdminModelHealthPage />} />
                <Route path="recommendations" element={<AdminAIRecommendationsPage />} />
                <Route path="alerts" element={<AdminAlertsPage />} />
                <Route path="system" element={<AdminSystemStatusPage />} />
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="settings" element={<Settings />} />
                <Route path="support" element={<AdminSystemStatusPage />} />
              </Route>

              {/* Legacy Flat Route Compatibility Redirects */}
              <Route path="/dashboard" element={<Navigate to={ROUTES.DRIVER.DASHBOARD} replace />} />
              <Route path="/live-map" element={<Navigate to={ROUTES.DRIVER.DEMAND} replace />} />
              <Route path="/ai-assistant" element={<Navigate to={ROUTES.DRIVER.ASSISTANT} replace />} />
              <Route path="/analytics" element={<Navigate to={ROUTES.DRIVER.ANALYTICS} replace />} />
              <Route path="/profile" element={<Navigate to={ROUTES.DRIVER.PROFILE} replace />} />
              <Route path="/trips" element={<Navigate to={ROUTES.DRIVER.TRIPS} replace />} />
              <Route path="/settings" element={<Navigate to={ROUTES.DRIVER.SETTINGS} replace />} />
              <Route path="/support" element={<Navigate to={ROUTES.DRIVER.SUPPORT} replace />} />

              {/* Catch-all Fallback Redirect */}
              <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};
