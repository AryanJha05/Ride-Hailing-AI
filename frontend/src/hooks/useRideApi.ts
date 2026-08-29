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

export const useDemandZones = (hour?: number) => {
  return useQuery({
    queryKey: ['demandZones', hour],
    queryFn: () => rideApi.getDemandZones(hour),
    refetchInterval: 10000,
  });
};

export const useForecast = (zone = 'Midtown Manhattan', hours = 24) => {
  return useQuery({
    queryKey: ['forecast', zone, hours],
    queryFn: () => rideApi.getForecast(zone, hours),
  });
};

export const useDriverPerformance = (driverId?: string) => {
  return useQuery({
    queryKey: ['driverPerformance', driverId || 'me'],
    queryFn: () => rideApi.getDriverPerformance(driverId),
  });
};

export const useDriverAdviceMutation = () => {
  return useMutation({
    mutationFn: (req: DriverAdviceRequest) => rideApi.getDriverAdvice(req),
  });
};

export const useAdminDrivers = () => {
  return useQuery({
    queryKey: ['adminDrivers'],
    queryFn: rideApi.getAdminDrivers,
    refetchInterval: 15000,
  });
};

export const useCreateDriverMutation = () => {
  return useMutation({
    mutationFn: rideApi.createAdminDriver,
  });
};

export const useUpdateDriverMutation = () => {
  return useMutation({
    mutationFn: ({ driverId, payload }: { driverId: string; payload: any }) =>
      rideApi.updateAdminDriver(driverId, payload),
  });
};

export const useTripDurationMutation = () => {
  return useMutation({
    mutationFn: rideApi.predictTripDuration,
  });
};

