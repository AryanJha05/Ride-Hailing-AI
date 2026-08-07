import React from 'react';
import { Container } from '@mui/material';
import { PageShell } from '../components/layout/PageShell';
import { useDriverPerformance } from '../hooks/useRideApi';
import { DriverHeaderCard } from '../components/profile/DriverHeaderCard';
import { PerformanceMetricsCard } from '../components/profile/PerformanceMetricsCard';

export const DriverProfile: React.FC = () => {
  const { data: driver } = useDriverPerformance('driver-001');

  return (
    <PageShell title="Driver Profile">
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <DriverHeaderCard driver={driver} />
        <PerformanceMetricsCard driver={driver} />
      </Container>
    </PageShell>
  );
};
