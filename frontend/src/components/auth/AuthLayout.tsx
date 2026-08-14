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
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { VELOUR_TOKENS } from '../../theme/palette';

interface AuthLayoutProps {
  children: React.ReactNode;
  mode?: 'login' | 'register';
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const navigate = useNavigate();

  const featureHighlights = [
    {
      icon: <ShowChartIcon sx={{ color: VELOUR_TOKENS.accentTeal, fontSize: 18 }} />,
      title: 'Real-time demand prediction',
      desc: 'Predictive passenger volume heatmaps accurate to 100m².',
    },
    {
      icon: <AltRouteIcon sx={{ color: VELOUR_TOKENS.accentPrimary, fontSize: 18 }} />,
      title: 'Intelligent driver positioning',
      desc: 'AI-guided staging vectors to eliminate deadheading.',
    },
    {
      icon: <MemoryIcon sx={{ color: VELOUR_TOKENS.accentLavender, fontSize: 18 }} />,
      title: 'ML powered mobility insights',
      desc: 'Neural spatial clustering trained on millions of NYC trips.',
    },
    {
      icon: <PsychologyIcon sx={{ color: VELOUR_TOKENS.accentGold, fontSize: 18 }} />,
      title: 'AI assistant for ops',
      desc: 'Natural language recommendations for active shift dispatch.',
    },
  ];

  return (
    <Box
      sx={{
        backgroundColor: VELOUR_TOKENS.bgBase,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        color: '#FFF',
        overflowX: 'hidden',
      }}
    >
      <Grid container sx={{ minHeight: '100vh', flex: 1 }}>
        {/* LEFT SECTION — Product Information & NYC Telemetry Visual */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            backgroundColor: VELOUR_TOKENS.bgSurface1,
            borderRight: { md: `1px solid ${VELOUR_TOKENS.borderSubtle}` },
            borderBottom: { xs: `1px solid ${VELOUR_TOKENS.borderSubtle}`, md: 'none' },
            px: { xs: 4, sm: 6, md: 7, lg: 8 },
            py: { xs: 5, md: 6 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
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
              width: '500px',
              height: '500px',
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
              width: '450px',
              height: '450px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0, 217, 192, 0.08) 0%, rgba(19, 18, 23, 0) 70%)',
              pointerEvents: 'none',
            }}
          />

          {/* Left Content Container with Balanced Width */}
          <Box sx={{ width: '100%', maxWidth: 540, position: 'relative', zIndex: 1 }}>
            {/* Top Branding */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                cursor: 'pointer',
                mb: 4,
                width: 'fit-content',
              }}
              onClick={() => navigate('/dashboard')}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2.5,
                  backgroundColor: VELOUR_TOKENS.accentPrimaryDim,
                  border: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                  boxShadow: `0 0 20px ${VELOUR_TOKENS.accentPrimaryDim}`,
                }}
              >
                <RocketLaunchIcon sx={{ color: VELOUR_TOKENS.accentPrimary, fontSize: 22 }} />
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    fontSize: 19,
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
                    fontSize: 10,
                    letterSpacing: '0.08em',
                    fontWeight: 600,
                  }}
                >
                  MOBILITY INTELLIGENCE
                </Typography>
              </Box>
            </Box>

            {/* Main Product Headline */}
            <Box sx={{ mb: 4 }}>
              <Chip
                label="ENTERPRISE MOBILITY PLATFORM"
                size="small"
                sx={{
                  backgroundColor: 'rgba(124, 58, 237, 0.15)',
                  color: VELOUR_TOKENS.accentLavender,
                  border: `1px solid rgba(124, 58, 237, 0.3)`,
                  fontWeight: 700,
                  fontSize: 10,
                  letterSpacing: '0.08em',
                  mb: 2,
                  borderRadius: 1.5,
                }}
              />
              <Typography
                variant="h3"
                sx={{
                  fontSize: { xs: 26, sm: 32, md: 38 },
                  fontWeight: 800,
                  lineHeight: 1.2,
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
                variant="body2"
                sx={{
                  color: VELOUR_TOKENS.textSecondary,
                  fontSize: { xs: 13.5, sm: 15 },
                  lineHeight: 1.6,
                }}
              >
                AI-powered demand forecasting and driver positioning intelligence platform for modern urban mobility fleets.
              </Typography>
            </Box>

            {/* Premium Enterprise Mobility Network Visualization (NYC Demand Heat Map Mockup) */}
            <Paper
              elevation={0}
              sx={{
                backgroundColor: VELOUR_TOKENS.bgSurface2,
                borderColor: VELOUR_TOKENS.borderSubtle,
                borderWidth: 1,
                borderStyle: 'solid',
                borderRadius: 3.5,
                p: 2.5,
                mb: 4,
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
              <Grid container spacing={1.2} sx={{ position: 'relative', zIndex: 1 }}>
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
                        p: 1.25,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mb: 0.3 }}>
                        <LocationOnIcon sx={{ fontSize: 13, color: item.color }} />
                        <Typography variant="caption" sx={{ fontWeight: 700, fontSize: 10.5, color: '#FFF' }} noWrap>
                          {item.zone}
                        </Typography>
                      </Box>
                      <Typography variant="caption" sx={{ display: 'block', color: item.color, fontWeight: 700, fontSize: 11.5 }}>
                        {item.surge}
                      </Typography>
                      <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 9.5 }}>
                        {item.delta}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>

            {/* Feature Highlights Grid */}
            <Grid container spacing={2} sx={{ position: 'relative', zIndex: 1 }}>
              {featureHighlights.map((feat, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Box sx={{ display: 'flex', gap: 1.2, alignItems: 'flex-start' }}>
                    <Box
                      sx={{
                        width: 30,
                        height: 30,
                        borderRadius: 1.5,
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
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: 12.5, color: '#FFF' }}>
                        {feat.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 11, lineHeight: 1.35, display: 'block' }}>
                        {feat.desc}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>

            {/* Bottom Enterprise Footer */}
            <Box
              sx={{
                mt: 4,
                pt: 2.5,
                borderTop: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
                display: 'flex',
                alignItems: 'center',
                justify: 'space-between',
              }}
            >
              <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textTertiary, fontSize: 10.5 }}>
                © 2026 Ride AI Mobility Inc. All rights reserved.
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                <CheckCircleIcon sx={{ fontSize: 12, color: VELOUR_TOKENS.accentTeal }} />
                <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 10.5, fontWeight: 600 }}>
                  SOC2 Type II Certified
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* RIGHT SECTION — Authentication Card (Vertically Centered) */}
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
            position: 'relative',
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 430 }}>
            {children}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
