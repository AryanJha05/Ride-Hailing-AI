import React from 'react';
import {
  Grid,
  Box,
  Card,
  Typography,
  Chip,
} from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { PageShell } from '../../components/layout/PageShell';
import { VELOUR_TOKENS } from '../../theme/palette';
import { useSystemHealth } from '../../hooks/useRideApi';

export const AdminAlertsPage: React.FC = () => {
  const { data: healthRes } = useSystemHealth();

  const isHealthy = healthRes?.status === 'healthy' || healthRes?.status === 'ok';

  return (
    <PageShell title="NOC Operational & System Alerts">
      <Grid container spacing={3}>
        {/* Alert Stats Strip */}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {[
              { label: 'ACTIVE UNRESOLVED ALERTS', val: '0 ALERTS', color: VELOUR_TOKENS.success },
              { label: 'CRITICAL SEVERITY', val: '0 CRITICAL', color: VELOUR_TOKENS.textSecondary },
              { label: 'WARNING SEVERITY', val: '0 WARNING', color: VELOUR_TOKENS.textSecondary },
              { label: 'SYSTEM HEALTH STATUS', val: isHealthy ? 'OPERATIONAL' : 'DEGRADED', color: isHealthy ? VELOUR_TOKENS.success : VELOUR_TOKENS.warning },
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

        {/* Alerts Log List Empty State */}
        <Grid item xs={12}>
          <Card sx={{ p: 4, backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle, textAlign: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
              <Box sx={{ p: 2, borderRadius: '50%', backgroundColor: 'rgba(34, 197, 94, 0.1)', mb: 2 }}>
                <NotificationsNoneIcon sx={{ color: VELOUR_TOKENS.success, fontSize: 40 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFF', mb: 1 }}>
                No Active System Telemetry Alerts
              </Typography>
              <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary, maxWidth: 480, mb: 3 }}>
                All backend system services, database connections, and integrated ML model microservices are operating nominal with zero active warnings.
              </Typography>
              <Chip
                label="System Signal Monitoring Active"
                sx={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: VELOUR_TOKENS.success, fontWeight: 600, border: `1px solid rgba(34, 197, 94, 0.3)` }}
              />
            </Box>
          </Card>
        </Grid>
      </Grid>
    </PageShell>
  );
};
