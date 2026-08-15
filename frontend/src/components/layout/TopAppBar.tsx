import React from 'react';
import { Header } from '../../layouts/Header';

interface TopAppBarProps {
  title?: string;
  onMenuClick?: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = (props) => {
  return <Header {...props} />;
};
