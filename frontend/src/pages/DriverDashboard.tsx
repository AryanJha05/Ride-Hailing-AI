import React from 'react';
import { Box, Container, Grid, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SpeedIcon from '@mui/icons-material/Speed';
import StarIcon from '@mui/icons-material/Star';
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi';
import { PageShell } from '../components/layout/PageShell';
import { VELOUR_TOKENS } from '../theme/palette';
import { KpiCard } from '../components/dashboard/KpiCard';
import { EarningsChart } from '../components/dashboard/EarningsChart';
import { DemandSurgeRadar } from '../components/dashboard/DemandSurgeRadar';
import { useDemandZones, useDriverPerformance } from '../hooks/useRideApi';

export const DriverDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { data: zones } = useDemandZones();
  const { data: driver } = useDriverPerformance('driver-001');

  return (
    <PageShell title="Driver Intelligence Hub">
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Banner Action Bar */}
        <Box
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 3,
            backgroundColor: VELOUR_TOKENS.bgSurface1,
            border: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#FFF', mb: 0.5 }}>
              Welcome back, {driver?.name || 'E. Operations'}
            </Typography>
            <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary }}>
              High surge demand detected in Financial District (+42%). Optimal positioning active.
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => navigate('/live-map')}
            sx={{
              backgroundColor: VELOUR_TOKENS.accentPrimary,
              fontWeight: 700,
              px: 3,
              py: 1.2,
            }}
          >
            Launch Live Map
          </Button>
        </Box>

        {/* KPI Strip */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <KpiCard
              title="TOTAL EARNINGS"
              value={`$${driver?.total_earnings?.toLocaleString() || '14,250.00'}`}
              change="+18.4% vs last week"
              icon={<AttachMoneyIcon />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KpiCard
              title="ACCEPTANCE RATE"
              value={`${driver?.acceptance_rate || 98.0}%`}
              change="Top 2% Fleet Tier"
              accentColor={VELOUR_TOKENS.accentLavender}
              icon={<SpeedIcon />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KpiCard
              title="DRIVER RATING"
              value={`${driver?.rating || 4.96}`}
              change="1,284 completed trips"
              accentColor={VELOUR_TOKENS.accentGold}
              icon={<StarIcon />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KpiCard
              title="TOTAL TRIPS"
              value={`${driver?.total_trips || 1284}`}
              change="98.8% Completion"
              icon={<LocalTaxiIcon />}
            />
          </Grid>
        </Grid>

        {/* Charts & Radar Grid */}
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <EarningsChart />
          </Grid>
          <Grid item xs={12} lg={4}>
            <DemandSurgeRadar zones={zones || []} onSelectZone={() => navigate('/live-map')} />
          </Grid>
        </Grid>
      </Container>
    </PageShell>
  );
};
