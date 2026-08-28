import React from 'react';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import { VELOUR_TOKENS } from '../../theme/palette';
import { DriverPerformanceResponse } from '../../types/api.types';

interface PerformanceMetricsCardProps {
  driver?: DriverPerformanceResponse;
}

export const PerformanceMetricsCard: React.FC<PerformanceMetricsCardProps> = ({ driver }) => {
  return (
    <Card sx={{ backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 16, color: '#FFF', mb: 3 }}>
          Performance Metrics
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ p: 2, borderRadius: 2, backgroundColor: VELOUR_TOKENS.bgSurface2 }}>
              <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 600 }}>
                ACCEPTANCE RATE
              </Typography>
              <Typography className="mono-num" variant="h5" sx={{ fontWeight: 700, color: VELOUR_TOKENS.accentTeal, mt: 0.5 }}>
                {driver?.acceptance_rate !== undefined ? `${driver.acceptance_rate}%` : '100.0%'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ p: 2, borderRadius: 2, backgroundColor: VELOUR_TOKENS.bgSurface2 }}>
              <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 600 }}>
                CANCELLATION RATE
              </Typography>
              <Typography className="mono-num" variant="h5" sx={{ fontWeight: 700, color: '#FFF', mt: 0.5 }}>
                {driver?.cancellation_rate !== undefined ? `${driver.cancellation_rate}%` : '0.0%'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ p: 2, borderRadius: 2, backgroundColor: VELOUR_TOKENS.bgSurface2 }}>
              <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 600 }}>
                TOTAL EARNINGS
              </Typography>
              <Typography className="mono-num" variant="h5" sx={{ fontWeight: 700, color: VELOUR_TOKENS.accentTeal, mt: 0.5 }}>
                ${driver?.total_earnings !== undefined ? driver.total_earnings.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00'}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
