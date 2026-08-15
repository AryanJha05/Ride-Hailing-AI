import React from 'react';
import {
  Grid,
  Box,
  Card,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { PageShell } from '../../components/layout/PageShell';
import { VELOUR_TOKENS } from '../../theme/palette';
import { useSystemHealth } from '../../hooks/useRideApi';

export const AdminDashboard: React.FC = () => {
  const { data: health } = useSystemHealth();

  const volumeTrendData = [
    { time: '00:00', predicted: 420, actual: 410 },
    { time: '04:00', predicted: 280, actual: 295 },
    { time: '08:00', predicted: 890, actual: 915 },
    { time: '12:00', predicted: 650, actual: 640 },
    { time: '16:00', predicted: 1120, actual: 1150 },
    { time: '20:00', predicted: 940, actual: 920 },
  ];

  return (
    <PageShell title="Admin Operations Dashboard">
      <Grid container spacing={3}>
        {/* Top 12-col NOC Live Status Strip */}
        <Grid item xs={12}>
          <Card sx={{ p: 2.5, backgroundColor: VELOUR_TOKENS.bgSurface1 }}>
            <Grid container spacing={2} textAlign="center">
              {[
                { label: 'ACTIVE DRIVERS', val: health?.active_drivers?.toLocaleString() || '14,921', color: VELOUR_TOKENS.accentTeal },
                { label: 'ACTIVE RIDES', val: health?.active_rides?.toLocaleString() || '3,842', color: '#FFF' },
                { label: 'SYSTEM UPTIME', val: health?.system_uptime || '99.98%', color: VELOUR_TOKENS.success },
                { label: 'AVG MODEL LATENCY', val: `${health?.avg_model_latency_ms || 14.2} ms`, color: VELOUR_TOKENS.accentLavender },
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

        {/* Bento Row 1: Live System Map (8 cols) & Demand Overview (4 cols) */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: 320, p: 3, position: 'relative', overflow: 'hidden', backgroundColor: '#0D1117' }}>
            <Typography variant="subtitle2" sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 600, fontSize: 13, mb: 2 }}>
              Live Network Density Map
            </Typography>

            <Box
              sx={{
                width: '100%',
                height: 230,
                borderRadius: 2,
                backgroundImage: 'radial-gradient(circle at 40% 40%, rgba(124, 58, 237, 0.25) 0%, rgba(0, 217, 192, 0.15) 30%, rgba(10, 10, 13, 0.95) 75%)',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                position: 'relative',
              }}
            >
              <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, letterSpacing: '0.08em' }}>
                14,921 UNITS DISPATCHED & ACTIVE
              </Typography>
            </Box>
          </Card>
        </Grid>

        {/* Model Health (4 cols) */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: 320, p: 3 }}>
            <Typography variant="subtitle2" sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 600, fontSize: 13, mb: 2 }}>
              ML Model Health & Services
            </Typography>

            <List disablePadding>
              {[
                { name: 'Trip Duration (Student A)', status: 'OPERATIONAL', latency: '12ms' },
                { name: 'Demand Zone (Student B)', status: 'OPERATIONAL', latency: '18ms' },
                { name: 'Demand Forecast (Student C)', status: 'OPERATIONAL', latency: '14ms' },
                { name: 'Ollama LLM (Gemma2)', status: 'HEALTHY', latency: '140ms' },
              ].map((service, idx) => (
                <ListItem key={idx} sx={{ px: 0, py: 1.2, borderBottom: `1px solid ${VELOUR_TOKENS.borderSubtle}` }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckCircleIcon sx={{ color: VELOUR_TOKENS.success, fontSize: 18 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={service.name}
                    secondary={`Latency: ${service.latency}`}
                    primaryTypographyProps={{ fontSize: 13, fontWeight: 600, color: '#FFF' }}
                    secondaryTypographyProps={{ fontSize: 11, color: VELOUR_TOKENS.textSecondary, fontFamily: VELOUR_TOKENS.fontMono }}
                  />
                  <Chip
                    label={service.status}
                    size="small"
                    sx={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: VELOUR_TOKENS.success, fontSize: 10, fontWeight: 700 }}
                  />
                </ListItem>
              ))}
            </List>
          </Card>
        </Grid>

        {/* Bento Row 2: Driver Growth (6 cols) & Alerts (6 cols) */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle2" sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 600, fontSize: 13 }}>
                Active Driver Growth
              </Typography>
              <Chip label="+4.2% WoW" size="small" sx={{ backgroundColor: VELOUR_TOKENS.accentPrimaryDim, color: VELOUR_TOKENS.accentLavender, fontSize: 11, fontWeight: 600 }} />
            </Box>

            <Box sx={{ width: '100%', height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={volumeTrendData}>
                  <XAxis dataKey="time" stroke={VELOUR_TOKENS.textTertiary} fontSize={11} />
                  <YAxis stroke={VELOUR_TOKENS.textTertiary} fontSize={11} />
                  <Area type="monotone" dataKey="actual" stroke={VELOUR_TOKENS.accentTeal} fill="rgba(0,217,192,0.15)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="subtitle2" sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 600, fontSize: 13, mb: 2 }}>
              System Alerts & Anomalies
            </Typography>

            <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {[
                { title: 'Surge Anomaly Detected', desc: 'Midtown Manhattan demand spiked by +350% above baseline.', border: VELOUR_TOKENS.warning },
                { title: 'API Rate Threshold Normal', desc: 'Gateway processing 1,420 req/sec within nominal bounds.', border: VELOUR_TOKENS.accentTeal },
              ].map((alert, idx) => (
                <Box
                  key={idx}
                  sx={{
                    p: 2,
                    backgroundColor: VELOUR_TOKENS.bgSurface2,
                    borderLeft: `4px solid ${alert.border}`,
                    borderRadius: '0 8px 8px 0',
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#FFF', fontSize: 13 }}>
                    {alert.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 12 }}>
                    {alert.desc}
                  </Typography>
                </Box>
              ))}
            </List>
          </Card>
        </Grid>

        {/* Bottom 12-col Chart: Ride Volume Trend (Predicted vs Actual) */}
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Typography variant="subtitle2" sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 600, fontSize: 13, mb: 2 }}>
              System Ride Volume Trend (Predicted vs. Actual Network Demand)
            </Typography>

            <Box sx={{ width: '100%', height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={volumeTrendData}>
                  <XAxis dataKey="time" stroke={VELOUR_TOKENS.textTertiary} fontSize={12} />
                  <YAxis stroke={VELOUR_TOKENS.textTertiary} fontSize={12} />
                  <RechartsTooltip contentStyle={{ backgroundColor: VELOUR_TOKENS.bgSurface2, color: '#FFF' }} />
                  <Line type="monotone" dataKey="predicted" stroke={VELOUR_TOKENS.accentPrimary} strokeDasharray="5 5" strokeWidth={2} name="Predicted" />
                  <Line type="monotone" dataKey="actual" stroke="#FFF" strokeWidth={2} name="Actual" />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </PageShell>
  );
};
