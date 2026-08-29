import React, { useState } from 'react';
import {
  Grid,
  Box,
  Card,
  CardContent,
  Typography,
  MenuItem,
  Select,
  Chip,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { PageShell } from '../../components/layout/PageShell';
import { VELOUR_TOKENS } from '../../theme/palette';
import { useForecast } from '../../hooks/useRideApi';
import { ForecastChart } from '../../components/analytics/ForecastChart';

export const AdminForecastPage: React.FC = () => {
  const [selectedZone, setSelectedZone] = useState('Midtown Manhattan');
  const { data: forecastRes } = useForecast(selectedZone);
  const forecastData = forecastRes?.data || [];
  const hasData = forecastData.length > 0;

  // Compute peak demand hour from real model forecast data
  let peakHourStr = 'N/A (Model Not Connected)';
  if (hasData) {
    const sorted = [...forecastData].sort((a, b) => b.predicted_demand - a.predicted_demand);
    peakHourStr = `${sorted[0].hour} (Est. ${Math.round(sorted[0].predicted_demand)} rides/hr)`;
  }

  return (
    <PageShell title="Demand Forecast Analytics">
      <Grid container spacing={3}>
        {/* Controls & Zone Filter Header */}
        <Grid item xs={12}>
          <Card sx={{ p: 2.5, backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <ShowChartIcon sx={{ color: VELOUR_TOKENS.accentTeal, fontSize: 28 }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFF' }}>
                    Spatial-Temporal ML Demand Forecasting Engine
                  </Typography>
                  <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary }}>
                    24-hour time-series forecasting model telemetry and zone trends.
                  </Typography>
                </Box>
              </Box>

              <Select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                size="small"
                sx={{
                  backgroundColor: VELOUR_TOKENS.bgSurface2,
                  color: '#FFF',
                  borderColor: VELOUR_TOKENS.borderSubtle,
                  minWidth: 240,
                  fontWeight: 600,
                }}
              >
                <MenuItem value="Midtown Manhattan">Midtown Manhattan</MenuItem>
                <MenuItem value="JFK International Airport">JFK International Airport</MenuItem>
                <MenuItem value="Downtown Brooklyn">Downtown Brooklyn</MenuItem>
                <MenuItem value="LaGuardia Airport LGA">LaGuardia Airport LGA</MenuItem>
                <MenuItem value="Williamsburg & Greenpoint">Williamsburg & Greenpoint</MenuItem>
              </Select>
            </Box>
          </Card>
        </Grid>

        {/* Main Forecast Chart */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ p: 3, backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle2" sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 600, fontSize: 13 }}>
                24-Hour Demand Forecast Curve ({selectedZone})
              </Typography>
              {hasData ? (
                <Chip
                  icon={<CheckCircleIcon sx={{ fontSize: '14px !important', color: '#10B981 !important' }} />}
                  label="Student C (PyTorch LSTM) Active"
                  size="small"
                  sx={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#10B981', fontSize: 11, fontWeight: 600 }}
                />
              ) : (
                <Chip
                  icon={<HourglassEmptyIcon sx={{ fontSize: '14px !important', color: `${VELOUR_TOKENS.accentGold} !important` }} />}
                  label="Student C Model Offline"
                  size="small"
                  sx={{ backgroundColor: 'rgba(234, 179, 8, 0.12)', color: VELOUR_TOKENS.accentGold, fontSize: 11, fontWeight: 600 }}
                />
              )}
            </Box>
            <ForecastChart data={forecastData} />
          </Card>
        </Grid>

        {/* Model Forecast Summary */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: '100%', backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 16, color: '#FFF', mb: 2 }}>
                Model Prediction Insights
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ p: 2, borderRadius: 2, backgroundColor: VELOUR_TOKENS.bgSurface2, border: `1px solid ${VELOUR_TOKENS.borderSubtle}` }}>
                  <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary }}>
                    PEAK DEMAND HORIZON
                  </Typography>
                  <Typography className="mono-num" variant="h6" sx={{ fontWeight: 700, color: hasData ? VELOUR_TOKENS.accentTeal : VELOUR_TOKENS.textSecondary, mt: 0.5, fontSize: 15 }}>
                    {peakHourStr}
                  </Typography>
                </Box>

                <Box sx={{ p: 2, borderRadius: 2, backgroundColor: VELOUR_TOKENS.bgSurface2, border: `1px solid ${VELOUR_TOKENS.borderSubtle}` }}>
                  <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary }}>
                    MODEL ACCURACY STATUS
                  </Typography>
                  <Typography className="mono-num" variant="h6" sx={{ fontWeight: 700, color: hasData ? '#10B981' : VELOUR_TOKENS.accentGold, mt: 0.5, fontSize: 15 }}>
                    {hasData ? 'PyTorch LSTM Operational' : 'Model Offline'}
                  </Typography>
                  <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 11 }}>
                    {hasData ? '2-Layer LSTM + MinMaxScaler Inverse Transform' : 'Waiting for Student C model server response'}
                  </Typography>
                </Box>

                <Box sx={{ p: 2, borderRadius: 2, backgroundColor: VELOUR_TOKENS.bgSurface2, border: `1px solid ${VELOUR_TOKENS.borderSubtle}` }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <TrendingUpIcon sx={{ color: VELOUR_TOKENS.accentLavender, fontSize: 18 }} />
                    <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 700 }}>
                      RECOMMENDED ACTION
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: hasData ? '#FFF' : VELOUR_TOKENS.textSecondary }}>
                    {hasData
                      ? `Pre-position fleet vehicles in ${selectedZone} 30 minutes prior to ${peakHourStr.split(' ')[0]} for maximum trip volume.`
                      : 'Automated staging recommendations unavailable until Student C forecasting model integration is complete.'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </PageShell>
  );
};
