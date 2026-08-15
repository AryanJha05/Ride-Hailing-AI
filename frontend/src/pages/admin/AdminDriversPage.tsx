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
  Avatar,
} from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import StarIcon from '@mui/icons-material/Star';
import { PageShell } from '../../components/layout/PageShell';
import { VELOUR_TOKENS } from '../../theme/palette';

export const AdminDriversPage: React.FC = () => {
  const driversList = [
    { id: 'DRV-9401', name: 'Alex Morgan', role: 'Gold Driver', rating: 4.92, status: 'ONLINE', trips: 1420, earnings: '$4,850.00', vehicle: 'Tesla Model Y (NYC #842)' },
    { id: 'DRV-8321', name: 'Marcus Vance', role: 'Platinum Driver', rating: 4.98, status: 'ONLINE', trips: 2890, earnings: '$9,420.00', vehicle: 'Toyota Camry Hybrid (NYC #112)' },
    { id: 'DRV-7712', name: 'Elena Rostova', role: 'Gold Driver', rating: 4.88, status: 'ONLINE', trips: 980, earnings: '$3,210.00', vehicle: 'Ford Mustang Mach-E (NYC #504)' },
    { id: 'DRV-6540', name: 'David Chen', role: 'Silver Driver', rating: 4.85, status: 'OFFLINE', trips: 640, earnings: '$1,940.00', vehicle: 'Hyundai Ioniq 5 (NYC #339)' },
    { id: 'DRV-5120', name: 'Sarah Jenkins', role: 'Platinum Driver', rating: 4.96, status: 'ONLINE', trips: 3120, earnings: '$11,500.00', vehicle: 'Chevy Bolt EV (NYC #921)' },
  ];

  return (
    <PageShell title="Driver Management Directory">
      <Grid container spacing={3}>
        {/* Driver Directory Summary Header */}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {[
              { label: 'TOTAL REGISTERED DRIVERS', val: '14,921', color: '#FFF' },
              { label: 'ONLINE ON SHIFT', val: '12,410', color: VELOUR_TOKENS.accentTeal },
              { label: 'AVERAGE DRIVER RATING', val: '4.91 / 5.0', color: VELOUR_TOKENS.accentGold },
              { label: 'PLATINUM TIER DRIVERS', val: '3,840', color: VELOUR_TOKENS.accentLavender },
            ].map((stat, idx) => (
              <Grid item xs={6} md={3} key={idx}>
                <Card sx={{ p: 2.5, backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle }}>
                  <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 700, letterSpacing: '0.06em' }}>
                    {stat.label}
                  </Typography>
                  <Typography className="mono-num" variant="h4" sx={{ fontWeight: 700, color: stat.color, mt: 1 }}>
                    {stat.val}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Drivers List Table */}
        <Grid item xs={12}>
          <Card sx={{ p: 3, backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFF', fontSize: 16 }}>
                Active Drivers Roster
              </Typography>
              <Chip label="14,921 Total Accounts" size="small" sx={{ backgroundColor: 'rgba(0,217,192,0.1)', color: VELOUR_TOKENS.accentTeal, fontSize: 11, fontWeight: 600 }} />
            </Box>

            <TableContainer component={Paper} sx={{ backgroundColor: VELOUR_TOKENS.bgSurface2, borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ borderBottom: `1px solid ${VELOUR_TOKENS.borderSubtle}` }}>
                    <TableCell sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 700, fontSize: 12 }}>DRIVER</TableCell>
                    <TableCell sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 700, fontSize: 12 }}>DRIVER TIER</TableCell>
                    <TableCell sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 700, fontSize: 12 }}>STATUS</TableCell>
                    <TableCell sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 700, fontSize: 12 }}>RATING</TableCell>
                    <TableCell sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 700, fontSize: 12 }}>COMPLETED TRIPS</TableCell>
                    <TableCell sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 700, fontSize: 12 }}>ASSIGNED VEHICLE</TableCell>
                    <TableCell sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 700, fontSize: 12 }}>EARNINGS (MTO)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {driversList.map((driver) => (
                    <TableRow key={driver.id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, borderBottom: `1px solid ${VELOUR_TOKENS.borderSubtle}` }}>
                      <TableCell sx={{ color: '#FFF', fontWeight: 600, fontSize: 13 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ width: 32, height: 32, backgroundColor: VELOUR_TOKENS.accentPrimaryDim, color: VELOUR_TOKENS.accentLavender, fontSize: 12, fontWeight: 700 }}>
                            {driver.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#FFF', fontSize: 13 }}>
                              {driver.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textTertiary, fontFamily: VELOUR_TOKENS.fontMono, fontSize: 11 }}>
                              {driver.id}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: VELOUR_TOKENS.accentLavender, fontWeight: 600, fontSize: 13 }}>{driver.role}</TableCell>
                      <TableCell>
                        <Chip
                          icon={<FiberManualRecordIcon sx={{ fontSize: '10px !important', color: driver.status === 'ONLINE' ? `${VELOUR_TOKENS.accentTeal} !important` : '#8E8C9A !important' }} />}
                          label={driver.status}
                          size="small"
                          sx={{
                            backgroundColor: driver.status === 'ONLINE' ? 'rgba(0, 217, 192, 0.1)' : 'rgba(255, 255, 255, 0.04)',
                            color: driver.status === 'ONLINE' ? VELOUR_TOKENS.accentTeal : VELOUR_TOKENS.textSecondary,
                            fontSize: 10,
                            fontWeight: 700,
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: '#FFF', fontWeight: 700 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <StarIcon sx={{ color: VELOUR_TOKENS.accentGold, fontSize: 16 }} />
                          <Typography className="mono-num" variant="body2" sx={{ fontWeight: 700, color: '#FFF' }}>
                            {driver.rating}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell className="mono-num" sx={{ color: VELOUR_TOKENS.textPrimary, fontWeight: 600 }}>{driver.trips.toLocaleString()}</TableCell>
                      <TableCell sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 12 }}>{driver.vehicle}</TableCell>
                      <TableCell className="mono-num" sx={{ color: VELOUR_TOKENS.accentTeal, fontWeight: 700 }}>{driver.earnings}</TableCell>
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
