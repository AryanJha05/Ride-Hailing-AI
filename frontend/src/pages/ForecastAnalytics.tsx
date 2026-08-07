import React, { useState } from 'react';
import {
  Grid,
  Box,
  Card,
  Typography,
  Select,
  MenuItem,
  FormControl,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { PageShell } from '../components/layout/PageShell';
import { VELOUR_TOKENS } from '../theme/palette';
import { useForecast } from '../hooks/useRideApi';

export const ForecastAnalytics: React.FC = () => {
  const [selectedZone, setSelectedZone] = useState('Financial District');
  const { data: forecastData } = useForecast(selectedZone);

  const mockBarData = [
    { zone: 'Fin. District', demand: 94 },
    { zone: 'Airports', demand: 88 },
    { zone: 'Midtown', demand: 72 },
    { zone: 'Williamsburg', demand: 64 },
    { zone: 'SoHo', demand: 58 },
  ];

  return (
    <PageShell title="Demand Forecast Analytics">
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#FFF' }}>
          Predictive Time-Series Analytics
        </Typography>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <Select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            sx={{
              backgroundColor: VELOUR_TOKENS.bgSurface1,
              color: '#FFF',
              borderRadius: 2,
              borderColor: VELOUR_TOKENS.borderSubtle,
              fontSize: 13,
            }}
          >
            <MenuItem value="Financial District">Financial District</MenuItem>
            <MenuItem value="Airports (JFK / LGA)">Airports (JFK / LGA)</MenuItem>
            <MenuItem value="Midtown Core">Midtown Core</MenuItem>
            <MenuItem value="Williamsburg">Williamsburg</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {/* Top 12-col Area Chart */}
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Typography variant="subtitle2" sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 600, fontSize: 13, mb: 2 }}>
              Hourly Demand Forecast — Next 24h ({selectedZone})
            </Typography>

            <Box sx={{ width: '100%', height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecastData?.data || []}>
                  <defs>
                    <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={VELOUR_TOKENS.accentTeal} stopOpacity={0.4} />
                      <stop offset="95%" stopColor={VELOUR_TOKENS.accentTeal} stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="hour" stroke={VELOUR_TOKENS.textTertiary} fontSize={12} />
                  <YAxis stroke={VELOUR_TOKENS.textTertiary} fontSize={12} />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: VELOUR_TOKENS.bgSurface2,
                      borderColor: VELOUR_TOKENS.borderSubtle,
                      borderRadius: 8,
                      color: '#FFF',
                      fontFamily: VELOUR_TOKENS.fontMono,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="predicted_demand"
                    stroke={VELOUR_TOKENS.accentTeal}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#tealGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>

        {/* Middle Left (7 cols): Area Comparison */}
        <Grid item xs={12} md={7}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="subtitle2" sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 600, fontSize: 13, mb: 2 }}>
              Zone Demand Comparison
            </Typography>
            <Box sx={{ width: '100%', height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockBarData} layout="vertical">
                  <XAxis type="number" stroke={VELOUR_TOKENS.textTertiary} fontSize={12} />
                  <YAxis type="category" dataKey="zone" stroke={VELOUR_TOKENS.textTertiary} fontSize={12} width={100} />
                  <Bar dataKey="demand" fill={VELOUR_TOKENS.accentPrimary} radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>

        {/* Middle Right (5 cols): Trend Summary */}
        <Grid item xs={12} md={5}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="subtitle2" sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 600, fontSize: 13, mb: 2 }}>
              Trend Summary & Observations
            </Typography>
            <List disablePadding>
              {[
                { title: 'Airport Zone', desc: 'Trending up 12% vs last week due to holiday travel surge.', isUp: true, val: '+12%' },
                { title: 'Financial District', desc: 'Morning peak extended by 25 mins.', isUp: true, val: '+8%' },
                { title: 'SoHo / Tribeca', desc: 'Slight cooling off expected post 20:00.', isUp: false, val: '-4%' },
              ].map((item, idx) => (
                <ListItem key={idx} sx={{ px: 0, py: 1.5, borderBottom: `1px solid ${VELOUR_TOKENS.borderSubtle}` }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    {item.isUp ? (
                      <TrendingUpIcon sx={{ color: VELOUR_TOKENS.accentTeal, fontSize: 20 }} />
                    ) : (
                      <TrendingDownIcon sx={{ color: VELOUR_TOKENS.danger, fontSize: 20 }} />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.title}
                    secondary={item.desc}
                    primaryTypographyProps={{ fontSize: 14, fontWeight: 600, color: '#FFF' }}
                    secondaryTypographyProps={{ fontSize: 12, color: VELOUR_TOKENS.textSecondary }}
                  />
                  <Typography className="mono-num" variant="body2" sx={{ fontWeight: 700, color: item.isUp ? VELOUR_TOKENS.accentTeal : VELOUR_TOKENS.danger }}>
                    {item.val}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Card>
        </Grid>

        {/* Bottom 12-col Weekly Pattern Heatmap Grid */}
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Typography variant="subtitle2" sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 600, fontSize: 13, mb: 2 }}>
              Weekly Pattern Demand Intensity (7 Days × 24 Hours)
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(24, 1fr)',
                gap: 0.8,
                overflowX: 'auto',
                pt: 1,
              }}
            >
              {Array.from({ length: 7 * 24 }).map((_, i) => {
                const day = Math.floor(i / 24);
                const hour = i % 24;
                const intensity = (Math.sin(hour / 3) + 1) / 2; // 0 to 1
                return (
                  <Tooltip key={i} title={`Day ${day + 1}, ${hour}:00 - Intensity: ${Math.round(intensity * 100)}%`}>
                    <Box
                      sx={{
                        height: 24,
                        borderRadius: 1,
                        backgroundColor:
                          intensity > 0.7
                            ? VELOUR_TOKENS.accentPrimary
                            : intensity > 0.4
                            ? 'rgba(124, 58, 237, 0.4)'
                            : VELOUR_TOKENS.bgSurface2,
                        cursor: 'pointer',
                        '&:hover': { outline: `2px solid ${VELOUR_TOKENS.accentLavender}` },
                      }}
                    />
                  </Tooltip>
                );
              })}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </PageShell>
  );
};
