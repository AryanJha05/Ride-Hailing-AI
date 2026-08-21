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
  Grid,
  Divider,
} from '@mui/material';
import SpeedIcon from '@mui/icons-material/Speed';
import TimerIcon from '@mui/icons-material/Timer';
import NavigationIcon from '@mui/icons-material/Navigation';
import { VELOUR_TOKENS } from '../../theme/palette';
import { useTripDurationMutation } from '../../hooks/useRideApi';
import { TripDurationResponse } from '../../types/api.types';

const PRESET_ROUTES = [
  {
    label: 'Midtown Manhattan ➔ JFK Airport',
    origin_lat: 40.7549,
    origin_lng: -73.9840,
    dest_lat: 40.6413,
    dest_lng: -73.7781,
  },
  {
    label: 'Upper East Side ➔ Grand Central',
    origin_lat: 40.767937,
    origin_lng: -73.982155,
    dest_lat: 40.765602,
    dest_lng: -73.964630,
  },
  {
    label: 'Financial District ➔ Williamsburg',
    origin_lat: 40.7075,
    origin_lng: -74.0089,
    dest_lat: 40.7081,
    dest_lng: -73.9571,
  },
  {
    label: 'LaGuardia Airport (LGA) ➔ Times Square',
    origin_lat: 40.7769,
    origin_lng: -73.8740,
    dest_lat: 40.7580,
    dest_lng: -73.9855,
  },
];

export const TripDurationPredictorCard: React.FC = () => {
  const [selectedRouteIdx, setSelectedRouteIdx] = useState<number>(1);
  const [result, setResult] = useState<TripDurationResponse | null>(null);

  const tripMutation = useTripDurationMutation();

  const handlePredict = () => {
    const route = PRESET_ROUTES[selectedRouteIdx];
    tripMutation.mutate(
      {
        origin_lat: route.origin_lat,
        origin_lng: route.origin_lng,
        dest_lat: route.dest_lat,
        dest_lng: route.dest_lng,
        passenger_count: 1,
        vendor_id: 1,
        store_and_fwd_flag: 'N',
      },
      {
        onSuccess: (data) => {
          setResult(data);
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
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
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
          Real-time ETA inference powered by 44 spatial-temporal XGBoost ML features.
        </Typography>

        {/* Route Selector */}
        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel id="route-select-label" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 12 }}>
            Select Sample Route
          </InputLabel>
          <Select
            labelId="route-select-label"
            value={selectedRouteIdx}
            label="Select Sample Route"
            onChange={(e) => setSelectedRouteIdx(Number(e.target.value))}
            sx={{
              color: '#FFF',
              backgroundColor: VELOUR_TOKENS.bgSurface2,
              borderRadius: 2,
              fontSize: 12.5,
              '& .MuiSelect-icon': { color: VELOUR_TOKENS.textSecondary },
            }}
          >
            {PRESET_ROUTES.map((route, idx) => (
              <MenuItem key={idx} value={idx} sx={{ fontSize: 12.5 }}>
                {route.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

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
            py: 1,
            borderRadius: 2,
            mb: 2.5,
            '&:hover': { backgroundColor: VELOUR_TOKENS.accentPrimary },
          }}
        >
          {tripMutation.isPending ? 'Calculating XGBoost ETA...' : 'Predict Trip Duration'}
        </Button>

        {/* Prediction Results Display */}
        {result ? (
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
                ● Online
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
              minHeight: 110,
            }}
          >
            <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, mb: 0.5 }}>
              TRIP DURATION
            </Typography>
            <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 12 }}>
              Select a route above to generate XGBoost V3 duration prediction.
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
