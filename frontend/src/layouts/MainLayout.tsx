import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import { Sidebar, DRAWER_WIDTH } from './Sidebar';
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
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: VELOUR_TOKENS.bgBase }}>
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
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
        }}
      >
        {!hideHeader && (
          <Header
            title={title}
            onMenuClick={handleDrawerToggle}
          />
        )}

        <Box component="main" sx={{ flexGrow: 1, p: hideHeader ? 0 : { xs: 2, sm: 3 }, overflowX: 'hidden' }}>
          {children ? children : <Outlet />}
        </Box>
      </Box>
    </Box>
  );
};
