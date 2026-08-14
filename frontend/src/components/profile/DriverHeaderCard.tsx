import React from 'react';
import { Card, CardContent, Box, Typography, Avatar, Chip } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { VELOUR_TOKENS } from '../../theme/palette';
import { DriverPerformanceResponse } from '../../types/api.types';

interface DriverHeaderCardProps {
  driver?: DriverPerformanceResponse;
}

export const DriverHeaderCard: React.FC<DriverHeaderCardProps> = ({ driver }) => {
  return (
    <Card sx={{ backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle, mb: 3 }}>
      <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
        <Avatar
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
          alt={driver?.name || 'Alex Morgan'}
          sx={{
            width: 80,
            height: 80,
            border: `2px solid ${VELOUR_TOKENS.accentGold}`,
          }}
        />

        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#FFF' }}>
              {driver?.name || 'Alex Morgan'}
            </Typography>
            <Chip
              icon={<VerifiedUserIcon sx={{ fontSize: '14px !important', color: `${VELOUR_TOKENS.accentGold} !important` }} />}
              label="Gold Driver · NYC-2048"
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
            {driver?.email || 'alex.morgan@rideai.nyc'} · +1 (555) 234-5678
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <StarIcon sx={{ color: VELOUR_TOKENS.accentGold, fontSize: 18 }} />
              <Typography className="mono-num" variant="subtitle2" sx={{ color: '#FFF', fontWeight: 700 }}>
                {driver?.rating || 4.92}
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary }}>
              •
            </Typography>
            <Typography className="mono-num" variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary }}>
              {driver?.total_trips || 1284} Total Trips
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
