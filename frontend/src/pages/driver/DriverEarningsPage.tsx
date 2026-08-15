import React from 'react';
import {
  Grid,
  Box,
  Card,
  Typography,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { PageShell } from '../../components/layout/PageShell';
import { VELOUR_TOKENS } from '../../theme/palette';

export const DriverEarningsPage: React.FC = () => {
  const recentPayouts = [
    { id: 'PAY-8841', date: 'Today, 16:30 EST', desc: '14 Completed Shifts & Surge Bonuses', amount: '+$285.00', status: 'COMPLETED' },
    { id: 'PAY-8720', date: 'Yesterday', desc: '18 Completed Shifts & Airport Trips', amount: '+$342.50', status: 'COMPLETED' },
    { id: 'PAY-8611', date: 'Aug 13, 2026', desc: 'Weekly Automatic Payout to Chase Bank ****4921', amount: '+$1,842.00', status: 'TRANSFERRED' },
  ];

  return (
    <PageShell title="Driver Earnings & Performance Payouts">
      <Grid container spacing={3}>
        {/* Earnings Summary Cards */}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {[
              { label: 'TODAY\'S EARNINGS', val: '$285.00', color: VELOUR_TOKENS.accentTeal, sub: '82% of $350.00 shift goal' },
              { label: 'THIS WEEK TOTAL', val: '$1,842.00', color: '#FFF', sub: '+14% vs last week' },
              { label: 'PASSENGER TIPS', val: '$148.50', color: VELOUR_TOKENS.accentGold, sub: 'Included in total' },
              { label: 'SURGE INCENTIVES', val: '$94.00', color: VELOUR_TOKENS.accentLavender, sub: 'Midtown & JFK surges' },
            ].map((stat, idx) => (
              <Grid item xs={6} md={3} key={idx}>
                <Card sx={{ p: 2.5, backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle }}>
                  <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 700, letterSpacing: '0.06em' }}>
                    {stat.label}
                  </Typography>
                  <Typography className="mono-num" variant="h4" sx={{ fontWeight: 700, color: stat.color, mt: 0.5 }}>
                    {stat.val}
                  </Typography>
                  <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textTertiary, mt: 0.5, display: 'block' }}>
                    {stat.sub}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Daily Shift Target Progress Widget */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmojiEventsIcon sx={{ color: VELOUR_TOKENS.accentGold, fontSize: 24 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFF', fontSize: 16 }}>
                  Daily Shift Goal Progress
                </Typography>
              </Box>
              <Chip label="82% Complete" size="small" sx={{ backgroundColor: 'rgba(0,217,192,0.1)', color: VELOUR_TOKENS.accentTeal, fontWeight: 700 }} />
            </Box>

            <Box sx={{ my: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary }}>Current: $285.00</Typography>
                <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary }}>Target: $350.00</Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={82}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: VELOUR_TOKENS.accentTeal,
                    borderRadius: 5,
                  },
                }}
              />
            </Box>

            <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, display: 'block' }}>
              Complete 3 more trips during the Midtown peak hours to trigger the $40.00 shift completion bonus.
            </Typography>
          </Card>
        </Grid>

        {/* Recent Payout Activity */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFF', fontSize: 16, mb: 2 }}>
              Recent Earnings Payout Log
            </Typography>

            <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {recentPayouts.map((payout) => (
                <Box
                  key={payout.id}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: VELOUR_TOKENS.bgSurface2,
                    border: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
                    display: 'flex',
                    justify: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#FFF' }}>
                      {payout.desc}
                    </Typography>
                    <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textTertiary, fontFamily: VELOUR_TOKENS.fontMono }}>
                      {payout.date} • {payout.id}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography className="mono-num" variant="subtitle1" sx={{ fontWeight: 700, color: VELOUR_TOKENS.accentTeal }}>
                      {payout.amount}
                    </Typography>
                    <Chip label={payout.status} size="small" sx={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: VELOUR_TOKENS.success, fontSize: 9, fontWeight: 700 }} />
                  </Box>
                </Box>
              ))}
            </List>
          </Card>
        </Grid>
      </Grid>
    </PageShell>
  );
};
