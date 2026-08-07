import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Box } from '@mui/material';
import { VELOUR_TOKENS } from '../../theme/palette';
import { DemandZone } from '../../types/api.types';

// Custom Leaflet DivIcon for Driver Location Pin
const driverIcon = L.divIcon({
  className: 'custom-driver-pin',
  html: `<div style="
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background-color: #ffffff;
    box-shadow: 0 0 0 6px rgba(0, 217, 192, 0.4), 0 0 20px ${VELOUR_TOKENS.accentTeal};
  "></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

// Custom Leaflet DivIcon for Recommended Zone Marker
const recommendedIcon = L.divIcon({
  className: 'custom-rec-pin',
  html: `<div style="
    padding: 4px 10px;
    background-color: ${VELOUR_TOKENS.bgSurface1};
    color: ${VELOUR_TOKENS.accentLavender};
    border: 1px solid ${VELOUR_TOKENS.accentPrimary};
    border-radius: 12px;
    font-size: 11px;
    font-weight: 700;
    font-family: monospace;
    box-shadow: 0 4px 12px rgba(0,0,0,0.6);
    white-space: nowrap;
  ">Recommended · +42%</div>`,
  iconSize: [140, 24],
  iconAnchor: [70, 30],
});

interface DemandMapProps {
  zones: DemandZone[];
  driverLocation?: { lat: number; lng: number };
}

export const DemandMap: React.FC<DemandMapProps> = ({
  zones,
  driverLocation = { lat: 40.7128, lng: -74.0060 },
}) => {
  const center: [number, number] = [driverLocation.lat, driverLocation.lng];

  return (
    <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
      <MapContainer
        center={center}
        zoom={13}
        style={{ width: '100%', height: '100%', backgroundColor: '#060709' }}
        zoomControl={false}
      >
        {/* Dark CartoDB Tile Layer */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          maxZoom={19}
        />

        {/* Driver Location Marker */}
        <Marker position={center} icon={driverIcon}>
          <Popup>
            <span style={{ color: '#000', fontWeight: 'bold' }}>Your Current Location</span>
          </Popup>
        </Marker>

        {/* Render Active Demand Zones */}
        {zones.map((zone) => {
          const isHighSurge = zone.surge_multiplier >= 1.4;
          const color = isHighSurge ? VELOUR_TOKENS.accentTeal : VELOUR_TOKENS.accentLavender;

          return (
            <React.Fragment key={zone.id}>
              {/* Heat Circle */}
              <Circle
                center={[zone.lat, zone.lng]}
                radius={zone.surge_multiplier * 600}
                pathOptions={{
                  color: color,
                  fillColor: color,
                  fillOpacity: isHighSurge ? 0.25 : 0.15,
                  weight: 1.5,
                  dashArray: isHighSurge ? '4, 4' : undefined,
                }}
              />
              <CircleMarker
                center={[zone.lat, zone.lng]}
                radius={6}
                pathOptions={{
                  color: '#FFFFFF',
                  fillColor: color,
                  fillOpacity: 1,
                  weight: 2,
                }}
              >
                <Popup>
                  <div style={{ color: '#111', fontFamily: 'sans-serif' }}>
                    <strong>{zone.zone_name}</strong>
                    <br />
                    Surge: {zone.surge_multiplier}x
                    <br />
                    Demand: {zone.demand_percentage}
                  </div>
                </Popup>
              </CircleMarker>
            </React.Fragment>
          );
        })}

        {/* Recommended Staging Overlay Marker */}
        {zones.length > 0 && (
          <Marker position={[zones[0].lat, zones[0].lng]} icon={recommendedIcon} />
        )}
      </MapContainer>
    </Box>
  );
};
