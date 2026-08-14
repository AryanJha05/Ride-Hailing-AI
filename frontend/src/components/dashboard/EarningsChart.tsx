import React from 'react';
import { Card, CardContent, Typography, Box, Grid } from '@mui/material';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SpeedIcon from '@mui/icons-material/Speed';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import { VELOUR_TOKENS } from '../../theme/palette';

const mockWeeklyData = [
  { day: 'Mon', earnings: 210 },
  { day: 'Tue', earnings: 265 },
  { day: 'Wed', earnings: 230 },
  { day: 'Thu', earnings: 290 },
  { day: 'Fri', earnings: 360 },
  { day: 'Sat', earnings: 420 },
  { day: 'Sun', earnings: 270 },
];

export const EarningsChart: React.FC = () => {
  return (
    <Card
      sx={{
        backgroundColor: VELOUR_TOKENS.bgSurface1,
        border: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
        borderRadius: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardContent sx={{ p: 2.5, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="subtitle2" sx={{ color: VELOUR_TOKENS.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8, fontSize: 11, fontWeight: 700 }}>
              Weekly Earnings Overview
            </Typography>
            <Typography className="mono-num" variant="h4" sx={{ fontWeight: 700, color: '#FFF', fontSize: 26, mt: 0.5 }}>
              $1,845.00 <span style={{ color: VELOUR_TOKENS.accentTeal, fontSize: 14, fontWeight: 600 }}>↑ 24.6%</span>
            </Typography>
          </Box>
        </Box>

        <Box sx={{ width: '100%', height: 180, mb: 2 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockWeeklyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={VELOUR_TOKENS.accentPrimary} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={VELOUR_TOKENS.accentPrimary} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke={VELOUR_TOKENS.textSecondary} fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke={VELOUR_TOKENS.textSecondary} fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: VELOUR_TOKENS.bgSurface2,
                  borderColor: VELOUR_TOKENS.borderSubtle,
                  borderRadius: 8,
                  color: '#FFF',
                }}
                formatter={(val: number) => [`$${val.toLocaleString('en-US')}`, 'Earnings']}
              />
              <Area type="monotone" dataKey="earnings" stroke={VELOUR_TOKENS.accentPrimary} strokeWidth={2.5} fillOpacity={1} fill="url(#earningsGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </Box>

        {/* Contextual Sub-Metrics Summary Row */}
        <Grid container spacing={1.5} sx={{ mt: 'auto' }}>
          <Grid item xs={4}>
            <Box sx={{ p: 1.2, borderRadius: 2, backgroundColor: VELOUR_TOKENS.bgSurface2, border: `1px solid ${VELOUR_TOKENS.borderSubtle}` }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, color: VELOUR_TOKENS.textSecondary, mb: 0.3 }}>
                <AccessTimeIcon sx={{ fontSize: 13, color: VELOUR_TOKENS.accentTeal }} />
                <Typography variant="caption" sx={{ fontSize: 10, fontWeight: 600 }}>Online Time</Typography>
              </Box>
              <Typography className="mono-num" variant="body2" sx={{ fontWeight: 700, color: '#FFF', fontSize: 13 }}>
                38h 45m
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={4}>
            <Box sx={{ p: 1.2, borderRadius: 2, backgroundColor: VELOUR_TOKENS.bgSurface2, border: `1px solid ${VELOUR_TOKENS.borderSubtle}` }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, color: VELOUR_TOKENS.textSecondary, mb: 0.3 }}>
                <SpeedIcon sx={{ fontSize: 13, color: VELOUR_TOKENS.accentGold }} />
                <Typography variant="caption" sx={{ fontSize: 10, fontWeight: 600 }}>Avg / Hr</Typography>
              </Box>
              <Typography className="mono-num" variant="body2" sx={{ fontWeight: 700, color: '#FFF', fontSize: 13 }}>
                $42/hr
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={4}>
            <Box sx={{ p: 1.2, borderRadius: 2, backgroundColor: VELOUR_TOKENS.bgSurface2, border: `1px solid ${VELOUR_TOKENS.borderSubtle}` }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, color: VELOUR_TOKENS.textSecondary, mb: 0.3 }}>
                <VolunteerActivismIcon sx={{ fontSize: 13, color: VELOUR_TOKENS.accentLavender }} />
                <Typography variant="caption" sx={{ fontSize: 10, fontWeight: 600 }}>Tips</Typography>
              </Box>
              <Typography className="mono-num" variant="body2" sx={{ fontWeight: 700, color: '#FFF', fontSize: 13 }}>
                $185
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
