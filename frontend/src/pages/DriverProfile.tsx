import React, { useState } from 'react';
import {
  Grid,
  Box,
  Card,
  Typography,
  Avatar,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';
import { PageShell } from '../components/layout/PageShell';
import { VELOUR_TOKENS } from '../theme/palette';
import { useDriverPerformance } from '../hooks/useRideApi';

export const DriverProfile: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'Week' | 'Month' | 'Year'>('Week');
  const { data: perf } = useDriverPerformance();

  return (
    <PageShell title="Driver Profile">
      <Grid container spacing={3}>
        {/* Top Header Card with Champagne Gold Rating (12 cols) */}
        <Grid item xs={12}>
          <Card sx={{ p: 4, backgroundColor: VELOUR_TOKENS.bgSurface1 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                <Avatar
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                  alt={perf?.name || 'E. Operations'}
                  sx={{ width: 72, height: 72, border: `2px solid ${VELOUR_TOKENS.accentLavender}` }}
                />
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#FFF' }}>
                    {perf?.name || 'E. Operations'}
                  </Typography>
                  <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 12 }}>
                    Member since March 2024
                  </Typography>

                  {/* Champagne Gold Rating Star Row */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    <Typography className="mono-num" variant="h6" sx={{ fontWeight: 700, color: '#FFF', fontSize: 24 }}>
                      {perf?.rating || '4.96'}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.2 }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon key={star} sx={{ color: VELOUR_TOKENS.accentGold, fontSize: 20 }} />
                      ))}
                    </Box>
                  </Box>
                </Box>
              </Grid>

              {/* Three Inline Key Stats Separated by Dividers */}
              <Grid item xs={12} md={8}>
                <Grid container spacing={2}>
                  <Grid item xs={4} textAlign="center">
                    <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, letterSpacing: '0.08em', fontWeight: 600 }}>
                      TOTAL TRIPS
                    </Typography>
                    <Typography className="mono-num" variant="h4" sx={{ fontWeight: 700, color: '#FFF', mt: 0.5 }}>
                      {perf?.total_trips?.toLocaleString() || '1,284'}
                    </Typography>
                  </Grid>
                  <Grid item xs={4} textAlign="center">
                    <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, letterSpacing: '0.08em', fontWeight: 600 }}>
                      TOTAL EARNINGS
                    </Typography>
                    <Typography className="mono-num" variant="h4" sx={{ fontWeight: 700, color: VELOUR_TOKENS.accentTeal, mt: 0.5 }}>
                      ${perf?.total_earnings?.toLocaleString() || '14,250.00'}
                    </Typography>
                  </Grid>
                  <Grid item xs={4} textAlign="center">
                    <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, letterSpacing: '0.08em', fontWeight: 600 }}>
                      ACCEPTANCE RATE
                    </Typography>
                    <Typography className="mono-num" variant="h4" sx={{ fontWeight: 700, color: '#FFF', mt: 0.5 }}>
                      {perf?.acceptance_rate || '98.0'}%
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Card>
        </Grid>

        {/* Earnings Over Time Chart (7 cols) */}
        <Grid item xs={12} md={7}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle2" sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 600, fontSize: 13 }}>
                Earnings Over Time
              </Typography>

              <ToggleButtonGroup
                value={timeframe}
                exclusive
                onChange={(_, v) => v && setTimeframe(v)}
                size="small"
              >
                {(['Week', 'Month', 'Year'] as const).map((t) => (
                  <ToggleButton
                    key={t}
                    value={t}
                    sx={{
                      fontSize: 11,
                      py: 0.4,
                      px: 1.5,
                      color: VELOUR_TOKENS.textSecondary,
                      '&.Mui-selected': {
                        backgroundColor: VELOUR_TOKENS.accentPrimary,
                        color: '#FFF',
                      },
                    }}
                  >
                    {t}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Box>

            <Box sx={{ width: '100%', height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={perf?.performance_history || []}>
                  <defs>
                    <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={VELOUR_TOKENS.accentPrimary} stopOpacity={0.4} />
                      <stop offset="95%" stopColor={VELOUR_TOKENS.accentPrimary} stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke={VELOUR_TOKENS.textTertiary} fontSize={12} />
                  <YAxis stroke={VELOUR_TOKENS.textTertiary} fontSize={12} />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: VELOUR_TOKENS.bgSurface2,
                      borderColor: VELOUR_TOKENS.borderSubtle,
                      color: '#FFF',
                      fontFamily: VELOUR_TOKENS.fontMono,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="earnings"
                    stroke={VELOUR_TOKENS.accentPrimary}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#purpleGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>

        {/* AI Performance Insights (5 cols) */}
        <Grid item xs={12} md={5}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="subtitle2" sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 600, fontSize: 13, mb: 2 }}>
              AI Performance Insights
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[
                'You earn 18% more on Friday evenings by staging near Financial District.',
                'Your acceptance rate of 98% qualifies you for the Gold Operator tier.',
                'Average trip rating remains consistently high at 4.96.',
              ].map((insight, idx) => (
                <Paper
                  key={idx}
                  sx={{
                    p: 2,
                    backgroundColor: VELOUR_TOKENS.bgSurface2,
                    borderColor: 'rgba(196, 181, 253, 0.2)',
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body2" sx={{ color: VELOUR_TOKENS.accentLavender, fontSize: 13, lineHeight: 1.5 }}>
                    {insight}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Card>
        </Grid>

        {/* Trip History Table (12 cols) */}
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Typography variant="subtitle2" sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 600, fontSize: 13, mb: 2 }}>
              Recent Trip History
            </Typography>

            <TableContainer component={Paper} sx={{ backgroundColor: 'transparent', border: 'none' }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ borderBottom: `1px solid ${VELOUR_TOKENS.borderSubtle}` }}>
                    <TableCell sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 12, fontWeight: 600 }}>Date</TableCell>
                    <TableCell sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 12, fontWeight: 600 }}>Zone</TableCell>
                    <TableCell sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 12, fontWeight: 600 }}>Duration</TableCell>
                    <TableCell align="right" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 12, fontWeight: 600 }}>Fare</TableCell>
                    <TableCell align="right" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 12, fontWeight: 600 }}>Rating</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(perf?.recent_trips || []).map((t, idx) => (
                    <TableRow
                      key={t.id || idx}
                      sx={{
                        backgroundColor: idx % 2 === 0 ? VELOUR_TOKENS.bgBase : VELOUR_TOKENS.bgSurface1,
                        '&:hover': { backgroundColor: VELOUR_TOKENS.accentPrimaryDim },
                        borderBottom: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
                      }}
                    >
                      <TableCell sx={{ color: '#FFF', fontSize: 13, fontFamily: VELOUR_TOKENS.fontMono }}>{t.date}</TableCell>
                      <TableCell sx={{ color: VELOUR_TOKENS.textPrimary, fontSize: 13 }}>{t.zone}</TableCell>
                      <TableCell sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 13, fontFamily: VELOUR_TOKENS.fontMono }}>{t.duration}</TableCell>
                      <TableCell align="right" sx={{ color: VELOUR_TOKENS.accentTeal, fontSize: 13, fontWeight: 700, fontFamily: VELOUR_TOKENS.fontMono }}>
                        {t.fare}
                      </TableCell>
                      <TableCell align="right" sx={{ color: VELOUR_TOKENS.accentGold, fontSize: 13, fontWeight: 700, fontFamily: VELOUR_TOKENS.fontMono }}>
                        ★ {t.rating}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>
    </PageShell>
  );
};
