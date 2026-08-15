import React from 'react';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import DnsOutlinedIcon from '@mui/icons-material/DnsOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { ROUTES } from '../routes/routes';

export interface NavItem {
  label: string;
  iconName: string;
  path: string;
}

export interface NavGroup {
  section: string;
  items: NavItem[];
}

export const ADMIN_NAV_GROUPS = [
  {
    section: 'FLEET OPERATIONS',
    items: [
      { label: 'Overview', icon: React.createElement(DashboardOutlinedIcon, { fontSize: 'small' }), path: ROUTES.ADMIN.DASHBOARD },
      { label: 'Fleet', icon: React.createElement(DirectionsCarOutlinedIcon, { fontSize: 'small' }), path: ROUTES.ADMIN.FLEET },
      { label: 'Drivers', icon: React.createElement(PeopleOutlineIcon, { fontSize: 'small' }), path: ROUTES.ADMIN.DRIVERS },
      { label: 'Live Demand', icon: React.createElement(MapOutlinedIcon, { fontSize: 'small' }), path: ROUTES.ADMIN.DEMAND },
    ],
  },
  {
    section: 'AI & ANALYTICS',
    items: [
      { label: 'Demand Forecast', icon: React.createElement(AnalyticsOutlinedIcon, { fontSize: 'small' }), path: ROUTES.ADMIN.FORECAST },
      { label: 'Model Health', icon: React.createElement(DnsOutlinedIcon, { fontSize: 'small' }), path: ROUTES.ADMIN.MODELS },
      { label: 'AI Recommendations', icon: React.createElement(AutoAwesomeOutlinedIcon, { fontSize: 'small' }), path: ROUTES.ADMIN.RECOMMENDATIONS },
    ],
  },
  {
    section: 'MONITORING',
    items: [
      { label: 'Alerts', icon: React.createElement(NotificationsActiveOutlinedIcon, { fontSize: 'small' }), path: ROUTES.ADMIN.ALERTS },
      { label: 'System Status', icon: React.createElement(SecurityOutlinedIcon, { fontSize: 'small' }), path: ROUTES.ADMIN.SYSTEM },
    ],
  },
  {
    section: 'ADMINISTRATION',
    items: [
      { label: 'Users & Roles', icon: React.createElement(ManageAccountsOutlinedIcon, { fontSize: 'small' }), path: ROUTES.ADMIN.USERS },
      { label: 'Settings', icon: React.createElement(SettingsOutlinedIcon, { fontSize: 'small' }), path: ROUTES.ADMIN.SETTINGS },
    ],
  },
];
