import React, { useState } from 'react';
import { Container, Grid, Card, CardContent, Typography, Box, MenuItem, Select } from '@mui/material';
import { PageShell } from '../../components/layout/PageShell';
import { VELOUR_TOKENS } from '../../theme/palette';
import { useForecast } from '../../hooks/useRideApi';
import { ForecastChart } from '../../components/analytics/ForecastChart';

export const ForecastAnalytics: React.FC = () => {
  const [selectedZone, setSelectedZone] = useState('Midtown Manhattan');
  const { data: forecastRes } = useForecast(selectedZone);
  const forecastData = forecastRes?.data || [];
  const hasData = forecastData.length > 0;

  return (
    <PageShell title="Demand Forecast Analytics">
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Controls Bar */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#FFF' }}>
              Spatial-Temporal Demand Forecasting
            </Typography>
            <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary }}>
              Time-series model predictions vs baseline demand across NYC network.
            </Typography>
          </Box>

          <Select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            size="small"
            sx={{
              backgroundColor: VELOUR_TOKENS.bgSurface1,
              color: '#FFF',
              borderColor: VELOUR_TOKENS.borderSubtle,
              minWidth: 220,
            }}
          >
            <MenuItem value="Midtown Manhattan">Midtown Manhattan</MenuItem>
            <MenuItem value="JFK Airport (JFK)">JFK Airport (JFK)</MenuItem>
            <MenuItem value="Financial District">Financial District</MenuItem>
            <MenuItem value="Williamsburg">Williamsburg</MenuItem>
            <MenuItem value="Lower Manhattan">Lower Manhattan</MenuItem>
          </Select>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <ForecastChart data={forecastData} />
          </Grid>
          <Grid item xs={12} lg={4}>
            <Card sx={{ height: '100%', backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 16, color: '#FFF', mb: 2 }}>
                  Forecast Summary
                </Typography>
                {(() => {
                  const peakPoint = hasData
                    ? forecastData.reduce((max, pt) => (pt.predicted_demand > max.predicted_demand ? pt : max), forecastData[0])
                    : null;

                  return (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box sx={{ p: 2, borderRadius: 2, backgroundColor: VELOUR_TOKENS.bgSurface2 }}>
                        <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary }}>
                          Peak Demand Hour
                        </Typography>
                        <Typography className="mono-num" variant="h6" sx={{ fontWeight: 700, color: hasData ? VELOUR_TOKENS.accentTeal : VELOUR_TOKENS.textSecondary, fontSize: 15 }}>
                          {peakPoint ? `${peakPoint.hour} EST (${peakPoint.predicted_demand} rides/hr)` : 'N/A (Model Offline)'}
                        </Typography>
                      </Box>

                      <Box sx={{ p: 2, borderRadius: 2, backgroundColor: VELOUR_TOKENS.bgSurface2 }}>
                        <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary }}>
                          Model Status
                        </Typography>
                        <Typography className="mono-num" variant="h6" sx={{ fontWeight: 700, color: hasData ? VELOUR_TOKENS.accentTeal : VELOUR_TOKENS.accentGold, fontSize: 15 }}>
                          {hasData ? 'PyTorch LSTM Operational' : 'Model Offline'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 11 }}>
                          {hasData ? 'Student C PyTorch LSTM time-series forecast active' : 'Model artifact not connected'}
                        </Typography>
                      </Box>

                      <Box sx={{ p: 2, borderRadius: 2, backgroundColor: VELOUR_TOKENS.bgSurface2 }}>
                        <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary }}>
                          Recommended Shift Action
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: VELOUR_TOKENS.textSecondary, mt: 0.5 }}>
                          {peakPoint
                            ? `Stage units in ${selectedZone} prior to ${peakPoint.hour} peak onset (estimated ${peakPoint.predicted_demand} rides/hr).`
                            : 'Automated staging recommendations unavailable until model connects.'}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })()}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </PageShell>
  );
};
