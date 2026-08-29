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
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import MemoryIcon from '@mui/icons-material/Memory';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SecurityIcon from '@mui/icons-material/Security';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import SaveIcon from '@mui/icons-material/Save';
import LanIcon from '@mui/icons-material/Lan';
import { PageShell } from '../../components/layout/PageShell';
import { VELOUR_TOKENS } from '../../theme/palette';
import { useAuth } from '../../auth/AuthContext';

export const AdminSettingsPage: React.FC = () => {
  const { user, updateProfile } = useAuth();

  // Admin Account Details
  const [adminName, setAdminName] = useState(user?.name || 'Suraj Panigrahi');
  const [adminEmail, setAdminEmail] = useState(user?.email || 'suraj.admin@rideai.demo');
  const [adminPhone, setAdminPhone] = useState(user?.phone || '+91 98765 00000');

  // Platform & Environment
  const [environmentMode, setEnvironmentMode] = useState('demo');
  const [operatingRegion, setOperatingRegion] = useState('nyc_metro');
  const [timeZone, setTimeZone] = useState('EST (UTC-5)');

  // AI / ML Model Preferences
  const [forecastHorizon, setForecastHorizon] = useState('24h');
  const [retrainingInterval, setRetrainingInterval] = useState('weekly');
  const [ollamaEndpoint, setOllamaEndpoint] = useState('http://localhost:8001');
  const [hdbscanThreshold, setHdbscanThreshold] = useState('0.85');

  // NOC & Telemetry Monitoring
  const [latencyAlertMs, setLatencyAlertMs] = useState('250');
  const [telemetryRefreshSec, setTelemetryRefreshSec] = useState('10');
  const [healthProbeFreqSec, setHealthProbeFreqSec] = useState('5');
  const [logRetentionDays, setLogRetentionDays] = useState('30');
  const [auditLogging, setAuditLogging] = useState(true);

  // Fleet Operations Defaults
  const [maxFleetSize, setMaxFleetSize] = useState('500');
  const [autoApproveDrivers, setAutoApproveDrivers] = useState(true);
  const [maxSurgeCap, setMaxSurgeCap] = useState('3.5x');

  // NOC Alert Preferences
  const [serviceOutageAlerts, setServiceOutageAlerts] = useState(true);
  const [latencyThresholdAlerts, setLatencyThresholdAlerts] = useState(true);
  const [modelFailureEmailAlerts, setModelFailureEmailAlerts] = useState(true);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');

  useEffect(() => {
    if (user) {
      setAdminName(user.name);
      setAdminEmail(user.email);
      if (user.phone) setAdminPhone(user.phone);
    }
  }, [user]);

  const handleSaveAdminSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: adminName.trim() || user?.name,
      email: adminEmail.trim() || user?.email,
      phone: adminPhone.trim(),
    });

    localStorage.setItem('admin_env_mode', environmentMode);
    localStorage.setItem('admin_forecast_horizon', forecastHorizon);
    localStorage.setItem('admin_telemetry_refresh', telemetryRefreshSec);
    localStorage.setItem('admin_max_fleet', maxFleetSize);

    setSnackbarMsg('Enterprise NOC & Fleet Operations settings updated successfully!');
    setSavedSuccess(true);
  };

  return (
    <PageShell title="Admin & NOC Platform Settings">
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#FFF', mb: 0.5 }}>
              Enterprise NOC & Fleet Configuration
            </Typography>
            <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary }}>
              Configure AI model runtime, telemetry probe intervals, fleet controls, and NOC alerts.
            </Typography>
          </Box>
          <Chip
            icon={<AdminPanelSettingsIcon sx={{ fontSize: '14px !important', color: `${VELOUR_TOKENS.accentGold} !important` }} />}
            label="ADMIN / NOC CONTROL LEVEL"
            size="small"
            sx={{
              backgroundColor: 'rgba(212, 175, 55, 0.12)',
              color: VELOUR_TOKENS.accentGold,
              borderColor: 'rgba(212, 175, 55, 0.3)',
              borderWidth: 1,
              borderStyle: 'solid',
              fontWeight: 700,
              fontSize: 11,
            }}
          />
        </Box>

        <form onSubmit={handleSaveAdminSettings}>
          <Grid container spacing={3}>
            {/* 1. PLATFORM & ENVIRONMENT */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle, borderRadius: 3, height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <LanIcon sx={{ color: VELOUR_TOKENS.accentLavender }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFF', fontSize: 16 }}>
                    1. Platform & Network Architecture
                  </Typography>
                </Box>
                <Divider sx={{ borderColor: VELOUR_TOKENS.borderSubtle, mb: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      label="Deployment Mode"
                      value={environmentMode}
                      onChange={(e) => setEnvironmentMode(e.target.value)}
                    >
                      <MenuItem value="demo">Demo Development Mode</MenuItem>
                      <MenuItem value="staging">Staging Cluster</MenuItem>
                      <MenuItem value="production">Production NOC Cluster</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      label="Operating Regional Network"
                      value={operatingRegion}
                      onChange={(e) => setOperatingRegion(e.target.value)}
                    >
                      <MenuItem value="nyc_metro">NYC Metro Network (Default)</MenuItem>
                      <MenuItem value="mumbai">Mumbai Fleet Region</MenuItem>
                      <MenuItem value="delhi">NCR Delhi Region</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      label="System Timezone Standard"
                      value={timeZone}
                      onChange={(e) => setTimeZone(e.target.value)}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* 2. AI / ML MODEL CONFIGURATION */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle, borderRadius: 3, height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <MemoryIcon sx={{ color: VELOUR_TOKENS.accentTeal }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFF', fontSize: 16 }}>
                    2. AI / ML Engine & Microservice Pipeline
                  </Typography>
                </Box>
                <Divider sx={{ borderColor: VELOUR_TOKENS.borderSubtle, mb: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      label="LSTM Forecast Horizon"
                      value={forecastHorizon}
                      onChange={(e) => setForecastHorizon(e.target.value)}
                    >
                      <MenuItem value="12h">12-Hour Horizon</MenuItem>
                      <MenuItem value="24h">24-Hour Rolling (Default)</MenuItem>
                      <MenuItem value="48h">48-Hour Horizon</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      label="Retraining Interval"
                      value={retrainingInterval}
                      onChange={(e) => setRetrainingInterval(e.target.value)}
                    >
                      <MenuItem value="daily">Daily Pipeline</MenuItem>
                      <MenuItem value="weekly">Weekly Auto-Retrain</MenuItem>
                      <MenuItem value="manual">Manual Trigger Only</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Ollama LLM Microservice Endpoint"
                      value={ollamaEndpoint}
                      onChange={(e) => setOllamaEndpoint(e.target.value)}
                      helperText="Default: http://localhost:8001"
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* 3. NOC / TELEMETRY MONITORING */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <MonitorHeartIcon sx={{ color: VELOUR_TOKENS.accentGold }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFF', fontSize: 16 }}>
                    3. NOC Telemetry & Probe Controls
                  </Typography>
                </Box>
                <Divider sx={{ borderColor: VELOUR_TOKENS.borderSubtle, mb: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Latency Warning Threshold (ms)"
                      type="number"
                      value={latencyAlertMs}
                      onChange={(e) => setLatencyAlertMs(e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Telemetry Refresh Interval (sec)"
                      type="number"
                      value={telemetryRefreshSec}
                      onChange={(e) => setTelemetryRefreshSec(e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Health Check Probe (sec)"
                      type="number"
                      value={healthProbeFreqSec}
                      onChange={(e) => setHealthProbeFreqSec(e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Audit Log Retention (Days)"
                      type="number"
                      value={logRetentionDays}
                      onChange={(e) => setLogRetentionDays(e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={auditLogging}
                          onChange={(e) => setAuditLogging(e.target.checked)}
                          sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: VELOUR_TOKENS.accentTeal } }}
                        />
                      }
                      label={
                        <Typography variant="body2" sx={{ color: '#FFF', fontWeight: 600 }}>
                          Strict Cryptographic Audit Logging Enabled
                        </Typography>
                      }
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* 4. FLEET MANAGEMENT DEFAULTS */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <DirectionsCarIcon sx={{ color: VELOUR_TOKENS.accentTeal }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFF', fontSize: 16 }}>
                    4. Fleet Management Rules
                  </Typography>
                </Box>
                <Divider sx={{ borderColor: VELOUR_TOKENS.borderSubtle, mb: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Max Fleet Capacity"
                      type="number"
                      value={maxFleetSize}
                      onChange={(e) => setMaxFleetSize(e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Max Surge Cap Multiplier"
                      value={maxSurgeCap}
                      onChange={(e) => setMaxSurgeCap(e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={autoApproveDrivers}
                          onChange={(e) => setAutoApproveDrivers(e.target.checked)}
                          sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: VELOUR_TOKENS.accentPrimary } }}
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="body2" sx={{ color: '#FFF', fontWeight: 600 }}>
                            Auto-Approve Registered Demo Drivers
                          </Typography>
                          <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary }}>
                            Instantly activate accounts created via Admin registration.
                          </Typography>
                        </Box>
                      }
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* 5. ADMIN ACCOUNT & NOC ALERTS */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3, backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <SecurityIcon sx={{ color: VELOUR_TOKENS.accentGold }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFF', fontSize: 16 }}>
                    5. Admin Account & Incident Alerts
                  </Typography>
                </Box>
                <Divider sx={{ borderColor: VELOUR_TOKENS.borderSubtle, mb: 2 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" sx={{ color: '#FFF', fontWeight: 700, mb: 1 }}>
                      Admin Account Profile
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Admin Name"
                          value={adminName}
                          onChange={(e) => setAdminName(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Admin Email"
                          value={adminEmail}
                          onChange={(e) => setAdminEmail(e.target.value)}
                        />
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" sx={{ color: '#FFF', fontWeight: 700, mb: 1 }}>
                      NOC Critical Notifications
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <FormControlLabel
                        control={<Switch checked={serviceOutageAlerts} onChange={(e) => setServiceOutageAlerts(e.target.checked)} />}
                        label={<Typography variant="body2" sx={{ color: '#FFF' }}>Instant Service Outage Alerts</Typography>}
                      />
                      <FormControlLabel
                        control={<Switch checked={latencyThresholdAlerts} onChange={(e) => setLatencyThresholdAlerts(e.target.checked)} />}
                        label={<Typography variant="body2" sx={{ color: '#FFF' }}>Model Latency Exceeded Warnings</Typography>}
                      />
                    </Box>
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
                    Save Enterprise Admin Settings
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
