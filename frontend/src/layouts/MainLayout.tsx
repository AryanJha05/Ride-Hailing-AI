import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import { Sidebar, DRAWER_WIDTH, HEADER_HEIGHT } from './Sidebar';
import { Header } from './Header';
import { VELOUR_TOKENS } from '../theme/palette';

export interface MainLayoutProps {
  children?: React.ReactNode;
  title?: string;
  hideHeader?: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  title = 'Operations View',
  hideHeader = false,
}) => {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        width: '100%',
        maxWidth: '100vw',
        backgroundColor: VELOUR_TOKENS.bgBase,
        boxSizing: 'border-box',
        overflowX: 'hidden',
      }}
    >
      {/* Shared Application Sidebar Navigation */}
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      {/* Main Content Area spanning remaining viewport */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          width: { xs: '100%', md: `calc(100% - ${DRAWER_WIDTH}px)` },
          maxWidth: { xs: '100%', md: `calc(100% - ${DRAWER_WIDTH}px)` },
          height: '100vh',
          maxHeight: '100vh',
          overflow: 'hidden',
          boxSizing: 'border-box',
        }}
      >
        {!hideHeader && (
          <Header
            title={title}
            onMenuClick={handleDrawerToggle}
          />
        )}

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: '100%',
            maxWidth: '100%',
            minWidth: 0,
            height: `calc(100vh - ${HEADER_HEIGHT}px)`,
            display: 'flex',
            flexDirection: 'column',
            p: hideHeader ? 0 : { xs: 1.5, sm: 2, md: 2.5 },
            boxSizing: 'border-box',
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          {children ? children : <Outlet />}
        </Box>
      </Box>
    </Box>
  );
};
