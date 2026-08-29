import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Box, Typography, Card } from '@mui/material';
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
}

export const DemandMap: React.FC<DemandMapProps> = ({
  zones = [],
  filter = 'Demand',
  driverLocation = { lat: 40.7549, lng: -73.9840 },
}) => {
  const activeZones = zones && zones.length > 0 ? zones : [];
  const center: [number, number] = [driverLocation.lat, driverLocation.lng];
  const hasZones = activeZones.length > 0;

  return (
    <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
      <MapContainer
        center={center}
        zoom={13}
        style={{ width: '100%', height: '100%', backgroundColor: '#060709' }}
        zoomControl={false}
      >
        <MapRecenter center={center} />
        {/* CartoDB Dark Base Layer */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          maxZoom={19}
        />

        {/* Primary Driver GPS Location Marker */}
        <Marker position={center} icon={driverIcon}>
          <Popup>
            <div style={{ color: '#111', fontFamily: 'sans-serif', padding: 2 }}>
              <strong style={{ fontSize: 13 }}>Driver GPS Unit</strong>
              <br />
              <span style={{ fontSize: 11, color: '#555' }}>Current Vehicle Position (Base Map)</span>
            </div>
          </Popup>
        </Marker>

        {/* REAL DEMAND ZONE LAYER (When filter is Demand) */}
        {filter === 'Demand' && hasZones &&
          activeZones.map((zone) => {
            const isHighSurge = zone.surge_multiplier >= 1.4;
            const color = isHighSurge ? VELOUR_TOKENS.accentTeal : VELOUR_TOKENS.accentLavender;
            const outerRadius = (zone.surge_multiplier || 1.0) * 750;
            const innerRadius = (zone.surge_multiplier || 1.0) * 350;

            return (
              <React.Fragment key={zone.id}>
                {/* Heatmap Outer Aura Circle */}
                <Circle
                  center={[zone.lat, zone.lng]}
                  radius={outerRadius}
                  pathOptions={{
                    color: color,
                    fillColor: color,
                    fillOpacity: isHighSurge ? 0.22 : 0.12,
                    weight: 1,
                  }}
                />

                {/* Heatmap Core Circle */}
                <Circle
                  center={[zone.lat, zone.lng]}
                  radius={innerRadius}
                  pathOptions={{
                    color: '#FFF',
                    fillColor: color,
                    fillOpacity: isHighSurge ? 0.45 : 0.3,
                    weight: 2,
                    dashArray: isHighSurge ? '4, 4' : undefined,
                  }}
                />

                {/* Zone Center Marker */}
                <CircleMarker
                  center={[zone.lat, zone.lng]}
                  radius={7}
                  pathOptions={{
                    color: '#FFFFFF',
                    fillColor: color,
                    fillOpacity: 1,
                    weight: 2,
                  }}
                >
                  <Popup>
                    <div style={{ color: '#111', fontFamily: 'sans-serif', padding: 4 }}>
                      <strong style={{ fontSize: 14 }}>{zone.zone_name}</strong>
                      <br />
                      Surge Level: <span style={{ color: VELOUR_TOKENS.accentPrimary, fontWeight: 'bold' }}>{zone.surge_multiplier}x</span>
                      <br />
                      Demand Delta: {zone.demand_percentage}
                    </div>
                  </Popup>
                </CircleMarker>
              </React.Fragment>
            );
          })}

        {/* FLEET DRIVERS LAYER (When filter is Drivers) */}
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

        {/* HIGH-DEMAND EVENTS LAYER (When filter is Events) */}
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

      {/* Centered Top Status Pill overlay when Student B Model is Not Connected */}
      {!hasZones && (
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
