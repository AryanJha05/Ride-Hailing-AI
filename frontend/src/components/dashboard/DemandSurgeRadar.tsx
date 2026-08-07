import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Box } from '@mui/material';
import { VELOUR_TOKENS } from '../../theme/palette';
import { DemandZone } from '../../types/api.types';

interface DemandSurgeRadarProps {
  zones: DemandZone[];
  onSelectZone?: (zoneName: string) => void;
}

export const DemandSurgeRadar: React.FC<DemandSurgeRadarProps> = ({ zones, onSelectZone }) => {
  return (
    <Card sx={{ height: '100%', backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 16, color: '#FFF', mb: 2 }}>
          Active Demand Radar
        </Typography>
        <List disablePadding>
          {(zones.length > 0 ? zones.slice(0, 4) : [
            { id: 'z1', zone_name: 'Financial District', surge_multiplier: 1.4, demand_percentage: '+42%' },
            { id: 'z2', zone_name: 'Airports (JFK)', surge_multiplier: 1.65, demand_percentage: '+65%' },
            { id: 'z3', zone_name: 'Midtown Core', surge_multiplier: 1.2, demand_percentage: '+18%' },
            { id: 'z4', zone_name: 'Williamsburg', surge_multiplier: 1.1, demand_percentage: '+15%' },
          ]).map((z) => (
            <ListItem
              key={z.id}
              onClick={() => onSelectZone && onSelectZone(z.zone_name)}
              sx={{
                px: 0,
                py: 1.2,
                borderBottom: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
                cursor: 'pointer',
                '&:hover': { opacity: 0.8 },
              }}
            >
              <ListItemText
                primary={z.zone_name}
                primaryTypographyProps={{ fontSize: 14, fontWeight: 500, color: '#FFF' }}
              />
              <Box sx={{ textAlign: 'right' }}>
                <Typography className="mono-num" variant="subtitle2" sx={{ color: VELOUR_TOKENS.accentTeal, fontWeight: 700 }}>
                  {z.surge_multiplier}x Surge
                </Typography>
                <Typography className="mono-num" variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary }}>
                  {z.demand_percentage}
                </Typography>
              </Box>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};
