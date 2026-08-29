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
  Chip,
} from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SecurityIcon from '@mui/icons-material/Security';
import { VELOUR_TOKENS } from '../theme/palette';
import { useAuth } from '../auth/AuthContext';
import { UserRole } from '../auth/roles';
import { ROUTES } from '../routes/routes';
import { ADMIN_NAV_GROUPS, DRIVER_NAV_GROUPS } from '../navigation';

export const DRAWER_WIDTH = 260;
export const HEADER_HEIGHT = 70;

interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  mobileOpen = false,
  onClose,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { role } = useAuth();
  const isAdminRole = role === UserRole.ADMIN;

  const handleNavClick = (path: string) => {
    navigate(path);
    if (onClose) {
      onClose();
    }
  };

  // Role-Aware Navigation Configuration
  const navGroups = isAdminRole ? ADMIN_NAV_GROUPS : DRIVER_NAV_GROUPS;

  const drawerContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: VELOUR_TOKENS.bgSurface1,
        color: VELOUR_TOKENS.textPrimary,
        borderRight: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
      }}
    >
      {/* Brand Header — Aligned with App Header Height (70px) */}
      <Box
        sx={{
          height: HEADER_HEIGHT,
          minHeight: HEADER_HEIGHT,
          maxHeight: HEADER_HEIGHT,
          px: 2.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          cursor: 'pointer',
          boxSizing: 'border-box',
          borderBottom: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
        }}
        onClick={() => handleNavClick(isAdminRole ? ROUTES.ADMIN.DASHBOARD : ROUTES.DRIVER.DASHBOARD)}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 2,
            backgroundColor: isAdminRole ? 'rgba(0, 217, 192, 0.15)' : VELOUR_TOKENS.accentPrimaryDim,
            border: `1px solid ${isAdminRole ? 'rgba(0, 217, 192, 0.3)' : VELOUR_TOKENS.borderSubtle}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 16px ${isAdminRole ? 'rgba(0, 217, 192, 0.2)' : VELOUR_TOKENS.accentPrimaryDim}`,
          }}
        >
          {isAdminRole ? (
            <SecurityIcon sx={{ color: VELOUR_TOKENS.accentTeal, fontSize: 20 }} />
          ) : (
            <RocketLaunchIcon sx={{ color: VELOUR_TOKENS.accentPrimary, fontSize: 20 }} />
          )}
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: 18,
              color: VELOUR_TOKENS.textPrimary,
              letterSpacing: '-0.02em',
              lineHeight: 1,
            }}
          >
            Ride AI
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: isAdminRole ? VELOUR_TOKENS.accentTeal : VELOUR_TOKENS.accentLavender,
              fontSize: 9.5,
              letterSpacing: '0.08em',
              fontWeight: 700,
              display: 'block',
              mt: 0.3,
            }}
          >
            {isAdminRole ? 'ENTERPRISE NOC' : 'MOBILITY INTELLIGENCE'}
          </Typography>
        </Box>
      </Box>

      {/* Navigation Sections */}
      <Box sx={{ flexGrow: 1, px: 2, py: 2, overflowY: 'auto' }}>
        {navGroups.map((group, groupIdx) => (
          <Box key={groupIdx} sx={{ mb: 2.5 }}>
            <Typography
              variant="caption"
              sx={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: VELOUR_TOKENS.textTertiary,
                px: 1.5,
                mb: 1,
                display: 'block',
              }}
            >
              {group.section}
            </Typography>

            <List disablePadding>
              {group.items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <ListItemButton
                    key={item.path}
                    onClick={() => handleNavClick(item.path)}
                    sx={{
                      borderRadius: '8px',
                      mb: 0.5,
                      py: 1,
                      px: 1.5,
                      backgroundColor: isActive
                        ? isAdminRole ? 'rgba(0, 217, 192, 0.12)' : VELOUR_TOKENS.accentPrimaryDim
                        : 'transparent',
                      borderLeft: isActive
                        ? `3px solid ${isAdminRole ? VELOUR_TOKENS.accentTeal : VELOUR_TOKENS.accentPrimary}`
                        : '3px solid transparent',
                      color: isActive ? VELOUR_TOKENS.textPrimary : VELOUR_TOKENS.textSecondary,
                      '&:hover': {
                        backgroundColor: isActive
                          ? isAdminRole ? 'rgba(0, 217, 192, 0.16)' : VELOUR_TOKENS.accentPrimaryDim
                          : 'rgba(255, 255, 255, 0.04)',
                        color: VELOUR_TOKENS.textPrimary,
                        '& .MuiListItemIcon-root': {
                          color: isAdminRole ? VELOUR_TOKENS.accentTeal : VELOUR_TOKENS.accentLavender,
                        },
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 32,
                        color: isActive
                          ? isAdminRole ? VELOUR_TOKENS.accentTeal : VELOUR_TOKENS.accentPrimary
                          : VELOUR_TOKENS.textSecondary,
                        transition: 'color 0.2s ease',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontSize: 13,
                        fontWeight: isActive ? 700 : 500,
                        letterSpacing: '-0.01em',
                      }}
                    />
                  </ListItemButton>
                );
              })}
            </List>
          </Box>
        ))}
      </Box>

      {/* Sidebar Footer Widget */}
      <Box sx={{ p: 2, borderTop: `1px solid ${VELOUR_TOKENS.borderSubtle}` }}>
        <Paper
          elevation={0}
          sx={{
            p: 1.5,
            backgroundColor: isAdminRole ? 'rgba(0, 217, 192, 0.04)' : VELOUR_TOKENS.bgSurface2,
            borderRadius: 2,
            border: `1px solid ${isAdminRole ? 'rgba(0, 217, 192, 0.2)' : VELOUR_TOKENS.borderSubtle}`,
          }}
        >
          {isAdminRole ? (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.8 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <SecurityIcon sx={{ color: VELOUR_TOKENS.accentTeal, fontSize: 16 }} />
                  <Typography variant="caption" sx={{ fontWeight: 700, fontSize: 11, color: VELOUR_TOKENS.textPrimary }}>
                    Fleet Operations
                  </Typography>
                </Box>
                <Chip label="READY" size="small" sx={{ backgroundColor: 'rgba(0, 217, 192, 0.15)', color: VELOUR_TOKENS.accentTeal, fontSize: 9, fontWeight: 700, height: 18 }} />
              </Box>
              <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 10, display: 'block' }}>
                Mobility Intelligence NOC
              </Typography>
            </>
          ) : (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <RocketLaunchIcon sx={{ color: VELOUR_TOKENS.accentLavender, fontSize: 16 }} />
                  <Typography variant="caption" sx={{ fontWeight: 700, fontSize: 11, color: VELOUR_TOKENS.textPrimary }}>
                    AI Copilot
                  </Typography>
                </Box>
                <Chip label="DEMO" size="small" sx={{ backgroundColor: 'rgba(234, 179, 8, 0.15)', color: VELOUR_TOKENS.accentGold, fontSize: 9, fontWeight: 700, height: 18 }} />
              </Box>
              <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 10, display: 'block' }}>
                Demand & trip intelligence
              </Typography>
            </>
          )}
        </Paper>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile Temporary Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: DRAWER_WIDTH,
            backgroundColor: VELOUR_TOKENS.bgSurface1,
            borderRight: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Persistent Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: DRAWER_WIDTH,
            backgroundColor: VELOUR_TOKENS.bgSurface1,
            borderRight: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
};
