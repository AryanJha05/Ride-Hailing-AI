import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Chip,
} from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import MemoryIcon from '@mui/icons-material/Memory';
import PsychologyIcon from '@mui/icons-material/Psychology';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { VELOUR_TOKENS } from '../../theme/palette';
import { ROUTES } from '../../routes/routes';

interface AuthLayoutProps {
  children: React.ReactNode;
  mode?: 'login' | 'register';
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const navigate = useNavigate();

  const featureHighlights = [
    {
      icon: <ShowChartIcon sx={{ color: VELOUR_TOKENS.accentTeal, fontSize: 20 }} />,
      title: 'Real-time demand prediction',
      desc: 'Predictive passenger volume heatmaps accurate to 100m².',
    },
    {
      icon: <AltRouteIcon sx={{ color: VELOUR_TOKENS.accentPrimary, fontSize: 20 }} />,
      title: 'Intelligent driver positioning',
      desc: 'AI-guided staging vectors to eliminate deadheading.',
    },
    {
      icon: <MemoryIcon sx={{ color: VELOUR_TOKENS.accentLavender, fontSize: 20 }} />,
      title: 'ML powered mobility insights',
      desc: 'Neural spatial clustering trained on millions of NYC trips.',
    },
    {
      icon: <PsychologyIcon sx={{ color: VELOUR_TOKENS.accentGold, fontSize: 20 }} />,
      title: 'AI assistant for ops',
      desc: 'Natural language recommendations for active shift dispatch.',
    },
  ];

  return (
    <Box
      sx={{
        backgroundColor: VELOUR_TOKENS.bgBase,
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        color: '#FFF',
        overflowX: 'hidden',
      }}
    >
      <Grid container sx={{ minHeight: '100vh', width: '100%', flex: 1, alignItems: 'stretch' }}>
        {/* LEFT SECTION — 50% Product Information & NYC Telemetry Visual */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            backgroundColor: VELOUR_TOKENS.bgSurface1,
            borderRight: { md: `1px solid ${VELOUR_TOKENS.borderSubtle}` },
            borderBottom: { xs: `1px solid ${VELOUR_TOKENS.borderSubtle}`, md: 'none' },
            px: { xs: 4, sm: 6, md: 7, lg: 8, xl: 10 },
            py: { xs: 5, md: 6 },
            display: 'flex',
            flexDirection: 'column',
            justify: 'center',
            alignItems: 'center',
            minHeight: { md: '100vh' },
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Background Ambient Lighting */}
          <Box
            sx={{
              position: 'absolute',
              top: '-15%',
              left: '-10%',
              width: '550px',
              height: '550px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(124, 58, 237, 0.12) 0%, rgba(19, 18, 23, 0) 70%)',
              pointerEvents: 'none',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: '-15%',
              right: '-10%',
              width: '500px',
              height: '500px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0, 217, 192, 0.08) 0%, rgba(19, 18, 23, 0) 70%)',
              pointerEvents: 'none',
            }}
          />

          {/* Left Content Container */}
          <Box
            sx={{
              width: { xs: '100%', lg: '85%' },
              maxWidth: 680,
              position: 'relative',
              zIndex: 1,
              my: 'auto',
              mx: 'auto',
            }}
          >
            {/* Top Branding */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.8,
                cursor: 'pointer',
                mb: 3.5,
                width: 'fit-content',
              }}
              onClick={() => navigate(ROUTES.USER.DASHBOARD)}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2.5,
                  backgroundColor: VELOUR_TOKENS.accentPrimaryDim,
                  border: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                  boxShadow: `0 0 20px ${VELOUR_TOKENS.accentPrimaryDim}`,
                }}
              >
                <RocketLaunchIcon sx={{ color: VELOUR_TOKENS.accentPrimary, fontSize: 24 }} />
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    fontSize: 23,
                    color: '#FFF',
                    letterSpacing: '-0.02em',
                    lineHeight: 1,
                  }}
                >
                  Ride AI
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: VELOUR_TOKENS.textSecondary,
                    fontSize: 11,
                    letterSpacing: '0.08em',
                    fontWeight: 600,
                    mt: 0.2,
                    display: 'block',
                  }}
                >
                  MOBILITY INTELLIGENCE
                </Typography>
              </Box>
            </Box>

            {/* Main Product Headline & Description */}
            <Box sx={{ mb: 3.5 }}>
              <Chip
                label="ENTERPRISE MOBILITY PLATFORM"
                size="small"
                sx={{
                  backgroundColor: 'rgba(124, 58, 237, 0.15)',
                  color: VELOUR_TOKENS.accentLavender,
                  border: `1px solid rgba(124, 58, 237, 0.3)`,
                  fontWeight: 700,
                  fontSize: 10.5,
                  letterSpacing: '0.08em',
                  mb: 2,
                  borderRadius: 1.5,
                  px: 0.5,
                }}
              />
              <Typography
                variant="h3"
                sx={{
                  fontSize: { xs: 28, sm: 36, md: 44, lg: 48 },
                  fontWeight: 700,
                  lineHeight: 1.1,
                  letterSpacing: '-0.03em',
                  color: '#FFF',
                  mb: 2,
                }}
              >
                Know where the ride is{' '}
                <Box
                  component="span"
                  sx={{
                    background: `linear-gradient(135deg, #FFF 30%, ${VELOUR_TOKENS.accentLavender} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  before it happens.
                </Box>
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: VELOUR_TOKENS.textSecondary,
                  fontSize: { xs: 14.5, sm: 16.5 },
                  lineHeight: 1.6,
                  maxWidth: 600,
                }}
              >
                AI-powered demand forecasting and driver positioning intelligence platform for modern urban mobility fleets.
              </Typography>
            </Box>

            {/* NYC Telemetry Network Visualization */}
            <Paper
              elevation={0}
              sx={{
                backgroundColor: VELOUR_TOKENS.bgSurface2,
                borderColor: VELOUR_TOKENS.borderSubtle,
                borderWidth: 1,
                borderStyle: 'solid',
                borderRadius: 3.5,
                p: 2.5,
                mb: 3.5,
                maxWidth: 680,
                width: '100%',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 16px 36px rgba(0, 0, 0, 0.5)',
              }}
            >
              {/* Dark Grid Background Effect */}
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage:
                    'radial-gradient(circle at 50% 50%, rgba(124, 58, 237, 0.08) 0%, transparent 80%), linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
                  backgroundSize: '100% 100%, 24px 24px, 24px 24px',
                  opacity: 0.8,
                }}
              />

              {/* Header bar of visual */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'space-between',
                  mb: 2,
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: VELOUR_TOKENS.accentTeal,
                      boxShadow: `0 0 10px ${VELOUR_TOKENS.accentTeal}`,
                    }}
                  />
                  <Typography variant="caption" sx={{ fontWeight: 700, fontSize: 10.5, color: VELOUR_TOKENS.textPrimary, letterSpacing: '0.04em' }}>
                    NYC TELEMETRY NETWORK — LIVE
                  </Typography>
                </Box>
                <Chip
                  label="94.2% ACCURACY"
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(0, 217, 192, 0.1)',
                    color: VELOUR_TOKENS.accentTeal,
                    border: `1px solid rgba(0, 217, 192, 0.25)`,
                    fontSize: 9.5,
                    fontWeight: 700,
                    height: 20,
                  }}
                />
              </Box>

              {/* Simulated Heat Zones Grid */}
              <Grid container spacing={1.5} sx={{ position: 'relative', zIndex: 1 }}>
                {[
                  { zone: 'Midtown Manhattan', surge: '1.65x Surge', delta: '+42% Demand', color: VELOUR_TOKENS.accentTeal },
                  { zone: 'JFK Corridor', surge: '1.80x Surge', delta: '+65% Requests', color: VELOUR_TOKENS.accentPrimary },
                  { zone: 'Financial District', surge: '1.40x Surge', delta: '+28% Volume', color: VELOUR_TOKENS.accentLavender },
                ].map((item, idx) => (
                  <Grid item xs={12} sm={4} key={idx}>
                    <Box
                      sx={{
                        backgroundColor: 'rgba(10, 10, 13, 0.65)',
                        backdropFilter: 'blur(8px)',
                        border: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
                        borderRadius: 2,
                        p: 1.5,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mb: 0.4 }}>
                        <LocationOnIcon sx={{ fontSize: 14, color: item.color }} />
                        <Typography variant="caption" sx={{ fontWeight: 700, fontSize: 11, color: '#FFF' }} noWrap>
                          {item.zone}
                        </Typography>
                      </Box>
                      <Typography variant="caption" sx={{ display: 'block', color: item.color, fontWeight: 700, fontSize: 12 }}>
                        {item.surge}
                      </Typography>
                      <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 10 }}>
                        {item.delta}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>

            {/* Feature Highlights 2 x 2 Grid */}
            <Grid container spacing={2.5} sx={{ position: 'relative', zIndex: 1 }}>
              {featureHighlights.map((feat, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                    <Box
                      sx={{
                        width: 34,
                        height: 34,
                        borderRadius: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        border: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
                        display: 'flex',
                        alignItems: 'center',
                        justify: 'center',
                        flexShrink: 0,
                        mt: 0.2,
                      }}
                    >
                      {feat.icon}
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: 14.5, color: '#FFF', lineHeight: 1.2, mb: 0.3 }}>
                        {feat.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 12.5, lineHeight: 1.4, display: 'block' }}>
                        {feat.desc}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>

        {/* RIGHT SECTION — 50% Authentication Card */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            backgroundColor: VELOUR_TOKENS.bgBase,
            px: { xs: 3, sm: 6, md: 7, lg: 8 },
            py: { xs: 5, md: 6 },
            display: 'flex',
            flexDirection: 'column',
            justify: 'center',
            alignItems: 'center',
            minHeight: { md: '100vh' },
            position: 'relative',
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 450, my: 'auto', mx: 'auto' }}>
            {children}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
