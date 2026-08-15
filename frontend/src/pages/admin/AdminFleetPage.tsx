import React from 'react';
import {
  Grid,
  Box,
  Card,
  Typography,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BuildIcon from '@mui/icons-material/Build';
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi';
import { PageShell } from '../../components/layout/PageShell';
import { VELOUR_TOKENS } from '../../theme/palette';

export const AdminFleetPage: React.FC = () => {
  const fleetSummaryStats = [
    { label: 'TOTAL VEHICLES', val: '18,500', color: '#FFF', icon: <LocalTaxiIcon sx={{ color: VELOUR_TOKENS.accentLavender }} /> },
    { label: 'ACTIVE DISPATCHED', val: '14,921', color: VELOUR_TOKENS.accentTeal, icon: <DirectionsCarIcon sx={{ color: VELOUR_TOKENS.accentTeal }} /> },
    { label: 'AVAILABLE STAGED', val: '2,840', color: VELOUR_TOKENS.success, icon: <CheckCircleIcon sx={{ color: VELOUR_TOKENS.success }} /> },
    { label: 'IN MAINTENANCE', val: '739', color: VELOUR_TOKENS.warning, icon: <BuildIcon sx={{ color: VELOUR_TOKENS.warning }} /> },
  ];

  const boroughDistribution = [
    { borough: 'Manhattan (Midtown / Downtown)', total: 7850, active: 6420, staged: 1150, maintenance: 280, utilization: '96.4%' },
    { borough: 'Brooklyn (Williamsburg / DUMBO)', total: 4200, active: 3410, staged: 610, maintenance: 180, utilization: '95.7%' },
    { borough: 'Queens (JFK / LGA / LIC)', total: 3900, active: 3180, staged: 580, maintenance: 140, utilization: '96.1%' },
    { borough: 'The Bronx & Staten Island', total: 2550, active: 1911, staged: 500, maintenance: 139, utilization: '94.2%' },
  ];

  return (
    <PageShell title="Fleet Operations Management">
      <Grid container spacing={3}>
        {/* Fleet Metric Strip */}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {fleetSummaryStats.map((stat, idx) => (
              <Grid item xs={6} md={3} key={idx}>
                <Card sx={{ p: 2.5, backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 700, letterSpacing: '0.06em' }}>
                      {stat.label}
                    </Typography>
                    {stat.icon}
                  </Box>
                  <Typography className="mono-num" variant="h4" sx={{ fontWeight: 700, color: stat.color, mt: 1 }}>
                    {stat.val}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* NYC Borough Fleet Distribution Table */}
        <Grid item xs={12}>
          <Card sx={{ p: 3, backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFF', fontSize: 16 }}>
                NYC Borough Fleet Distribution & Status
              </Typography>
              <Chip label="Real-time Telemetry" size="small" sx={{ backgroundColor: 'rgba(0,217,192,0.1)', color: VELOUR_TOKENS.accentTeal, fontSize: 11, fontWeight: 600 }} />
            </Box>

            <TableContainer component={Paper} sx={{ backgroundColor: VELOUR_TOKENS.bgSurface2, borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ borderBottom: `1px solid ${VELOUR_TOKENS.borderSubtle}` }}>
                    <TableCell sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 700, fontSize: 12 }}>BOROUGH ZONE</TableCell>
                    <TableCell sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 700, fontSize: 12 }}>TOTAL FLEET</TableCell>
                    <TableCell sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 700, fontSize: 12 }}>ACTIVE DISPATCHED</TableCell>
                    <TableCell sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 700, fontSize: 12 }}>AVAILABLE STAGED</TableCell>
                    <TableCell sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 700, fontSize: 12 }}>MAINTENANCE</TableCell>
                    <TableCell sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 700, fontSize: 12 }}>EFFICIENCY</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {boroughDistribution.map((row, idx) => (
                    <TableRow key={idx} sx={{ '&:last-child td, &:last-child th': { border: 0 }, borderBottom: `1px solid ${VELOUR_TOKENS.borderSubtle}` }}>
                      <TableCell sx={{ color: '#FFF', fontWeight: 600, fontSize: 13 }}>{row.borough}</TableCell>
                      <TableCell className="mono-num" sx={{ color: VELOUR_TOKENS.textPrimary, fontWeight: 600 }}>{row.total.toLocaleString()}</TableCell>
                      <TableCell className="mono-num" sx={{ color: VELOUR_TOKENS.accentTeal, fontWeight: 700 }}>{row.active.toLocaleString()}</TableCell>
                      <TableCell className="mono-num" sx={{ color: VELOUR_TOKENS.success, fontWeight: 600 }}>{row.staged.toLocaleString()}</TableCell>
                      <TableCell className="mono-num" sx={{ color: VELOUR_TOKENS.warning, fontWeight: 600 }}>{row.maintenance}</TableCell>
                      <TableCell>
                        <Chip label={row.utilization} size="small" sx={{ backgroundColor: 'rgba(0,217,192,0.1)', color: VELOUR_TOKENS.accentTeal, fontSize: 11, fontWeight: 700 }} />
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
