import React, { useState, useEffect } from 'react';
import { Box, Typography, Avatar, IconButton, Badge, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { VELOUR_TOKENS } from '../../theme/palette';

interface TopAppBarProps {
  title?: string;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({ title = 'Dashboard' }) => {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [timeStr, setTimeStr] = useState<string>('');
  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ' EST');
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
        justify: 'space-between',
        padding: '12px 28px',
        borderBottom: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
        backgroundColor: VELOUR_TOKENS.bgSurface1,
      }}
    >
      {/* Left Title & Mobile Menu Icon */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton size="small" sx={{ color: VELOUR_TOKENS.textSecondary }}>
          <MenuIcon fontSize="small" />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFF', fontSize: 18 }}>
          {title}
        </Typography>
      </Box>

      {/* Right Controls: Online Status, Notification Bell, User Avatar, Live Clock */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
        {/* Interactive Online Status Pill */}
        <Box
          onClick={() => setIsOnline(!isOnline)}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            px: 1.8,
            py: 0.6,
            borderRadius: 999,
            cursor: 'pointer',
            backgroundColor: isOnline ? 'rgba(0, 217, 192, 0.12)' : 'rgba(255, 255, 255, 0.05)',
            border: `1px solid ${isOnline ? 'rgba(0, 217, 192, 0.3)' : VELOUR_TOKENS.borderSubtle}`,
            transition: 'all 0.2s ease',
            '&:hover': { opacity: 0.9 },
          }}
        >
          <FiberManualRecordIcon
            sx={{
              fontSize: 10,
              color: isOnline ? `${VELOUR_TOKENS.accentTeal} !important` : `${VELOUR_TOKENS.textSecondary} !important`,
            }}
          />
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              fontSize: 12,
              color: isOnline ? VELOUR_TOKENS.accentTeal : VELOUR_TOKENS.textSecondary,
            }}
          >
            {isOnline ? 'Online' : 'Offline'}
          </Typography>
        </Box>

        {/* Notification Bell */}
        <IconButton size="small" sx={{ color: VELOUR_TOKENS.textSecondary, '&:hover': { color: '#FFF' } }}>
          <Badge badgeContent={3} color="error" sx={{ '& .MuiBadge-badge': { backgroundColor: VELOUR_TOKENS.accentPrimary, fontSize: 10 } }}>
            <NotificationsOutlinedIcon fontSize="small" />
          </Badge>
        </IconButton>

        {/* Driver Profile Badge */}
        <Box
          onClick={(e) => setProfileAnchor(e.currentTarget)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.2,
            cursor: 'pointer',
            p: '4px 8px',
            borderRadius: 2,
            '&:hover': { backgroundColor: VELOUR_TOKENS.bgSurface2 },
          }}
        >
          <Avatar
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
            alt="E. Operations"
            sx={{ width: 32, height: 32, border: `1px solid ${VELOUR_TOKENS.borderSubtle}` }}
          />
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#FFF', fontSize: 13, lineHeight: 1.2 }}>
              E. Operations
            </Typography>
            <Typography variant="caption" sx={{ color: VELOUR_TOKENS.accentGold, fontSize: 11, fontWeight: 500, display: 'block' }}>
              Gold Driver
            </Typography>
          </Box>
          <KeyboardArrowDownIcon sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 18 }} />
        </Box>

        {/* Profile Dropdown Menu */}
        <Menu
          anchorEl={profileAnchor}
          open={Boolean(profileAnchor)}
          onClose={() => setProfileAnchor(null)}
          PaperProps={{
            sx: {
              backgroundColor: VELOUR_TOKENS.bgSurface2,
              borderColor: VELOUR_TOKENS.borderSubtle,
              color: '#FFF',
            },
          }}
        >
          <MenuItem onClick={() => setProfileAnchor(null)}>Profile & Rating</MenuItem>
          <MenuItem onClick={() => setProfileAnchor(null)}>Shift Preferences</MenuItem>
          <MenuItem onClick={() => setProfileAnchor(null)}>Sign Out</MenuItem>
        </Menu>

        {/* Live Clock */}
        <Typography
          className="mono-num"
          sx={{
            fontSize: 13,
            fontWeight: 600,
            color: VELOUR_TOKENS.textSecondary,
            display: { xs: 'none', md: 'block' },
            fontFamily: VELOUR_TOKENS.fontMono,
          }}
        >
          {timeStr || '10:46 PM EST'}
        </Typography>
      </Box>
    </Box>
  );
};
