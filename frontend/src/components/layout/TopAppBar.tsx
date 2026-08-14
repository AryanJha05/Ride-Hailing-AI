import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Popover,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import HeadsetMicOutlinedIcon from '@mui/icons-material/HeadsetMicOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import SecurityIcon from '@mui/icons-material/Security';
import { VELOUR_TOKENS } from '../../theme/palette';
import { useAuth } from '../../auth/AuthContext';
import { ROLES } from '../../auth/roles';
import { ROUTES } from '../../routes/routes';

interface TopAppBarProps {
  title?: string;
  onMenuClick?: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({ title = 'Dashboard', onMenuClick }) => {
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();
  const isAdminRole = role === ROLES.ADMIN;
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [timeStr, setTimeStr] = useState<string>('');
  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);
  const [notifAnchor, setNotifAnchor] = useState<null | HTMLElement>(null);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ' EST');
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const notifications = [
    {
      id: 1,
      title: isAdminRole ? 'Fleet Surge Spike' : 'High Demand Zone Nearby',
      desc: isAdminRole ? 'Midtown Manhattan surge reached 1.85x.' : '+42% demand increase near Midtown Manhattan.',
      time: '2 mins ago',
      icon: <TrendingUpIcon sx={{ color: VELOUR_TOKENS.accentTeal, fontSize: 18 }} />,
    },
    {
      id: 2,
      title: isAdminRole ? 'Weekly Fleet Revenue' : 'Weekly Payout Processed',
      desc: isAdminRole ? '$48,920.00 total volume processed today.' : '$1,842.00 transferred to your linked account.',
      time: '1 hour ago',
      icon: <AccountBalanceWalletOutlinedIcon sx={{ color: VELOUR_TOKENS.accentGold, fontSize: 18 }} />,
    },
    {
      id: 3,
      title: isAdminRole ? 'Ollama Model Health Verified' : 'Driver Rating Verified',
      desc: isAdminRole ? 'Gemma2 model latency stable at 142ms.' : 'Your rating is 4.92 (Top 2% in NYC region).',
      time: '3 hours ago',
      icon: <CheckCircleOutlineIcon sx={{ color: VELOUR_TOKENS.accentLavender, fontSize: 18 }} />,
    },
  ];

  const handleSignOut = () => {
    setProfileAnchor(null);
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <Box
      component="header"
      sx={{
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        px: { xs: 2, md: 3 },
        borderBottom: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
        backgroundColor: VELOUR_TOKENS.bgSurface1,
        position: 'sticky',
        top: 0,
        zIndex: 1100,
      }}
    >
      {/* Left Section: Mobile Menu Toggle & Title Hierarchy */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <IconButton
          size="small"
          onClick={onMenuClick}
          sx={{
            color: VELOUR_TOKENS.textSecondary,
            display: { xs: 'inline-flex', md: 'none' },
            p: 1,
            borderRadius: '8px',
            '&:hover': {
              color: '#FFF',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
            },
          }}
        >
          <MenuIcon fontSize="small" />
        </IconButton>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            variant="caption"
            sx={{
              color: VELOUR_TOKENS.textSecondary,
              fontWeight: 600,
              fontSize: 12,
              letterSpacing: '0.04em',
              display: { xs: 'none', sm: 'inline' },
            }}
          >
            Ride AI
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: VELOUR_TOKENS.textSecondary,
              fontSize: 12,
              display: { xs: 'none', sm: 'inline' },
            }}
          >
            /
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: '#FFF',
              fontSize: { xs: 16, sm: 18 },
              letterSpacing: '-0.01em',
              lineHeight: 1,
            }}
          >
            {title}
          </Typography>
        </Box>
      </Box>

      {/* Right Section: Status Pill, Notification Bell, Profile Card, Clock */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 } }}>
        {/* Interactive Online Status Pill */}
        <Box
          onClick={() => setIsOnline(!isOnline)}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            px: 1.6,
            py: 0.5,
            borderRadius: 999,
            cursor: 'pointer',
            backgroundColor: isOnline ? 'rgba(0, 217, 192, 0.12)' : 'rgba(255, 255, 255, 0.05)',
            border: `1px solid ${isOnline ? 'rgba(0, 217, 192, 0.35)' : VELOUR_TOKENS.borderSubtle}`,
            transition: 'all 0.2s ease',
            userSelect: 'none',
            '&:hover': {
              backgroundColor: isOnline ? 'rgba(0, 217, 192, 0.18)' : 'rgba(255, 255, 255, 0.08)',
            },
          }}
        >
          <FiberManualRecordIcon
            sx={{
              fontSize: 9,
              color: isOnline ? `${VELOUR_TOKENS.accentTeal} !important` : `${VELOUR_TOKENS.textSecondary} !important`,
              animation: isOnline ? 'pulse 2s infinite' : 'none',
              '@keyframes pulse': {
                '0%': { opacity: 1 },
                '50%': { opacity: 0.4 },
                '100%': { opacity: 1 },
              },
            }}
          />
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              fontSize: 11.5,
              color: isOnline ? VELOUR_TOKENS.accentTeal : VELOUR_TOKENS.textSecondary,
              letterSpacing: '0.02em',
            }}
          >
            {isOnline ? 'Online' : 'Offline'}
          </Typography>
        </Box>

        {/* Notification Bell */}
        <IconButton
          size="small"
          onClick={(e) => setNotifAnchor(e.currentTarget)}
          sx={{
            color: VELOUR_TOKENS.textSecondary,
            p: 1,
            borderRadius: '8px',
            '&:hover': { color: '#FFF', backgroundColor: 'rgba(255, 255, 255, 0.06)' },
          }}
        >
          <Badge
            badgeContent={notifications.length}
            sx={{
              '& .MuiBadge-badge': {
                backgroundColor: VELOUR_TOKENS.accentPrimary,
                color: '#FFF',
                fontSize: 10,
                fontWeight: 700,
                minWidth: 16,
                height: 16,
                padding: '0 4px',
              },
            }}
          >
            <NotificationsOutlinedIcon fontSize="small" />
          </Badge>
        </IconButton>

        {/* Notifications Popover */}
        <Popover
          open={Boolean(notifAnchor)}
          anchorEl={notifAnchor}
          onClose={() => setNotifAnchor(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{
            sx: {
              width: 320,
              mt: 1,
              backgroundColor: VELOUR_TOKENS.bgSurface2,
              borderColor: VELOUR_TOKENS.borderSubtle,
              borderWidth: 1,
              borderStyle: 'solid',
              borderRadius: 2.5,
              color: '#FFF',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            },
          }}
        >
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: 13.5 }}>
              Alerts & Notifications
            </Typography>
            <Typography variant="caption" sx={{ color: VELOUR_TOKENS.accentTeal, fontSize: 11, cursor: 'pointer' }}>
              Mark all read
            </Typography>
          </Box>
          <Divider sx={{ borderColor: VELOUR_TOKENS.borderSubtle }} />
          <List disablePadding>
            {notifications.map((item, idx) => (
              <React.Fragment key={item.id}>
                <ListItem sx={{ py: 1.5, px: 2, cursor: 'pointer', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.04)' } }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>{item.icon}</ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.3 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: 12.5, color: '#FFF' }}>
                          {item.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 10 }}>
                          {item.time}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 11.5, display: 'block' }}>
                        {item.desc}
                      </Typography>
                    }
                  />
                </ListItem>
                {idx < notifications.length - 1 && <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.04)' }} />}
              </React.Fragment>
            ))}
          </List>
        </Popover>

        {/* Profile Control */}
        <Box
          onClick={(e) => setProfileAnchor(e.currentTarget)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.2,
            cursor: 'pointer',
            p: '4px 8px',
            borderRadius: '10px',
            transition: 'background-color 0.15s ease',
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.06)' },
          }}
        >
          <Avatar
            src={user?.avatar}
            alt={user?.name || 'User Profile'}
            sx={{
              width: 32,
              height: 32,
              border: `1.5px solid ${isAdminRole ? VELOUR_TOKENS.accentTeal : VELOUR_TOKENS.accentGold}`,
            }}
          />
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#FFF', fontSize: 13, lineHeight: 1.2 }}>
              {user?.name || 'Alex Morgan'}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: isAdminRole ? VELOUR_TOKENS.accentTeal : VELOUR_TOKENS.accentGold,
                fontSize: 10.5,
                fontWeight: 600,
                display: 'block',
              }}
            >
              {isAdminRole ? `Fleet Admin · ${user?.adminId || 'NOC-101'}` : `${user?.tier || 'Gold Driver'} · ${user?.driverId || 'NYC-2048'}`}
            </Typography>
          </Box>
          <KeyboardArrowDownIcon sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 16 }} />
        </Box>

        {/* Profile Dropdown Menu */}
        <Menu
          anchorEl={profileAnchor}
          open={Boolean(profileAnchor)}
          onClose={() => setProfileAnchor(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{
            sx: {
              mt: 1,
              width: 210,
              backgroundColor: VELOUR_TOKENS.bgSurface2,
              borderColor: VELOUR_TOKENS.borderSubtle,
              borderWidth: 1,
              borderStyle: 'solid',
              borderRadius: 2.5,
              color: '#FFF',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
              '& .MuiMenuItem-root': {
                fontSize: 13,
                gap: 1.5,
                py: 1,
                borderRadius: '6px',
                mx: 0.5,
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.06)' },
              },
            },
          }}
        >
          {!isAdminRole && (
            <MenuItem
              onClick={() => {
                setProfileAnchor(null);
                navigate(ROUTES.PROFILE);
              }}
            >
              <PersonOutlineIcon fontSize="small" sx={{ color: VELOUR_TOKENS.accentPrimary }} />
              Profile & Rating
            </MenuItem>
          )}

          {isAdminRole && (
            <MenuItem
              onClick={() => {
                setProfileAnchor(null);
                navigate(ROUTES.ADMIN);
              }}
            >
              <SecurityIcon fontSize="small" sx={{ color: VELOUR_TOKENS.accentTeal }} />
              Admin NOC Center
            </MenuItem>
          )}

          <MenuItem
            onClick={() => {
              setProfileAnchor(null);
              navigate(ROUTES.SETTINGS);
            }}
          >
            <SettingsOutlinedIcon fontSize="small" sx={{ color: VELOUR_TOKENS.textSecondary }} />
            {isAdminRole ? 'Fleet Configuration' : 'Shift Preferences'}
          </MenuItem>

          <MenuItem
            onClick={() => {
              setProfileAnchor(null);
              navigate(ROUTES.SUPPORT);
            }}
          >
            <HeadsetMicOutlinedIcon fontSize="small" sx={{ color: VELOUR_TOKENS.accentTeal }} />
            Support & Help
          </MenuItem>

          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', my: 0.5 }} />

          <MenuItem onClick={handleSignOut} sx={{ color: '#FF5252 !important' }}>
            <LogoutIcon fontSize="small" sx={{ color: '#FF5252' }} />
            Sign Out
          </MenuItem>
        </Menu>

        {/* Live Clock (EST) */}
        <Typography
          className="mono-num"
          sx={{
            fontSize: 12.5,
            fontWeight: 600,
            color: VELOUR_TOKENS.textSecondary,
            display: { xs: 'none', lg: 'block' },
            fontFamily: VELOUR_TOKENS.fontMono,
            ml: 0.5,
            px: 1.2,
            py: 0.4,
            borderRadius: '6px',
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            border: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
          }}
        >
          {timeStr || '22:45 EST'}
        </Typography>
      </Box>
    </Box>
  );
};
