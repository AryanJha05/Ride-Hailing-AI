import React, { useState } from 'react';
import { Container, Grid, Card, CardContent, Typography, Box, MenuItem, Select } from '@mui/material';
import { PageShell } from '../components/layout/PageShell';
import { VELOUR_TOKENS } from '../theme/palette';
import { useForecast } from '../hooks/useRideApi';
import { ForecastChart } from '../components/analytics/ForecastChart';

export const ForecastAnalytics: React.FC = () => {
  const [selectedZone, setSelectedZone] = useState('Financial District');
  const { data: forecastRes } = useForecast(selectedZone);

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
              Time-series model predictions vs baseline demand.
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
              minWidth: 200,
            }}
          >
            <MenuItem value="Financial District">Financial District</MenuItem>
            <MenuItem value="Airports (JFK / LGA)">Airports (JFK / LGA)</MenuItem>
            <MenuItem value="Midtown Core">Midtown Core</MenuItem>
            <MenuItem value="Williamsburg">Williamsburg</MenuItem>
          </Select>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <ForecastChart data={forecastRes?.data || []} />
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
                    <Typography className="mono-num" variant="h6" sx={{ fontWeight: 700, color: VELOUR_TOKENS.accentTeal }}>
                      18:00 - 19:00
                    </Typography>
                  </Box>
                  <Box sx={{ p: 2, borderRadius: 2, backgroundColor: VELOUR_TOKENS.bgSurface2 }}>
                    <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary }}>
                      Model Accuracy Score
                    </Typography>
                    <Typography className="mono-num" variant="h6" sx={{ fontWeight: 700, color: '#FFF' }}>
                      94.2% (MAPE 5.8%)
                    </Typography>
                  </Box>
                  <Box sx={{ p: 2, borderRadius: 2, backgroundColor: VELOUR_TOKENS.bgSurface2 }}>
                    <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary }}>
                      Recommended Shift Action
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: VELOUR_TOKENS.accentLavender, mt: 0.5 }}>
                      Stage units in Financial District prior to 17:30 peak onset.
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
