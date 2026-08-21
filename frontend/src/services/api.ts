/// <reference types="vite/client" />
import axios from 'axios';
import {
  DriverAdviceRequest,
  DriverAdviceResponse,
  ForecastResponse,
  DemandZone,
  DriverPerformanceResponse,
  SystemHealthResponse,
  LoginCredentials,
  LoginResponse,
  AuthUser,
  DriverRecord,
  CreateDriverPayload,
  UpdateDriverPayload,
  TripDurationRequest,
  TripDurationResponse,
} from '../types/api.types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach Bearer JWT token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('ride_ai_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Interceptor to handle 401 Unauthorized globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear invalid/expired token
      localStorage.removeItem('ride_ai_token');
      localStorage.removeItem('ride_ai_role');
    }
    return Promise.reject(error);
  }
);

export const rideApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const res = await apiClient.post('/auth/login', credentials);
    return res.data;
  },

  getMe: async (): Promise<AuthUser> => {
    const res = await apiClient.get('/auth/me');
    return res.data;
  },

  getHealth: async (): Promise<SystemHealthResponse> => {
    const res = await apiClient.get('/health');
    return res.data;
  },

  getDriverAdvice: async (req: DriverAdviceRequest): Promise<DriverAdviceResponse> => {
    const res = await apiClient.post('/driver-advice', req);
    return res.data;
  },

  getForecast: async (zone = 'Midtown Manhattan', hours = 24): Promise<ForecastResponse> => {
    const res = await apiClient.get('/forecast', {
      params: { zone, horizon_hours: hours },
    });
    return res.data;
  },

  getDemandZones: async (): Promise<DemandZone[]> => {
    const res = await apiClient.get('/demand-zones');
    return res.data;
  },

  getDriverPerformance: async (driverId = 'driver-001'): Promise<DriverPerformanceResponse> => {
    const res = await apiClient.get('/driver-performance', {
      params: { driver_id: driverId },
    });
    return res.data;
  },

  getAdminDrivers: async (): Promise<DriverRecord[]> => {
    const res = await apiClient.get('/admin/drivers');
    return res.data;
  },

  createAdminDriver: async (payload: CreateDriverPayload): Promise<DriverRecord> => {
    const res = await apiClient.post('/admin/drivers', payload);
    return res.data;
  },

  getAdminDriver: async (driverId: string): Promise<DriverRecord> => {
    const res = await apiClient.get(`/admin/drivers/${driverId}`);
    return res.data;
  },

  updateAdminDriver: async (driverId: string, payload: UpdateDriverPayload): Promise<DriverRecord> => {
    const res = await apiClient.patch(`/admin/drivers/${driverId}`, payload);
    return res.data;
  },

  predictTripDuration: async (payload: TripDurationRequest): Promise<TripDurationResponse> => {
    const res = await apiClient.post('/driver/trip-duration', payload);
    return res.data;
  },
};

