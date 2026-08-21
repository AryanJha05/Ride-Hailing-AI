import React from 'react';
import {
  Grid,
  Box,
  Card,
  Typography,
  Chip,
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BuildIcon from '@mui/icons-material/Build';
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { PageShell } from '../../components/layout/PageShell';
import { VELOUR_TOKENS } from '../../theme/palette';
import { useSystemHealth } from '../../hooks/useRideApi';

export const AdminFleetPage: React.FC = () => {
  const { data: healthRes } = useSystemHealth();

  const fleetSummaryStats = [
    { label: 'TOTAL REGISTERED FLEET', val: '—', sub: 'Fleet Backend Not Connected', color: VELOUR_TOKENS.textSecondary, icon: <LocalTaxiIcon sx={{ color: VELOUR_TOKENS.accentLavender }} /> },
    { label: 'ACTIVE DISPATCHED DRIVERS', val: healthRes?.active_drivers ? healthRes.active_drivers.toLocaleString() : '—', sub: healthRes?.active_drivers ? 'Live Database Active' : 'No Live Telemetry', color: VELOUR_TOKENS.accentTeal, icon: <DirectionsCarIcon sx={{ color: VELOUR_TOKENS.accentTeal }} /> },
    { label: 'STAGED IN ZONES', val: '—', sub: 'Zone Staging Pending', color: VELOUR_TOKENS.textSecondary, icon: <CheckCircleIcon sx={{ color: VELOUR_TOKENS.textSecondary }} /> },
    { label: 'IN MAINTENANCE', val: '—', sub: 'Telematics Unavailable', color: VELOUR_TOKENS.textSecondary, icon: <BuildIcon sx={{ color: VELOUR_TOKENS.textSecondary }} /> },
  ];

  return (
    <PageShell title="Fleet Operations Management">
      <Grid container spacing={3}>
        {/* Fleet Metric Strip */}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {fleetSummaryStats.map((stat, idx) => (
              <Grid item xs={6} md={3} key={idx}>
                <Card sx={{ p: 2.5, backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 700, letterSpacing: '0.06em' }}>
                      {stat.label}
                    </Typography>
                    {stat.icon}
                  </Box>
                  <Typography className="mono-num" variant="h4" sx={{ fontWeight: 700, color: stat.color, mt: 1 }}>
                    {stat.val}
                  </Typography>
                  <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textTertiary, mt: 0.5, display: 'block' }}>
                    {stat.sub}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Fleet Status Container */}
        <Grid item xs={12}>
          <Card sx={{ p: 4, backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle, textAlign: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 4 }}>
              <Box sx={{ p: 2, borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.04)', mb: 2 }}>
                <InfoOutlinedIcon sx={{ color: VELOUR_TOKENS.accentLavender, fontSize: 40 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFF', mb: 1 }}>
                Fleet Telemetry & Vehicle Service Unavailable
              </Typography>
              <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary, maxWidth: 480, mb: 3 }}>
                Vehicle-level telematics, maintenance tracking, and per-borough fleet distribution APIs are not connected to live hardware telemetry.
              </Typography>
              <Chip
                label="Fleet Management API Pending Integration"
                sx={{ backgroundColor: VELOUR_TOKENS.bgSurface2, color: VELOUR_TOKENS.accentGold, fontWeight: 600, border: `1px solid ${VELOUR_TOKENS.borderSubtle}` }}
              />
            </Box>
          </Card>
        </Grid>
      </Grid>
    </PageShell>
  );
};
