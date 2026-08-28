import React from 'react';
import { Card, CardContent, Box, Typography, Avatar, Chip } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { VELOUR_TOKENS } from '../../theme/palette';
import { DriverPerformanceResponse } from '../../types/api.types';
import { useAuth } from '../../auth/AuthContext';

interface DriverHeaderCardProps {
  driver?: DriverPerformanceResponse;
}

export const DriverHeaderCard: React.FC<DriverHeaderCardProps> = ({ driver }) => {
  const { user } = useAuth();
  const name = driver?.name || user?.name || 'Driver Account';
  const email = driver?.email || user?.email || 'driver@rideai.nyc';
  const phone = user?.phone || '+1 (555) 234-5678';
  const rating = driver?.rating ?? user?.rating ?? 5.0;
  const totalTrips = driver?.total_trips ?? user?.total_trips ?? 0;
  const vehicle = user?.vehicle || 'Toyota Camry (NYC-TLC)';
  const badge = user?.badge || 'Active Driver';

  return (
    <Card sx={{ backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle, mb: 3 }}>
      <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
        <Avatar
          src={user?.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"}
          alt={name}
          sx={{
            width: 80,
            height: 80,
            border: `2px solid ${VELOUR_TOKENS.accentGold}`,
          }}
        />

        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5, flexWrap: 'wrap' }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#FFF' }}>
              {name}
            </Typography>
            <Chip
              icon={<VerifiedUserIcon sx={{ fontSize: '14px !important', color: `${VELOUR_TOKENS.accentGold} !important` }} />}
              label={`${badge} · ${vehicle}`}
              size="small"
              sx={{
                backgroundColor: 'rgba(212, 175, 55, 0.12)',
                color: VELOUR_TOKENS.accentGold,
                border: `1px solid rgba(212, 175, 55, 0.3)`,
                fontWeight: 600,
                fontSize: 12,
              }}
            />
          </Box>
          <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary, mb: 1 }}>
            {email} {phone ? `· ${phone}` : ''}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <StarIcon sx={{ color: VELOUR_TOKENS.accentGold, fontSize: 18 }} />
              <Typography className="mono-num" variant="subtitle2" sx={{ color: '#FFF', fontWeight: 700 }}>
                {rating}
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary }}>
              •
            </Typography>
            <Typography className="mono-num" variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary }}>
              {totalTrips} Total Trips
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
