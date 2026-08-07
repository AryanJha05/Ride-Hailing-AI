import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import { VELOUR_TOKENS } from '../../theme/palette';
import { ForecastPoint } from '../../types/api.types';

const DEFAULT_FORECAST_DATA: ForecastPoint[] = [
  { hour: '00:00', predicted_demand: 34.5, actual_demand: 30.0 },
  { hour: '02:00', predicted_demand: 23.0, actual_demand: 20.0 },
  { hour: '04:00', predicted_demand: 17.2, actual_demand: 15.0 },
  { hour: '06:00', predicted_demand: 51.8, actual_demand: 45.0 },
  { hour: '08:00', predicted_demand: 97.7, actual_demand: 85.0 },
  { hour: '10:00', predicted_demand: 69.0, actual_demand: 60.0 },
  { hour: '12:00', predicted_demand: 74.8, actual_demand: 65.0 },
  { hour: '14:00', predicted_demand: 92.0, actual_demand: 80.0 },
  { hour: '16:00', predicted_demand: 103.5, actual_demand: 90.0 },
  { hour: '18:00', predicted_demand: 112.7, actual_demand: 98.0 },
  { hour: '20:00', predicted_demand: 92.0, actual_demand: 80.0 },
  { hour: '22:00', predicted_demand: 57.5, actual_demand: 50.0 },
];

interface ForecastChartProps {
  data?: ForecastPoint[];
}

export const ForecastChart: React.FC<ForecastChartProps> = ({ data }) => {
  const chartData = data && data.length > 0 ? data : DEFAULT_FORECAST_DATA;

  return (
    <Card sx={{ height: '100%', backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 16, color: '#FFF', mb: 2 }}>
          24-Hour Spatial Demand Forecast vs Baseline Curve
        </Typography>
        <Box sx={{ width: '100%', height: 340 }}>
          <ResponsiveContainer width="100%" height="100%" minHeight={300}>
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={VELOUR_TOKENS.borderSubtle} opacity={0.5} />
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
              <Legend wrapperStyle={{ color: '#FFF', fontSize: 12, paddingTop: 10 }} />
              <Line
                type="monotone"
                dataKey="predicted_demand"
                name="AI Predicted Demand"
                stroke={VELOUR_TOKENS.accentTeal}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 6, fill: VELOUR_TOKENS.accentTeal }}
                connectNulls={true}
              />
              <Line
                type="monotone"
                dataKey="actual_demand"
                name="Baseline Historical Demand"
                stroke={VELOUR_TOKENS.accentLavender}
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
                connectNulls={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};
