import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Box, Typography, Card, CircularProgress } from '@mui/material';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { VELOUR_TOKENS } from '../../theme/palette';
import { DemandZone } from '../../types/api.types';

// MapRecenter Helper Component
const MapRecenter: React.FC<{ center: [number, number]; zoom?: number }> = ({ center, zoom = 13 }) => {
  const map = useMap();
  React.useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
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

interface DemandMapProps {
  zones?: DemandZone[];
  filter?: 'Demand' | 'Drivers' | 'Events';
  driverLocation?: { lat: number; lng: number };
  isLoading?: boolean;
  isError?: boolean;
  isFilteredEmpty?: boolean;
}

export const DemandMap: React.FC<DemandMapProps> = ({
  zones = [],
  filter = 'Demand',
  driverLocation = { lat: 40.7549, lng: -73.9840 },
  isLoading = false,
  isError = false,
  isFilteredEmpty = false,
}) => {
  const activeZones = zones && zones.length > 0 ? zones : [];
  const center: [number, number] = [driverLocation.lat, driverLocation.lng];
  const isModelDisconnected = !isLoading && !isError && activeZones.length === 0 && !isFilteredEmpty;

  return (
    <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
      <MapContainer
        center={center}
        zoom={13}
        style={{ width: '100%', height: '100%', zIndex: 1, backgroundColor: '#0A0A0C' }}
        zoomControl={false}
      >
        <MapRecenter center={center} />

        {/* CARTO Dark Matter Basemap */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          maxZoom={19}
        />

        {/* DRIVER LOCATION PIN */}
        <Marker position={center} icon={driverIcon}>
          <Popup>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              Your Driver Location
            </Typography>
          </Popup>
        </Marker>

        {/* STUDENT B REAL-TIME DEMAND CLUSTERS */}
        {filter === 'Demand' &&
          activeZones.map((zone) => {
            const isHighSurge = zone.surge_multiplier >= 1.5;
            const radiusMeters = isHighSurge ? 1600 : 1200;
            const color = isHighSurge ? VELOUR_TOKENS.accentGold : VELOUR_TOKENS.accentTeal;

            return (
              <React.Fragment key={zone.id}>
                <Circle
                  center={[zone.lat, zone.lng]}
                  radius={radiusMeters}
                  pathOptions={{
                    color,
                    fillColor: color,
                    fillOpacity: isHighSurge ? 0.35 : 0.2,
                    weight: 2,
                  }}
                />
                <CircleMarker
                  center={[zone.lat, zone.lng]}
                  radius={8}
                  pathOptions={{
                    color: '#FFFFFF',
                    fillColor: color,
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
            <span style={{ color: VELOUR_TOKENS.accentGold }}>Demand Zone Model (Student B) Not Connected</span>
          </Typography>
        </Card>
      )}
    </Box>
  );
};
