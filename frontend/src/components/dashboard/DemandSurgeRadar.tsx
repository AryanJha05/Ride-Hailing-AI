import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Box, Button } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FencingIcon from '@mui/icons-material/PinDrop';
import { useNavigate } from 'react-router-dom';
import { VELOUR_TOKENS } from '../../theme/palette';
import { DemandZone } from '../../types/api.types';
import { DemandMap } from '../map/DemandMap';

interface DemandSurgeRadarProps {
  zones: DemandZone[];
  onSelectZone?: (zoneName: string) => void;
}

export const DemandSurgeRadar: React.FC<DemandSurgeRadarProps> = ({ zones, onSelectZone }) => {
  const navigate = useNavigate();
  const displayZones = zones && zones.length > 0 ? zones.slice(0, 4) : [
    { id: 'z1', zone_name: 'Financial District', surge_multiplier: 1.4, demand_percentage: '+42%', lat: 40.7075, lng: -74.0090 },
    { id: 'z2', zone_name: 'Airports (JFK)', surge_multiplier: 1.6, demand_percentage: '+65%', lat: 40.6413, lng: -73.7781 },
    { id: 'z3', zone_name: 'Midtown Core', surge_multiplier: 1.2, demand_percentage: '+18%', lat: 40.7549, lng: -73.9840 },
    { id: 'z4', zone_name: 'Williamsburg', surge_multiplier: 1.1, demand_percentage: '+15%', lat: 40.7182, lng: -73.9614 },
  ];

  return (
    <Card sx={{ height: '100%', backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle, borderRadius: 3 }}>
      <CardContent sx={{ p: 2.5, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 16, color: '#FFF' }}>
            Demand Radar
          </Typography>
          <Button
            size="small"
            onClick={() => navigate('/live-map')}
            endIcon={<ArrowForwardIcon sx={{ fontSize: '14px !important' }} />}
            sx={{
              color: VELOUR_TOKENS.accentTeal,
              fontSize: 12,
              fontWeight: 600,
              p: 0,
              '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' },
            }}
          >
            View Map
          </Button>
        </Box>

        {/* Leaflet Map Preview Container */}
        <Box sx={{ width: '100%', height: 140, borderRadius: 2, overflow: 'hidden', mb: 1.5, border: `1px solid ${VELOUR_TOKENS.borderSubtle}` }}>
          <DemandMap zones={displayZones as any} filter="Demand" />
        </Box>

        {/* Zone Surge List */}
        <List disablePadding sx={{ mt: 'auto' }}>
          {displayZones.map((z) => (
            <ListItem
              key={z.id}
              onClick={() => onSelectZone && onSelectZone(z.zone_name)}
              sx={{
                px: 1,
                py: 0.8,
                borderRadius: 1.5,
                mb: 0.5,
                backgroundColor: VELOUR_TOKENS.bgSurface2,
                cursor: 'pointer',
                '&:hover': { backgroundColor: 'rgba(124, 58, 237, 0.1)' },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
                <FencingIcon sx={{ color: VELOUR_TOKENS.accentTeal, fontSize: 16 }} />
                <ListItemText
                  primary={z.zone_name}
                  primaryTypographyProps={{ fontSize: 12.5, fontWeight: 600, color: '#FFF' }}
                />
              </Box>
              <Typography className="mono-num" variant="subtitle2" sx={{ color: VELOUR_TOKENS.accentTeal, fontWeight: 700, fontSize: 12.5 }}>
                {z.surge_multiplier}x Surge
              </Typography>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};
