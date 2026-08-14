import React, { useState } from 'react';
import { Box } from '@mui/material';
import { SidebarDrawer, DRAWER_WIDTH } from './SidebarDrawer';
import { TopAppBar } from './TopAppBar';
import { VELOUR_TOKENS } from '../../theme/palette';

interface PageShellProps {
  children: React.ReactNode;
  title?: string;
  hideHeader?: boolean;
}

export const PageShell: React.FC<PageShellProps> = ({ children, title = 'Operations View', hideHeader = false }) => {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: VELOUR_TOKENS.bgBase }}>
      {/* Shared Application Sidebar Navigation */}
      <SidebarDrawer
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
          <TopAppBar
            title={title}
            onMenuClick={handleDrawerToggle}
          />
        )}

        <Box component="main" sx={{ flexGrow: 1, p: hideHeader ? 0 : { xs: 2, sm: 3 }, overflowX: 'hidden' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};
