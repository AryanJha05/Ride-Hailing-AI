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

export const DriverEarningsPage: React.FC = () => {
  const { user } = useAuth();
  const { data: driver } = useDriverPerformance('driver-001');

  const shiftEarnings = driver?.projected_shift_earnings || 0;
  const recentTrips = driver?.recent_trips || [];

  return (
    <PageShell title="Driver Earnings & Shift Payouts">
      <Grid container spacing={3}>
        {/* Earnings Summary Cards */}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {[
              { label: 'PROJECTED SHIFT EARNINGS', val: `$${shiftEarnings.toFixed(2)}`, color: VELOUR_TOKENS.accentTeal, sub: 'Calculated from completed shifts' },
              { label: 'COMPLETED SHIFT TRIPS', val: driver?.total_trips !== undefined ? driver.total_trips.toLocaleString() : '—', color: '#FFF', sub: 'Database Logged Trips' },
              { label: 'DRIVER RATING', val: driver?.rating ? `${driver.rating} ★` : '—', color: VELOUR_TOKENS.accentGold, sub: 'Passenger feedback score' },
              { label: 'ACCEPTANCE RATE', val: driver?.acceptance_rate ? `${driver.acceptance_rate}%` : '—', color: VELOUR_TOKENS.accentLavender, sub: 'Real-time dispatch rate' },
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
              <Chip label="Database Verified" size="small" sx={{ backgroundColor: 'rgba(0,217,192,0.1)', color: VELOUR_TOKENS.accentTeal, fontWeight: 700 }} />
            </Box>

            <Box sx={{ p: 2.5, borderRadius: 2, backgroundColor: VELOUR_TOKENS.bgSurface2, border: `1px solid ${VELOUR_TOKENS.borderSubtle}`, my: 2 }}>
              <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary, mb: 1 }}>
                Logged-in Driver: <Box component="span" sx={{ color: '#FFF', fontWeight: 700 }}>{driver?.name || user?.name || 'Driver Account'}</Box>
              </Typography>
              <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary }}>
                Account Email: <Box component="span" sx={{ color: VELOUR_TOKENS.accentLavender }}>{driver?.email || user?.email || 'driver@rideai.nyc'}</Box>
              </Typography>
            </Box>

            <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textTertiary, display: 'block' }}>
              All trip duration estimates and fares are verified against Student A's XGBoost V3 Trip Duration model.
            </Typography>
          </Card>
        </Grid>

        {/* Recent Trip Activity Log */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFF', fontSize: 16, mb: 2 }}>
              Recent Completed Trips Log
            </Typography>

            {recentTrips.length === 0 ? (
              <Box sx={{ p: 3, textAlign: 'center', backgroundColor: VELOUR_TOKENS.bgSurface2, borderRadius: 2 }}>
                <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary }}>
                  No completed trip records found for current shift.
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
                      justify: 'space-between',
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
