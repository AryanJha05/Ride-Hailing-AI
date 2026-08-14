export const ROUTES = {
  ROOT: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  LIVE_MAP: '/live-map',
  AI_ASSISTANT: '/ai-assistant',
  ANALYTICS: '/analytics',
  PROFILE: '/profile',
  TRIPS: '/trips',
  SETTINGS: '/settings',
  SUPPORT: '/support',
  ADMIN: '/admin',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];
