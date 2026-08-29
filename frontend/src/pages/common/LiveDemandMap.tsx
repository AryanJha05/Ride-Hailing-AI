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
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 40.7549, lng: -73.9840 });

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

  const handleSelectLocation = (loc: LocationOption) => {
    setMapCenter({ lat: loc.lat, lng: loc.lng });
  };

  const handleResetLocation = () => {
    setMapCenter({ lat: 40.7549, lng: -73.9840 });
    setSearchQuery('');
  };

  return (
    <PageShell title="Live Demand Map" hideHeader={true}>
      <Box sx={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', backgroundColor: '#060709' }}>
        {/* Leaflet Dark Map Base Layer with Interactive Heatmaps */}
        <DemandMap
          zones={displayZones}
          filter={filter}
          driverLocation={mapCenter}
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
            <IconButton size="small" sx={{ color: VELOUR_TOKENS.textSecondary, '&:hover': { color: '#FFF' } }}>
              <AddIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" sx={{ color: VELOUR_TOKENS.textSecondary, '&:hover': { color: '#FFF' } }}>
              <RemoveIcon fontSize="small" />
            </IconButton>
          </Paper>
        </Box>
      </Box>
    </PageShell>
  );
};
