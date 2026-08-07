import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Box,
  TextField,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { PageShell } from '../components/layout/PageShell';
import { VELOUR_TOKENS } from '../theme/palette';

const MOCK_TRIPS = [
  { id: 'TRIP-8921', time: '10:14 AM', pickup: 'Financial District', dropoff: 'Midtown Core', fare: '$34.50', surge: '1.4x', rating: 5, status: 'Completed' },
  { id: 'TRIP-8920', time: '09:30 AM', pickup: 'Brooklyn Heights', dropoff: 'JFK Airport T4', fare: '$62.00', surge: '1.65x', rating: 5, status: 'Completed' },
  { id: 'TRIP-8919', time: '08:45 AM', pickup: 'Williamsburg', dropoff: 'Wall St', fare: '$28.10', surge: '1.2x', rating: 5, status: 'Completed' },
  { id: 'TRIP-8918', time: '08:10 AM', pickup: 'SoHo', dropoff: 'Penn Station', fare: '$19.50', surge: '1.0x', rating: 4, status: 'Completed' },
  { id: 'TRIP-8917', time: '07:25 AM', pickup: 'DUMBO', dropoff: 'Grand Central', fare: '$31.20', surge: '1.3x', rating: 5, status: 'Completed' },
];

export const Trips: React.FC = () => {
  const [search, setSearch] = useState('');

  const filteredTrips = MOCK_TRIPS.filter(
    (t) =>
      t.pickup.toLowerCase().includes(search.toLowerCase()) ||
      t.dropoff.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageShell title="Trip History & Rides Log">
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#FFF' }}>
              Shift Trips Log
            </Typography>
            <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary }}>
              Completed rides, fare breakdowns, and driver ratings.
            </Typography>
          </Box>

          <TextField
            size="small"
            placeholder="Search trips, zones..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 18 }} />
                </InputAdornment>
              ),
              sx: {
                backgroundColor: VELOUR_TOKENS.bgSurface1,
                color: '#FFF',
                borderRadius: 2,
                fontSize: 13,
                width: 260,
              },
            }}
          />
        </Box>

        <Paper sx={{ backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle, borderRadius: 3, overflow: 'hidden' }}>
          <Table>
            <TableHead sx={{ backgroundColor: VELOUR_TOKENS.bgSurface2 }}>
              <TableRow>
                <TableCell sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 700 }}>TRIP ID</TableCell>
                <TableCell sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 700 }}>TIME</TableCell>
                <TableCell sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 700 }}>PICKUP ZONE</TableCell>
                <TableCell sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 700 }}>DROPOFF ZONE</TableCell>
                <TableCell sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 700 }}>SURGE</TableCell>
                <TableCell sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 700 }}>FARE</TableCell>
                <TableCell sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 700 }}>RATING</TableCell>
                <TableCell sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 700 }}>STATUS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTrips.map((trip) => (
                <TableRow key={trip.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell className="mono-num" sx={{ color: VELOUR_TOKENS.accentLavender, fontWeight: 600 }}>
                    {trip.id}
                  </TableCell>
                  <TableCell className="mono-num" sx={{ color: VELOUR_TOKENS.textSecondary }}>
                    {trip.time}
                  </TableCell>
                  <TableCell sx={{ color: '#FFF', fontWeight: 500 }}>{trip.pickup}</TableCell>
                  <TableCell sx={{ color: VELOUR_TOKENS.textSecondary }}>{trip.dropoff}</TableCell>
                  <TableCell>
                    <Chip
                      label={trip.surge}
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(0, 217, 192, 0.12)',
                        color: VELOUR_TOKENS.accentTeal,
                        fontWeight: 700,
                        fontSize: 11,
                      }}
                    />
                  </TableCell>
                  <TableCell className="mono-num" sx={{ color: '#FFF', fontWeight: 700 }}>
                    {trip.fare}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: VELOUR_TOKENS.accentGold }}>
                      <StarIcon sx={{ fontSize: 14 }} />
                      <Typography className="mono-num" variant="body2" sx={{ fontWeight: 600 }}>
                        {trip.rating}.0
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={<DirectionsCarIcon sx={{ fontSize: '14px !important', color: `${VELOUR_TOKENS.accentTeal} !important` }} />}
                      label={trip.status}
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(0, 217, 192, 0.1)',
                        color: VELOUR_TOKENS.accentTeal,
                        fontSize: 11,
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Container>
    </PageShell>
  );
};
