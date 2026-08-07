import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { VELOUR_TOKENS } from '../../theme/palette';
import { ForecastPoint } from '../../types/api.types';

interface ForecastChartProps {
  data: ForecastPoint[];
}

export const ForecastChart: React.FC<ForecastChartProps> = ({ data }) => {
  return (
    <Card sx={{ height: '100%', backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 16, color: '#FFF', mb: 2 }}>
          24-Hour Demand Forecast vs Baseline
        </Typography>
        <Box sx={{ width: '100%', height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <XAxis dataKey="hour" stroke={VELOUR_TOKENS.textSecondary} fontSize={12} tickLine={false} />
              <YAxis stroke={VELOUR_TOKENS.textSecondary} fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: VELOUR_TOKENS.bgSurface2,
                  borderColor: VELOUR_TOKENS.borderSubtle,
                  borderRadius: 8,
                  color: '#FFF',
                }}
              />
              <Legend wrapperStyle={{ color: '#FFF', fontSize: 12 }} />
              <Line type="monotone" dataKey="predicted_demand" name="Predicted Demand" stroke={VELOUR_TOKENS.accentTeal} strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="actual_demand" name="Baseline Demand" stroke={VELOUR_TOKENS.accentLavender} strokeWidth={2} strokeDasharray="3 3" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};
