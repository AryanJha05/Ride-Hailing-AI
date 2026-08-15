export const ROUTES = {
  ROOT: '/',
  LOGIN: '/login',

  // Driver Routes (/user/*)
  USER: {
    DASHBOARD: '/user/dashboard',
    LIVE_MAP: '/user/live-map',
    AI_ASSISTANT: '/user/ai-assistant',
    ANALYTICS: '/user/analytics',
    PROFILE: '/user/profile',
    TRIPS: '/user/trips',
    SETTINGS: '/user/settings',
    SUPPORT: '/user/support',
  },

  // Admin Routes (/admin/*)
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    FLEET: '/admin/fleet',
    DEMAND: '/admin/demand',
    FORECASTING: '/admin/forecasting',
    MODELS: '/admin/models',
    ALERTS: '/admin/alerts',
    SETTINGS: '/admin/settings',
    SUPPORT: '/admin/support',
  },
} as const;

export type RouteKey = keyof typeof ROUTES;
