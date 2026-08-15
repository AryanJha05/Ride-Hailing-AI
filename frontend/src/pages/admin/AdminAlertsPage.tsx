import React from 'react';
import {
  Grid,
  Box,
  Card,
  Typography,
  Chip,
  List,
  Button,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { PageShell } from '../../components/layout/PageShell';
import { VELOUR_TOKENS } from '../../theme/palette';

export const AdminAlertsPage: React.FC = () => {
  const alertsList = [
    {
      id: 'ALT-401',
      severity: 'CRITICAL',
      title: 'Surge Demand Anomaly Spike Detected',
      desc: 'Midtown Manhattan (Zone 161) trip requests spiked by +350% above 30-day baseline in under 15 minutes.',
      time: '4 mins ago',
      source: 'XGBoost Demand Classifier',
      color: '#FF5252',
      icon: <ErrorOutlineIcon sx={{ color: '#FF5252' }} />,
    },
    {
      id: 'ALT-398',
      severity: 'WARNING',
      title: 'API Gateway Latency Transient Warning',
      desc: 'Gateway p99 response time momentarily hit 182ms during peak batch trip dispatch sync.',
      time: '28 mins ago',
      source: 'FastAPI Gateway',
      color: VELOUR_TOKENS.warning,
      icon: <WarningAmberIcon sx={{ color: VELOUR_TOKENS.warning }} />,
    },
    {
      id: 'ALT-395',
      severity: 'INFO',
      title: 'Ollama LLM Model Health Verification Passed',
      desc: 'Gemma-2-9B model state validated with zero memory leaks and stable 140ms response latency.',
      time: '1 hour ago',
      source: 'Ollama Health Monitor',
      color: VELOUR_TOKENS.accentTeal,
      icon: <InfoOutlinedIcon sx={{ color: VELOUR_TOKENS.accentTeal }} />,
    },
    {
      id: 'ALT-392',
      severity: 'RESOLVED',
      title: 'JFK Airport Terminal 2 Driver Supply Deficit Resolved',
      desc: 'Automated dispatch staged +120 drivers to JFK T2, reducing passenger queue wait time to 1.8 mins.',
      time: '2 hours ago',
      source: 'Auto-Dispatcher',
      color: VELOUR_TOKENS.success,
      icon: <CheckCircleOutlineIcon sx={{ color: VELOUR_TOKENS.success }} />,
    },
  ];

  return (
    <PageShell title="NOC Operational & System Alerts">
      <Grid container spacing={3}>
        {/* Alert Stats Strip */}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {[
              { label: 'ACTIVE UNRESOLVED ALERTS', val: '2 ALERTS', color: '#FF5252' },
              { label: 'CRITICAL SEVERITY', val: '1 CRITICAL', color: '#FF5252' },
              { label: 'WARNING SEVERITY', val: '1 WARNING', color: VELOUR_TOKENS.warning },
              { label: 'RESOLVED TODAY', val: '42 RESOLVED', color: VELOUR_TOKENS.success },
            ].map((stat, idx) => (
              <Grid item xs={6} md={3} key={idx}>
                <Card sx={{ p: 2.5, backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle }}>
                  <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 700, letterSpacing: '0.06em' }}>
                    {stat.label}
                  </Typography>
                  <Typography className="mono-num" variant="h5" sx={{ fontWeight: 700, color: stat.color, mt: 1 }}>
                    {stat.val}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Alerts Log List */}
        <Grid item xs={12}>
          <Card sx={{ p: 3, backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFF', fontSize: 16 }}>
                Real-Time System Signal Log
              </Typography>
              <Chip label="Live NOC Telemetry" size="small" sx={{ backgroundColor: 'rgba(0, 217, 192, 0.1)', color: VELOUR_TOKENS.accentTeal, fontSize: 11, fontWeight: 600 }} />
            </Box>

            <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {alertsList.map((alert) => (
                <Box
                  key={alert.id}
                  sx={{
                    p: 2.5,
                    backgroundColor: VELOUR_TOKENS.bgSurface2,
                    borderLeft: `4px solid ${alert.color}`,
                    borderRadius: '0 8px 8px 0',
                    borderTop: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
                    borderRight: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
                    borderBottom: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      {alert.icon}
                      <Typography variant="body1" sx={{ fontWeight: 700, color: '#FFF', fontSize: 15 }}>
                        {alert.title}
                      </Typography>
                      <Chip label={alert.severity} size="small" sx={{ backgroundColor: `${alert.color}20`, color: alert.color, fontSize: 10, fontWeight: 700 }} />
                    </Box>
                    <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textTertiary, fontFamily: VELOUR_TOKENS.fontMono }}>
                      {alert.time} • Source: {alert.source}
                    </Typography>
                  </Box>

                  <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary, pl: 4 }}>
                    {alert.desc}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 0.5 }}>
                    <Button variant="outlined" size="small" sx={{ borderColor: VELOUR_TOKENS.borderSubtle, color: VELOUR_TOKENS.textSecondary, textTransform: 'none', fontSize: 12 }}>
                      Acknowledge
                    </Button>
                    {alert.severity === 'CRITICAL' && (
                      <Button variant="contained" size="small" color="error" sx={{ textTransform: 'none', fontSize: 12, fontWeight: 700 }}>
                        Dispatch Mitigation Team
                      </Button>
                    )}
                  </Box>
                </Box>
              ))}
            </List>
          </Card>
        </Grid>
      </Grid>
    </PageShell>
  );
};
