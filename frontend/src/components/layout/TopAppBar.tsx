import React, { useState, useEffect } from 'react';
import { Box, Typography, Chip, Avatar } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { VELOUR_TOKENS } from '../../theme/palette';

interface TopAppBarProps {
  title?: string;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({ title = 'Operations View' }) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { hour12: false }) + ' EST');
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 32px',
        borderBottom: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
        backgroundColor: VELOUR_TOKENS.bgBase,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#FFF' }}>
          {title}
        </Typography>
        <Chip
          icon={<FiberManualRecordIcon sx={{ fontSize: 10, color: '#22C55E !important' }} />}
          label="ONLINE"
          size="small"
          sx={{
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            color: '#22C55E',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            fontWeight: 600,
            fontSize: 11,
          }}
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        <Typography className="mono-num" sx={{ fontSize: 16, fontWeight: 500, color: VELOUR_TOKENS.textSecondary }}>
          {timeStr || '04:01:00 EST'}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
            alt="E. Operations"
            sx={{ width: 36, height: 36, border: `1px solid ${VELOUR_TOKENS.borderSubtle}` }}
          />
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#FFF' }}>
            E. Operations
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
