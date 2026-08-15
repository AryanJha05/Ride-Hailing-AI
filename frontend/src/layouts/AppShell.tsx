import React from 'react';
import { MainLayout, MainLayoutProps } from './MainLayout';

/**
 * AppShell export alias for MainLayout component, ensuring architectural compatibility.
 */
export const AppShell: React.FC<MainLayoutProps> = (props) => {
  return <MainLayout {...props} />;
};

export default AppShell;
