import { useQuery, useMutation } from '@tanstack/react-query';
import { rideApi } from '../services/api';
import { DriverAdviceRequest } from '../types/api.types';

export const useSystemHealth = () => {
  return useQuery({
    queryKey: ['systemHealth'],
    queryFn: rideApi.getHealth,
    refetchInterval: 15000,
  });
};

export const useDemandZones = () => {
  return useQuery({
    queryKey: ['demandZones'],
    queryFn: rideApi.getDemandZones,
    refetchInterval: 10000,
  });
};

export const useForecast = (zone = 'Financial District', hours = 24) => {
  return useQuery({
    queryKey: ['forecast', zone, hours],
    queryFn: () => rideApi.getForecast(zone, hours),
  });
};

export const useDriverPerformance = (driverId = 'driver-001') => {
  return useQuery({
    queryKey: ['driverPerformance', driverId],
    queryFn: () => rideApi.getDriverPerformance(driverId),
  });
};

export const useDriverAdviceMutation = () => {
  return useMutation({
    mutationFn: (req: DriverAdviceRequest) => rideApi.getDriverAdvice(req),
  });
};
