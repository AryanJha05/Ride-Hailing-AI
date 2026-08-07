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
  Button,
} from '@mui/material';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { VELOUR_TOKENS } from '../../theme/palette';

const DRAWER_WIDTH = 240;

interface SidebarDrawerProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export const SidebarDrawer: React.FC<SidebarDrawerProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Landing Page', icon: <HomeOutlinedIcon />, path: '/' },
    { label: 'Dashboard', icon: <DashboardOutlinedIcon />, path: '/dashboard' },
    { label: 'Live Map', icon: <MapOutlinedIcon />, path: '/live-map' },
    { label: 'AI Assistant', icon: <SmartToyOutlinedIcon />, path: '/ai-assistant' },
    { label: 'Analytics', icon: <AnalyticsOutlinedIcon />, path: '/analytics' },
    { label: 'Profile', icon: <PersonOutlineOutlinedIcon />, path: '/profile' },
    { label: 'Admin Ops', icon: <AdminPanelSettingsOutlinedIcon />, path: '/admin' },
  ];

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
          justify: 'space-between',
          padding: '20px 12px',
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
            padding: '8px 12px 24px 12px',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/')}
        >
          <RocketLaunchIcon sx={{ color: VELOUR_TOKENS.accentPrimary, fontSize: 28 }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 18, lineHeight: 1.2, color: '#FFF' }}>
              Ride AI
            </Typography>
            <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 11, letterSpacing: '0.05em' }}>
              COMMAND CENTER
            </Typography>
          </Box>
        </Box>

        {/* Navigation List */}
        <List component="nav" sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItemButton
                key={item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: '8px',
                  padding: '10px 14px',
                  backgroundColor: isActive ? VELOUR_TOKENS.accentPrimaryDim : 'transparent',
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
                    minWidth: 36,
                    color: isActive ? VELOUR_TOKENS.accentPrimary : VELOUR_TOKENS.textSecondary,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: 14,
                    fontWeight: isActive ? 600 : 400,
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      {/* Upgrade CTA Button */}
      <Box sx={{ mt: 'auto', pt: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          sx={{
            borderColor: 'rgba(212, 175, 55, 0.4)',
            color: VELOUR_TOKENS.accentGold,
            fontSize: 13,
            padding: '8px 12px',
            '&:hover': {
              borderColor: VELOUR_TOKENS.accentGold,
              backgroundColor: 'rgba(212, 175, 55, 0.08)',
            },
          }}
        >
          Upgrade to Premium
        </Button>
      </Box>
    </Drawer>
  );
};
