import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  LinearProgress,
  Paper,
} from '@mui/material';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import HeadsetMicOutlinedIcon from '@mui/icons-material/HeadsetMicOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { VELOUR_TOKENS } from '../../theme/palette';

const DRAWER_WIDTH = 240;

interface SidebarDrawerProps {
  mobileOpen?: boolean;
  onClose?: () => void;
  isAdmin?: boolean;
}

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({ isAdmin = true }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', icon: <DashboardOutlinedIcon />, path: '/dashboard' },
    { label: 'Live Demand Map', icon: <MapOutlinedIcon />, path: '/live-map' },
    { label: 'AI Assistant', icon: <SmartToyOutlinedIcon />, path: '/ai-assistant' },
    { label: 'Earnings', icon: <AttachMoneyIcon />, path: '/analytics' },
    { label: 'Trips', icon: <DirectionsCarOutlinedIcon />, path: '/trips' },
    { label: 'Analytics', icon: <AnalyticsOutlinedIcon />, path: '/analytics' },
    { label: 'Profile', icon: <PersonOutlineOutlinedIcon />, path: '/profile' },
    { label: 'Settings', icon: <SettingsOutlinedIcon />, path: '/settings' },
    { label: 'Support', icon: <HeadsetMicOutlinedIcon />, path: '/support' },
  ];

  if (isAdmin) {
    navItems.push({ label: 'Admin Ops', icon: <AdminPanelSettingsOutlinedIcon />, path: '/admin' });
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          backgroundColor: VELOUR_TOKENS.bgSurface1,
          borderColor: VELOUR_TOKENS.borderSubtle,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '20px 14px',
        },
      }}
    >
      <Box>
        {/* Brand Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            padding: '4px 8px 24px 8px',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/dashboard')}
        >
          <RocketLaunchIcon sx={{ color: VELOUR_TOKENS.accentPrimary, fontSize: 26 }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 18, lineHeight: 1.1, color: '#FFF' }}>
              Ride AI
            </Typography>
            <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 10, letterSpacing: '0.08em', fontWeight: 600 }}>
              DRIVER PORTAL
            </Typography>
          </Box>
        </Box>

        {/* Navigation List */}
        <List component="nav" sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItemButton
                key={item.label + item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: '10px',
                  padding: '8px 12px',
                  backgroundColor: isActive ? 'rgba(124, 58, 237, 0.15)' : 'transparent',
                  borderLeft: isActive ? `3px solid ${VELOUR_TOKENS.accentPrimary}` : '3px solid transparent',
                  color: isActive ? '#FFF' : VELOUR_TOKENS.textSecondary,
                  '&:hover': {
                    backgroundColor: 'rgba(124, 58, 237, 0.08)',
                    color: '#FFF',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 34,
                    color: isActive ? VELOUR_TOKENS.accentPrimary : VELOUR_TOKENS.textSecondary,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: 13.5,
                    fontWeight: isActive ? 600 : 400,
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      {/* Pro Driver Gold Tier Footer Progress Card */}
      <Paper
        sx={{
          mt: 'auto',
          p: 1.8,
          backgroundColor: VELOUR_TOKENS.bgSurface2,
          borderColor: 'rgba(212, 175, 55, 0.25)',
          borderWidth: 1,
          borderStyle: 'solid',
          borderRadius: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <EmojiEventsIcon sx={{ color: VELOUR_TOKENS.accentGold, fontSize: 20 }} />
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: 13, color: '#FFF', lineHeight: 1.2 }}>
              Pro Driver
            </Typography>
            <Typography variant="caption" sx={{ color: VELOUR_TOKENS.accentGold, fontSize: 11, fontWeight: 600 }}>
              Gold Tier
            </Typography>
          </Box>
        </Box>

        <LinearProgress
          variant="determinate"
          value={84.5}
          sx={{
            height: 6,
            borderRadius: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            '& .MuiLinearProgress-bar': {
              backgroundColor: VELOUR_TOKENS.accentGold,
              borderRadius: 3,
            },
            mb: 0.8,
          }}
        />

        <Typography className="mono-num" variant="caption" sx={{ display: 'block', color: VELOUR_TOKENS.textSecondary, fontSize: 10.5, fontWeight: 500 }}>
          8,450 / 10,000 pts
        </Typography>
      </Paper>
    </Drawer>
  );
};
