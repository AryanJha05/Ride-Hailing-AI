import React from 'react';
import { MainLayout, MainLayoutProps } from '../../layouts/MainLayout';

/**
 * Reusable AppShell component exported under components/layout/AppShell.tsx.
 */
export const AppShell: React.FC<MainLayoutProps> = (props) => {
  return <MainLayout {...props} />;
};

export default AppShell;
