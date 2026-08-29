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
  Button,
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { PageShell } from '../../components/layout/PageShell';
import { VELOUR_TOKENS } from '../../theme/palette';

export const AdminUsersPage: React.FC = () => {
  const usersList = [
    { id: 'USR-001', name: 'NOC Administrator', email: 'admin@rideai.com', role: 'ADMIN', permissions: 'Full Fleet NOC Management', status: 'ACTIVE' },
    { id: 'USR-002', name: 'Aryan Jha', email: 'aryan.jha@rideai.com', role: 'DRIVER', permissions: 'Driver Dispatch & Analytics', status: 'ACTIVE' },
    { id: 'USR-003', name: 'Suraj Panigrahi', email: 'suraj.p@rideai.com', role: 'DRIVER', permissions: 'Driver Dispatch & Analytics', status: 'ACTIVE' },
    { id: 'USR-004', name: 'Ananya Singh', email: 'ananya.s@rideai.com', role: 'DRIVER', permissions: 'Driver Dispatch & Analytics', status: 'ACTIVE' },
    { id: 'USR-005', name: 'Raghav Singh', email: 'raghav.s@rideai.com', role: 'DRIVER', permissions: 'Driver Dispatch & Analytics', status: 'ACTIVE' },
    { id: 'USR-006', name: 'Fleet Ops Manager', email: 'ops.director@rideai.com', role: 'ADMIN', permissions: 'Fleet Configuration & Telemetry', status: 'ACTIVE' },
  ];

  return (
    <PageShell title="User & Role Management (RBAC)">
      <Grid container spacing={3}>
        {/* User Summary Header */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFF' }}>
                Role-Based Access Control (RBAC) Administration
              </Typography>
              <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary }}>
                Manage system users, assigned roles, JWT permissions, and access privileges.
              </Typography>
            </Box>

            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              sx={{
                backgroundColor: VELOUR_TOKENS.accentTeal,
                color: '#0A0A0D',
                fontWeight: 700,
                textTransform: 'none',
                '&:hover': { backgroundColor: '#00BFA5' },
              }}
            >
              Provision New User
            </Button>
          </Box>
        </Grid>

        {/* Users Roster Table */}
        <Grid item xs={12}>
          <Card sx={{ p: 3, backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle }}>
            <TableContainer component={Paper} sx={{ backgroundColor: VELOUR_TOKENS.bgSurface2, borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ borderBottom: `1px solid ${VELOUR_TOKENS.borderSubtle}` }}>
                    <TableCell sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 700, fontSize: 12 }}>USER</TableCell>
                    <TableCell sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 700, fontSize: 12 }}>ROLE</TableCell>
                    <TableCell sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 700, fontSize: 12 }}>PERMISSIONS SCOPE</TableCell>
                    <TableCell sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 700, fontSize: 12 }}>ACCOUNT STATUS</TableCell>
                    <TableCell sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 700, fontSize: 12 }}>ACTIONS</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {usersList.map((user) => (
                    <TableRow key={user.id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, borderBottom: `1px solid ${VELOUR_TOKENS.borderSubtle}` }}>
                      <TableCell sx={{ color: '#FFF', fontWeight: 600, fontSize: 13 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ width: 32, height: 32, backgroundColor: user.role === 'ADMIN' ? 'rgba(0, 217, 192, 0.15)' : VELOUR_TOKENS.accentPrimaryDim, color: user.role === 'ADMIN' ? VELOUR_TOKENS.accentTeal : VELOUR_TOKENS.accentLavender, fontSize: 12, fontWeight: 700 }}>
                            {user.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#FFF', fontSize: 13 }}>
                              {user.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textTertiary, fontFamily: VELOUR_TOKENS.fontMono, fontSize: 11 }}>
                              {user.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={user.role === 'ADMIN' ? <SecurityIcon sx={{ fontSize: '12px !important', color: `${VELOUR_TOKENS.accentTeal} !important` }} /> : undefined}
                          label={user.role}
                          size="small"
                          sx={{
                            backgroundColor: user.role === 'ADMIN' ? 'rgba(0, 217, 192, 0.12)' : VELOUR_TOKENS.accentPrimaryDim,
                            color: user.role === 'ADMIN' ? VELOUR_TOKENS.accentTeal : VELOUR_TOKENS.accentLavender,
                            fontSize: 10,
                            fontWeight: 700,
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 12 }}>{user.permissions}</TableCell>
                      <TableCell>
                        <Chip label={user.status} size="small" sx={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: VELOUR_TOKENS.success, fontSize: 10, fontWeight: 700 }} />
                      </TableCell>
                      <TableCell>
                        <Button variant="text" size="small" sx={{ color: VELOUR_TOKENS.accentTeal, textTransform: 'none', fontWeight: 600 }}>
                          Edit Privileges
                        </Button>
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
