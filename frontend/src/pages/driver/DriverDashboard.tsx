import React, { useState } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Paper,
} from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useNavigate } from 'react-router-dom';
import { PageShell } from '../../components/layout/PageShell';
import { ROUTES } from '../../routes/routes';
import { KpiCard } from '../../components/dashboard/KpiCard';
import { EarningsChart } from '../../components/dashboard/EarningsChart';
import { DemandSurgeRadar } from '../../components/dashboard/DemandSurgeRadar';
import { TripDurationPredictorCard } from '../../components/dashboard/TripDurationPredictorCard';
import { useDemandZones, useDriverPerformance } from '../../hooks/useRideApi';
import { useAuth } from '../../auth/AuthContext';
import { VELOUR_TOKENS } from '../../theme/palette';

export const DriverDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: zones } = useDemandZones();
  const { data: perfRes } = useDriverPerformance();

  return (
    <PageShell title="Dashboard">
      <Box
        sx={{
          width: '100%',
          maxWidth: '100%',
          minWidth: 0,
          boxSizing: 'border-box',
          py: { xs: 2, sm: 2.5, md: 3 },
          px: { xs: 1.5, sm: 2, md: 3 },
        }}
      >
        {/* Contextual Welcome Hero Banner */}
        <Box
          sx={{
            p: { xs: 2, sm: 2.5, md: 3 },
            mb: 3,
            borderRadius: '16px',
            background: `linear-gradient(135deg, ${VELOUR_TOKENS.bgSurface1} 0%, rgba(20, 20, 32, 0.95) 100%)`,
            border: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
            width: '100%',
            maxWidth: '100%',
            minWidth: 0,
            boxSizing: 'border-box',
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#FFF', fontSize: { xs: 18, sm: 20, md: 22 }, mb: 0.5 }}>
              Good evening, {perfRes?.name || user?.name || 'Alex Morgan'} 👋
            </Typography>
            <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 13 }}>
              System operational. Student A XGBoost V3 Trip Duration model connected for dynamic map predictions.
            </Typography>
          </Box>
        </Box>

        {/* Row 1 — 4 KPI Metric Cards with Mini Visualizers */}
        <Grid container spacing={{ xs: 1.5, sm: 2, md: 2.5 }} sx={{ mb: 3, width: '100%', minWidth: 0 }}>
          <Grid item xs={12} sm={6} md={3} sx={{ minWidth: 0 }}>
            <KpiCard
              title="TODAY'S EARNINGS"
              value={perfRes?.projected_shift_earnings !== undefined ? `$${perfRes.projected_shift_earnings.toFixed(2)}` : '$0.00'}
              change={perfRes?.total_trips ? "+18.4% vs yesterday" : "No shift activity yet"}
              isPositive={true}
              accentColor={VELOUR_TOKENS.accentPrimary}
              icon={<AttachMoneyIcon fontSize="small" />}
              variant="sparkline"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} sx={{ minWidth: 0 }}>
            <KpiCard
              title="ACCEPTANCE RATE"
              value={perfRes?.acceptance_rate !== undefined ? `${perfRes.acceptance_rate}%` : '100%'}
              change={perfRes?.total_trips ? "Calculated rate" : "Optimal rating"}
              isPositive={true}
              accentColor={VELOUR_TOKENS.accentTeal}
              icon={<CheckCircleOutlineIcon fontSize="small" />}
              variant="bars"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} sx={{ minWidth: 0 }}>
            <KpiCard
              title="DRIVER RATING"
              value={perfRes?.rating !== undefined ? `${perfRes.rating}` : '5.0'}
              subtext={perfRes?.rating ? "Based on passenger feedback" : "New driver profile"}
              isPositive={true}
              accentColor={VELOUR_TOKENS.accentGold}
              icon={<StarOutlinedIcon fontSize="small" />}
              variant="stars"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} sx={{ minWidth: 0 }}>
            <KpiCard
              title="TOTAL TRIPS"
              value={perfRes?.total_trips !== undefined ? perfRes.total_trips.toLocaleString() : '0'}
              change={perfRes?.total_trips ? `${perfRes.total_trips} trips logged` : "0 trips completed"}
              isPositive={true}
              accentColor={VELOUR_TOKENS.accentLavender}
              icon={<DirectionsCarOutlinedIcon fontSize="small" />}
              variant="tripsBars"
            />
          </Grid>
        </Grid>

        {/* Row 2 — Bento Grid Core Layout */}
        <Grid container spacing={{ xs: 1.5, sm: 2, md: 2.5 }} sx={{ mb: 3, width: '100%', minWidth: 0 }}>
          {/* Earnings Overview Area Chart */}
          <Grid item xs={12} lg={7} sx={{ minWidth: 0 }}>
            <EarningsChart data={perfRes?.performance_history} />
          </Grid>

          {/* Demand Radar with Leaflet Inset */}
          <Grid item xs={12} lg={5} sx={{ minWidth: 0 }}>
            <DemandSurgeRadar zones={zones || []} />
          </Grid>
        </Grid>

        {/* Row 3 — ML Intelligence & Goal Metrics */}
        <Grid container spacing={{ xs: 1.5, sm: 2, md: 2.5 }} sx={{ mb: 3, width: '100%', minWidth: 0 }}>
          {/* XGBoost V3 Trip Duration Predictor */}
          <Grid item xs={12} lg={6} sx={{ minWidth: 0 }}>
            <TripDurationPredictorCard />
          </Grid>

          {/* Today's Goal & Upcoming Peak Hours Stacked Cards */}
          <Grid item xs={12} lg={6} sx={{ minWidth: 0 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, md: 2.5 }, height: '100%', width: '100%', minWidth: 0, boxSizing: 'border-box' }}>
              {/* Today's Goal Card */}
              <Card sx={{ backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle, borderRadius: 3, width: '100%', minWidth: 0, boxSizing: 'border-box' }}>
                <CardContent sx={{ p: { xs: 1.8, sm: 2.2 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: 14, color: '#FFF' }}>
                      Today's Goal
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: VELOUR_TOKENS.textSecondary, cursor: 'pointer', '&:hover': { color: VELOUR_TOKENS.accentTeal } }}
                      onClick={() => navigate(ROUTES.DRIVER.SETTINGS)}
                    >
                      Settings
                    </Typography>
                  </Box>

                  {(() => {
                    const currentEarn = perfRes?.projected_shift_earnings || 0;
                    const goalEarn = parseFloat(localStorage.getItem('pref_daily_target') || '400') || 400;
                    const pct = Math.min(100, Math.round((currentEarn / goalEarn) * 100));
                    const totalTrips = perfRes?.total_trips || 0;
                    const dashOffset = 150 - (150 * pct) / 100;
                    const remaining = Math.max(0, goalEarn - currentEarn);

                    return (
                      <>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5, minWidth: 0 }}>
                          {/* SVG Circular Progress Ring */}
                          <Box sx={{ position: 'relative', display: 'inline-flex', flexShrink: 0 }}>
                            <svg width="60" height="60" viewBox="0 0 60 60">
                              <circle cx="30" cy="30" r="24" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
                              <circle
                                cx="30"
                                cy="30"
                                r="24"
                                fill="none"
                                stroke={VELOUR_TOKENS.accentPrimary}
                                strokeWidth="6"
                                strokeDasharray="150"
                                strokeDashoffset={dashOffset}
                                strokeLinecap="round"
                              />
                            </svg>
                            <Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Typography className="mono-num" variant="caption" sx={{ color: '#FFF', fontWeight: 700, fontSize: 12 }}>
                                {pct}%
                              </Typography>
                            </Box>
                          </Box>

                          <Box sx={{ minWidth: 0 }}>
                            <Typography className="mono-num" variant="subtitle1" sx={{ fontWeight: 700, color: '#FFF', fontSize: 16 }}>
                              ${currentEarn.toFixed(0)} <span style={{ color: VELOUR_TOKENS.textSecondary, fontSize: 13 }}>/ ${goalEarn}</span>
                            </Typography>
                            <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 11, display: 'block' }}>
                              {remaining > 0 ? `$${remaining.toFixed(0)} more to reach daily goal` : 'Daily goal achieved!'}
                            </Typography>
                          </Box>
                        </Box>

                        <LinearProgress
                          variant="determinate"
                          value={pct}
                          sx={{
                            height: 5,
                            borderRadius: 3,
                            backgroundColor: 'rgba(255, 255, 255, 0.08)',
                            '& .MuiLinearProgress-bar': { backgroundColor: VELOUR_TOKENS.accentTeal, borderRadius: 3 },
                            mb: 0.8,
                          }}
                        />
                        <Typography className="mono-num" variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 10.5 }}>
                          {totalTrips} completed shift trips logged
                        </Typography>
                      </>
                    );
                  })()}
                </CardContent>
              </Card>

              {/* Upcoming Peak Hours Schedule Card */}
              <Card sx={{ backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle, borderRadius: 3, flexGrow: 1, width: '100%', minWidth: 0, boxSizing: 'border-box' }}>
                <CardContent sx={{ p: { xs: 1.8, sm: 2.2 }, display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: 14, color: '#FFF', mb: 1.5 }}>
                    Upcoming Peak Hours
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2, mb: 1.5, minWidth: 0 }}>
                    {[
                      { time: '11:00 AM - 1:00 PM', level: 'High Demand', color: VELOUR_TOKENS.accentTeal },
                      { time: '5:00 PM - 7:00 PM', level: 'Very High Demand', color: VELOUR_TOKENS.accentGold },
                      { time: '9:00 PM - 11:00 PM', level: 'High Demand', color: VELOUR_TOKENS.accentTeal },
                    ].map((item, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1, borderRadius: 1.5, backgroundColor: VELOUR_TOKENS.bgSurface2, minWidth: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                          <AccessTimeIcon sx={{ fontSize: 14, color: item.color, flexShrink: 0 }} />
                          <Typography className="mono-num" variant="caption" sx={{ color: '#FFF', fontWeight: 600, fontSize: 11.5, minWidth: 0 }}>
                            {item.time}
                          </Typography>
                        </Box>
                        <Chip label={item.level} size="small" sx={{ backgroundColor: 'transparent', color: item.color, fontSize: 10, fontWeight: 700, height: 20, flexShrink: 0 }} />
                      </Box>
                    ))}
                  </Box>

                  <Button
                    fullWidth
                    size="small"
                    variant="outlined"
                    onClick={() => navigate(ROUTES.DRIVER.ANALYTICS)}
                    sx={{ mt: 'auto', color: VELOUR_TOKENS.textSecondary, borderColor: VELOUR_TOKENS.borderSubtle, fontSize: 12, py: 0.6 }}
                  >
                    View Full Schedule
                  </Button>
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>

        {/* Row 4 — Persistent AI Insight Bottom Panel */}
        <Paper
          sx={{
            p: { xs: 1.8, sm: 2 },
            borderRadius: 3,
            backgroundColor: VELOUR_TOKENS.bgSurface1,
            borderColor: 'rgba(124, 58, 237, 0.3)',
            borderWidth: 1,
            borderStyle: 'solid',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
            width: '100%',
            maxWidth: '100%',
            minWidth: 0,
            boxSizing: 'border-box',
            boxShadow: '0 4px 20px rgba(124, 58, 237, 0.15)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: '1 1 280px', minWidth: 0 }}>
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                backgroundColor: VELOUR_TOKENS.accentPrimaryDim,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: VELOUR_TOKENS.accentPrimary,
                flexShrink: 0,
              }}
            >
              <SmartToyIcon />
            </Box>

            <Box sx={{ minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#FFF', fontSize: 13.5 }}>
                  AI Assistant
                </Typography>
                <Chip
                  label="Active"
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(0, 217, 192, 0.15)',
                    color: VELOUR_TOKENS.accentTeal,
                    fontWeight: 700,
                    fontSize: 10,
                    height: 18,
                  }}
                />
              </Box>
              <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 13 }}>
                XGBoost V3 model active for real-time ETA predictions. Pick pickup and drop-off points directly on the interactive map.
              </Typography>
            </Box>
          </Box>

          <Button
            variant="contained"
            onClick={() => navigate(ROUTES.DRIVER.ASSISTANT)}
            endIcon={<ArrowForwardIcon />}
            sx={{
              backgroundColor: VELOUR_TOKENS.accentPrimary,
              color: '#FFF',
              fontWeight: 700,
              fontSize: 13,
              px: 2.5,
              py: 0.9,
              borderRadius: 2.5,
              flexShrink: 0,
              '&:hover': { backgroundColor: VELOUR_TOKENS.accentPrimary },
            }}
          >
            Ask AI Assistant
          </Button>
        </Paper>
      </Box>
    </PageShell>
  );
};
