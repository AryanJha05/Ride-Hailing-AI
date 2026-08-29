import React from 'react';
import {
  Grid,
  Box,
  Card,
  Typography,
  Chip,
  List,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { PageShell } from '../../components/layout/PageShell';
import { VELOUR_TOKENS } from '../../theme/palette';
import { useDriverPerformance } from '../../hooks/useRideApi';
import { useAuth } from '../../auth/AuthContext';
import { APP_ENV } from '../../config/envConfig';

export const DriverEarningsPage: React.FC = () => {
  const { user } = useAuth();
  const { data: driver } = useDriverPerformance();

  const shiftEarnings = driver?.projected_shift_earnings || 0;
  const recentTrips = driver?.recent_trips || [];

  return (
    <PageShell title="Driver Earnings & Shift Payouts">
      <Grid container spacing={3}>
        {/* Earnings Summary Cards */}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {[
              {
                label: 'PROJECTED SHIFT EARNINGS',
                val: `$${shiftEarnings.toFixed(2)}`,
                color: VELOUR_TOKENS.accentTeal,
                sub: APP_ENV.labels.demoEstimate,
              },
              {
                label: 'COMPLETED SHIFT TRIPS',
                val: driver?.total_trips !== undefined ? driver.total_trips.toLocaleString() : '—',
                color: '#FFF',
                sub: APP_ENV.labels.sampleRecords,
              },
              {
                label: 'DRIVER RATING',
                val: driver?.rating ? `${driver.rating} ★` : '—',
                color: VELOUR_TOKENS.accentGold,
                sub: APP_ENV.labels.demoFeedback,
              },
              {
                label: 'ACCEPTANCE RATE',
                val: driver?.acceptance_rate ? `${driver.acceptance_rate}%` : '—',
                color: VELOUR_TOKENS.accentLavender,
                sub: APP_ENV.labels.demoDispatch,
              },
            ].map((stat, idx) => (
              <Grid item xs={6} md={3} key={idx}>
                <Card sx={{ p: 2.5, backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle }}>
                  <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 700, letterSpacing: '0.06em' }}>
                    {stat.label}
                  </Typography>
                  <Typography className="mono-num" variant="h4" sx={{ fontWeight: 700, color: stat.color, mt: 0.5 }}>
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

        {/* Shift Summary Card */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmojiEventsIcon sx={{ color: VELOUR_TOKENS.accentGold, fontSize: 24 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFF', fontSize: 16 }}>
                  Driver Telemetry Overview
                </Typography>
              </Box>
              <Chip
                label={APP_ENV.labels.sampleDataBadge}
                size="small"
                sx={{
                  backgroundColor: 'rgba(234, 179, 8, 0.12)',
                  color: VELOUR_TOKENS.accentGold,
                  border: '1px solid rgba(234, 179, 8, 0.3)',
                  fontWeight: 700,
                  fontSize: 10,
                }}
              />
            </Box>

            <Box sx={{ p: 2.5, borderRadius: 2, backgroundColor: VELOUR_TOKENS.bgSurface2, border: `1px solid ${VELOUR_TOKENS.borderSubtle}`, my: 2 }}>
              <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary, mb: 1 }}>
                Active Driver:{' '}
                <Box component="span" sx={{ color: '#FFF', fontWeight: 700 }}>
                  {user?.name || driver?.name || 'Aryan Jha'}
                </Box>
              </Typography>
              <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary }}>
                Account Email:{' '}
                <Box component="span" sx={{ color: VELOUR_TOKENS.accentLavender }}>
                  {driver?.email || user?.email || APP_ENV.labels.demoAccountDefault}
                </Box>
              </Typography>
            </Box>

            <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textTertiary, display: 'block' }}>
              All trip duration estimates and fares demonstrate model predictions on sample shift data.
            </Typography>
          </Card>
        </Grid>

        {/* Recent Trip Activity Log */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFF', fontSize: 16 }}>
                {APP_ENV.labels.sampleTripsHeader}
              </Typography>
              <Chip
                label="DEMO RECORDS"
                size="small"
                sx={{
                  backgroundColor: 'rgba(0, 217, 192, 0.08)',
                  color: VELOUR_TOKENS.accentTeal,
                  border: '1px solid rgba(0, 217, 192, 0.25)',
                  fontSize: 10,
                  fontWeight: 700,
                }}
              />
            </Box>

            {recentTrips.length === 0 ? (
              <Box sx={{ p: 3, textAlign: 'center', backgroundColor: VELOUR_TOKENS.bgSurface2, borderRadius: 2 }}>
                <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary }}>
                  No sample trip records found for current shift.
                </Typography>
              </Box>
            ) : (
              <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {recentTrips.map((trip) => (
                  <Box
                    key={trip.id}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: VELOUR_TOKENS.bgSurface2,
                      border: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#FFF' }}>
                        {trip.zone}
                      </Typography>
                      <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textTertiary, fontFamily: VELOUR_TOKENS.fontMono }}>
                        {trip.id} • {trip.date} • {trip.duration}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography className="mono-num" variant="subtitle1" sx={{ fontWeight: 700, color: VELOUR_TOKENS.accentTeal }}>
                        {trip.fare}
                      </Typography>
                      <Chip label={`★ ${trip.rating}`} size="small" sx={{ backgroundColor: 'rgba(234, 179, 8, 0.12)', color: VELOUR_TOKENS.accentGold, fontSize: 10, fontWeight: 700 }} />
                    </Box>
                  </Box>
                ))}
              </List>
            )}
          </Card>
        </Grid>
      </Grid>
    </PageShell>
  );
};

