import React from 'react';
import { Box } from '@mui/material';

interface PageShellProps {
  children: React.ReactNode;
  title?: string;
  hideHeader?: boolean;
}

/**
 * Lightweight PageShell wrapper.
 * The shared MainLayout provides the outer App Shell (Header & Sidebar).
 */
export const PageShell: React.FC<PageShellProps> = ({ children }) => {
  return <Box sx={{ width: '100%', height: '100%' }}>{children}</Box>;
};
