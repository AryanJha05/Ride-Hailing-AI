import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { theme } from './theme/theme';
import { LandingPage } from './pages/LandingPage';
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
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<DriverDashboard />} />
            <Route path="/live-map" element={<LiveDemandMap />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
            <Route path="/analytics" element={<ForecastAnalytics />} />
            <Route path="/trips" element={<Trips />} />
            <Route path="/profile" element={<DriverProfile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/support" element={<Support />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
};
