import React from 'react';
import { Sidebar, DRAWER_WIDTH } from '../../layouts/Sidebar';

export { DRAWER_WIDTH };

interface SidebarDrawerProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export const SidebarDrawer: React.FC<SidebarDrawerProps> = (props) => {
  return <Sidebar {...props} />;
};
