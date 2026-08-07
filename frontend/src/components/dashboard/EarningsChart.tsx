import React from 'react';
import { Card, CardContent, Typography, Box, Grid } from '@mui/material';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SpeedIcon from '@mui/icons-material/Speed';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
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
    <Card sx={{ height: '100%', backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle, borderRadius: 3 }}>
      <CardContent sx={{ p: 2.5, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 16, color: '#FFF' }}>
            Earnings Overview
          </Typography>
          <Typography className="mono-num" variant="subtitle1" sx={{ color: VELOUR_TOKENS.accentTeal, fontWeight: 700 }}>
            $1,970.00 <Typography component="span" variant="caption" sx={{ color: VELOUR_TOKENS.accentTeal, fontSize: 11 }}>↑ 24.6% vs last week</Typography>
          </Typography>
        </Box>

        <Box sx={{ width: '100%', height: 210, mb: 2 }}>
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
              <Area type="monotone" dataKey="earnings" stroke={VELOUR_TOKENS.accentPrimary} strokeWidth={2.5} fillOpacity={1} fill="url(#earningsGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </Box>

        {/* Sub-metrics summary row */}
        <Grid container spacing={1.5} sx={{ mt: 'auto' }}>
          <Grid item xs={4}>
            <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: VELOUR_TOKENS.bgSurface2, border: `1px solid ${VELOUR_TOKENS.borderSubtle}` }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, color: VELOUR_TOKENS.textSecondary, mb: 0.5 }}>
                <AccessTimeIcon sx={{ fontSize: 14 }} />
                <Typography variant="caption" sx={{ fontSize: 10.5, fontWeight: 600 }}>Online Time</Typography>
              </Box>
              <Typography className="mono-num" variant="subtitle2" sx={{ color: '#FFF', fontWeight: 700 }}>
                38h 45m
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={4}>
            <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: VELOUR_TOKENS.bgSurface2, border: `1px solid ${VELOUR_TOKENS.borderSubtle}` }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, color: VELOUR_TOKENS.textSecondary, mb: 0.5 }}>
                <SpeedIcon sx={{ fontSize: 14 }} />
                <Typography variant="caption" sx={{ fontSize: 10.5, fontWeight: 600 }}>Avg. Earnings / Hr</Typography>
              </Box>
              <Typography className="mono-num" variant="subtitle2" sx={{ color: VELOUR_TOKENS.accentTeal, fontWeight: 700 }}>
                $50.78
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={4}>
            <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: VELOUR_TOKENS.bgSurface2, border: `1px solid ${VELOUR_TOKENS.borderSubtle}` }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, color: VELOUR_TOKENS.textSecondary, mb: 0.5 }}>
                <CardGiftcardIcon sx={{ fontSize: 14 }} />
                <Typography variant="caption" sx={{ fontSize: 10.5, fontWeight: 600 }}>Tips</Typography>
              </Box>
              <Typography className="mono-num" variant="subtitle2" sx={{ color: '#FFF', fontWeight: 700 }}>
                $312.60
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
