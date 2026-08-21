import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Box, Typography, Card } from '@mui/material';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { VELOUR_TOKENS } from '../../theme/palette';
import { DemandZone } from '../../types/api.types';

// Custom Leaflet DivIcon for Driver Location Pin
const driverIcon = L.divIcon({
  className: 'custom-driver-pin',
  html: `<div style="
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: #ffffff;
    border: 3px solid ${VELOUR_TOKENS.accentTeal};
    box-shadow: 0 0 0 6px rgba(0, 217, 192, 0.4), 0 0 20px ${VELOUR_TOKENS.accentTeal};
  "></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
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
        {/* CartoDB Dark Base Layer */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          maxZoom={19}
        />

        {/* Primary Driver Location Pin */}
        <Marker position={center} icon={driverIcon}>
          <Popup>
            <div style={{ color: '#111', fontFamily: 'sans-serif' }}>
              <strong>Your Driver Unit (Active)</strong>
            </div>
          </Popup>
        </Marker>

        {/* REAL DEMAND ZONE LAYER */}
        {hasZones &&
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
      </MapContainer>

      {/* Honest Empty State Overlay Banner when Student B Model is Not Connected */}
      {!hasZones && (
        <Card
          sx={{
            position: 'absolute',
            top: 20,
            left: 20,
            right: 20,
            zIndex: 1000,
            p: 2,
            backgroundColor: 'rgba(18, 16, 25, 0.92)',
            backdropFilter: 'blur(12px)',
            border: `1px dashed ${VELOUR_TOKENS.borderSubtle}`,
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: '50%',
              backgroundColor: 'rgba(234, 179, 8, 0.12)',
              border: `1px solid rgba(234, 179, 8, 0.3)`,
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              flexShrink: 0,
            }}
          >
            <HourglassEmptyIcon sx={{ color: VELOUR_TOKENS.accentGold, fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ color: VELOUR_TOKENS.accentGold, fontWeight: 700, fontSize: 13 }}>
              DEMAND INTELLIGENCE UNAVAILABLE
            </Typography>
            <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 12 }}>
              Student B spatial demand-zone ML model is pending pipeline integration. Base navigation map active.
            </Typography>
          </Box>
        </Card>
      )}
    </Box>
  );
};
