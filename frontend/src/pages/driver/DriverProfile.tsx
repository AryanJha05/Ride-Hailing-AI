import React from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Avatar,
  Divider,
} from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import BadgeIcon from '@mui/icons-material/Badge';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SettingsIcon from '@mui/icons-material/Settings';
import PaymentsIcon from '@mui/icons-material/Payments';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import ShieldIcon from '@mui/icons-material/Shield';
import SpeedIcon from '@mui/icons-material/Speed';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useNavigate } from 'react-router-dom';
import { PageShell } from '../../components/layout/PageShell';
import { useDriverPerformance } from '../../hooks/useRideApi';
import { useAuth } from '../../auth/AuthContext';
import { VELOUR_TOKENS } from '../../theme/palette';
import { ROUTES } from '../../routes/routes';

export const DriverProfile: React.FC = () => {
  const { data: driver } = useDriverPerformance();
  const { user } = useAuth();
  const navigate = useNavigate();

  const name = driver?.name || user?.name || 'Aryan Jha';
  const email = driver?.email || user?.email || 'aryan.driver@rideai.demo';
  const phone = user?.phone || '+91 98765 43210';
  const rating = driver?.rating ?? user?.rating ?? 4.94;
  const totalTrips = driver?.total_trips ?? user?.total_trips ?? 1284;
  const acceptanceRate = driver?.acceptance_rate ? `${driver.acceptance_rate}%` : '96.4%';
  const cancellationRate = driver?.cancellation_rate ? `${driver.cancellation_rate}%` : '1.2%';
  const vehicle = user?.vehicle || `${user?.vehicle_make || 'Toyota'} ${user?.vehicle_model || 'Camry Hybrid'}`;
  const licensePlate = user?.vehicle_plate || 'NYC-TLC-7782';
  const licenseNumber = user?.license_number || 'NYC-TLC-99821';
  const badge = user?.badge || 'Platinum Fleet Driver';

  return (
    <PageShell title="Driver User Profile">
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* Top Header Card */}
        <Card sx={{ backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle, mb: 3 }}>
          <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
            <Avatar
              src={user?.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"}
              alt={name}
              sx={{
                width: 84,
                height: 84,
                border: `2px solid ${VELOUR_TOKENS.accentGold}`,
                boxShadow: '0 4px 20px rgba(212, 175, 55, 0.2)',
              }}
            />

            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5, flexWrap: 'wrap' }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#FFF' }}>
                  {name}
                </Typography>
                <Chip
                  icon={<VerifiedUserIcon sx={{ fontSize: '14px !important', color: `${VELOUR_TOKENS.accentGold} !important` }} />}
                  label={`${badge} · ${vehicle}`}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(212, 175, 55, 0.12)',
                    color: VELOUR_TOKENS.accentGold,
                    border: `1px solid rgba(212, 175, 55, 0.3)`,
                    fontWeight: 600,
                    fontSize: 12,
                  }}
                />
                <Chip
                  icon={<CheckCircleIcon sx={{ fontSize: '14px !important', color: `${VELOUR_TOKENS.accentTeal} !important` }} />}
                  label="Active Shift Status"
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(0, 217, 192, 0.12)',
                    color: VELOUR_TOKENS.accentTeal,
                    border: `1px solid rgba(0, 217, 192, 0.3)`,
                    fontWeight: 600,
                    fontSize: 12,
                  }}
                />
              </Box>
              <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary, mb: 1 }}>
                {email} · {phone} · NYC Metro Fleet
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <StarIcon sx={{ color: VELOUR_TOKENS.accentGold, fontSize: 18 }} />
                  <Typography className="mono-num" variant="subtitle2" sx={{ color: '#FFF', fontWeight: 700 }}>
                    {rating} Rating
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary }}>•</Typography>
                <Typography className="mono-num" variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary }}>
                  {totalTrips} Shift Trips Logged
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              startIcon={<SettingsIcon />}
              onClick={() => navigate(ROUTES.DRIVER.SETTINGS)}
              sx={{
                backgroundColor: VELOUR_TOKENS.accentPrimary,
                fontWeight: 700,
                borderRadius: 2,
                px: 2.5,
                '&:hover': { backgroundColor: VELOUR_TOKENS.accentPrimaryHover },
              }}
            >
              Account Settings
            </Button>
          </CardContent>
        </Card>

        {/* 5-Section Detailed Profile View */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {/* SECTION 1: PERSONAL INFORMATION */}
          <Grid item xs={12} md={6}>
            <Card sx={{ backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle, height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <PersonOutlineIcon sx={{ color: VELOUR_TOKENS.accentLavender }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFF', fontSize: 16 }}>
                    1. Personal Information
                  </Typography>
                </Box>
                <Divider sx={{ borderColor: VELOUR_TOKENS.borderSubtle, mb: 2 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, display: 'block' }}>
                      Full Legal Name
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#FFF', fontWeight: 600 }}>
                      {name}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <EmailIcon sx={{ color: VELOUR_TOKENS.accentTeal, fontSize: 18 }} />
                    <Box>
                      <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, display: 'block' }}>
                        Account Email Address
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#FFF', fontWeight: 500 }}>
                        {email}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <PhoneIcon sx={{ color: VELOUR_TOKENS.accentGold, fontSize: 18 }} />
                    <Box>
                      <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, display: 'block' }}>
                        Primary Contact Phone
                      </Typography>
                      <Typography className="mono-num" variant="body2" sx={{ color: '#FFF', fontWeight: 500 }}>
                        {phone}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <ShieldIcon sx={{ color: VELOUR_TOKENS.accentTeal, fontSize: 18 }} />
                    <Box>
                      <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, display: 'block' }}>
                        Identity & Background Status
                      </Typography>
                      <Typography variant="body2" sx={{ color: VELOUR_TOKENS.accentTeal, fontWeight: 600 }}>
                        Background Cleared · Verified TLC Identity
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* SECTION 2: DRIVER INFORMATION */}
          <Grid item xs={12} md={6}>
            <Card sx={{ backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle, height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <BadgeIcon sx={{ color: VELOUR_TOKENS.accentGold }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFF', fontSize: 16 }}>
                    2. Driver Credentials & Standing
                  </Typography>
                </Box>
                <Divider sx={{ borderColor: VELOUR_TOKENS.borderSubtle, mb: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, display: 'block' }}>
                      Driver Fleet ID
                    </Typography>
                    <Typography className="mono-num" variant="body2" sx={{ color: '#FFF', fontWeight: 700 }}>
                      DRV-2026-8812
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, display: 'block' }}>
                      Driver Tier / Badge
                    </Typography>
                    <Typography variant="body2" sx={{ color: VELOUR_TOKENS.accentGold, fontWeight: 700 }}>
                      {badge}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, display: 'block' }}>
                      Acceptance Rate
                    </Typography>
                    <Typography className="mono-num" variant="body2" sx={{ color: '#FFF', fontWeight: 700 }}>
                      {acceptanceRate}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, display: 'block' }}>
                      Cancellation Rate
                    </Typography>
                    <Typography className="mono-num" variant="body2" sx={{ color: '#FFF', fontWeight: 700 }}>
                      {cancellationRate}
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1 }}>
                      <CalendarMonthIcon sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 18 }} />
                      <Box>
                        <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, display: 'block' }}>
                          Member Experience / Join Date
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#FFF', fontWeight: 600 }}>
                          January 15, 2024 (2+ Years Seniority)
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* SECTION 3: VEHICLE INFORMATION */}
          <Grid item xs={12} md={6}>
            <Card sx={{ backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle, height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <DirectionsCarIcon sx={{ color: VELOUR_TOKENS.accentTeal }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFF', fontSize: 16 }}>
                    3. Vehicle & Registration
                  </Typography>
                </Box>
                <Divider sx={{ borderColor: VELOUR_TOKENS.borderSubtle, mb: 2 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, display: 'block' }}>
                      Registered Vehicle Make / Model
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#FFF', fontWeight: 700 }}>
                      {vehicle}
                    </Typography>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, display: 'block' }}>
                        Vehicle Category
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#FFF', fontWeight: 600 }}>
                        Electric Hybrid Sedan
                      </Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, display: 'block' }}>
                        Vehicle Plate Identifier
                      </Typography>
                      <Typography className="mono-num" variant="body2" sx={{ color: VELOUR_TOKENS.accentTeal, fontWeight: 700 }}>
                        {licensePlate}
                      </Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, display: 'block' }}>
                        TLC License ID
                      </Typography>
                      <Typography className="mono-num" variant="body2" sx={{ color: '#FFF', fontWeight: 600 }}>
                        {licenseNumber}
                      </Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, display: 'block' }}>
                        Inspection Status
                      </Typography>
                      <Chip
                        label="Compliant / Active"
                        size="small"
                        sx={{ backgroundColor: 'rgba(0, 217, 192, 0.15)', color: VELOUR_TOKENS.accentTeal, fontSize: 11, fontWeight: 700 }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* SECTION 4: ACCOUNT INFORMATION */}
          <Grid item xs={12} md={6}>
            <Card sx={{ backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle, height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <AccessTimeIcon sx={{ color: VELOUR_TOKENS.accentLavender }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFF', fontSize: 16 }}>
                    4. Account Security & Audit
                  </Typography>
                </Box>
                <Divider sx={{ borderColor: VELOUR_TOKENS.borderSubtle, mb: 2 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, display: 'block' }}>
                        Account Creation Date
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#FFF', fontWeight: 600 }}>
                        Jan 15, 2024
                      </Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, display: 'block' }}>
                        Last Active Timestamp
                      </Typography>
                      <Typography variant="body2" sx={{ color: VELOUR_TOKENS.accentTeal, fontWeight: 600 }}>
                        Just Now (Live Shift)
                      </Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, display: 'block' }}>
                        Auth System Role
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#FFF', fontWeight: 600 }}>
                        DRIVER (Role-based)
                      </Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, display: 'block' }}>
                        Operating Network Hub
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#FFF', fontWeight: 600 }}>
                        NYC Metro Network
                      </Typography>
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 1, p: 1.5, borderRadius: 2, backgroundColor: 'rgba(255, 255, 255, 0.03)', border: `1px solid ${VELOUR_TOKENS.borderSubtle}` }}>
                    <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, display: 'block' }}>
                      Security Status
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#FFF', fontSize: 13, fontWeight: 500 }}>
                      Two-Factor Auth Enabled · JWT Session Active
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* SECTION 5: PERFORMANCE SUMMARY */}
          <Grid item xs={12}>
            <Card sx={{ backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <SpeedIcon sx={{ color: VELOUR_TOKENS.accentGold }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFF', fontSize: 16 }}>
                    5. Performance & Telemetry Summary
                  </Typography>
                </Box>
                <Divider sx={{ borderColor: VELOUR_TOKENS.borderSubtle, mb: 3 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={2.4}>
                    <Box sx={{ p: 2, borderRadius: 2, backgroundColor: 'rgba(255, 255, 255, 0.03)', border: `1px solid ${VELOUR_TOKENS.borderSubtle}`, textAlign: 'center' }}>
                      <StarIcon sx={{ color: VELOUR_TOKENS.accentGold, mb: 0.5 }} />
                      <Typography className="mono-num" variant="h5" sx={{ fontWeight: 700, color: '#FFF' }}>
                        {rating}
                      </Typography>
                      <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary }}>
                        Driver Rating
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6} md={2.4}>
                    <Box sx={{ p: 2, borderRadius: 2, backgroundColor: 'rgba(255, 255, 255, 0.03)', border: `1px solid ${VELOUR_TOKENS.borderSubtle}`, textAlign: 'center' }}>
                      <CheckCircleIcon sx={{ color: VELOUR_TOKENS.accentTeal, mb: 0.5 }} />
                      <Typography className="mono-num" variant="h5" sx={{ fontWeight: 700, color: '#FFF' }}>
                        {totalTrips}
                      </Typography>
                      <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary }}>
                        Completed Trips
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6} md={2.4}>
                    <Box sx={{ p: 2, borderRadius: 2, backgroundColor: 'rgba(255, 255, 255, 0.03)', border: `1px solid ${VELOUR_TOKENS.borderSubtle}`, textAlign: 'center' }}>
                      <PaymentsIcon sx={{ color: VELOUR_TOKENS.accentTeal, mb: 0.5 }} />
                      <Typography className="mono-num" variant="h5" sx={{ fontWeight: 700, color: VELOUR_TOKENS.accentTeal }}>
                        $1,284.50
                      </Typography>
                      <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary }}>
                        Weekly Earnings
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6} md={2.4}>
                    <Box sx={{ p: 2, borderRadius: 2, backgroundColor: 'rgba(255, 255, 255, 0.03)', border: `1px solid ${VELOUR_TOKENS.borderSubtle}`, textAlign: 'center' }}>
                      <SpeedIcon sx={{ color: VELOUR_TOKENS.accentLavender, mb: 0.5 }} />
                      <Typography className="mono-num" variant="h5" sx={{ fontWeight: 700, color: '#FFF' }}>
                        {acceptanceRate}
                      </Typography>
                      <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary }}>
                        Acceptance Rate
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6} md={2.4}>
                    <Box sx={{ p: 2, borderRadius: 2, backgroundColor: 'rgba(255, 255, 255, 0.03)', border: `1px solid ${VELOUR_TOKENS.borderSubtle}`, textAlign: 'center' }}>
                      <CancelIcon sx={{ color: VELOUR_TOKENS.accentGold, mb: 0.5 }} />
                      <Typography className="mono-num" variant="h5" sx={{ fontWeight: 700, color: '#FFF' }}>
                        {cancellationRate}
                      </Typography>
                      <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary }}>
                        Cancellation Rate
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </PageShell>
  );
};
