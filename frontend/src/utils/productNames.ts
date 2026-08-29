/**
 * Production Product-Facing Display Names & Utility Mappings for Ride AI Platform.
 * Centralized mapping for all user-facing model and intelligence service names.
 */

export const GLOBAL_MODEL_DISPLAY_NAMES = {
  trip_duration: 'Trip Duration Intelligence',
  demand_clustering: 'Demand Intelligence',
  demand_forecasting: 'Demand Forecasting Engine',
  surge: 'Surge Intelligence',
  route: 'Route Intelligence',
  copilot: 'AI Driver Copilot',
} as const;

export const MODEL_DISPLAY_NAMES = GLOBAL_MODEL_DISPLAY_NAMES;

export const SYSTEM_STATUS_DISPLAY = {
  OPERATIONAL: 'Operational',
  ACTIVE: 'Live & Active',
  CONNECTED: 'Connected',
  UNAVAILABLE: 'Service Offline',
} as const;

/**
 * Maps technical or legacy model strings to professional product display names for Driver UI.
 */
export function formatModelDisplayName(rawName?: string): string {
  if (!rawName) return GLOBAL_MODEL_DISPLAY_NAMES.trip_duration;

  const lower = rawName.toLowerCase();
  if (lower.includes('student a') || lower.includes('xgboost') || lower.includes('duration')) {
    return GLOBAL_MODEL_DISPLAY_NAMES.trip_duration;
  }
  if (lower.includes('student b') || lower.includes('hdbscan') || lower.includes('clustering') || lower.includes('zone')) {
    return GLOBAL_MODEL_DISPLAY_NAMES.demand_clustering;
  }
  if (lower.includes('student c') || lower.includes('lstm') || lower.includes('forecast')) {
    return GLOBAL_MODEL_DISPLAY_NAMES.demand_forecasting;
  }
  if (lower.includes('surge')) {
    return GLOBAL_MODEL_DISPLAY_NAMES.surge;
  }
  if (lower.includes('route')) {
    return GLOBAL_MODEL_DISPLAY_NAMES.route;
  }
  if (lower.includes('ollama') || lower.includes('copilot') || lower.includes('llm')) {
    return GLOBAL_MODEL_DISPLAY_NAMES.copilot;
  }
  return rawName;
}
