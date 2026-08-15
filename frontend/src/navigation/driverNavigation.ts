import React from 'react';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import HeadsetMicOutlinedIcon from '@mui/icons-material/HeadsetMicOutlined';
import { ROUTES } from '../routes/routes';

export const DRIVER_NAV_GROUPS = [
  {
    section: 'DRIVER OPERATIONS',
    items: [
      { label: 'Dashboard', icon: React.createElement(DashboardOutlinedIcon, { fontSize: 'small' }), path: ROUTES.DRIVER.DASHBOARD },
      { label: 'Live Demand', icon: React.createElement(MapOutlinedIcon, { fontSize: 'small' }), path: ROUTES.DRIVER.DEMAND },
      { label: 'AI Assistant', icon: React.createElement(SmartToyOutlinedIcon, { fontSize: 'small' }), path: ROUTES.DRIVER.ASSISTANT },
    ],
  },
  {
    section: 'EARNINGS & HISTORY',
    items: [
      { label: 'Earnings', icon: React.createElement(AccountBalanceWalletOutlinedIcon, { fontSize: 'small' }), path: ROUTES.DRIVER.EARNINGS },
      { label: 'Trips', icon: React.createElement(DirectionsCarOutlinedIcon, { fontSize: 'small' }), path: ROUTES.DRIVER.TRIPS },
      { label: 'Analytics', icon: React.createElement(AnalyticsOutlinedIcon, { fontSize: 'small' }), path: ROUTES.DRIVER.ANALYTICS },
    ],
  },
  {
    section: 'PREFERENCES',
    items: [
      { label: 'Profile', icon: React.createElement(PersonOutlineOutlinedIcon, { fontSize: 'small' }), path: ROUTES.DRIVER.PROFILE },
      { label: 'Settings', icon: React.createElement(SettingsOutlinedIcon, { fontSize: 'small' }), path: ROUTES.DRIVER.SETTINGS },
      { label: 'Support', icon: React.createElement(HeadsetMicOutlinedIcon, { fontSize: 'small' }), path: ROUTES.DRIVER.SUPPORT },
    ],
  },
];
