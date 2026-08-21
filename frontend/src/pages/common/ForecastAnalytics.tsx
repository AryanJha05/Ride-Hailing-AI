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
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ p: 2, borderRadius: 2, backgroundColor: VELOUR_TOKENS.bgSurface2 }}>
                    <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary }}>
                      Peak Demand Hour
                    </Typography>
                    <Typography className="mono-num" variant="h6" sx={{ fontWeight: 700, color: hasData ? VELOUR_TOKENS.accentTeal : VELOUR_TOKENS.textSecondary, fontSize: 15 }}>
                      {hasData ? '18:00 - 19:00 EST' : 'N/A (Model Not Connected)'}
                    </Typography>
                  </Box>
                  <Box sx={{ p: 2, borderRadius: 2, backgroundColor: VELOUR_TOKENS.bgSurface2 }}>
                    <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary }}>
                      Model Status
                    </Typography>
                    <Typography className="mono-num" variant="h6" sx={{ fontWeight: 700, color: VELOUR_TOKENS.accentGold, fontSize: 15 }}>
                      Pending Student C Integration
                    </Typography>
                    <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 11 }}>
                      (LSTM Time-Series forecasting model pending deployment)
                    </Typography>
                  </Box>

                  <Box sx={{ p: 2, borderRadius: 2, backgroundColor: VELOUR_TOKENS.bgSurface2 }}>
                    <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary }}>
                      Recommended Shift Action
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: VELOUR_TOKENS.textSecondary, mt: 0.5 }}>
                      {hasData ? 'Stage units in Midtown Manhattan prior to 17:30 peak onset.' : 'Automated staging recommendations unavailable until Student C model integration.'}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </PageShell>
  );
};
