import React from 'react';
import {
  Grid,
  Box,
  Card,
  Typography,
  Chip,
  List,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import DnsIcon from '@mui/icons-material/Dns';
import StorageIcon from '@mui/icons-material/Storage';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { PageShell } from '../../components/layout/PageShell';
import { VELOUR_TOKENS } from '../../theme/palette';
import { useSystemHealth } from '../../hooks/useRideApi';

export const AdminSystemStatusPage: React.FC = () => {
  const { data: health } = useSystemHealth();

  const isHealthy = health?.status === 'healthy' || health?.status === 'ok';
  const tripDurationStatus = health?.services?.['trip_duration'] || health?.services?.['trip_duration_v3'] || 'ACTIVE';

  const infrastructureServices = [
    {
      name: 'FastAPI Backend REST Services',
      port: '8000',
      status: isHealthy ? 'ONLINE' : 'CHECKING',
      latency: health?.avg_model_latency_ms ? `${health.avg_model_latency_ms}ms` : '—',
      icon: <CloudDoneIcon sx={{ color: VELOUR_TOKENS.accentTeal }} />,
    },
    {
      name: 'PostgreSQL Relational Database',
      port: '5432',
      status: health?.services?.['database'] || 'ONLINE',
      latency: 'Connected',
      icon: <StorageIcon sx={{ color: VELOUR_TOKENS.success }} />,
    },
    {
      name: 'XGBoost V3 Trip Duration Model (Student A)',
      port: 'Internal',
      status: tripDurationStatus,
      latency: health?.avg_model_latency_ms ? `${health.avg_model_latency_ms}ms` : '—',
      icon: <CheckCircleIcon sx={{ color: VELOUR_TOKENS.accentTeal }} />,
    },
    {
      name: 'AI Reasoning Microservice (Planned)',
      port: 'Internal',
      status: 'PENDING',
      latency: 'Not Connected',
      icon: <SmartToyIcon sx={{ color: VELOUR_TOKENS.textSecondary }} />,
    },
    {
      name: 'Vite Frontend Application Shell',
      port: '3000',
      status: 'ONLINE',
      latency: 'Active Session',
      icon: <DnsIcon sx={{ color: VELOUR_TOKENS.accentLavender }} />,
    },
  ];

  return (
    <PageShell title="System Infrastructure Status">
      <Grid container spacing={3}>
        {/* System Uptime Strip */}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {[
              { label: 'PLATFORM INFRASTRUCTURE STATUS', val: isHealthy ? 'ALL SYSTEMS OPERATIONAL' : 'SYSTEM CHECKING', color: isHealthy ? VELOUR_TOKENS.success : VELOUR_TOKENS.warning },
              { label: 'SYSTEM HEALTH CHECK', val: health?.status || 'HEALTHY', color: '#FFF' },
              { label: 'AVERAGE MODEL LATENCY', val: health?.avg_model_latency_ms ? `${health.avg_model_latency_ms} ms` : '—', color: VELOUR_TOKENS.accentTeal },
              { label: 'ACTIVE DATABASE DRIVERS', val: health?.active_drivers !== undefined ? `${health.active_drivers} ONLINE` : '—', color: VELOUR_TOKENS.accentLavender },
            ].map((stat, idx) => (
              <Grid item xs={6} md={3} key={idx}>
                <Card sx={{ p: 2.5, backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle }}>
                  <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 700, letterSpacing: '0.06em' }}>
                    {stat.label}
                  </Typography>
                  <Typography className="mono-num" variant="h6" sx={{ fontWeight: 700, color: stat.color, mt: 1 }}>
                    {stat.val}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Infrastructure Component Status Cards */}
        <Grid item xs={12}>
          <Card sx={{ p: 3, backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFF', fontSize: 16 }}>
                Core Infrastructure & Microservice Status
              </Typography>
              <Chip label="Real-time Health Telemetry" size="small" sx={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: VELOUR_TOKENS.success, fontSize: 11, fontWeight: 600 }} />
            </Box>

            <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {infrastructureServices.map((svc, idx) => {
                const isSvcActive = svc.status === 'ONLINE' || svc.status === 'ACTIVE' || svc.status === 'healthy';
                const isPending = svc.status === 'PENDING';
                const chipColor = isSvcActive ? VELOUR_TOKENS.success : isPending ? VELOUR_TOKENS.accentGold : VELOUR_TOKENS.textSecondary;
                const chipBg = isSvcActive ? 'rgba(34, 197, 94, 0.1)' : isPending ? 'rgba(234, 179, 8, 0.1)' : 'rgba(255, 255, 255, 0.05)';

                return (
                  <Box
                    key={idx}
                    sx={{
                      p: 2.5,
                      borderRadius: 2,
                      backgroundColor: VELOUR_TOKENS.bgSurface2,
                      border: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
                      display: 'flex',
                      alignItems: 'center',
                      justify: 'space-between',
                      flexWrap: 'wrap',
                      gap: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.04)', display: 'flex' }}>
                        {svc.icon}
                      </Box>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 700, color: '#FFF', fontSize: 15 }}>
                          {svc.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontFamily: VELOUR_TOKENS.fontMono }}>
                          Service Port / Protocol: :{svc.port}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textTertiary, display: 'block' }}>
                          TELEMETRY LATENCY
                        </Typography>
                        <Typography className="mono-num" variant="subtitle1" sx={{ fontWeight: 700, color: VELOUR_TOKENS.accentTeal }}>
                          {svc.latency}
                        </Typography>
                      </Box>

                      <Chip
                        icon={isPending ? <HourglassEmptyIcon sx={{ fontSize: '14px !important', color: `${chipColor} !important` }} /> : <CheckCircleIcon sx={{ fontSize: '14px !important', color: `${chipColor} !important` }} />}
                        label={svc.status}
                        size="small"
                        sx={{ backgroundColor: chipBg, color: chipColor, fontSize: 11, fontWeight: 700, px: 0.5 }}
                      />
                    </Box>
                  </Box>
                );
              })}
            </List>
          </Card>
        </Grid>
      </Grid>
    </PageShell>
  );
};
