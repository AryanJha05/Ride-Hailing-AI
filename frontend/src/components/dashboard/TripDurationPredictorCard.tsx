import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Chip,
} from '@mui/material';
import SpeedIcon from '@mui/icons-material/Speed';
import TimerIcon from '@mui/icons-material/Timer';
import NavigationIcon from '@mui/icons-material/Navigation';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MapIcon from '@mui/icons-material/Map';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { VELOUR_TOKENS } from '../../theme/palette';
import { useTripDurationMutation } from '../../hooks/useRideApi';
import { TripDurationResponse } from '../../types/api.types';
import { LocationRoutePickerModal } from '../map/LocationRoutePickerModal';
import { LocationGeocodeResult } from '../../services/geocodingService';

export const TripDurationPredictorCard: React.FC = () => {
  // Independent Location State containing coordinates + reverse-geocoded place names
  const [pickupLocation, setPickupLocation] = useState<LocationGeocodeResult>({
    lat: 40.7549,
    lng: -73.9840,
    name: 'Midtown Manhattan',
    subtitle: 'New York, NY',
  });
  const [dropoffLocation, setDropoffLocation] = useState<LocationGeocodeResult>({
    lat: 40.6413,
    lng: -73.7781,
    name: 'JFK Airport (JFK)',
    subtitle: 'Queens, NY',
  });
  const [passengerCount, setPassengerCount] = useState<number>(1);

  // Map Modal State
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  // Mutation and API Result / Error state
  const [result, setResult] = useState<TripDurationResponse | null>(null);
  const [predictionError, setPredictionError] = useState<string | null>(null);

  const tripMutation = useTripDurationMutation();

  const handleConfirmRoute = (pickup: LocationGeocodeResult, dropoff: LocationGeocodeResult) => {
    setPickupLocation(pickup);
    setDropoffLocation(dropoff);
  };

  const handlePredict = () => {
    setPredictionError(null);

    // Send exact numerical float coordinates to XGBoost V3 FastAPI model
    tripMutation.mutate(
      {
        origin_lat: pickupLocation.lat,
        origin_lng: pickupLocation.lng,
        dest_lat: dropoffLocation.lat,
        dest_lng: dropoffLocation.lng,
        passenger_count: passengerCount,
        vendor_id: 1,
        store_and_fwd_flag: 'N',
      },
      {
        onSuccess: (data) => {
          setResult(data);
          setPredictionError(null);
        },
        onError: (err: any) => {
          setResult(null);
          setPredictionError(err?.response?.data?.detail || err?.message || 'Failed to connect to XGBoost V3 prediction service.');
        },
      }
    );
  };

  return (
    <Card
      sx={{
        backgroundColor: VELOUR_TOKENS.bgSurface1,
        borderColor: VELOUR_TOKENS.borderSubtle,
        borderRadius: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardContent sx={{ p: 2.5, display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Card Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TimerIcon sx={{ color: VELOUR_TOKENS.accentTeal, fontSize: 20 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: 14, color: '#FFF' }}>
              TRIP DURATION PREDICTOR
            </Typography>
          </Box>
          <Chip
            label="XGBoost V3"
            size="small"
            sx={{
              backgroundColor: 'rgba(0, 217, 192, 0.12)',
              color: VELOUR_TOKENS.accentTeal,
              fontWeight: 700,
              fontSize: 10,
              height: 20,
            }}
          />
        </Box>

        <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 12, mb: 2 }}>
          Dynamic route selection with live reverse-geocoding powered by 44 spatial XGBoost ML features.
        </Typography>

        {/* Pickup Location Card */}
        <Box
          sx={{
            p: 1.8,
            borderRadius: 2,
            backgroundColor: VELOUR_TOKENS.bgSurface2,
            border: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
            mb: 1.5,
          }}
        >
          <Typography variant="caption" sx={{ color: VELOUR_TOKENS.accentTeal, fontWeight: 700, letterSpacing: '0.05em', display: 'block', mb: 0.8 }}>
            PICKUP LOCATION
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.2 }}>
            <LocationOnIcon sx={{ color: VELOUR_TOKENS.accentTeal, fontSize: 20, mt: 0.2 }} />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#FFF', fontSize: 13 }}>
                📍 {pickupLocation.name}
              </Typography>
              <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 11, display: 'block' }}>
                {pickupLocation.subtitle}
              </Typography>
              <Typography className="mono-num" variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 10.5, opacity: 0.7 }}>
                {pickupLocation.lat.toFixed(5)}, {pickupLocation.lng.toFixed(5)}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Drop-off Location Card */}
        <Box
          sx={{
            p: 1.8,
            borderRadius: 2,
            backgroundColor: VELOUR_TOKENS.bgSurface2,
            border: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
            mb: 1.8,
          }}
        >
          <Typography variant="caption" sx={{ color: VELOUR_TOKENS.accentLavender, fontWeight: 700, letterSpacing: '0.05em', display: 'block', mb: 0.8 }}>
            DROP-OFF LOCATION
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.2 }}>
            <LocationOnIcon sx={{ color: VELOUR_TOKENS.accentLavender, fontSize: 20, mt: 0.2 }} />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#FFF', fontSize: 13 }}>
                📍 {dropoffLocation.name}
              </Typography>
              <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 11, display: 'block' }}>
                {dropoffLocation.subtitle}
              </Typography>
              <Typography className="mono-num" variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 10.5, opacity: 0.7 }}>
                {dropoffLocation.lat.toFixed(5)}, {dropoffLocation.lng.toFixed(5)}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Single Unified Route Selection Trigger Button */}
        <Button
          fullWidth
          variant="outlined"
          onClick={() => setModalOpen(true)}
          startIcon={<MapIcon />}
          sx={{
            borderColor: 'rgba(0, 217, 192, 0.4)',
            color: VELOUR_TOKENS.accentTeal,
            fontWeight: 700,
            fontSize: 12.5,
            py: 1,
            borderRadius: 2,
            mb: 2,
            backgroundColor: 'rgba(0, 217, 192, 0.06)',
            textTransform: 'none',
            '&:hover': {
              borderColor: VELOUR_TOKENS.accentTeal,
              backgroundColor: 'rgba(0, 217, 192, 0.14)',
            },
          }}
        >
          Select Route on Map
        </Button>

        {/* Passenger Count Selection */}
        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel id="passenger-select-label" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 12 }}>
            Passenger Count
          </InputLabel>
          <Select
            labelId="passenger-select-label"
            value={passengerCount}
            label="Passenger Count"
            onChange={(e) => setPassengerCount(Number(e.target.value))}
            sx={{
              color: '#FFF',
              backgroundColor: VELOUR_TOKENS.bgSurface2,
              borderRadius: 2,
              fontSize: 12.5,
              '& .MuiSelect-icon': { color: VELOUR_TOKENS.textSecondary },
            }}
          >
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <MenuItem key={num} value={num} sx={{ fontSize: 12.5 }}>
                {num} {num === 1 ? 'Passenger' : 'Passengers'}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Predict Trip Duration Action Button */}
        <Button
          fullWidth
          variant="contained"
          onClick={handlePredict}
          disabled={tripMutation.isPending}
          startIcon={tripMutation.isPending ? <CircularProgress size={16} color="inherit" /> : <SpeedIcon />}
          sx={{
            backgroundColor: VELOUR_TOKENS.accentPrimary,
            color: '#FFF',
            fontWeight: 700,
            fontSize: 13,
            py: 1.1,
            borderRadius: 2,
            mb: 2,
            '&:hover': { backgroundColor: VELOUR_TOKENS.accentPrimary },
          }}
        >
          {tripMutation.isPending ? 'Calculating XGBoost ETA...' : 'Predict Trip Duration'}
        </Button>

        {/* Prediction Results Display or Failure Error State */}
        {tripMutation.isError || predictionError ? (
          <Box
            sx={{
              p: 2,
              borderRadius: 2.5,
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: `1px solid rgba(239, 68, 68, 0.4)`,
              mt: 'auto',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <ErrorOutlineIcon sx={{ color: '#EF4444', fontSize: 20 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#EF4444', fontSize: 13 }}>
                Prediction unavailable
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 11.5 }}>
              {predictionError || 'Unable to communicate with the FastAPI XGBoost V3 model service.'}
            </Typography>
          </Box>
        ) : result ? (
          <Box
            sx={{
              p: 2,
              borderRadius: 2.5,
              backgroundColor: VELOUR_TOKENS.bgSurface2,
              border: `1px solid ${VELOUR_TOKENS.accentTeal}`,
              mt: 'auto',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 700 }}>
                ESTIMATED TRAVEL TIME
              </Typography>
              <Typography variant="caption" sx={{ color: VELOUR_TOKENS.accentTeal, fontWeight: 700 }}>
                ● Online (XGBoost V3)
              </Typography>
            </Box>

            <Typography className="mono-num" variant="h4" sx={{ fontWeight: 800, color: '#FFF', mb: 0.5 }}>
              {result.duration_min} <span style={{ fontSize: 16, fontWeight: 500, color: VELOUR_TOKENS.textSecondary }}>min</span>
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
              <Chip
                label={`Formatted: ${result.formatted_duration}`}
                size="small"
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  color: '#FFF',
                  fontSize: 11,
                  fontWeight: 600,
                }}
              />
              <Chip
                icon={<NavigationIcon sx={{ fontSize: '12px !important', color: `${VELOUR_TOKENS.accentGold} !important` }} />}
                label={`${result.distance_km} km (${result.distance_miles} mi)`}
                size="small"
                sx={{
                  backgroundColor: 'rgba(234, 179, 8, 0.1)',
                  color: VELOUR_TOKENS.accentGold,
                  fontSize: 11,
                  fontWeight: 600,
                }}
              />
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              p: 2,
              borderRadius: 2.5,
              backgroundColor: VELOUR_TOKENS.bgSurface2,
              border: `1px dashed ${VELOUR_TOKENS.borderSubtle}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justify: 'center',
              textAlign: 'center',
              mt: 'auto',
              minHeight: 90,
            }}
          >
            <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, mb: 0.5 }}>
              TRIP DURATION PREDICTOR
            </Typography>
            <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 12 }}>
              Click "Select Route on Map" to pick pickup and drop-off points for real XGBoost V3 ETA predictions.
            </Typography>
          </Box>
        )}
      </CardContent>

      {/* Unified Interactive Route Map Picker Modal */}
      <LocationRoutePickerModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialPickup={pickupLocation}
        initialDropoff={dropoffLocation}
        onConfirm={handleConfirmRoute}
      />
    </Card>
  );
};
