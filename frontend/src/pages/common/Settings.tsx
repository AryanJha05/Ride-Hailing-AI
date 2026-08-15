import React from 'react';
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
} from '@mui/material';
import { PageShell } from '../../components/layout/PageShell';
import { VELOUR_TOKENS } from '../../theme/palette';

export const Settings: React.FC = () => {
  return (
    <PageShell title="Platform Settings & Driver Preferences">
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#FFF', mb: 0.5 }}>
          Driver Preferences
        </Typography>
        <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary, mb: 3 }}>
          Customize dispatch rules, AI guidance alerts, navigation integration, and shift goals.
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle, borderRadius: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFF', fontSize: 16, mb: 2 }}>
                AI Dispatch & Surge Guidance
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel
                  control={<Switch defaultChecked sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: VELOUR_TOKENS.accentTeal } }} />}
                  label={
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: '#FFF', fontWeight: 600 }}>
                        Real-time AI Positioning Alerts
                      </Typography>
                      <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary }}>
                        Receive proactive voice/push recommendations when nearby demand surges exceeds +30%.
                      </Typography>
                    </Box>
                  }
                />

                <Divider sx={{ borderColor: VELOUR_TOKENS.borderSubtle }} />

                <FormControlLabel
                  control={<Switch defaultChecked sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: VELOUR_TOKENS.accentPrimary } }} />}
                  label={
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: '#FFF', fontWeight: 600 }}>
                        Auto-Accept High Surge Trips (&gt;1.5x)
                      </Typography>
                      <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary }}>
                        Automatically reserve incoming rides matching high surge criteria.
                      </Typography>
                    </Box>
                  }
                />

                <Divider sx={{ borderColor: VELOUR_TOKENS.borderSubtle }} />

                <Box sx={{ mt: 1 }}>
                  <Typography variant="subtitle2" sx={{ color: '#FFF', fontWeight: 600, mb: 1 }}>
                    Default Navigation App Provider
                  </Typography>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    defaultValue="google"
                    sx={{ backgroundColor: VELOUR_TOKENS.bgSurface2, color: '#FFF' }}
                  >
                    <MenuItem value="google">Google Maps Navigation API (US East)</MenuItem>
                    <MenuItem value="nycdot">NYC DOT Real-Time Traffic Feed</MenuItem>
                    <MenuItem value="waze">Waze Live Traffic</MenuItem>
                  </TextField>
                </Box>
              </Box>
            </Paper>

            <Paper sx={{ p: 3, backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFF', fontSize: 16, mb: 2 }}>
                Shift Earnings Goals
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Daily Target Earnings ($)"
                    defaultValue="400"
                    size="small"
                    InputLabelProps={{ style: { color: VELOUR_TOKENS.textSecondary } }}
                    sx={{ backgroundColor: VELOUR_TOKENS.bgSurface2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Target Shift Trips"
                    defaultValue="12"
                    size="small"
                    InputLabelProps={{ style: { color: VELOUR_TOKENS.textSecondary } }}
                    sx={{ backgroundColor: VELOUR_TOKENS.bgSurface2 }}
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" sx={{ backgroundColor: VELOUR_TOKENS.accentPrimary, fontWeight: 700 }}>
                  Save Preferences
                </Button>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFF', fontSize: 16, mb: 2 }}>
                Vehicle & Fleet Profile
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ p: 1.8, borderRadius: 2, backgroundColor: VELOUR_TOKENS.bgSurface2 }}>
                  <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary }}>Vehicle Assigned</Typography>
                  <Typography variant="subtitle1" sx={{ color: '#FFF', fontWeight: 700 }}>Tesla Model Y (EV Premier)</Typography>
                </Box>

                <Box sx={{ p: 1.8, borderRadius: 2, backgroundColor: VELOUR_TOKENS.bgSurface2 }}>
                  <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary }}>License Plate</Typography>
                  <Typography className="mono-num" variant="subtitle1" sx={{ color: VELOUR_TOKENS.accentTeal, fontWeight: 700 }}>NYC-TLC-9421</Typography>
                </Box>

                <Box sx={{ p: 1.8, borderRadius: 2, backgroundColor: VELOUR_TOKENS.bgSurface2 }}>
                  <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary }}>Fleet Member Status</Typography>
                  <Typography variant="subtitle1" sx={{ color: VELOUR_TOKENS.accentGold, fontWeight: 700 }}>Gold Tier Driver</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </PageShell>
  );
};
