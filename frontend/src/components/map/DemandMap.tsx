import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Box, Typography, Card, CircularProgress } from '@mui/material';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { VELOUR_TOKENS } from '../../theme/palette';
import { DemandZone } from '../../types/api.types';

// MapCameraController: Handles EXPLICIT camera movements (e.g. search selection, reset location, zoom buttons)
// Separates map data updates (hour slider changes) from map viewport state.
const MapCameraController: React.FC<{
  cameraTarget?: { lat: number; lng: number; zoom: number; timestamp: number } | null;
  zoomDelta?: { action: 'in' | 'out'; timestamp: number } | null;
}> = ({ cameraTarget, zoomDelta }) => {
  const map = useMap();
  const prevTargetTs = useRef<number | null>(null);
  const prevZoomTs = useRef<number | null>(null);

  useEffect(() => {
    if (cameraTarget && cameraTarget.timestamp !== prevTargetTs.current) {
      prevTargetTs.current = cameraTarget.timestamp;
      map.flyTo([cameraTarget.lat, cameraTarget.lng], cameraTarget.zoom, {
        animate: true,
        duration: 1.2,
      });
    }
  }, [cameraTarget, map]);

  useEffect(() => {
    if (zoomDelta && zoomDelta.timestamp !== prevZoomTs.current) {
      prevZoomTs.current = zoomDelta.timestamp;
      if (zoomDelta.action === 'in') {
        map.zoomIn();
      } else {
        map.zoomOut();
      }
    }
  }, [zoomDelta, map]);

  return null;
};

// Custom Leaflet DivIcon for Driver GPS Location Pin
const driverIcon = L.divIcon({
  className: 'custom-driver-gps-pin',
  html: `<div style="
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background-color: #1A1D24;
    border: 2px solid #FFFFFF;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.6);
  ">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="12 2 19 21 12 17 5 21 12 2"></polygon>
    </svg>
  </div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

// Semantic Heatmap Gradient Helper: Low (Cyan/Blue) -> Med (Yellow) -> High (Orange) -> Surge (Red)
const getZoneHeatmapStyle = (demandScore: number, surgeMultiplier: number) => {
  if (surgeMultiplier >= 1.6 || demandScore >= 85) {
    return {
      color: '#EF4444', // Red (Peak Surge)
      label: 'Surge',
      outerOpacity: 0.22,
      midOpacity: 0.38,
      coreOpacity: 0.65,
    };
  } else if (surgeMultiplier >= 1.35 || demandScore >= 70) {
    return {
      color: '#F97316', // Orange (High Demand)
      label: 'High',
      outerOpacity: 0.18,
      midOpacity: 0.32,
      coreOpacity: 0.55,
    };
  } else if (surgeMultiplier >= 1.18 || demandScore >= 55) {
    return {
      color: '#FACC15', // Yellow (Medium Demand)
      label: 'Med',
      outerOpacity: 0.15,
      midOpacity: 0.28,
      coreOpacity: 0.48,
    };
  } else {
    return {
      color: '#00D9C0', // Cyan/Blue (Low Demand)
      label: 'Low',
      outerOpacity: 0.12,
      midOpacity: 0.22,
      coreOpacity: 0.4,
    };
  }
};

interface DemandMapProps {
  zones?: DemandZone[];
  filter?: 'Demand' | 'Drivers' | 'Events';
  driverLocation?: { lat: number; lng: number };
  cameraTarget?: { lat: number; lng: number; zoom: number; timestamp: number } | null;
  zoomDelta?: { action: 'in' | 'out'; timestamp: number } | null;
  isLoading?: boolean;
  isError?: boolean;
  isFilteredEmpty?: boolean;
}

export const DemandMap: React.FC<DemandMapProps> = ({
  zones = [],
  filter = 'Demand',
  driverLocation = { lat: 40.7549, lng: -73.9840 },
  cameraTarget = null,
  zoomDelta = null,
  isLoading = false,
  isError = false,
  isFilteredEmpty = false,
}) => {
  const activeZones = zones && zones.length > 0 ? zones : [];
  const initialCenter: [number, number] = [driverLocation.lat, driverLocation.lng];
  const isModelDisconnected = !isLoading && !isError && activeZones.length === 0 && !isFilteredEmpty;

  return (
    <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
      <MapContainer
        center={initialCenter}
        zoom={13}
        style={{ width: '100%', height: '100%', zIndex: 1, backgroundColor: '#0A0A0C' }}
        zoomControl={false}
      >
        {/* Handles camera movements on search, reset, or manual zoom controls without touching hour slider state */}
        <MapCameraController cameraTarget={cameraTarget} zoomDelta={zoomDelta} />

        {/* CARTO Dark Matter Basemap */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          maxZoom={19}
        />

        {/* DRIVER LOCATION PIN */}
        <Marker position={[driverLocation.lat, driverLocation.lng]} icon={driverIcon}>
          <Popup>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              Your Driver Location
            </Typography>
          </Popup>
        </Marker>

        {/* REAL-TIME DEMAND HEATMAP AREAS (LOW: Cyan -> MED: Yellow -> HIGH: Orange -> SURGE: Red) */}
        {filter === 'Demand' &&
          activeZones.map((zone) => {
            const style = getZoneHeatmapStyle(zone.demand_score, zone.surge_multiplier);

            return (
              <React.Fragment key={zone.id}>
                {/* Outer Heat Dispersion Layer (Soft Falloff, No Border) */}
                <Circle
                  center={[zone.lat, zone.lng]}
                  radius={2200}
                  pathOptions={{
                    stroke: false,
                    fillColor: style.color,
                    fillOpacity: style.outerOpacity,
                  }}
                />

                {/* Mid Heat Concentration Ring (No Border) */}
                <Circle
                  center={[zone.lat, zone.lng]}
                  radius={1300}
                  pathOptions={{
                    stroke: false,
                    fillColor: style.color,
                    fillOpacity: style.midOpacity,
                  }}
                />

                {/* Core Peak Intensity Area (No Border) */}
                <Circle
                  center={[zone.lat, zone.lng]}
                  radius={600}
                  pathOptions={{
                    stroke: false,
                    fillColor: style.color,
                    fillOpacity: style.coreOpacity,
                  }}
                />

                {/* Precision Center Indicator Marker */}
                <CircleMarker
                  center={[zone.lat, zone.lng]}
                  radius={6}
                  pathOptions={{
                    color: '#FFFFFF',
                    fillColor: style.color,
                    fillOpacity: 1,
                    weight: 2,
                  }}
                >
                  <Popup>
                    <Box sx={{ p: 0.5 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: VELOUR_TOKENS.bgBase }}>
                        {zone.zone_name}
                      </Typography>
                      <Typography variant="caption" display="block" sx={{ color: VELOUR_TOKENS.textSecondary }}>
                        Demand Score: {zone.demand_score} / 100
                      </Typography>
                      <Typography variant="caption" display="block" sx={{ color: VELOUR_TOKENS.textSecondary }}>
                        Surge Multiplier: {zone.surge_multiplier}x ({zone.demand_percentage})
                      </Typography>
                      <Typography variant="caption" display="block" sx={{ color: VELOUR_TOKENS.textSecondary }}>
                        Trend: {zone.trend.toUpperCase()}
                      </Typography>
                    </Box>
                  </Popup>
                </CircleMarker>
              </React.Fragment>
            );
          })}

        {/* FLEET DRIVERS LAYER */}
        {filter === 'Drivers' && (
          <Card
            sx={{
              position: 'absolute',
              top: 24,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1000,
              px: 3,
              py: 1.2,
              backgroundColor: 'rgba(18, 16, 25, 0.94)',
              backdropFilter: 'blur(16px)',
              border: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
              borderRadius: 999,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              whiteSpace: 'nowrap',
            }}
          >
            <Typography variant="body2" sx={{ color: '#FFF', fontWeight: 600, fontSize: 12.5 }}>
              Fleet Telemetry &bull; <span style={{ color: VELOUR_TOKENS.textSecondary }}>No live driver data available</span>
            </Typography>
          </Card>
        )}

        {/* HIGH-DEMAND EVENTS LAYER */}
        {filter === 'Events' && (
          <Card
            sx={{
              position: 'absolute',
              top: 24,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1000,
              px: 3,
              py: 1.2,
              backgroundColor: 'rgba(18, 16, 25, 0.94)',
              backdropFilter: 'blur(16px)',
              border: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
              borderRadius: 999,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              whiteSpace: 'nowrap',
            }}
          >
            <Typography variant="body2" sx={{ color: '#FFF', fontWeight: 600, fontSize: 12.5 }}>
              Event Stream &bull; <span style={{ color: VELOUR_TOKENS.textSecondary }}>No event data source connected</span>
            </Typography>
          </Card>
        )}
      </MapContainer>

      {/* STATUS OVERLAYS */}
      {isLoading && (
        <Card
          sx={{
            position: 'absolute',
            top: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            px: 3,
            py: 1.2,
            backgroundColor: 'rgba(18, 16, 25, 0.94)',
            backdropFilter: 'blur(16px)',
            border: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
            borderRadius: 999,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            whiteSpace: 'nowrap',
          }}
        >
          <CircularProgress size={16} sx={{ color: VELOUR_TOKENS.accentTeal }} />
          <Typography variant="body2" sx={{ color: '#FFF', fontWeight: 600, fontSize: 12.5 }}>
            Loading Live Spatial Demand Clusters...
          </Typography>
        </Card>
      )}

      {isModelDisconnected && (
        <Card
          sx={{
            position: 'absolute',
            top: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            px: 3,
            py: 1.2,
            backgroundColor: 'rgba(18, 16, 25, 0.94)',
            backdropFilter: 'blur(16px)',
            border: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
            borderRadius: 999,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            whiteSpace: 'nowrap',
          }}
        >
          <HourglassEmptyIcon sx={{ color: VELOUR_TOKENS.accentGold, fontSize: 18 }} />
          <Typography variant="body2" sx={{ color: '#FFF', fontWeight: 600, fontSize: 12.5 }}>
            Base Navigation Map Active &bull;{' '}
            <span style={{ color: VELOUR_TOKENS.accentGold }}>Demand Zone Intelligence Model Not Connected</span>
          </Typography>
        </Card>
      )}
    </Box>
  );
};

