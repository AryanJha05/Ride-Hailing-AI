import React from 'react';
import { Container, Grid, Card, CardContent, Typography, Box, Button, Chip } from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import BadgeIcon from '@mui/icons-material/Badge';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SettingsIcon from '@mui/icons-material/Settings';
import PaymentsIcon from '@mui/icons-material/Payments';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useNavigate } from 'react-router-dom';
import { PageShell } from '../../components/layout/PageShell';
import { useDriverPerformance } from '../../hooks/useRideApi';
import { DriverHeaderCard } from '../../components/profile/DriverHeaderCard';
import { PerformanceMetricsCard } from '../../components/profile/PerformanceMetricsCard';
import { useAuth } from '../../auth/AuthContext';
import { VELOUR_TOKENS } from '../../theme/palette';
import { ROUTES } from '../../routes/routes';

export const DriverProfile: React.FC = () => {
  const { data: driver } = useDriverPerformance();
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <PageShell title="Driver Profile">
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <DriverHeaderCard driver={driver} />

        <Grid container spacing={3} sx={{ mb: 3 }}>
          {/* Performance & Telemetry */}
          <Grid item xs={12} md={7}>
            <PerformanceMetricsCard driver={driver} />
          </Grid>

          {/* Vehicle & Credentials Card */}
          <Grid item xs={12} md={5}>
            <Card sx={{ backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle, height: '100%' }}>
              <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 16, color: '#FFF' }}>
                      Vehicle & License
                    </Typography>
                    <Chip
                      icon={<VerifiedUserIcon sx={{ fontSize: '13px !important', color: `${VELOUR_TOKENS.accentTeal} !important` }} />}
                      label="Verified Active"
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(0, 217, 192, 0.1)',
                        color: VELOUR_TOKENS.accentTeal,
                        borderColor: 'rgba(0, 217, 192, 0.3)',
                        borderWidth: 1,
                        borderStyle: 'solid',
                        fontWeight: 600,
                        fontSize: 11,
                      }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.8 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <DirectionsCarIcon sx={{ color: VELOUR_TOKENS.accentLavender, fontSize: 20 }} />
                      <Box>
                        <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, display: 'block' }}>
                          Registered Vehicle
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#FFF', fontWeight: 600 }}>
                          {user?.vehicle || `${user?.vehicle_make || 'Toyota'} ${user?.vehicle_model || 'Camry Hybrid'}`}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <BadgeIcon sx={{ color: VELOUR_TOKENS.accentTeal, fontSize: 20 }} />
                      <Box>
                        <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, display: 'block' }}>
                          TLC License Number
                        </Typography>
                        <Typography className="mono-num" variant="body2" sx={{ color: '#FFF', fontWeight: 600 }}>
                          {user?.license_number || 'NYC-TLC-99821'}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <LocationOnIcon sx={{ color: VELOUR_TOKENS.accentGold, fontSize: 20 }} />
                      <Box>
                        <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, display: 'block' }}>
                          Operating Region
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#FFF', fontWeight: 600 }}>
                          NYC Metro Network
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <CalendarMonthIcon sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 20 }} />
                      <Box>
                        <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, display: 'block' }}>
                          Member Since
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#FFF', fontWeight: 600 }}>
                          January 2024
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Quick Action Navigation Bar */}
        <Card sx={{ backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle }}>
          <CardContent sx={{ p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="subtitle2" sx={{ color: '#FFF', fontWeight: 700 }}>
                Account Management & Quick Shortcuts
              </Typography>
              <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary }}>
                Update preferences, inspect earnings log, or contact support
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                startIcon={<SettingsIcon fontSize="small" />}
                onClick={() => navigate(ROUTES.DRIVER.SETTINGS)}
                sx={{
                  borderColor: VELOUR_TOKENS.borderSubtle,
                  color: '#FFF',
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: 13,
                  fontWeight: 600,
                  '&:hover': { borderColor: VELOUR_TOKENS.accentLavender, color: VELOUR_TOKENS.accentLavender },
                }}
              >
                Edit Settings
              </Button>
              <Button
                variant="outlined"
                startIcon={<PaymentsIcon fontSize="small" />}
                onClick={() => navigate(ROUTES.DRIVER.EARNINGS)}
                sx={{
                  borderColor: VELOUR_TOKENS.borderSubtle,
                  color: '#FFF',
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: 13,
                  fontWeight: 600,
                  '&:hover': { borderColor: VELOUR_TOKENS.accentTeal, color: VELOUR_TOKENS.accentTeal },
                }}
              >
                View Earnings
              </Button>
              <Button
                variant="outlined"
                startIcon={<HelpOutlineIcon fontSize="small" />}
                onClick={() => navigate(ROUTES.DRIVER.SUPPORT)}
                sx={{
                  borderColor: VELOUR_TOKENS.borderSubtle,
                  color: '#FFF',
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: 13,
                  fontWeight: 600,
                  '&:hover': { borderColor: VELOUR_TOKENS.textPrimary, color: VELOUR_TOKENS.textPrimary },
                }}
              >
                Contact Support
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </PageShell>
  );
};
