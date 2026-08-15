import React from 'react';
import {
  Grid,
  Box,
  Card,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';
import { PageShell } from '../../components/layout/PageShell';
import { VELOUR_TOKENS } from '../../theme/palette';
import { useSystemHealth } from '../../hooks/useRideApi';

export const AdminDashboard: React.FC = () => {
  const { data: health } = useSystemHealth();

  const networkGrowthData = [
    { time: '00:00', active: 11200 },
    { time: '04:00', active: 8900 },
    { time: '08:00', active: 16500 },
    { time: '12:00', active: 14200 },
    { time: '16:00', active: 18900 },
    { time: '20:00', active: 15400 },
  ];

  return (
    <PageShell title="NOC Operations Overview">
      <Grid container spacing={3}>
        {/* Top 12-col NOC Telemetry Summary Strip */}
        <Grid item xs={12}>
          <Card sx={{ p: 2.5, backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle }}>
            <Grid container spacing={2} textAlign="center">
              {[
                { label: 'ACTIVE DRIVERS', val: health?.active_drivers?.toLocaleString() || '14,921', color: VELOUR_TOKENS.accentTeal },
                { label: 'ACTIVE RIDES IN FLIGHT', val: health?.active_rides?.toLocaleString() || '3,842', color: '#FFF' },
                { label: 'NETWORK UPTIME', val: health?.system_uptime || '99.98%', color: VELOUR_TOKENS.success },
                { label: 'AVG ML LATENCY', val: `${health?.avg_model_latency_ms || 14.2} ms`, color: VELOUR_TOKENS.accentLavender },
              ].map((stat, idx) => (
                <Grid item xs={6} md={3} key={idx}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10, color: `${stat.color} !important` }} />
                    <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, letterSpacing: '0.06em', fontWeight: 600 }}>
                      {stat.label}
                    </Typography>
                  </Box>
                  <Typography className="mono-num" variant="h5" sx={{ fontWeight: 700, color: stat.color, mt: 0.5 }}>
                    {stat.val}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Card>
        </Grid>

        {/* High-Level Network Summary & Density Map Widget */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: 340, p: 3, backgroundColor: '#0D1117', borderColor: VELOUR_TOKENS.borderSubtle, position: 'relative' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle2" sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 600, fontSize: 13 }}>
                NYC Metro Real-Time Network Density Summary
              </Typography>
              <Chip label="14,921 Units Dispatched" size="small" sx={{ backgroundColor: 'rgba(0, 217, 192, 0.1)', color: VELOUR_TOKENS.accentTeal, fontSize: 11, fontWeight: 600 }} />
            </Box>

            <Box
              sx={{
                width: '100%',
                height: 240,
                borderRadius: 2,
                backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(124, 58, 237, 0.25) 0%, rgba(0, 217, 192, 0.15) 35%, rgba(10, 10, 13, 0.95) 80%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                border: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
                p: 3,
                textAlign: 'center',
              }}
            >
              <SecurityIcon sx={{ color: VELOUR_TOKENS.accentTeal, fontSize: 36, mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFF' }}>
                All 5 NYC Boroughs Operating Nominally
              </Typography>
              <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary, maxWidth: 500, mt: 0.5 }}>
                Manhattan, Brooklyn, Queens, Bronx, and Staten Island fleet grids synced to Ollama LLM dispatch.
              </Typography>
            </Box>
          </Card>
        </Grid>

        {/* Quick System Health Overview */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: 340, p: 3, backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle }}>
            <Typography variant="subtitle2" sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 600, fontSize: 13, mb: 2 }}>
              High-Level NOC Health
            </Typography>

            <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {[
                { title: 'Core API Gateway', status: 'ONLINE', detail: 'Latency 4.1ms', icon: <CheckCircleOutlineIcon sx={{ color: VELOUR_TOKENS.success }} /> },
                { title: 'Ollama Gemma2 LLM', status: 'HEALTHY', detail: 'Latency 142ms', icon: <SpeedIcon sx={{ color: VELOUR_TOKENS.accentLavender }} /> },
                { title: 'XGBoost Forecast Engine', status: 'ACTIVE', detail: 'MAPE 5.8%', icon: <TrendingUpIcon sx={{ color: VELOUR_TOKENS.accentTeal }} /> },
              ].map((item, idx) => (
                <Box key={idx} sx={{ p: 2, borderRadius: 2, backgroundColor: VELOUR_TOKENS.bgSurface2, border: `1px solid ${VELOUR_TOKENS.borderSubtle}` }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#FFF' }}>
                      {item.title}
                    </Typography>
                    <Chip label={item.status} size="small" sx={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: VELOUR_TOKENS.success, fontSize: 10, fontWeight: 700 }} />
                  </Box>
                  <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontFamily: VELOUR_TOKENS.fontMono }}>
                    {item.detail}
                  </Typography>
                </Box>
              ))}
            </List>
          </Card>
        </Grid>

        {/* Active Driver Network Volume Trend */}
        <Grid item xs={12}>
          <Card sx={{ p: 3, backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle2" sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 600, fontSize: 13 }}>
                24-Hour Active Driver Network Utilization Trend
              </Typography>
              <Chip label="Peak 18,900 Drivers" size="small" sx={{ backgroundColor: VELOUR_TOKENS.accentPrimaryDim, color: VELOUR_TOKENS.accentLavender, fontSize: 11, fontWeight: 600 }} />
            </Box>

            <Box sx={{ width: '100%', height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={networkGrowthData}>
                  <XAxis dataKey="time" stroke={VELOUR_TOKENS.textTertiary} fontSize={11} />
                  <YAxis stroke={VELOUR_TOKENS.textTertiary} fontSize={11} />
                  <RechartsTooltip contentStyle={{ backgroundColor: VELOUR_TOKENS.bgSurface2, color: '#FFF' }} />
                  <Area type="monotone" dataKey="active" stroke={VELOUR_TOKENS.accentTeal} fill="rgba(0, 217, 192, 0.15)" strokeWidth={2} name="Active Units" />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </PageShell>
  );
};
