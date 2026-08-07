import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  LinearProgress,
} from '@mui/material';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import NavigationIcon from '@mui/icons-material/Navigation';
import { PageShell } from '../components/layout/PageShell';
import { VELOUR_TOKENS } from '../theme/palette';
import { useDriverPerformance, useDemandZones } from '../hooks/useRideApi';

export const DriverDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { data: perf } = useDriverPerformance();
  const { data: zones } = useDemandZones();

  const recZone = zones?.[0] || {
    zone_name: 'Financial District',
    demand_percentage: '+35%',
    surge_multiplier: 1.4,
  };

  return (
    <PageShell title="Operations View">
      <Grid container spacing={3}>
        {/* Top Left: Map Preview Card (8 cols) */}
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              height: 340,
              position: 'relative',
              overflow: 'hidden',
              backgroundColor: '#0D1117',
              borderColor: VELOUR_TOKENS.borderSubtle,
              backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(0, 217, 192, 0.15) 0%, rgba(10, 10, 13, 0.95) 75%)',
            }}
          >
            {/* Top Left Badge Overlay */}
            <Box
              sx={{
                position: 'absolute',
                top: 16,
                left: 16,
                zIndex: 2,
                backgroundColor: 'rgba(19, 18, 23, 0.85)',
                backdropFilter: 'blur(8px)',
                p: '10px 16px',
                borderRadius: 2,
                border: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
              }}
            >
              <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 11, fontWeight: 600 }}>
                Current Sector
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 18, color: '#FFF' }}>
                Downtown Core
              </Typography>
            </Box>

            {/* Top Right Badges */}
            <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 2, display: 'flex', gap: 1 }}>
              <Chip
                label={`Surge ${recZone.surge_multiplier}x`}
                size="small"
                sx={{
                  backgroundColor: 'rgba(19, 18, 23, 0.85)',
                  color: '#FFF',
                  border: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
                  fontWeight: 600,
                  fontSize: 12,
                }}
              />
              <Chip
                label="High Demand"
                size="small"
                sx={{
                  backgroundColor: 'rgba(0, 217, 192, 0.15)',
                  color: VELOUR_TOKENS.accentTeal,
                  border: '1px solid rgba(0, 217, 192, 0.4)',
                  fontWeight: 600,
                  fontSize: 12,
                }}
              />
            </Box>

            {/* Map Visual / Pulsing Staging Pin */}
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
              }}
            >
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(0, 217, 192, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                  boxShadow: `0 0 30px ${VELOUR_TOKENS.accentTeal}`,
                }}
              >
                <Box
                  sx={{
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    backgroundColor: VELOUR_TOKENS.accentTeal,
                  }}
                />
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Top Right: AI Recommendation Card (4 cols) */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              height: 340,
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between',
              p: 3,
              backgroundColor: VELOUR_TOKENS.bgSurface1,
              borderColor: 'rgba(196, 181, 253, 0.3)',
              boxShadow: '0 0 24px rgba(124, 58, 237, 0.12)',
            }}
          >
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <SmartToyOutlinedIcon sx={{ color: VELOUR_TOKENS.accentLavender, fontSize: 20 }} />
                <Typography variant="subtitle2" sx={{ color: VELOUR_TOKENS.accentLavender, fontWeight: 600, fontSize: 13 }}>
                  AI Insight
                </Typography>
              </Box>

              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1.5, color: '#FFF', fontSize: 22 }}>
                Relocate to {recZone.zone_name}
              </Typography>

              <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 14, lineHeight: 1.6 }}>
                Our models predict a 35% surge in ride requests due to an upcoming event concluding in 15 minutes.
              </Typography>
            </Box>

            <Box sx={{ pt: 2, borderTop: `1px solid ${VELOUR_TOKENS.borderSubtle}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 11 }}>
                  Confidence Score
                </Typography>
                <Typography className="mono-num" variant="h6" sx={{ fontWeight: 700, fontSize: 20, color: '#FFF' }}>
                  94.2%
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<NavigationIcon />}
                onClick={() => navigate('/live-map')}
                sx={{
                  backgroundColor: VELOUR_TOKENS.accentPrimary,
                  px: 2.5,
                  py: 1,
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                Set Route
              </Button>
            </Box>
          </Card>
        </Grid>

        {/* Middle Row Module 1: Est. Next Hour Trips (4 cols) */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2.5, height: '100%' }}>
            <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 600, fontSize: 12 }}>
              Est. Next Hour Trips
            </Typography>
            <Typography className="mono-num" variant="h3" sx={{ fontWeight: 700, fontSize: 40, my: 1, color: '#FFF' }}>
              {perf?.est_next_hour_trips || '4-6'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: VELOUR_TOKENS.accentTeal }}>
              <TrendingUpIcon sx={{ fontSize: 16 }} />
              <Typography className="mono-num" variant="caption" sx={{ fontWeight: 600, fontSize: 12 }}>
                +12% vs avg
              </Typography>
            </Box>
          </Card>
        </Grid>

        {/* Middle Row Module 2: Projected Shift Earnings (4 cols) */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2.5, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 600, fontSize: 12 }}>
                Projected Shift Earnings
              </Typography>
              <Chip
                label="6h remaining"
                size="small"
                sx={{ backgroundColor: VELOUR_TOKENS.bgSurface2, color: VELOUR_TOKENS.textSecondary, fontSize: 11 }}
              />
            </Box>

            <Typography className="mono-num" variant="h3" sx={{ fontWeight: 700, fontSize: 40, my: 1, color: '#FFF' }}>
              ${perf?.projected_shift_earnings || '245.50'}
            </Typography>

            <Box sx={{ display: 'flex', gap: 3, mt: 1 }}>
              <Box>
                <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 10, letterSpacing: '0.05em' }}>
                  CURRENT
                </Typography>
                <Typography className="mono-num" variant="body2" sx={{ fontWeight: 600, color: '#FFF' }}>
                  $112.00
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: VELOUR_TOKENS.accentTeal, fontSize: 10, letterSpacing: '0.05em' }}>
                  AI BONUS
                </Typography>
                <Typography className="mono-num" variant="body2" sx={{ fontWeight: 600, color: VELOUR_TOKENS.accentTeal }}>
                  +$34.50
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Middle Row Module 3: Global Demand Level (4 cols) */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2.5, height: '100%' }}>
            <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 600, fontSize: 12 }}>
              Global Demand Level
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, fontSize: 28, my: 1.5, color: '#FFF' }}>
              Elevated
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, my: 2 }}>
              <Box sx={{ flex: 1, height: 8, borderRadius: 4, backgroundColor: VELOUR_TOKENS.borderSubtle }} />
              <Box sx={{ flex: 1, height: 8, borderRadius: 4, backgroundColor: VELOUR_TOKENS.accentTeal }} />
              <Box sx={{ flex: 1, height: 8, borderRadius: 4, backgroundColor: VELOUR_TOKENS.accentPrimary }} />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', color: VELOUR_TOKENS.textSecondary, fontSize: 11, fontWeight: 600 }}>
              <span>LOW</span>
              <span>PEAK</span>
            </Box>
          </Card>
        </Grid>

        {/* Bottom Row: Performance Metrics (12 cols) */}
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Typography variant="subtitle2" sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 600, fontSize: 13, mb: 3 }}>
              Performance Metrics
            </Typography>

            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontSize: 14, color: VELOUR_TOKENS.textSecondary }}>
                    Acceptance Rate
                  </Typography>
                  <Typography className="mono-num" variant="body2" sx={{ fontWeight: 700, color: VELOUR_TOKENS.accentTeal }}>
                    98%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={98}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: VELOUR_TOKENS.bgSurface2,
                    '& .MuiLinearProgress-bar': { backgroundColor: VELOUR_TOKENS.accentTeal },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontSize: 14, color: VELOUR_TOKENS.textSecondary }}>
                    Driver Rating
                  </Typography>
                  <Typography className="mono-num" variant="body2" sx={{ fontWeight: 700, color: VELOUR_TOKENS.accentLavender }}>
                    4.96
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={96}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: VELOUR_TOKENS.bgSurface2,
                    '& .MuiLinearProgress-bar': { backgroundColor: VELOUR_TOKENS.accentPrimary },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontSize: 14, color: VELOUR_TOKENS.textSecondary }}>
                    Cancellation Rate
                  </Typography>
                  <Typography className="mono-num" variant="body2" sx={{ fontWeight: 700, color: VELOUR_TOKENS.textSecondary }}>
                    1.2%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={12}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: VELOUR_TOKENS.bgSurface2,
                    '& .MuiLinearProgress-bar': { backgroundColor: VELOUR_TOKENS.textSecondary },
                  }}
                />
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </PageShell>
  );
};
