/// <reference types="vite/client" />
import axios from 'axios';
import {
  DriverAdviceRequest,
  DriverAdviceResponse,
  ForecastResponse,
  DemandZone,
  DriverPerformanceResponse,
  SystemHealthResponse,
} from '../types/api.types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const rideApi = {
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
};
