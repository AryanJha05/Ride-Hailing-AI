export interface Location {
  lat: number;
  lng: number;
}

export interface DriverProfile {
  id: string;
  driver_id?: string;
  phone?: string;
  license_number?: string;
  status: string;
  rating: number;
  total_trips: number;
  total_earnings: number;
  vehicle_make?: string;
  vehicle_model?: string;
  vehicle_plate?: string;
  created_at?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'DRIVER' | 'ADMIN';
  driver_profile?: DriverProfile | null;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: AuthUser;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface DataChip {
  label: string;
  value: string;
}

export interface DriverAdviceRequest {
  driver_id?: string;
  location?: Location;
  demand_level?: string;
  expected_rides?: string;
  weather?: string;
  time_of_day?: string;
  query?: string;
}

export interface DriverAdviceResponse {
  recommendation: string;
  reason: string;
  suggested_area: string;
  confidence: number;
  reasoning_chips: DataChip[];
  estimated_travel_time?: string;
  surge_multiplier?: number;
}

export interface ForecastPoint {
  hour: string;
  timestamp?: string;
  predicted_demand: number;
  actual_demand?: number | null;
}

export interface ForecastResponse {
  zone_name: string;
  horizon_hours: number;
  data: ForecastPoint[];
}

export interface DemandZone {
  id: string;
  zone_name: string;
  lat: number;
  lng: number;
  demand_score: number;
  trend: 'up' | 'down' | 'flat';
  surge_multiplier: number;
  demand_percentage: string;
  demand_forecast_delta?: string;
  historical_avg?: string;
  distance_miles?: string;
  recommended?: boolean;
}

export interface PerformanceHistoryPoint {
  day: string;
  trips: number;
  earnings: number;
}

export interface RecentTrip {
  id: string;
  date: string;
  zone: string;
  duration: string;
  fare: string;
  rating: number;
}

export interface DriverPerformanceResponse {
  driver_id: string;
  name: string;
  email?: string;
  rating: number;
  total_trips: number;
  total_earnings: number;
  acceptance_rate: number;
  cancellation_rate: number;
  projected_shift_earnings: number;
  ai_bonus: number;
  est_next_hour_trips: string;
  performance_history: PerformanceHistoryPoint[];
  recent_trips: RecentTrip[];
}

export interface SystemHealthResponse {
  status: string;
  timestamp: string;
  active_drivers: number;
  active_rides: number;
  system_uptime: string;
  avg_model_latency_ms: number;
  services: Record<string, string>;
}

export interface DriverRecord {
  id: string;
  user_id?: string | null;
  driver_id: string;
  name: string;
  email: string;
  phone: string;
  license_number: string;
  vehicle_make?: string;
  vehicle_model?: string;
  vehicle_plate?: string;
  status: 'Active' | 'Offline' | 'Inactive' | string;
  rating: number;
  total_trips: number;
  total_earnings: number;
  created_at?: string;
  temp_password?: string;
}

export interface CreateDriverPayload {
  name: string;
  email: string;
  phone?: string;
  driver_id?: string;
  license_number?: string;
  vehicle_make?: string;
  vehicle_model?: string;
  vehicle_plate?: string;
  status?: string;
  password?: string;
}

export interface UpdateDriverPayload {
  phone?: string;
  license_number?: string;
  vehicle_make?: string;
  vehicle_model?: string;
  vehicle_plate?: string;
  status?: string;
  is_active?: boolean;
}

export interface TripDurationRequest {
  origin_lat: number;
  origin_lng: number;
  dest_lat: number;
  dest_lng: number;
  pickup_datetime?: string;
  passenger_count?: number;
  vendor_id?: number;
  store_and_fwd_flag?: string;
  temp?: number;
  windspeed?: number;
  humidity?: number;
  precip?: number;
  pressure?: number;
  dailyprecip?: number;
  dailysnow?: number;
  fog?: number;
  conditions?: string;
}

export interface TripDurationResponse {
  duration_min: number;
  formatted_duration: string;
  predicted_seconds: number;
  distance_km: number;
  distance_miles: number;
  model: string;
  status: string;
}

