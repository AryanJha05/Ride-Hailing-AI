import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Switch,
  FormControlLabel,
  Divider,
  Button,
  TextField,
  MenuItem,
  Grid,
  Alert,
  Snackbar,
} from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SecurityIcon from '@mui/icons-material/Security';
import MemoryIcon from '@mui/icons-material/Memory';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import SaveIcon from '@mui/icons-material/Save';
import MapIcon from '@mui/icons-material/Map';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import { PageShell } from '../../components/layout/PageShell';
import { VELOUR_TOKENS } from '../../theme/palette';
import { useAuth } from '../../auth/AuthContext';

export const DriverSettingsPage: React.FC = () => {
  const { user, updateProfile } = useAuth();

  // Driver Personal Details
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [vehicleMake, setVehicleMake] = useState(user?.vehicle_make || 'Toyota');
  const [vehicleModel, setVehicleModel] = useState(user?.vehicle_model || 'Camry Hybrid');
  const [vehiclePlate, setVehiclePlate] = useState(user?.vehicle_plate || 'NYC-TLC-7782');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // AI & Dispatch Preferences
  const [positioningAlerts, setPositioningAlerts] = useState<boolean>(() => {
    return localStorage.getItem('driver_positioning_alerts') !== 'false';
  });
  const [highDemandPrioritization, setHighDemandPrioritization] = useState<boolean>(() => {
    return localStorage.getItem('driver_high_demand_prio') !== 'false';
  });
  const [demandAlertFreq, setDemandAlertFreq] = useState<string>(() => {
    return localStorage.getItem('driver_demand_alert_freq') || '15m';
  });
  const [recommendationNotifs, setRecommendationNotifs] = useState<boolean>(() => {
    return localStorage.getItem('driver_rec_notifs') !== 'false';
  });

  // Navigation Preferences
  const [navProvider, setNavProvider] = useState<string>(() => {
    return localStorage.getItem('driver_nav_provider') || 'google';
  });
  const [voiceGuidance, setVoiceGuidance] = useState<boolean>(() => {
    return localStorage.getItem('driver_voice_guidance') !== 'false';
  });

  // Shift & Earnings Goals
  const [dailyTarget, setDailyTarget] = useState<string>(() => {
    return localStorage.getItem('driver_daily_target') || '300';
  });
  const [targetTrips, setTargetTrips] = useState<string>(() => {
    return localStorage.getItem('driver_target_trips') || '14';
  });
  const [maxShiftHours, setMaxShiftHours] = useState<string>(() => {
    return localStorage.getItem('driver_max_shift_hrs') || '10';
  });

  // Notifications & Privacy
  const [pushNotifs, setPushNotifs] = useState<boolean>(true);
  const [earningsNotifs, setEarningsNotifs] = useState<boolean>(true);
  const [preciseLocation, setPreciseLocation] = useState<boolean>(true);
  const [telemetryOptIn, setTelemetryOptIn] = useState<boolean>(true);

  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      if (user.phone) setPhone(user.phone);
      if (user.vehicle_make) setVehicleMake(user.vehicle_make);
      if (user.vehicle_model) setVehicleModel(user.vehicle_model);
      if (user.vehicle_plate) setVehiclePlate(user.vehicle_plate);
    }
  }, [user]);

  const handleSaveDriverSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim() || user?.name,
      email: email.trim() || user?.email,
      phone: phone.trim(),
      vehicle_make: vehicleMake.trim(),
      vehicle_model: vehicleModel.trim(),
      vehicle_plate: vehiclePlate.trim(),
    });

    localStorage.setItem('driver_positioning_alerts', String(positioningAlerts));
    localStorage.setItem('driver_high_demand_prio', String(highDemandPrioritization));
    localStorage.setItem('driver_demand_alert_freq', demandAlertFreq);
    localStorage.setItem('driver_rec_notifs', String(recommendationNotifs));
    localStorage.setItem('driver_nav_provider', navProvider);
    localStorage.setItem('driver_voice_guidance', String(voiceGuidance));
    localStorage.setItem('driver_daily_target', dailyTarget);
    localStorage.setItem('driver_target_trips', targetTrips);
    localStorage.setItem('driver_max_shift_hrs', maxShiftHours);

    setCurrentPassword('');
    setNewPassword('');
    setSnackbarMsg('Driver account & operational preferences saved successfully!');
    setSavedSuccess(true);
  };

  return (
    <PageShell title="Driver Preferences & Account Settings">
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#FFF', mb: 0.5 }}>
            Driver Account & Dispatch Settings
          </Typography>
          <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary }}>
            Manage your AI positioning guidance, shift goals, vehicle details, and account security.
          </Typography>
        </Box>

        <form onSubmit={handleSaveDriverSettings}>
          <Grid container spacing={3}>
            {/* 1. AI & DISPATCH PREFERENCES */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle, borderRadius: 3, height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <MemoryIcon sx={{ color: VELOUR_TOKENS.accentLavender }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFF', fontSize: 16 }}>
                    AI & Dispatch Intelligence
                  </Typography>
                </Box>
                <Divider sx={{ borderColor: VELOUR_TOKENS.borderSubtle, mb: 2 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={positioningAlerts}
                        onChange={(e) => setPositioningAlerts(e.target.checked)}
                        sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: VELOUR_TOKENS.accentPrimary } }}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body2" sx={{ color: '#FFF', fontWeight: 600 }}>
                          AI Positioning Recommendations
                        </Typography>
                        <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary }}>
                          Receive real-time map alerts for predicted high-demand zones.
                        </Typography>
                      </Box>
                    }
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={highDemandPrioritization}
                        onChange={(e) => setHighDemandPrioritization(e.target.checked)}
                        sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: VELOUR_TOKENS.accentTeal } }}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body2" sx={{ color: '#FFF', fontWeight: 600 }}>
                          High-Demand Surge Prioritization
                        </Typography>
                        <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary }}>
                          Prioritize dispatch routing toward &gt;1.5x surge clusters.
                        </Typography>
                      </Box>
                    }
                  />

                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="Demand Alert Frequency"
                    value={demandAlertFreq}
                    onChange={(e) => setDemandAlertFreq(e.target.value)}
                    sx={{ mt: 1 }}
                  >
                    <MenuItem value="5m">Every 5 Minutes (Real-Time)</MenuItem>
                    <MenuItem value="15m">Every 15 Minutes (Recommended)</MenuItem>
                    <MenuItem value="30m">Every 30 Minutes</MenuItem>
                    <MenuItem value="1h">Hourly Summaries Only</MenuItem>
                  </TextField>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={recommendationNotifs}
                        onChange={(e) => setRecommendationNotifs(e.target.checked)}
                        sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: VELOUR_TOKENS.accentGold } }}
                      />
                    }
                    label={
                      <Typography variant="body2" sx={{ color: '#FFF', fontWeight: 500 }}>
                        Enable Copilot Audio/Pop-up Notifications
                      </Typography>
                    }
                  />
                </Box>
              </Paper>
            </Grid>

            {/* 2. NAVIGATION PREFERENCES */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle, borderRadius: 3, height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <MapIcon sx={{ color: VELOUR_TOKENS.accentTeal }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFF', fontSize: 16 }}>
                    Navigation Provider & Routing
                  </Typography>
                </Box>
                <Divider sx={{ borderColor: VELOUR_TOKENS.borderSubtle, mb: 2 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="Default Navigation Engine"
                    value={navProvider}
                    onChange={(e) => setNavProvider(e.target.value)}
                  >
                    <MenuItem value="google">Google Maps (TLC Optimized)</MenuItem>
                    <MenuItem value="waze">Waze (Traffic & Hazards)</MenuItem>
                    <MenuItem value="apple">Apple Maps</MenuItem>
                    <MenuItem value="osm">OpenStreetMap Routing</MenuItem>
                  </TextField>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={voiceGuidance}
                        onChange={(e) => setVoiceGuidance(e.target.checked)}
                        sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: VELOUR_TOKENS.accentTeal } }}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body2" sx={{ color: '#FFF', fontWeight: 600 }}>
                          Turn-by-Turn Voice Prompts
                        </Typography>
                        <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary }}>
                          Spoken navigation alerts during active pickups & drop-offs.
                        </Typography>
                      </Box>
                    }
                  />
                </Box>
              </Paper>
            </Grid>

            {/* 3. SHIFT & EARNINGS GOALS */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <TrackChangesIcon sx={{ color: VELOUR_TOKENS.accentGold }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFF', fontSize: 16 }}>
                    Shift & Target Earnings Goals
                  </Typography>
                </Box>
                <Divider sx={{ borderColor: VELOUR_TOKENS.borderSubtle, mb: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Daily Earnings Target ($)"
                      type="number"
                      value={dailyTarget}
                      onChange={(e) => setDailyTarget(e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Target Shift Trips"
                      type="number"
                      value={targetTrips}
                      onChange={(e) => setTargetTrips(e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Max Shift Duration Goal (Hours)"
                      type="number"
                      value={maxShiftHours}
                      onChange={(e) => setMaxShiftHours(e.target.value)}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* 4. ACCOUNT & VEHICLE INFORMATION */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <PersonOutlineIcon sx={{ color: VELOUR_TOKENS.accentLavender }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFF', fontSize: 16 }}>
                    Account Details & Vehicle Identity
                  </Typography>
                </Box>
                <Divider sx={{ borderColor: VELOUR_TOKENS.borderSubtle, mb: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Driver Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Phone Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="TLC License Plate"
                      value={vehiclePlate}
                      onChange={(e) => setVehiclePlate(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Vehicle Make"
                      value={vehicleMake}
                      onChange={(e) => setVehicleMake(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Vehicle Model"
                      value={vehicleModel}
                      onChange={(e) => setVehicleModel(e.target.value)}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* 5. NOTIFICATIONS & PRIVACY */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3, backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <NotificationsActiveIcon sx={{ color: VELOUR_TOKENS.accentTeal }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFF', fontSize: 16 }}>
                    Driver Notifications & Privacy Controls
                  </Typography>
                </Box>
                <Divider sx={{ borderColor: VELOUR_TOKENS.borderSubtle, mb: 2 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={<Switch checked={pushNotifs} onChange={(e) => setPushNotifs(e.target.checked)} />}
                      label={
                        <Typography variant="body2" sx={{ color: '#FFF', fontWeight: 600 }}>
                          Mobile & Browser Push Notifications
                        </Typography>
                      }
                    />
                    <FormControlLabel
                      control={<Switch checked={earningsNotifs} onChange={(e) => setEarningsNotifs(e.target.checked)} />}
                      label={
                        <Typography variant="body2" sx={{ color: '#FFF', fontWeight: 600 }}>
                          Weekly Earnings Summaries
                        </Typography>
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={<Switch checked={preciseLocation} onChange={(e) => setPreciseLocation(e.target.checked)} />}
                      label={
                        <Typography variant="body2" sx={{ color: '#FFF', fontWeight: 600 }}>
                          High-Precision GPS Location Sharing
                        </Typography>
                      }
                    />
                    <FormControlLabel
                      control={<Switch checked={telemetryOptIn} onChange={(e) => setTelemetryOptIn(e.target.checked)} />}
                      label={
                        <Typography variant="body2" sx={{ color: '#FFF', fontWeight: 600 }}>
                          Anonymized Model Telemetry Sharing
                        </Typography>
                      }
                    />
                  </Grid>
                </Grid>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    sx={{
                      backgroundColor: VELOUR_TOKENS.accentPrimary,
                      fontWeight: 700,
                      px: 4,
                      py: 1.2,
                      borderRadius: 2,
                      '&:hover': { backgroundColor: VELOUR_TOKENS.accentPrimaryHover },
                    }}
                  >
                    Save Driver Settings
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </form>

        <Snackbar
          open={savedSuccess}
          autoHideDuration={4000}
          onClose={() => setSavedSuccess(false)}
        >
          <Alert severity="success" sx={{ backgroundColor: VELOUR_TOKENS.bgSurface1, color: '#FFF' }}>
            {snackbarMsg}
          </Alert>
        </Snackbar>
      </Container>
    </PageShell>
  );
};
