import React from 'react';
import { Card, CardContent, Typography, Box, Grid } from '@mui/material';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SpeedIcon from '@mui/icons-material/Speed';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { VELOUR_TOKENS } from '../../theme/palette';

interface EarningsChartProps {
  data?: { day: string; earnings: number; trips?: number }[];
}

export const EarningsChart: React.FC<EarningsChartProps> = ({ data }) => {
  const hasData = data && data.length > 0;
  const chartData = hasData ? data : [];
  const totalEarnings = chartData.reduce((acc, curr) => acc + (curr.earnings || 0), 0);

  return (
    <Card
      sx={{
        backgroundColor: VELOUR_TOKENS.bgSurface1,
        border: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
        borderRadius: 3,
        height: '100%',
        width: '100%',
        minWidth: 0,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardContent sx={{ p: { xs: 1.8, sm: 2.2, md: 2.5 }, display: 'flex', flexDirection: 'column', height: '100%', minWidth: 0, boxSizing: 'border-box' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, minWidth: 0 }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle2" sx={{ color: VELOUR_TOKENS.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8, fontSize: 11, fontWeight: 700 }}>
              Weekly Earnings Overview
            </Typography>
            {hasData ? (
              <Typography className="mono-num" variant="h4" sx={{ fontWeight: 700, color: '#FFF', fontSize: { xs: 22, sm: 24, md: 26 }, mt: 0.5 }}>
                ${totalEarnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Typography>
            ) : (
              <Typography variant="h6" sx={{ fontWeight: 600, color: VELOUR_TOKENS.textSecondary, fontSize: 18, mt: 0.5 }}>
                No Earnings History
              </Typography>
            )}
          </Box>
        </Box>

        {hasData ? (
          <Box sx={{ width: '100%', height: 180, mb: 2, minWidth: 0, overflow: 'hidden' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
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
        ) : (
          <Box
            sx={{
              width: '100%',
              height: 180,
              mb: 2,
              minWidth: 0,
              borderRadius: 2,
              backgroundColor: VELOUR_TOKENS.bgSurface2,
              border: `1px dashed ${VELOUR_TOKENS.borderSubtle}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              p: 2,
              boxSizing: 'border-box',
            }}
          >
            <ShowChartIcon sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 32, mb: 1 }} />
            <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 13, fontWeight: 600 }}>
              No earnings history data available
            </Typography>
            <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textTertiary, fontSize: 11, mt: 0.5 }}>
              Complete shift trips to generate weekly performance analytics.
            </Typography>
          </Box>
        )}

        {/* Contextual Sub-Metrics Summary Row */}
        <Grid container spacing={1.5} sx={{ mt: 'auto', minWidth: 0, width: '100%' }}>
          <Grid item xs={4} sx={{ minWidth: 0 }}>
            <Box sx={{ p: 1, borderRadius: 2, backgroundColor: VELOUR_TOKENS.bgSurface2, border: `1px solid ${VELOUR_TOKENS.borderSubtle}`, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, color: VELOUR_TOKENS.textSecondary, mb: 0.3, minWidth: 0 }}>
                <AccessTimeIcon sx={{ fontSize: 13, color: VELOUR_TOKENS.accentTeal, flexShrink: 0 }} />
                <Typography variant="caption" noWrap sx={{ fontSize: 10, fontWeight: 600 }}>Online Time</Typography>
              </Box>
              <Typography className="mono-num" variant="body2" noWrap sx={{ fontWeight: 700, color: '#FFF', fontSize: 12.5 }}>
                {hasData ? '38h 45m' : '0h 0m'}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={4} sx={{ minWidth: 0 }}>
            <Box sx={{ p: 1, borderRadius: 2, backgroundColor: VELOUR_TOKENS.bgSurface2, border: `1px solid ${VELOUR_TOKENS.borderSubtle}`, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, color: VELOUR_TOKENS.textSecondary, mb: 0.3, minWidth: 0 }}>
                <SpeedIcon sx={{ fontSize: 13, color: VELOUR_TOKENS.accentGold, flexShrink: 0 }} />
                <Typography variant="caption" noWrap sx={{ fontSize: 10, fontWeight: 600 }}>Avg / Hr</Typography>
              </Box>
              <Typography className="mono-num" variant="body2" noWrap sx={{ fontWeight: 700, color: '#FFF', fontSize: 12.5 }}>
                {hasData ? '$42/hr' : '$0/hr'}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={4} sx={{ minWidth: 0 }}>
            <Box sx={{ p: 1, borderRadius: 2, backgroundColor: VELOUR_TOKENS.bgSurface2, border: `1px solid ${VELOUR_TOKENS.borderSubtle}`, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, color: VELOUR_TOKENS.textSecondary, mb: 0.3, minWidth: 0 }}>
                <VolunteerActivismIcon sx={{ fontSize: 13, color: VELOUR_TOKENS.accentLavender, flexShrink: 0 }} />
                <Typography variant="caption" noWrap sx={{ fontSize: 10, fontWeight: 600 }}>Tips</Typography>
              </Box>
              <Typography className="mono-num" variant="body2" noWrap sx={{ fontWeight: 700, color: '#FFF', fontSize: 12.5 }}>
                {hasData ? '$185' : '$0'}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
