import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
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
  mode: 'login' | 'register';
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, mode }) => {
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
        display: 'flex',
        flexDirection: 'column',
        color: '#FFF',
        overflowX: 'hidden',
      }}
    >
      <Grid container sx={{ minHeight: '100vh', flex: 1 }}>
        {/* LEFT SECTION — Product Introduction & Enterprise Mobility Network Visual */}
        <Grid
          item
          xs={12}
          md={6}
          lg={6.5}
          sx={{
            backgroundColor: VELOUR_TOKENS.bgSurface1,
            borderRight: { md: `1px solid ${VELOUR_TOKENS.borderSubtle}` },
            borderBottom: { xs: `1px solid ${VELOUR_TOKENS.borderSubtle}`, md: 'none' },
            p: { xs: 4, sm: 6, md: 8 },
            display: 'flex',
            flexDirection: 'column',
            justify: 'space-between',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle Background Glows */}
          <Box
            sx={{
              position: 'absolute',
              top: '-20%',
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

          {/* Top Branding */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              cursor: 'pointer',
              mb: { xs: 4, md: 6 },
              width: 'fit-content',
            }}
            onClick={() => navigate('/')}
          >
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: 3,
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
                  fontSize: 20,
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
                  fontSize: 10.5,
                  letterSpacing: '0.08em',
                  fontWeight: 600,
                }}
              >
                MOBILITY INTELLIGENCE
              </Typography>
            </Box>
          </Box>

          {/* Main Product Headline */}
          <Box sx={{ mb: 6, position: 'relative', zIndex: 1 }}>
            <Chip
              label="ENTERPRISE SAAS PLATFORM"
              size="small"
              sx={{
                backgroundColor: 'rgba(124, 58, 237, 0.15)',
                color: VELOUR_TOKENS.accentLavender,
                border: `1px solid rgba(124, 58, 237, 0.3)`,
                fontWeight: 700,
                fontSize: 10,
                letterSpacing: '0.08em',
                mb: 2.5,
                borderRadius: 1.5,
              }}
            />
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: 28, sm: 36, md: 44 },
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                color: '#FFF',
                mb: 2.5,
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
                fontSize: { xs: 14, sm: 16 },
                lineHeight: 1.6,
                maxWidth: 520,
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
              borderRadius: 4,
              p: 3,
              mb: 6,
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
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
                justifyContent: 'space-between',
                mb: 2.5,
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
                <Typography variant="caption" sx={{ fontWeight: 700, fontSize: 11, color: VELOUR_TOKENS.textPrimary, letterSpacing: '0.04em' }}>
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
                  fontSize: 10,
                  fontWeight: 700,
                  height: 22,
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
                      borderRadius: 2.5,
                      p: 1.5,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.5 }}>
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

          {/* Feature Highlights Grid */}
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
                      mt: 0.3,
                    }}
                  >
                    {feat.icon}
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: 13, color: '#FFF' }}>
                      {feat.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 11.5, lineHeight: 1.4, display: 'block' }}>
                      {feat.desc}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* Bottom Enterprise Footer */}
          <Box sx={{ mt: 6, pt: 3, borderTop: `1px solid ${VELOUR_TOKENS.borderSubtle}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textTertiary, fontSize: 11 }}>
              © 2026 Ride AI Mobility Inc. All rights reserved.
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircleIcon sx={{ fontSize: 13, color: VELOUR_TOKENS.accentTeal }} />
              <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 11, fontWeight: 600 }}>
                SOC2 Type II Certified
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* RIGHT SECTION — Authentication Form (Login or Register) */}
        <Grid
          item
          xs={12}
          md={6}
          lg={5.5}
          sx={{
            backgroundColor: VELOUR_TOKENS.bgBase,
            p: { xs: 3, sm: 6, md: 8 },
            display: 'flex',
            flexDirection: 'column',
            justify: 'center',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          <Container maxWidth="xs" disableGutters sx={{ width: '100%' }}>
            {children}
          </Container>
        </Grid>
      </Grid>
    </Box>
  );
};
