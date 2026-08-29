import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import { VELOUR_TOKENS } from '../../theme/palette';
import { ForecastPoint } from '../../types/api.types';

interface ForecastChartProps {
  data?: ForecastPoint[];
}

export const ForecastChart: React.FC<ForecastChartProps> = ({ data }) => {
  const hasData = data && data.length > 0;

  return (
    <Card sx={{ height: '100%', backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle }}>
      <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 16, color: '#FFF' }}>
            24-Hour Spatial Demand Forecast vs Baseline Curve
          </Typography>
          <Chip
            label={hasData ? 'Forecasting Engine · Operational' : 'Demand Forecasting Engine Offline'}
            size="small"
            sx={{
              backgroundColor: hasData ? 'rgba(0, 217, 192, 0.12)' : 'rgba(234, 179, 8, 0.12)',
              color: hasData ? VELOUR_TOKENS.accentTeal : VELOUR_TOKENS.accentGold,
              fontWeight: 700,
              fontSize: 10,
              height: 20,
            }}
          />
        </Box>

        {hasData ? (
          <Box sx={{ width: '100%', height: 340 }}>
            <ResponsiveContainer width="100%" height="100%" minHeight={300}>
              <LineChart data={data} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
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
        ) : (
          <Box
            sx={{
              p: 4,
              borderRadius: 2.5,
              backgroundColor: VELOUR_TOKENS.bgSurface2,
              border: `1px dashed ${VELOUR_TOKENS.borderSubtle}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justify: 'center',
              textAlign: 'center',
              my: 'auto',
              minHeight: 280,
            }}
          >
            <ShowChartIcon sx={{ fontSize: 44, color: VELOUR_TOKENS.accentGold, mb: 1.5, opacity: 0.8 }} />
            <Typography variant="subtitle1" sx={{ color: '#FFF', fontWeight: 700, mb: 0.5 }}>
              Demand Forecasting Engine Disconnected
            </Typography>
            <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 13, maxWidth: 420 }}>
              Demand Forecasting Engine is currently offline or unreachable.
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
