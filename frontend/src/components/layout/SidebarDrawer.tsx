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
  Divider,
} from '@mui/material';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import HeadsetMicOutlinedIcon from '@mui/icons-material/HeadsetMicOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { VELOUR_TOKENS } from '../../theme/palette';

export const DRAWER_WIDTH = 260;

interface SidebarDrawerProps {
  mobileOpen?: boolean;
  onClose?: () => void;
  isAdmin?: boolean;
}

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

interface NavGroup {
  section: string;
  items: NavItem[];
}

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  mobileOpen = false,
  onClose,
  isAdmin = true,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (path: string) => {
    navigate(path);
    if (onClose) {
      onClose();
    }
  };

  const navGroups: NavGroup[] = [
    {
      section: 'OVERVIEW',
      items: [
        { label: 'Dashboard', icon: <DashboardOutlinedIcon fontSize="small" />, path: '/dashboard' },
        { label: 'Live Demand Map', icon: <MapOutlinedIcon fontSize="small" />, path: '/live-map' },
        { label: 'AI Assistant', icon: <SmartToyOutlinedIcon fontSize="small" />, path: '/ai-assistant' },
      ],
    },
    {
      section: 'PERFORMANCE',
      items: [
        { label: 'Analytics', icon: <AnalyticsOutlinedIcon fontSize="small" />, path: '/analytics' },
        { label: 'Trips', icon: <DirectionsCarOutlinedIcon fontSize="small" />, path: '/trips' },
      ],
    },
    {
      section: 'ACCOUNT',
      items: [
        { label: 'Profile', icon: <PersonOutlineOutlinedIcon fontSize="small" />, path: '/profile' },
        { label: 'Settings', icon: <SettingsOutlinedIcon fontSize="small" />, path: '/settings' },
        { label: 'Support', icon: <HeadsetMicOutlinedIcon fontSize="small" />, path: '/support' },
      ],
    },
  ];

  if (isAdmin) {
    navGroups.push({
      section: 'ADMIN',
      items: [
        { label: 'Admin Ops', icon: <AdminPanelSettingsOutlinedIcon fontSize="small" />, path: '/admin' },
      ],
    });
  }

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justify: 'space-between',
        padding: '16px 14px 20px 14px',
        backgroundColor: VELOUR_TOKENS.bgSurface1,
      }}
    >
      {/* Top Branding Section */}
      <Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            padding: '8px 10px 20px 10px',
            cursor: 'pointer',
            borderBottom: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
            mb: 2,
          }}
          onClick={() => handleNavClick('/dashboard')}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              backgroundColor: 'rgba(124, 58, 237, 0.18)',
              border: '1px solid rgba(124, 58, 237, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
            }}
          >
            <RocketLaunchIcon sx={{ color: VELOUR_TOKENS.accentPrimary, fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, fontSize: 17, lineHeight: 1.1, color: '#FFF', letterSpacing: '-0.02em' }}>
              Ride AI
            </Typography>
            <Typography variant="caption" sx={{ color: VELOUR_TOKENS.accentTeal, fontSize: 9.5, letterSpacing: '0.12em', fontWeight: 700 }}>
              DRIVER PORTAL
            </Typography>
          </Box>
        </Box>

        {/* Grouped Navigation Sections */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {navGroups.map((group, groupIdx) => (
            <Box key={group.section}>
              <Typography
                variant="caption"
                sx={{
                  color: VELOUR_TOKENS.textSecondary,
                  fontSize: 10.5,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  px: 1.5,
                  mb: 0.8,
                  display: 'block',
                  opacity: 0.8,
                }}
              >
                {group.section}
              </Typography>
              <List disablePadding component="nav" sx={{ display: 'flex', flexDirection: 'column', gap: 0.4 }}>
                {group.items.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <ListItemButton
                      key={item.label + item.path}
                      onClick={() => handleNavClick(item.path)}
                      sx={{
                        borderRadius: '8px',
                        padding: '8px 12px',
                        backgroundColor: isActive ? 'rgba(124, 58, 237, 0.16)' : 'transparent',
                        borderLeft: isActive ? `3px solid ${VELOUR_TOKENS.accentPrimary}` : '3px solid transparent',
                        color: isActive ? '#FFF' : VELOUR_TOKENS.textSecondary,
                        transition: 'all 0.15s ease',
                        '&:hover': {
                          backgroundColor: isActive ? 'rgba(124, 58, 237, 0.22)' : 'rgba(255, 255, 255, 0.05)',
                          color: '#FFF',
                          '& .MuiListItemIcon-root': {
                            color: '#FFF',
                          },
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 32,
                          color: isActive ? VELOUR_TOKENS.accentPrimary : VELOUR_TOKENS.textSecondary,
                          transition: 'color 0.15s ease',
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          fontSize: 13,
                          fontWeight: isActive ? 600 : 500,
                          letterSpacing: '-0.01em',
                        }}
                      />
                    </ListItemButton>
                  );
                })}
              </List>
              {groupIdx < navGroups.length - 1 && (
                <Divider sx={{ my: 1.5, borderColor: 'rgba(255, 255, 255, 0.04)' }} />
              )}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Pro Driver Gold Tier Footer Progress Card */}
      <Paper
        elevation={0}
        sx={{
          mt: 3,
          p: 1.6,
          backgroundColor: VELOUR_TOKENS.bgSurface2,
          borderColor: 'rgba(212, 175, 55, 0.25)',
          borderWidth: 1,
          borderStyle: 'solid',
          borderRadius: 2.5,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              backgroundColor: 'rgba(212, 175, 55, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
            }}
          >
            <EmojiEventsIcon sx={{ color: VELOUR_TOKENS.accentGold, fontSize: 17 }} />
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: 12.5, color: '#FFF', lineHeight: 1.2 }}>
              Pro Driver
            </Typography>
            <Typography variant="caption" sx={{ color: VELOUR_TOKENS.accentGold, fontSize: 10.5, fontWeight: 600 }}>
              Gold Tier
            </Typography>
          </Box>
        </Box>

        <LinearProgress
          variant="determinate"
          value={84.5}
          sx={{
            height: 5,
            borderRadius: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            '& .MuiLinearProgress-bar': {
              backgroundColor: VELOUR_TOKENS.accentGold,
              borderRadius: 3,
            },
            mb: 0.8,
          }}
        />

        <Typography className="mono-num" variant="caption" sx={{ display: 'block', color: VELOUR_TOKENS.textSecondary, fontSize: 10, fontWeight: 500, fontFamily: VELOUR_TOKENS.fontMono }}>
          8,450 / 10,000 pts
        </Typography>
      </Paper>
    </Box>
  );

  return (
    <>
      {/* Mobile / Tablet Temporary Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            backgroundColor: VELOUR_TOKENS.bgSurface1,
            borderColor: VELOUR_TOKENS.borderSubtle,
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Permanent Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            backgroundColor: VELOUR_TOKENS.bgSurface1,
            borderColor: VELOUR_TOKENS.borderSubtle,
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
};
