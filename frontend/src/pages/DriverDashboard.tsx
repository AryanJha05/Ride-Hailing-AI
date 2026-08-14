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
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useNavigate } from 'react-router-dom';
import { PageShell } from '../components/layout/PageShell';
import { KpiCard } from '../components/dashboard/KpiCard';
import { EarningsChart } from '../components/dashboard/EarningsChart';
import { DemandSurgeRadar } from '../components/dashboard/DemandSurgeRadar';
import { useDemandZones } from '../hooks/useRideApi';
import { VELOUR_TOKENS } from '../theme/palette';

export const DriverDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { data: zones } = useDemandZones();
  const [isOnline, setIsOnline] = useState(true);

  return (
    <PageShell title="Dashboard">
      <Container maxWidth="xl" sx={{ py: 2.5, px: { xs: 2, md: 3 } }}>
        {/* Contextual Welcome Hero Banner */}
        <Box
          sx={{
            p: { xs: 2.5, md: 3 },
            mb: 3,
            borderRadius: 3,
            backgroundColor: VELOUR_TOKENS.bgSurface1,
            border: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#FFF', fontSize: { xs: 20, md: 22 }, mb: 0.5 }}>
              Good evening, Alex Morgan 👋
            </Typography>
            <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 13 }}>
              High demand near <strong style={{ color: VELOUR_TOKENS.accentTeal }}>Midtown Manhattan (+42%)</strong>. Optimal positioning active.
            </Typography>
          </Box>

          <Button
            variant={isOnline ? 'outlined' : 'contained'}
            onClick={() => setIsOnline(!isOnline)}
            endIcon={<PlayArrowIcon />}
            sx={{
              backgroundColor: isOnline ? 'transparent' : VELOUR_TOKENS.accentTeal,
              borderColor: isOnline ? VELOUR_TOKENS.accentTeal : 'transparent',
              color: isOnline ? VELOUR_TOKENS.accentTeal : '#000',
              fontWeight: 700,
              fontSize: 13,
              px: 2.5,
              py: 1,
              borderRadius: 2,
              '&:hover': {
                backgroundColor: isOnline ? 'rgba(0, 217, 192, 0.1)' : VELOUR_TOKENS.accentTeal,
              },
            }}
          >
            {isOnline ? 'Online' : 'Go Online'}
          </Button>
        </Box>

        {/* Row 1 — 4 KPI Metric Cards with Mini Visualizers */}
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <KpiCard
              title="TODAY'S EARNINGS"
              value="$285.00"
              change="+18.4% vs yesterday"
              isPositive={true}
              accentColor={VELOUR_TOKENS.accentPrimary}
              icon={<AttachMoneyIcon fontSize="small" />}
              variant="sparkline"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KpiCard
              title="ACCEPTANCE RATE"
              value="97%"
              change="Top 2% of drivers"
              isPositive={true}
              accentColor={VELOUR_TOKENS.accentTeal}
              icon={<CheckCircleOutlineIcon fontSize="small" />}
              variant="bars"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KpiCard
              title="DRIVER RATING"
              value="4.92"
              subtext="Excellent rating"
              isPositive={true}
              accentColor={VELOUR_TOKENS.accentGold}
              icon={<StarOutlinedIcon fontSize="small" />}
              variant="stars"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KpiCard
              title="TOTAL TRIPS"
              value="1,284"
              change="+14 today"
              isPositive={true}
              accentColor={VELOUR_TOKENS.accentLavender}
              icon={<DirectionsCarOutlinedIcon fontSize="small" />}
              variant="tripsBars"
            />
          </Grid>
        </Grid>

        {/* Row 2 — Bento Grid Core Layout */}
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          {/* Earnings Overview Area Chart */}
          <Grid item xs={12} lg={5.5}>
            <EarningsChart />
          </Grid>

          {/* Demand Radar with Leaflet Inset */}
          <Grid item xs={12} md={6} lg={3.5}>
            <DemandSurgeRadar zones={zones || []} />
          </Grid>

          {/* Today's Goal & Upcoming Peak Hours Stacked Cards */}
          <Grid item xs={12} md={6} lg={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, height: '100%' }}>
              {/* Today's Goal Card */}
              <Card sx={{ backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle, borderRadius: 3 }}>
                <CardContent sx={{ p: 2.2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: 14, color: '#FFF' }}>
                      Today's Goal
                    </Typography>
                    <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, cursor: 'pointer' }}>
                      Edit Goal
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
                    {/* SVG Circular Progress Ring */}
                    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
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
                          strokeDashoffset="37.5"
                          strokeLinecap="round"
                        />
                      </svg>
                      <Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography className="mono-num" variant="caption" sx={{ color: '#FFF', fontWeight: 700, fontSize: 12 }}>
                          75%
                        </Typography>
                      </Box>
                    </Box>

                    <Box>
                      <Typography className="mono-num" variant="subtitle1" sx={{ fontWeight: 700, color: '#FFF', fontSize: 16 }}>
                        $300 <span style={{ color: VELOUR_TOKENS.textSecondary, fontSize: 13 }}>/ $400</span>
                      </Typography>
                      <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 11, display: 'block' }}>
                        $100 more to reach your daily goal
                      </Typography>
                    </Box>
                  </Box>

                  <LinearProgress
                    variant="determinate"
                    value={75}
                    sx={{
                      height: 5,
                      borderRadius: 3,
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      '& .MuiLinearProgress-bar': { backgroundColor: VELOUR_TOKENS.accentTeal, borderRadius: 3 },
                      mb: 0.8,
                    }}
                  />
                  <Typography className="mono-num" variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 10.5 }}>
                    8 / 12 trips completed
                  </Typography>
                </CardContent>
              </Card>

              {/* Upcoming Peak Hours Schedule Card */}
              <Card sx={{ backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle, borderRadius: 3, flexGrow: 1 }}>
                <CardContent sx={{ p: 2.2, display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: 14, color: '#FFF', mb: 1.5 }}>
                    Upcoming Peak Hours
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2, mb: 1.5 }}>
                    {[
                      { time: '11:00 AM - 1:00 PM', level: 'High Demand', color: VELOUR_TOKENS.accentTeal },
                      { time: '5:00 PM - 7:00 PM', level: 'Very High Demand', color: VELOUR_TOKENS.accentGold },
                      { time: '9:00 PM - 11:00 PM', level: 'High Demand', color: VELOUR_TOKENS.accentTeal },
                    ].map((item, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1, borderRadius: 1.5, backgroundColor: VELOUR_TOKENS.bgSurface2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AccessTimeIcon sx={{ fontSize: 14, color: item.color }} />
                          <Typography className="mono-num" variant="caption" sx={{ color: '#FFF', fontWeight: 600, fontSize: 11.5 }}>
                            {item.time}
                          </Typography>
                        </Box>
                        <Chip label={item.level} size="small" sx={{ backgroundColor: 'transparent', color: item.color, fontSize: 10, fontWeight: 700, height: 20 }} />
                      </Box>
                    ))}
                  </Box>

                  <Button
                    fullWidth
                    size="small"
                    variant="outlined"
                    onClick={() => navigate('/analytics')}
                    sx={{ mt: 'auto', color: VELOUR_TOKENS.textSecondary, borderColor: VELOUR_TOKENS.borderSubtle, fontSize: 12, py: 0.6 }}
                  >
                    View Full Schedule
                  </Button>
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>

        {/* Row 3 — Persistent AI Insight Bottom Panel */}
        <Paper
          sx={{
            p: 2,
            borderRadius: 3,
            backgroundColor: VELOUR_TOKENS.bgSurface1,
            borderColor: 'rgba(124, 58, 237, 0.3)',
            borderWidth: 1,
            borderStyle: 'solid',
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
            boxShadow: '0 4px 20px rgba(124, 58, 237, 0.15)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                backgroundColor: VELOUR_TOKENS.accentPrimaryDim,
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                color: VELOUR_TOKENS.accentPrimary,
              }}
            >
              <SmartToyIcon />
            </Box>

            <Box>
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
                High demand expected near <strong style={{ color: '#FFF' }}>Midtown Manhattan</strong> between 6 PM and 8 PM. Positioning near JFK Airport could increase your earnings by 42%.
              </Typography>
            </Box>
          </Box>

          <Button
            variant="contained"
            onClick={() => navigate('/ai-assistant')}
            endIcon={<ArrowForwardIcon />}
            sx={{
              backgroundColor: VELOUR_TOKENS.accentPrimary,
              color: '#FFF',
              fontWeight: 700,
              fontSize: 13,
              px: 2.5,
              py: 0.9,
              borderRadius: 2.5,
              '&:hover': { backgroundColor: VELOUR_TOKENS.accentPrimary },
            }}
          >
            Ask AI Assistant
          </Button>
        </Paper>
      </Container>
    </PageShell>
  );
};
