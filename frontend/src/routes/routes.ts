export const ROUTES = {
  ROOT: '/',
  LOGIN: '/login',

  // Driver Routes (/driver/*)
  DRIVER: {
    DASHBOARD: '/driver/dashboard',
    DEMAND: '/driver/demand',
    ASSISTANT: '/driver/assistant',
    EARNINGS: '/driver/earnings',
    TRIPS: '/driver/trips',
    ANALYTICS: '/driver/analytics',
    PROFILE: '/driver/profile',
    SETTINGS: '/driver/settings',
    SUPPORT: '/driver/support',
  },

  // Legacy Driver Aliases (/user/*) for backwards compatibility
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
    DRIVERS: '/admin/drivers',
    DEMAND: '/admin/demand',
    FORECAST: '/admin/forecast',
    MODELS: '/admin/models',
    RECOMMENDATIONS: '/admin/recommendations',
    ALERTS: '/admin/alerts',
    SYSTEM: '/admin/system',
    USERS: '/admin/users',
    SETTINGS: '/admin/settings',
    // Legacy mapping
    FORECASTING: '/admin/forecast',
    SUPPORT: '/admin/system',
  },
} as const;

export type RouteKey = keyof typeof ROUTES;
