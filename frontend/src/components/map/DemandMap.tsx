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

// Custom Fleet Driver Pin
const fleetDriverIcon = L.divIcon({
  className: 'fleet-driver-pin',
  html: `<div style="
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: ${VELOUR_TOKENS.accentTeal};
    border: 2px solid #FFF;
    box-shadow: 0 0 10px ${VELOUR_TOKENS.accentTeal};
  "></div>`,
  iconSize: [10, 10],
  iconAnchor: [5, 5],
});

// Custom Event Marker Pin
const eventIcon = L.divIcon({
  className: 'event-pin',
  html: `<div style="
    padding: 3px 8px;
    background-color: ${VELOUR_TOKENS.accentPrimary};
    color: #FFF;
    border-radius: 10px;
    font-size: 11px;
    font-weight: 700;
    font-family: sans-serif;
    box-shadow: 0 4px 12px rgba(124, 58, 237, 0.6);
    white-space: nowrap;
  ">🎪 Event Zone</div>`,
  iconSize: [90, 22],
  iconAnchor: [45, 11],
});

// Custom Recommended Zone Marker
const recommendedIcon = L.divIcon({
  className: 'custom-rec-pin',
  html: `<div style="
    padding: 4px 10px;
    background-color: ${VELOUR_TOKENS.bgSurface1};
    color: ${VELOUR_TOKENS.accentTeal};
    border: 1.5px solid ${VELOUR_TOKENS.accentTeal};
    border-radius: 12px;
    font-size: 11px;
    font-weight: 700;
    font-family: monospace;
    box-shadow: 0 4px 14px rgba(0,217,192,0.4);
    white-space: nowrap;
  ">Recommended · +42% Surge</div>`,
  iconSize: [150, 26],
  iconAnchor: [75, 32],
});

// Default Mock NYC Demand Zones if API data is loading or empty
const DEFAULT_ZONES: DemandZone[] = [
  { id: '1', zone_name: 'Financial District', lat: 40.7075, lng: -74.0090, surge_multiplier: 1.65, demand_percentage: '+42%', demand_score: 94, trend: 'up' },
  { id: '2', zone_name: 'Midtown Core', lat: 40.7549, lng: -73.9840, surge_multiplier: 1.4, demand_percentage: '+28%', demand_score: 82, trend: 'up' },
  { id: '3', zone_name: 'JFK Airport Terminal 4', lat: 40.6413, lng: -73.7781, surge_multiplier: 1.8, demand_percentage: '+65%', demand_score: 98, trend: 'up' },
  { id: '4', zone_name: 'Williamsburg Waterfront', lat: 40.7182, lng: -73.9614, surge_multiplier: 1.25, demand_percentage: '+18%', demand_score: 71, trend: 'flat' },
  { id: '5', zone_name: 'DUMBO Tech Hub', lat: 40.7033, lng: -73.9881, surge_multiplier: 1.35, demand_percentage: '+22%', demand_score: 76, trend: 'up' },
];

const MOCK_FLEET_DRIVERS = [
  { id: 'd1', lat: 40.7100, lng: -74.0050 },
  { id: 'd2', lat: 40.7150, lng: -74.0120 },
  { id: 'd3', lat: 40.7050, lng: -73.9990 },
  { id: 'd4', lat: 40.7500, lng: -73.9810 },
  { id: 'd5', lat: 40.7580, lng: -73.9890 },
];

const MOCK_EVENTS = [
  { id: 'e1', name: 'Barclays Concert', lat: 40.6826, lng: -73.9754 },
  { id: 'e2', name: 'Madison Square Garden', lat: 40.7505, lng: -73.9934 },
];

interface DemandMapProps {
  zones?: DemandZone[];
  filter?: 'Demand' | 'Drivers' | 'Events';
  driverLocation?: { lat: number; lng: number };
}

export const DemandMap: React.FC<DemandMapProps> = ({
  zones,
  filter = 'Demand',
  driverLocation = { lat: 40.7128, lng: -74.0060 },
}) => {
  const activeZones = zones && zones.length > 0 ? zones : DEFAULT_ZONES;
  const center: [number, number] = [driverLocation.lat, driverLocation.lng];

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

        {/* HEATMAP / DEMAND LAYER */}
        {(filter === 'Demand' || filter === 'Drivers') &&
          activeZones.map((zone) => {
            const isHighSurge = zone.surge_multiplier >= 1.4;
            const color = isHighSurge ? VELOUR_TOKENS.accentTeal : VELOUR_TOKENS.accentLavender;
            const outerRadius = zone.surge_multiplier * 750;
            const innerRadius = zone.surge_multiplier * 350;

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

                {/* Heatmap Core High-Intensity Circle */}
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

        {/* FLEET DRIVERS LAYER */}
        {(filter === 'Drivers') &&
          MOCK_FLEET_DRIVERS.map((d) => (
            <Marker key={d.id} position={[d.lat, d.lng]} icon={fleetDriverIcon} />
          ))}

        {/* EVENTS LAYER */}
        {(filter === 'Events') &&
          MOCK_EVENTS.map((e) => (
            <Marker key={e.id} position={[e.lat, e.lng]} icon={eventIcon}>
              <Popup>
                <div style={{ color: '#111' }}>
                  <strong>{e.name}</strong>
                  <br />High outbound ride request volume expected.
                </div>
              </Popup>
            </Marker>
          ))}

        {/* Recommended Surge Target Pin */}
        {activeZones.length > 0 && (
          <Marker position={[activeZones[0].lat, activeZones[0].lng]} icon={recommendedIcon} />
        )}
      </MapContainer>
    </Box>
  );
};
