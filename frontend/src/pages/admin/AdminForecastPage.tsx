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
import { PageShell } from '../../components/layout/PageShell';
import { VELOUR_TOKENS } from '../../theme/palette';
import { useForecast } from '../../hooks/useRideApi';
import { ForecastChart } from '../../components/analytics/ForecastChart';

export const AdminForecastPage: React.FC = () => {
  const [selectedZone, setSelectedZone] = useState('Midtown Manhattan');
  const { data: forecastRes } = useForecast(selectedZone);

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
                    Predictive time-series model outputs vs actual NYC passenger demand.
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
                <MenuItem value="JFK Airport (JFK)">JFK Airport (JFK)</MenuItem>
                <MenuItem value="Financial District">Financial District</MenuItem>
                <MenuItem value="Williamsburg">Williamsburg</MenuItem>
                <MenuItem value="Lower Manhattan">Lower Manhattan</MenuItem>
              </Select>
            </Box>
          </Card>
        </Grid>

        {/* Main Forecast Chart */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ p: 3, backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle2" sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 600, fontSize: 13 }}>
                24-Hour Predicted vs. Actual Demand Curve ({selectedZone})
              </Typography>
              <Chip label="XGBoost + LSTM Ensemble" size="small" sx={{ backgroundColor: VELOUR_TOKENS.accentPrimaryDim, color: VELOUR_TOKENS.accentLavender, fontSize: 11, fontWeight: 600 }} />
            </Box>
            <ForecastChart data={forecastRes?.data || []} />
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
                  <Typography className="mono-num" variant="h6" sx={{ fontWeight: 700, color: VELOUR_TOKENS.accentTeal, mt: 0.5 }}>
                    18:00 - 19:30 EST
                  </Typography>
                </Box>

                <Box sx={{ p: 2, borderRadius: 2, backgroundColor: VELOUR_TOKENS.bgSurface2, border: `1px solid ${VELOUR_TOKENS.borderSubtle}` }}>
                  <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary }}>
                    MODEL ACCURACY SCORE (MAPE)
                  </Typography>
                  <Typography className="mono-num" variant="h6" sx={{ fontWeight: 700, color: '#FFF', mt: 0.5 }}>
                    94.2% (MAPE 5.8%)
                  </Typography>
                </Box>

                <Box sx={{ p: 2, borderRadius: 2, backgroundColor: VELOUR_TOKENS.bgSurface2, border: `1px solid ${VELOUR_TOKENS.borderSubtle}` }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <TrendingUpIcon sx={{ color: VELOUR_TOKENS.accentGold, fontSize: 18 }} />
                    <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 700 }}>
                      RECOMMENDED ACTION
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: VELOUR_TOKENS.accentLavender }}>
                    Pre-stage +250 fleet units in {selectedZone} prior to 17:30 peak onset.
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
