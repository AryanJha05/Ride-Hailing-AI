export const ROUTES = {
  ROOT: '/',
  LOGIN: '/login',

  // Driver Routes
  DASHBOARD: '/dashboard',
  LIVE_MAP: '/live-map',
  AI_ASSISTANT: '/ai-assistant',
  ANALYTICS: '/analytics',
  PROFILE: '/profile',
  TRIPS: '/trips',

  // Shared / Common Routes
  SETTINGS: '/settings',
  SUPPORT: '/support',

  // Admin Routes
  ADMIN: '/admin',
  FLEET: '/admin/fleet',
  MODELS: '/admin/models',
  ALERTS: '/admin/alerts',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];
