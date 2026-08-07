import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { VELOUR_TOKENS } from '../../theme/palette';

const mockData = [
  { day: 'Mon', earnings: 140 },
  { day: 'Tue', earnings: 180 },
  { day: 'Wed', earnings: 210 },
  { day: 'Thu', earnings: 290 },
  { day: 'Fri', earnings: 380 },
  { day: 'Sat', earnings: 420 },
  { day: 'Sun', earnings: 350 },
];

export const EarningsChart: React.FC = () => {
  return (
    <Card sx={{ height: '100%', backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 16, color: '#FFF' }}>
            Weekly Earnings Trajectory
          </Typography>
          <Typography className="mono-num" variant="subtitle1" sx={{ color: VELOUR_TOKENS.accentTeal, fontWeight: 700 }}>
            $1,970.00
          </Typography>
        </Box>
        <Box sx={{ width: '100%', height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={VELOUR_TOKENS.accentPrimary} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={VELOUR_TOKENS.accentPrimary} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke={VELOUR_TOKENS.textSecondary} fontSize={12} tickLine={false} />
              <YAxis stroke={VELOUR_TOKENS.textSecondary} fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: VELOUR_TOKENS.bgSurface2,
                  borderColor: VELOUR_TOKENS.borderSubtle,
                  borderRadius: 8,
                  color: '#FFF',
                }}
              />
              <Area type="monotone" dataKey="earnings" stroke={VELOUR_TOKENS.accentPrimary} strokeWidth={2} fillOpacity={1} fill="url(#earningsGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};
