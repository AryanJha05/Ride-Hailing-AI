import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
import { VELOUR_TOKENS } from '../theme/palette';
import { useAuth } from '../auth/AuthContext';
import { UserRole } from '../auth/roles';
import { ROUTES } from '../routes/routes';
import { HEADER_HEIGHT } from './Sidebar';

interface HeaderProps {
  title?: string;
  onMenuClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, onMenuClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, role, logout } = useAuth();
  const isAdminRole = role === UserRole.ADMIN;
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

  const getComputedTitle = (): string => {
    if (title && title !== 'Operations View' && title !== 'Dashboard') {
      return title;
    }
    const path = location.pathname;
    if (isAdminRole) {
      if (path.includes('/admin/fleet')) return 'Fleet Operations';
      if (path.includes('/admin/drivers')) return 'Driver Management';
      if (path.includes('/admin/demand')) return 'Live Demand Map';
      if (path.includes('/admin/forecast')) return 'Demand Forecast';
      if (path.includes('/admin/models')) return 'Model Health & NOC';
      if (path.includes('/admin/recommendations')) return 'AI Recommendations';
      if (path.includes('/admin/alerts')) return 'NOC Alerts & Signals';
      if (path.includes('/admin/system')) return 'System Infrastructure Status';
      if (path.includes('/admin/users')) return 'Users & Roles';
      if (path.includes('/admin/settings')) return 'Fleet Settings';
      return 'Operations Overview';
    } else {
      if (path.includes('/driver/demand') || path.includes('/user/live-map')) return 'Live Demand Map';
      if (path.includes('/driver/assistant') || path.includes('/user/ai-assistant')) return 'AI Driver Assistant';
      if (path.includes('/driver/earnings')) return 'Driver Earnings Summary';
      if (path.includes('/driver/trips') || path.includes('/user/trips')) return 'Trip History';
      if (path.includes('/driver/analytics') || path.includes('/user/analytics')) return 'Performance Analytics';
      if (path.includes('/driver/profile') || path.includes('/user/profile')) return 'Driver Profile';
      if (path.includes('/driver/settings') || path.includes('/user/settings')) return 'Shift Preferences';
      if (path.includes('/driver/support') || path.includes('/user/support')) return 'Support & Help';
      return 'Driver Dashboard';
    }
  };

  const displayTitle = getComputedTitle();

  const notifications = [
    {
      id: 1,
      title: isAdminRole ? 'Fleet Telemetry Active' : 'System Telemetry Active',
      desc: isAdminRole ? 'XGBoost V3 model processing live inference requests.' : 'XGBoost V3 Trip Duration model operational.',
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
      title: isAdminRole ? 'Backend Health Verified' : 'Driver Rating Verified',
      desc: isAdminRole ? 'Core API telemetry and database latency stable.' : 'Your rating is 4.92 (Top 2% in NYC region).',
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
        height: HEADER_HEIGHT,
        minHeight: HEADER_HEIGHT,
        maxHeight: HEADER_HEIGHT,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: { xs: 1.5, sm: 2, md: 3 },
        borderBottom: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
        backgroundColor: VELOUR_TOKENS.bgSurface1,
        position: 'sticky',
        top: 0,
        zIndex: (theme) => theme.zIndex.drawer + 1,
        boxSizing: 'border-box',
        width: '100%',
        maxWidth: '100%',
        minWidth: 0,
      }}
    >
      {/* LEFT: Application Identity, Page Title & Network Badge */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, height: '100%', minWidth: 0, overflow: 'hidden' }}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onMenuClick}
          sx={{
            display: { md: 'none' },
            color: VELOUR_TOKENS.textPrimary,
            p: 0.8,
            flexShrink: 0,
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.05)' },
          }}
        >
          <MenuIcon fontSize="small" />
        </IconButton>

        <Typography
          variant="h6"
          noWrap
          sx={{
            fontSize: { xs: 14, sm: 16, md: 18 },
            fontWeight: 700,
            color: VELOUR_TOKENS.textPrimary,
            letterSpacing: '-0.01em',
            lineHeight: 1,
            display: 'block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            minWidth: 0,
          }}
        >
          {displayTitle}
        </Typography>

        {/* Network Badge */}
        <Chip
          label={isAdminRole ? 'NOC CONTROL CENTER' : 'NYC METRO NETWORK'}
          size="small"
          sx={{
            display: { xs: 'none', sm: 'inline-flex' },
            alignItems: 'center',
            backgroundColor: isAdminRole ? 'rgba(124, 58, 237, 0.08)' : 'rgba(0, 217, 192, 0.08)',
            color: isAdminRole ? VELOUR_TOKENS.accentLavender : VELOUR_TOKENS.accentTeal,
            border: `1px solid ${isAdminRole ? 'rgba(124, 58, 237, 0.25)' : 'rgba(0, 217, 192, 0.25)'}`,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.04em',
            height: 24,
            flexShrink: 0,
          }}
        />
      </Box>

      {/* RIGHT: Telemetry Status, Notifications, Driver Profile & Clock */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 }, height: '100%', flexShrink: 0 }}>
        {/* System Telemetry Active Status Chip */}
        <Chip
          icon={
            <FiberManualRecordIcon
              sx={{
                fontSize: '9px !important',
                color: `${VELOUR_TOKENS.accentTeal} !important`,
              }}
            />
          }
          label={isAdminRole ? 'NOC ACTIVE' : 'ONLINE'}
          size="small"
          sx={{
            backgroundColor: 'rgba(0, 217, 192, 0.08)',
            color: VELOUR_TOKENS.accentTeal,
            border: '1px solid rgba(0, 217, 192, 0.25)',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.04em',
            height: 26,
            px: 0.5,
            flexShrink: 0,
          }}
        />

        {/* Notifications Trigger */}
        <IconButton
          onClick={(e) => setNotifAnchor(e.currentTarget)}
          sx={{
            color: VELOUR_TOKENS.textSecondary,
            border: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            borderRadius: '8px',
            p: 0,
            width: 34,
            height: 34,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            '&:hover': {
              color: VELOUR_TOKENS.textPrimary,
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
            },
          }}
        >
          <Badge
            variant="dot"
            sx={{
              '& .MuiBadge-badge': {
                backgroundColor: VELOUR_TOKENS.accentTeal,
              },
            }}
          >
            <NotificationsOutlinedIcon fontSize="small" />
          </Badge>
        </IconButton>

        {/* Notifications Popover Dropdown */}
        <Popover
          open={Boolean(notifAnchor)}
          anchorEl={notifAnchor}
          onClose={() => setNotifAnchor(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{
            sx: {
              width: 320,
              backgroundColor: VELOUR_TOKENS.bgSurface2,
              borderColor: VELOUR_TOKENS.borderSubtle,
              borderWidth: 1,
              borderStyle: 'solid',
              borderRadius: 3,
              mt: 1,
              boxShadow: '0 16px 36px rgba(0, 0, 0, 0.5)',
            },
          }}
        >
          <Box sx={{ p: 2, borderBottom: `1px solid ${VELOUR_TOKENS.borderSubtle}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: VELOUR_TOKENS.textPrimary }}>
              Notifications
            </Typography>
            <Chip label="3 New" size="small" sx={{ backgroundColor: VELOUR_TOKENS.accentPrimaryDim, color: VELOUR_TOKENS.accentLavender, fontSize: 10, height: 20 }} />
          </Box>
          <List sx={{ py: 0 }}>
            {notifications.map((item, index) => (
              <React.Fragment key={item.id}>
                <ListItem sx={{ px: 2, py: 1.5, '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.03)' } }}>
                  <ListItemIcon sx={{ minWidth: 34 }}>{item.icon}</ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: 12.5, color: VELOUR_TOKENS.textPrimary }}>
                        {item.title}
                      </Typography>
                    }
                    secondary={
                      <Box component="span">
                        <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 11, display: 'block', mt: 0.2 }}>
                          {item.desc}
                        </Typography>
                        <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textTertiary, fontSize: 10, mt: 0.3, display: 'block' }}>
                          {item.time}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {index < notifications.length - 1 && <Divider sx={{ borderColor: VELOUR_TOKENS.borderSubtle }} />}
              </React.Fragment>
            ))}
          </List>
        </Popover>

        {/* Profile Pill Trigger */}
        <Box
          onClick={(e) => setProfileAnchor(e.currentTarget)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            px: 1.2,
            py: 0.5,
            height: 36,
            boxSizing: 'border-box',
            borderRadius: '9px',
            border: `1px solid ${isAdminRole ? 'rgba(0, 217, 192, 0.3)' : VELOUR_TOKENS.borderSubtle}`,
            backgroundColor: isAdminRole ? 'rgba(0, 217, 192, 0.04)' : 'rgba(255, 255, 255, 0.02)',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: isAdminRole ? 'rgba(0, 217, 192, 0.08)' : 'rgba(255, 255, 255, 0.06)',
            },
          }}
        >
          <Avatar
            src={user?.avatar}
            alt={user?.name || 'User'}
            sx={{
              width: 26,
              height: 26,
              border: `1.5px solid ${isAdminRole ? VELOUR_TOKENS.accentTeal : VELOUR_TOKENS.accentPrimary}`,
            }}
          />
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, flexDirection: 'column', justifyContent: 'center', textAlign: 'left' }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontSize: 12,
                fontWeight: 700,
                color: VELOUR_TOKENS.textPrimary,
                lineHeight: 1.1,
              }}
            >
              {user?.name || (isAdminRole ? 'Ride AI Administrator' : 'Alex Morgan')}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography
                variant="caption"
                sx={{
                  fontSize: 9.5,
                  color: isAdminRole ? VELOUR_TOKENS.accentTeal : VELOUR_TOKENS.accentGold,
                  fontWeight: 600,
                  lineHeight: 1,
                }}
              >
                {isAdminRole ? (user?.badge || 'Fleet Director') : (user?.badge || 'Active Driver')}
              </Typography>
              {!isAdminRole && (
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: 9.5,
                    color: VELOUR_TOKENS.textSecondary,
                    fontWeight: 600,
                    lineHeight: 1,
                  }}
                >
                  • ★ {user?.rating ?? 4.92}
                </Typography>
              )}
            </Box>
          </Box>
          <KeyboardArrowDownIcon sx={{ fontSize: 16, color: VELOUR_TOKENS.textSecondary }} />
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
              width: 240,
              backgroundColor: VELOUR_TOKENS.bgSurface2,
              borderColor: VELOUR_TOKENS.borderSubtle,
              borderWidth: 1,
              borderStyle: 'solid',
              borderRadius: 3,
              mt: 1,
              boxShadow: '0 16px 36px rgba(0, 0, 0, 0.5)',
              '& .MuiMenuItem-root': {
                fontSize: 13,
                fontWeight: 600,
                color: VELOUR_TOKENS.textPrimary,
                py: 1,
                px: 2,
                gap: 1.5,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                },
              },
            },
          }}
        >
          <Box sx={{ px: 2, py: 1.5, borderBottom: `1px solid ${VELOUR_TOKENS.borderSubtle}` }}>
            <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textTertiary, display: 'block', fontSize: 10 }}>
              SIGNED IN AS ({user?.role || (isAdminRole ? 'ADMIN' : 'DRIVER')})
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: VELOUR_TOKENS.textPrimary, fontSize: 13 }}>
              {user?.email || (isAdminRole ? 'admin@rideai.nyc' : 'driver@rideai.nyc')}
            </Typography>
          </Box>

          {!isAdminRole && (
            <MenuItem
              onClick={() => {
                setProfileAnchor(null);
                navigate(ROUTES.DRIVER.PROFILE);
              }}
            >
              <PersonOutlineIcon fontSize="small" sx={{ color: VELOUR_TOKENS.accentLavender }} />
              Driver Profile
            </MenuItem>
          )}

          {isAdminRole && (
            <MenuItem
              onClick={() => {
                setProfileAnchor(null);
                navigate(ROUTES.ADMIN.DASHBOARD);
              }}
            >
              <SecurityIcon fontSize="small" sx={{ color: VELOUR_TOKENS.accentTeal }} />
              Admin Operations Center
            </MenuItem>
          )}

          <MenuItem
            onClick={() => {
              setProfileAnchor(null);
              navigate(isAdminRole ? ROUTES.ADMIN.SETTINGS : ROUTES.DRIVER.SETTINGS);
            }}
          >
            <SettingsOutlinedIcon fontSize="small" sx={{ color: VELOUR_TOKENS.textSecondary }} />
            {isAdminRole ? 'Fleet Configuration' : 'Shift Preferences'}
          </MenuItem>

          <MenuItem
            onClick={() => {
              setProfileAnchor(null);
              navigate(isAdminRole ? ROUTES.ADMIN.SYSTEM : ROUTES.DRIVER.SUPPORT);
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

        {/* Live Monospace Clock (EST) */}
        <Box
          sx={{
            display: { xs: 'none', lg: 'flex' },
            alignItems: 'center',
            height: 32,
            px: 1.2,
            borderRadius: '6px',
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            border: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
            flexShrink: 0,
          }}
        >
          <Typography
            className="mono-num"
            sx={{
              fontSize: 12,
              fontWeight: 600,
              color: VELOUR_TOKENS.textSecondary,
              fontFamily: VELOUR_TOKENS.fontMono,
              lineHeight: 1,
            }}
          >
            {timeStr || '22:45 EST'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
