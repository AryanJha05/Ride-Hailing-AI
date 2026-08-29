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
  Chip,
} from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SecurityIcon from '@mui/icons-material/Security';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import MemoryIcon from '@mui/icons-material/Memory';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import SaveIcon from '@mui/icons-material/Save';
import { PageShell } from '../../components/layout/PageShell';
import { VELOUR_TOKENS } from '../../theme/palette';
import { useAuth } from '../../auth/AuthContext';
import { UserRole } from '../../auth/roles';

export const Settings: React.FC = () => {
  const { user, role, updateProfile } = useAuth();

  // Driver Profile State
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '+1 (555) 234-5678');
  const [vehicleMake, setVehicleMake] = useState(user?.vehicle_make || 'Toyota');
  const [vehicleModel, setVehicleModel] = useState(user?.vehicle_model || 'Camry Hybrid');
  const [vehiclePlate, setVehiclePlate] = useState(user?.vehicle_plate || 'NYC-TLC-7782');

  // Sync state if user changes
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

  // Driver Preference Switches & Inputs
  const [positioningAlerts, setPositioningAlerts] = useState<boolean>(() => {
    return localStorage.getItem('pref_positioning_alerts') !== 'false';
  });
  const [autoAcceptSurge, setAutoAcceptSurge] = useState<boolean>(() => {
    return localStorage.getItem('pref_auto_accept_surge') !== 'false';
  });
  const [navProvider, setNavProvider] = useState<string>(() => {
    return localStorage.getItem('pref_nav_provider') || 'google';
  });
  const [dailyTarget, setDailyTarget] = useState<string>(() => {
    return localStorage.getItem('pref_daily_target') || '300';
  });
  const [targetTrips, setTargetTrips] = useState<string>(() => {
    return localStorage.getItem('pref_target_trips') || '14';
  });

  // Admin Configuration State
  const [maxFleetSize, setMaxFleetSize] = useState<string>('500');
  const [autoApproveDrivers, setAutoApproveDrivers] = useState<boolean>(true);
  const [modelHorizon, setModelHorizon] = useState<string>('24h');
  const [maxSurgeCap, setMaxSurgeCap] = useState<string>('3.0x');
  const [retrainingInterval, setRetrainingInterval] = useState<string>('weekly');
  const [latencyAlertMs, setLatencyAlertMs] = useState<string>('250');
  const [auditLogging, setAuditLogging] = useState<boolean>(true);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('Settings updated successfully!');

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

    localStorage.setItem('pref_positioning_alerts', String(positioningAlerts));
    localStorage.setItem('pref_auto_accept_surge', String(autoAcceptSurge));
    localStorage.setItem('pref_nav_provider', navProvider);
    localStorage.setItem('pref_daily_target', dailyTarget);
    localStorage.setItem('pref_target_trips', targetTrips);

    setSnackbarMsg('Driver account profile & operational preferences updated!');
    setSavedSuccess(true);
  };

  const handleSaveAdminSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSnackbarMsg('Enterprise fleet governance & AI model settings saved!');
    setSavedSuccess(true);
  };

  const isAdmin = role === UserRole.ADMIN;

  return (
    <PageShell title={isAdmin ? 'Fleet Admin Settings & Platform Governance' : 'Driver Account & Operational Settings'}>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* Header Title Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3.5, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#FFF', mb: 0.5 }}>
              {isAdmin ? 'Admin Governance Settings' : 'Driver Account & Platform Settings'}
            </Typography>
            <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary }}>
              {isAdmin
                ? 'Manage fleet operational limits, model inference parameters, access rules, and audit controls.'
                : 'Manage profile details, vehicle details, AI positioning alerts, navigation integration, and shift goals.'}
            </Typography>
          </Box>
          <Chip
            icon={isAdmin ? <AdminPanelSettingsIcon sx={{ fontSize: '15px !important', color: '#FFF !important' }} /> : <PersonOutlineIcon sx={{ fontSize: '15px !important', color: '#FFF !important' }} />}
            label={isAdmin ? 'Role: Administrator' : 'Role: Verified Driver'}
            sx={{
              backgroundColor: isAdmin ? 'rgba(0, 217, 192, 0.15)' : 'rgba(124, 58, 237, 0.15)',
              color: isAdmin ? VELOUR_TOKENS.accentTeal : VELOUR_TOKENS.accentLavender,
              borderColor: isAdmin ? 'rgba(0, 217, 192, 0.3)' : 'rgba(124, 58, 237, 0.3)',
              borderWidth: 1,
              borderStyle: 'solid',
              fontWeight: 700,
              fontSize: 12,
              px: 0.5,
            }}
          />
        </Box>

        {/* DRIVER SETTINGS VIEW */}
        {!isAdmin && (
          <form onSubmit={handleSaveDriverSettings}>
            <Grid container spacing={3}>
              {/* Account Details & Vehicle Card */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle, borderRadius: 3, mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 2 }}>
                    <PersonOutlineIcon sx={{ color: VELOUR_TOKENS.accentLavender }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFF', fontSize: 16 }}>
                      Account & Contact Details
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      size="small"
                      InputLabelProps={{ style: { color: VELOUR_TOKENS.textSecondary } }}
                      sx={{ backgroundColor: VELOUR_TOKENS.bgSurface2 }}
                    />
                    <TextField
                      fullWidth
                      label="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      size="small"
                      InputLabelProps={{ style: { color: VELOUR_TOKENS.textSecondary } }}
                      sx={{ backgroundColor: VELOUR_TOKENS.bgSurface2 }}
                    />
                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      size="small"
                      InputLabelProps={{ style: { color: VELOUR_TOKENS.textSecondary } }}
                      sx={{ backgroundColor: VELOUR_TOKENS.bgSurface2 }}
                    />
                  </Box>
                </Paper>

                <Paper sx={{ p: 3, backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle, borderRadius: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 2 }}>
                    <DirectionsCarIcon sx={{ color: VELOUR_TOKENS.accentTeal }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFF', fontSize: 16 }}>
                      Vehicle Information
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Vehicle Make"
                          value={vehicleMake}
                          onChange={(e) => setVehicleMake(e.target.value)}
                          size="small"
                          InputLabelProps={{ style: { color: VELOUR_TOKENS.textSecondary } }}
                          sx={{ backgroundColor: VELOUR_TOKENS.bgSurface2 }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Vehicle Model"
                          value={vehicleModel}
                          onChange={(e) => setVehicleModel(e.target.value)}
                          size="small"
                          InputLabelProps={{ style: { color: VELOUR_TOKENS.textSecondary } }}
                          sx={{ backgroundColor: VELOUR_TOKENS.bgSurface2 }}
                        />
                      </Grid>
                    </Grid>
                    <TextField
                      fullWidth
                      label="TLC License Plate / Registration"
                      value={vehiclePlate}
                      onChange={(e) => setVehiclePlate(e.target.value)}
                      size="small"
                      InputLabelProps={{ style: { color: VELOUR_TOKENS.textSecondary } }}
                      sx={{ backgroundColor: VELOUR_TOKENS.bgSurface2 }}
                    />
                  </Box>
                </Paper>
              </Grid>

              {/* AI Guidance & Shift Goals Card */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle, borderRadius: 3, mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 2 }}>
                    <MemoryIcon sx={{ color: VELOUR_TOKENS.accentGold }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFF', fontSize: 16 }}>
                      AI Guidance & Navigation Rules
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={positioningAlerts}
                          onChange={(e) => setPositioningAlerts(e.target.checked)}
                          sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: VELOUR_TOKENS.accentTeal } }}
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="subtitle2" sx={{ color: '#FFF', fontWeight: 600 }}>
                            AI Positioning Recommendations
                          </Typography>
                          <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary }}>
                            Receive automated alerts when demand spikes in nearby TLC zones.
                          </Typography>
                        </Box>
                      }
                    />

                    <Divider sx={{ borderColor: VELOUR_TOKENS.borderSubtle }} />

                    <FormControlLabel
                      control={
                        <Switch
                          checked={autoAcceptSurge}
                          onChange={(e) => setAutoAcceptSurge(e.target.checked)}
                          sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: VELOUR_TOKENS.accentPrimary } }}
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="subtitle2" sx={{ color: '#FFF', fontWeight: 600 }}>
                            High-Demand Surge Priority
                          </Typography>
                          <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary }}>
                            Highlight high-multiplier opportunities in copilot feed.
                          </Typography>
                        </Box>
                      }
                    />

                    <Divider sx={{ borderColor: VELOUR_TOKENS.borderSubtle }} />

                    <Box sx={{ mt: 0.5 }}>
                      <Typography variant="subtitle2" sx={{ color: '#FFF', fontWeight: 600, mb: 1 }}>
                        Preferred Navigation Provider
                      </Typography>
                      <TextField
                        select
                        fullWidth
                        size="small"
                        value={navProvider}
                        onChange={(e) => setNavProvider(e.target.value)}
                        sx={{ backgroundColor: VELOUR_TOKENS.bgSurface2, color: '#FFF' }}
                      >
                        <MenuItem value="google">Google Maps Navigation</MenuItem>
                        <MenuItem value="waze">Waze Live Traffic</MenuItem>
                        <MenuItem value="nycdot">NYC DOT Traffic Feed</MenuItem>
                      </TextField>
                    </Box>
                  </Box>
                </Paper>

                <Paper sx={{ p: 3, backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle, borderRadius: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFF', fontSize: 16, mb: 2 }}>
                    Shift Target Goals
                  </Typography>

                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Daily Target Earnings ($)"
                        value={dailyTarget}
                        onChange={(e) => setDailyTarget(e.target.value)}
                        size="small"
                        InputLabelProps={{ style: { color: VELOUR_TOKENS.textSecondary } }}
                        sx={{ backgroundColor: VELOUR_TOKENS.bgSurface2 }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Target Shift Trips"
                        value={targetTrips}
                        onChange={(e) => setTargetTrips(e.target.value)}
                        size="small"
                        InputLabelProps={{ style: { color: VELOUR_TOKENS.textSecondary } }}
                        sx={{ backgroundColor: VELOUR_TOKENS.bgSurface2 }}
                      />
                    </Grid>
                  </Grid>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    startIcon={<SaveIcon />}
                    sx={{ backgroundColor: VELOUR_TOKENS.accentPrimary, fontWeight: 700, py: 1.2 }}
                  >
                    Save Driver Profile & Settings
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          </form>
        )}

        {/* ADMIN SETTINGS VIEW */}
        {isAdmin && (
          <form onSubmit={handleSaveAdminSettings}>
            <Grid container spacing={3}>
              {/* Fleet & User Access Governance */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle, borderRadius: 3, mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 2 }}>
                    <AdminPanelSettingsIcon sx={{ color: VELOUR_TOKENS.accentTeal }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFF', fontSize: 16 }}>
                      Fleet Governance & User Controls
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                      fullWidth
                      label="Maximum Operating Fleet Size"
                      value={maxFleetSize}
                      onChange={(e) => setMaxFleetSize(e.target.value)}
                      size="small"
                      InputLabelProps={{ style: { color: VELOUR_TOKENS.textSecondary } }}
                      sx={{ backgroundColor: VELOUR_TOKENS.bgSurface2 }}
                    />

                    <FormControlLabel
                      control={
                        <Switch
                          checked={autoApproveDrivers}
                          onChange={(e) => setAutoApproveDrivers(e.target.checked)}
                          sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: VELOUR_TOKENS.accentTeal } }}
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="subtitle2" sx={{ color: '#FFF', fontWeight: 600 }}>
                            Auto-Approve Driver Registrations
                          </Typography>
                          <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary }}>
                            Automatically verify TLC licenses with status Active upon registration.
                          </Typography>
                        </Box>
                      }
                    />

                    <Divider sx={{ borderColor: VELOUR_TOKENS.borderSubtle }} />

                    <FormControlLabel
                      control={
                        <Switch
                          checked={auditLogging}
                          onChange={(e) => setAuditLogging(e.target.checked)}
                          sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: VELOUR_TOKENS.accentGold } }}
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="subtitle2" sx={{ color: '#FFF', fontWeight: 600 }}>
                            Enterprise Audit Logging
                          </Typography>
                          <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary }}>
                            Record all admin actions, role elevation, and model parameter tweaks.
                          </Typography>
                        </Box>
                      }
                    />
                  </Box>
                </Paper>
              </Grid>

              {/* AI Model & Inference Parameters */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle, borderRadius: 3, mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 2 }}>
                    <MemoryIcon sx={{ color: VELOUR_TOKENS.accentLavender }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFF', fontSize: 16 }}>
                      AI Model Inference & Thresholds
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, mb: 0.5, display: 'block' }}>
                          Demand Forecast Horizon
                        </Typography>
                        <TextField
                          select
                          fullWidth
                          size="small"
                          value={modelHorizon}
                          onChange={(e) => setModelHorizon(e.target.value)}
                          sx={{ backgroundColor: VELOUR_TOKENS.bgSurface2 }}
                        >
                          <MenuItem value="12h">12 Hours Ahead</MenuItem>
                          <MenuItem value="24h">24 Hours Ahead (Standard)</MenuItem>
                          <MenuItem value="48h">48 Hours Ahead</MenuItem>
                        </TextField>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, mb: 0.5, display: 'block' }}>
                          Maximum Surge Multiplier
                        </Typography>
                        <TextField
                          select
                          fullWidth
                          size="small"
                          value={maxSurgeCap}
                          onChange={(e) => setMaxSurgeCap(e.target.value)}
                          sx={{ backgroundColor: VELOUR_TOKENS.bgSurface2 }}
                        >
                          <MenuItem value="2.0x">2.0x Cap</MenuItem>
                          <MenuItem value="3.0x">3.0x Cap (Standard)</MenuItem>
                          <MenuItem value="5.0x">5.0x Cap</MenuItem>
                        </TextField>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, mb: 0.5, display: 'block' }}>
                          Model Retraining Interval
                        </Typography>
                        <TextField
                          select
                          fullWidth
                          size="small"
                          value={retrainingInterval}
                          onChange={(e) => setRetrainingInterval(e.target.value)}
                          sx={{ backgroundColor: VELOUR_TOKENS.bgSurface2 }}
                        >
                          <MenuItem value="daily">Daily</MenuItem>
                          <MenuItem value="weekly">Weekly</MenuItem>
                          <MenuItem value="monthly">Monthly</MenuItem>
                        </TextField>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, mb: 0.5, display: 'block' }}>
                          Latency Alert Threshold
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          value={latencyAlertMs}
                          onChange={(e) => setLatencyAlertMs(e.target.value)}
                          InputProps={{ endAdornment: <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary }}>ms</Typography> }}
                          sx={{ backgroundColor: VELOUR_TOKENS.bgSurface2 }}
                        />
                      </Grid>
                    </Grid>

                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      startIcon={<SaveIcon />}
                      sx={{ backgroundColor: VELOUR_TOKENS.accentTeal, color: '#000', fontWeight: 700, mt: 1, py: 1.2, '&:hover': { backgroundColor: '#00BFA5' } }}
                    >
                      Save Admin & Governance Settings
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </form>
        )}

        {/* Snackbar Notification */}
        <Snackbar
          open={savedSuccess}
          autoHideDuration={3500}
          onClose={() => setSavedSuccess(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={() => setSavedSuccess(false)} severity="success" sx={{ width: '100%', fontWeight: 600 }}>
            {snackbarMsg}
          </Alert>
        </Snackbar>
      </Container>
    </PageShell>
  );
};
