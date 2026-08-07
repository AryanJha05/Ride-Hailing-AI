import React from 'react';
import { Box } from '@mui/material';
import { SidebarDrawer } from './SidebarDrawer';
import { TopAppBar } from './TopAppBar';
import { VELOUR_TOKENS } from '../../theme/palette';

interface PageShellProps {
  children: React.ReactNode;
  title?: string;
  hideHeader?: boolean;
}

export const PageShell: React.FC<PageShellProps> = ({ children, title = 'Operations View', hideHeader = false }) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: VELOUR_TOKENS.bgBase }}>
      <SidebarDrawer />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
        {!hideHeader && <TopAppBar title={title} />}
        <Box component="main" sx={{ flexGrow: 1, p: hideHeader ? 0 : 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};
