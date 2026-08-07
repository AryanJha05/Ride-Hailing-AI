import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Paper,
  Divider,
} from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import StorageIcon from '@mui/icons-material/Storage';
import CpuIcon from '@mui/icons-material/Memory';
import RouteIcon from '@mui/icons-material/AltRoute';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { VELOUR_TOKENS } from '../theme/palette';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ backgroundColor: VELOUR_TOKENS.bgBase, minHeight: '100vh', color: '#FFF' }}>
      {/* Navbar */}
      <Box
        sx={{
          borderBottom: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
          padding: '16px 0',
          position: 'sticky',
          top: 0,
          backgroundColor: 'rgba(10, 10, 13, 0.9)',
          backdropFilter: 'blur(12px)',
          zIndex: 100,
        }}
      >
        <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }} onClick={() => navigate('/')}>
            <RocketLaunchIcon sx={{ color: VELOUR_TOKENS.accentPrimary, fontSize: 28 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 20 }}>
              Ride AI
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary, cursor: 'pointer', '&:hover': { color: '#FFF' } }}>
              Product
            </Typography>
            <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary, cursor: 'pointer', '&:hover': { color: '#FFF' } }}>
              Pricing
            </Typography>
            <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary, cursor: 'pointer', '&:hover': { color: '#FFF' } }}>
              Docs
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/dashboard')}
              sx={{
                backgroundColor: VELOUR_TOKENS.accentPrimary,
                padding: '6px 18px',
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              Get Started
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: 36, md: 54 },
                fontWeight: 700,
                lineHeight: 1.15,
                mb: 3,
                letterSpacing: '-0.02em',
              }}
            >
              Know where the ride is before it happens.
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: VELOUR_TOKENS.textSecondary,
                fontSize: 18,
                lineHeight: 1.6,
                mb: 4,
                maxWidth: 480,
              }}
            >
              Deploy advanced machine learning to forecast mobility demand. Empower your fleet with AI-driven positioning recommendations to minimize deadheading and maximize operational efficiency.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/live-map')}
                sx={{
                  backgroundColor: VELOUR_TOKENS.accentPrimary,
                  px: 3,
                  py: 1.4,
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                }}
              >
                VIEW LIVE DEMAND MAP
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/dashboard')}
                sx={{
                  borderColor: VELOUR_TOKENS.accentPrimary,
                  color: '#FFF',
                  px: 3,
                  py: 1.4,
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                }}
              >
                FOR FLEETS
              </Button>
            </Box>
          </Grid>

          {/* Right Hero Image / Map Mockup */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                borderRadius: 3,
                overflow: 'hidden',
                borderColor: VELOUR_TOKENS.borderSubtle,
                boxShadow: '0 24px 48px rgba(0, 0, 0, 0.7)',
                position: 'relative',
              }}
            >
              <Box
                sx={{
                  padding: '12px 16px',
                  backgroundColor: VELOUR_TOKENS.bgSurface2,
                  borderBottom: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'space-between',
                }}
              >
                <Typography variant="subtitle2" sx={{ fontSize: 13, fontWeight: 600, color: VELOUR_TOKENS.textSecondary }}>
                  Live Network Demand
                </Typography>
                <ShowChartIcon sx={{ color: VELOUR_TOKENS.accentTeal, fontSize: 20 }} />
              </Box>
              <Box
                sx={{
                  height: 320,
                  backgroundImage: 'radial-gradient(circle at 40% 40%, rgba(0, 217, 192, 0.25) 0%, rgba(124, 58, 237, 0.15) 40%, rgba(10, 10, 13, 0.9) 80%)',
                  backgroundColor: '#0D1117',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                }}
              >
                <Box
                  sx={{
                    width: 140,
                    height: 140,
                    borderRadius: '50%',
                    border: `2px dashed ${VELOUR_TOKENS.accentLavender}`,
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center',
                    boxShadow: `0 0 40px ${VELOUR_TOKENS.accentPrimaryDim}`,
                  }}
                >
                  <Box
                    sx={{
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      backgroundColor: VELOUR_TOKENS.accentTeal,
                      boxShadow: `0 0 20px ${VELOUR_TOKENS.accentTeal}`,
                    }}
                  />
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Metric Strip */}
      <Box sx={{ backgroundColor: VELOUR_TOKENS.bgSurface1, py: 5, borderTop: `1px solid ${VELOUR_TOKENS.borderSubtle}`, borderBottom: `1px solid ${VELOUR_TOKENS.borderSubtle}` }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} textAlign="center">
            <Grid item xs={12} md={4}>
              <Typography className="mono-num" variant="h3" sx={{ fontWeight: 700, fontSize: 36, color: '#FFF' }}>
                2.3M
              </Typography>
              <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, letterSpacing: '0.08em', fontWeight: 600 }}>
                TRIPS FORECASTED
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography className="mono-num" variant="h3" sx={{ fontWeight: 700, fontSize: 36, color: '#FFF' }}>
                94%
              </Typography>
              <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, letterSpacing: '0.08em', fontWeight: 600 }}>
                FORECAST ACCURACY
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography className="mono-num" variant="h3" sx={{ fontWeight: 700, fontSize: 36, color: VELOUR_TOKENS.accentTeal }}>
                +35%
              </Typography>
              <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, letterSpacing: '0.08em', fontWeight: 600 }}>
                EARNINGS UPLIFT
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Engineered for Precision */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Typography variant="h3" textAlign="center" sx={{ fontWeight: 700, mb: 6 }}>
          Engineered for Precision
        </Typography>

        <Grid container spacing={3}>
          {[
            { title: 'Ingest', desc: 'Real-time telemetry and historical network data absorption.', icon: <StorageIcon sx={{ color: VELOUR_TOKENS.accentTeal }} /> },
            { title: 'Process', desc: 'Spatial-temporal ML models calculate demand surfaces.', icon: <CpuIcon sx={{ color: VELOUR_TOKENS.accentTeal }} /> },
            { title: 'Vector', desc: 'Optimal positioning coordinates dispatched to units.', icon: <RouteIcon sx={{ color: VELOUR_TOKENS.accentTeal }} /> },
            { title: 'Execute', desc: 'Fleet aligns with emerging demand zones automatically.', icon: <CheckCircleOutlineIcon sx={{ color: VELOUR_TOKENS.accentTeal }} /> },
          ].map((step, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Card sx={{ height: '100%', backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle }}>
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(0, 217, 192, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justify: 'center',
                      margin: '0 auto 16px auto',
                    }}
                  >
                    {step.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontSize: 18 }}>
                    {step.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 13, lineHeight: 1.5 }}>
                    {step.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Bottom CTA */}
      <Box sx={{ py: 10, textAlign: 'center', backgroundColor: VELOUR_TOKENS.bgSurface1, borderTop: `1px solid ${VELOUR_TOKENS.borderSubtle}` }}>
        <Container maxWidth="md">
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
            Ready to command your fleet with AI intelligence?
          </Typography>
          <Typography variant="body1" sx={{ color: VELOUR_TOKENS.textSecondary, mb: 4 }}>
            Join elite operators deploying predictable mobility infrastructure today.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/dashboard')}
            sx={{
              backgroundColor: VELOUR_TOKENS.accentPrimary,
              px: 4,
              py: 1.6,
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: '0.04em',
            }}
          >
            INITIALIZE DEPLOYMENT
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 4, borderTop: `1px solid ${VELOUR_TOKENS.borderSubtle}` }}>
        <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: VELOUR_TOKENS.textSecondary, fontSize: 13 }}>
          <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary }}>
            © 2026 Ride AI. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Typography variant="caption" sx={{ cursor: 'pointer', '&:hover': { color: '#FFF' } }}>Product</Typography>
            <Typography variant="caption" sx={{ cursor: 'pointer', '&:hover': { color: '#FFF' } }}>Pricing</Typography>
            <Typography variant="caption" sx={{ cursor: 'pointer', '&:hover': { color: '#FFF' } }}>Docs</Typography>
            <Typography variant="caption" sx={{ cursor: 'pointer', '&:hover': { color: '#FFF' } }}>Privacy</Typography>
            <Typography variant="caption" sx={{ cursor: 'pointer', '&:hover': { color: '#FFF' } }}>Terms</Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};
