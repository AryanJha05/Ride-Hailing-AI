import React, { useState } from 'react';
import { Box, Paper, IconButton } from '@mui/material';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { PageShell } from '../../components/layout/PageShell';
import { VELOUR_TOKENS } from '../../theme/palette';
import { useDemandZones } from '../../hooks/useRideApi';
import { DemandMap } from '../../components/map/DemandMap';
import { MapFilterPanel } from '../../components/map/MapFilterPanel';
import { MapSearchBar, LocationOption } from '../../components/map/MapSearchBar';

export const LiveDemandMap: React.FC = () => {
  const [filter, setFilter] = useState<'Demand' | 'Drivers' | 'Events'>('Demand');
  const [selectedHour, setSelectedHour] = useState<number>(new Date().getHours());
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Separated Driver Location from Camera Target
  const driverLocation = { lat: 40.7549, lng: -73.9840 };

  // Explicit Camera Movements (Search selection & Reset Location trigger timestamp updates)
  const [cameraTarget, setCameraTarget] = useState<{
    lat: number;
    lng: number;
    zoom: number;
    timestamp: number;
  } | null>({
    lat: 40.7549,
    lng: -73.9840,
    zoom: 13,
    timestamp: Date.now(),
  });

  const [zoomDelta, setZoomDelta] = useState<{ action: 'in' | 'out'; timestamp: number } | null>(null);

  const { data: zones, isLoading, isError } = useDemandZones(selectedHour);

  const displayZones = (zones || []).filter((z) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const name = z.zone_name.toLowerCase();
    if (name.includes(q)) return true;
    if (q.includes('jfk') && name.includes('jfk')) return true;
    if (q.includes('williamsburg') && name.includes('williamsburg')) return true;
    if (q.includes('midtown') && name.includes('midtown')) return true;
    if (q.includes('laguardia') && name.includes('laguardia')) return true;
    if (q.includes('brooklyn') && name.includes('brooklyn')) return true;
    return false;
  });

  const isFilteredEmpty = Boolean(searchQuery && (zones || []).length > 0 && displayZones.length === 0);

  // ONLY explicit location search moves/zooms the map camera
  const handleSelectLocation = (loc: LocationOption) => {
    setCameraTarget({ lat: loc.lat, lng: loc.lng, zoom: 14.5, timestamp: Date.now() });
  };

  // ONLY explicit reset button click moves map camera back to driver location
  const handleResetLocation = () => {
    setCameraTarget({ lat: driverLocation.lat, lng: driverLocation.lng, zoom: 13, timestamp: Date.now() });
    setSearchQuery('');
  };

  const handleZoomIn = () => {
    setZoomDelta({ action: 'in', timestamp: Date.now() });
  };

  const handleZoomOut = () => {
    setZoomDelta({ action: 'out', timestamp: Date.now() });
  };

  return (
    <PageShell title="Live Demand Map" hideHeader={true}>
      <Box sx={{ position: 'relative', width: '100%', height: '100%', flex: 1, minHeight: 0, overflow: 'hidden', backgroundColor: '#060709' }}>
        {/* Leaflet Dark Map Base Layer with Interactive Heatmaps */}
        <DemandMap
          zones={displayZones}
          filter={filter}
          driverLocation={driverLocation}
          cameraTarget={cameraTarget}
          zoomDelta={zoomDelta}
          isLoading={isLoading}
          isError={isError}
          isFilteredEmpty={isFilteredEmpty}
        />

        {/* Top Right Interactive Search Bar */}
        <MapSearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectLocation={handleSelectLocation}
        />

        {/* Left Floating Overlay Panel (MAP FILTERS) */}
        <MapFilterPanel
          filter={filter}
          onFilterChange={setFilter}
          zones={displayZones}
          hour={selectedHour}
          onHourChange={setSelectedHour}
        />

        {/* Bottom Right Map Controls */}
        <Box sx={{ position: 'absolute', bottom: 32, right: 32, zIndex: 1000, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Paper sx={{ borderRadius: 999, overflow: 'hidden', p: 0.5, backgroundColor: VELOUR_TOKENS.bgSurface1 }}>
            <IconButton size="small" onClick={handleResetLocation} sx={{ color: VELOUR_TOKENS.accentTeal, '&:hover': { color: '#FFF' } }}>
              <MyLocationIcon fontSize="small" />
            </IconButton>
          </Paper>
          <Paper sx={{ borderRadius: 2, overflow: 'hidden', display: 'flex', flexDirection: 'column', backgroundColor: VELOUR_TOKENS.bgSurface1 }}>
            <IconButton size="small" onClick={handleZoomIn} sx={{ color: VELOUR_TOKENS.textSecondary, '&:hover': { color: '#FFF' } }}>
              <AddIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={handleZoomOut} sx={{ color: VELOUR_TOKENS.textSecondary, '&:hover': { color: '#FFF' } }}>
              <RemoveIcon fontSize="small" />
            </IconButton>
          </Paper>
        </Box>
      </Box>
    </PageShell>
  );
};

