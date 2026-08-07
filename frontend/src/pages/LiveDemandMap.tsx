import React, { useState } from 'react';
import { Box, Paper, IconButton } from '@mui/material';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { PageShell } from '../components/layout/PageShell';
import { VELOUR_TOKENS } from '../theme/palette';
import { useDemandZones } from '../hooks/useRideApi';
import { DemandMap } from '../components/map/DemandMap';
import { MapFilterPanel } from '../components/map/MapFilterPanel';
import { MapSearchBar } from '../components/map/MapSearchBar';

export const LiveDemandMap: React.FC = () => {
  const [filter, setFilter] = useState<'Demand' | 'Drivers' | 'Events'>('Demand');
  const { data: zones } = useDemandZones();

  return (
    <PageShell title="Live Demand Map" hideHeader={true}>
      <Box sx={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', backgroundColor: '#060709' }}>
        {/* Leaflet Dark Map Base Layer with Interactive Heatmaps */}
        <DemandMap zones={zones || []} filter={filter} />

        {/* Top Right Search Bar */}
        <MapSearchBar />

        {/* Left Floating Overlay Panel (MAP FILTERS) */}
        <MapFilterPanel
          filter={filter}
          onFilterChange={setFilter}
          zones={zones || []}
        />

        {/* Bottom Right Map Controls */}
        <Box sx={{ position: 'absolute', bottom: 32, right: 32, zIndex: 1000, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Paper sx={{ borderRadius: 999, overflow: 'hidden', p: 0.5, backgroundColor: VELOUR_TOKENS.bgSurface1 }}>
            <IconButton size="small" sx={{ color: VELOUR_TOKENS.textSecondary, '&:hover': { color: '#FFF' } }}>
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
