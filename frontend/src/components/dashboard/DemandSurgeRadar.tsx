import React from 'react';
import { Card, CardContent, Typography, Box, Button, Chip } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MapIcon from '@mui/icons-material/Map';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { useNavigate } from 'react-router-dom';
import { VELOUR_TOKENS } from '../../theme/palette';
import { ROUTES } from '../../routes/routes';
import { DemandZone } from '../../types/api.types';

interface DemandSurgeRadarProps {
  zones: DemandZone[];
}

export const DemandSurgeRadar: React.FC<DemandSurgeRadarProps> = ({ zones }) => {
  const navigate = useNavigate();
  const hasZones = zones && zones.length > 0;
  const displayZones = hasZones ? zones.slice(0, 4) : [];

  return (
    <Card
      sx={{
        backgroundColor: VELOUR_TOKENS.bgSurface1,
        border: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
        borderRadius: 3,
        height: '100%',
        width: '100%',
        minWidth: 0,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardContent sx={{ p: { xs: 1.8, sm: 2.2, md: 2.5 }, display: 'flex', flexDirection: 'column', height: '100%', minWidth: 0, boxSizing: 'border-box' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.8, minWidth: 0 }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle2" sx={{ color: VELOUR_TOKENS.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8, fontSize: 11, fontWeight: 700 }}>
              Live Demand Radar
            </Typography>
            <Typography variant="h6" noWrap sx={{ fontWeight: 700, color: '#FFF', fontSize: 16 }}>
              NYC Surge Zones
            </Typography>
          </Box>
          <Button
            size="small"
            onClick={() => navigate(ROUTES.USER.LIVE_MAP)}
            endIcon={<ArrowForwardIcon fontSize="small" />}
            sx={{ color: VELOUR_TOKENS.accentTeal, fontSize: 12, fontWeight: 700, textTransform: 'none', flexShrink: 0 }}
          >
            View Map
          </Button>
        </Box>

        {/* Leaflet Inset Preview Box */}
        <Box
          onClick={() => navigate(ROUTES.USER.LIVE_MAP)}
          sx={{
            width: '100%',
            height: 110,
            borderRadius: 2,
            mb: 2,
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer',
            border: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
            background: `radial-gradient(circle at 40% 50%, rgba(124, 58, 237, 0.25) 0%, rgba(0, 217, 192, 0.15) 45%, #121019 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 0,
            boxSizing: 'border-box',
            '&:hover': { borderColor: VELOUR_TOKENS.accentTeal },
          }}
        >
          <Box sx={{ textAlign: 'center', zIndex: 2, p: 1, minWidth: 0 }}>
            <MapIcon sx={{ color: VELOUR_TOKENS.accentTeal, fontSize: 28, mb: 0.3 }} />
            <Typography variant="caption" sx={{ color: '#FFF', fontWeight: 600, display: 'block', fontSize: 11 }}>
              Click to Open Full Interactive Map
            </Typography>
          </Box>
        </Box>

        {/* Surge Zone Items List or Honest Empty State */}
        {hasZones ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 'auto', minWidth: 0 }}>
            {displayZones.map((zone, idx) => (
              <Box
                key={idx}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 1.2,
                  borderRadius: 2,
                  backgroundColor: VELOUR_TOKENS.bgSurface2,
                  border: `1px solid ${idx === 0 ? 'rgba(0, 217, 192, 0.3)' : VELOUR_TOKENS.borderSubtle}`,
                  minWidth: 0,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                  <LocationOnIcon sx={{ color: idx === 0 ? VELOUR_TOKENS.accentTeal : VELOUR_TOKENS.textSecondary, fontSize: 18, flexShrink: 0 }} />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" noWrap sx={{ color: '#FFF', fontWeight: 600, fontSize: 12.5 }}>
                      {zone.zone_name}
                    </Typography>
                    <Typography variant="caption" noWrap sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 10.5, display: 'block' }}>
                      {zone.demand_percentage || 'Normal'} demand surge
                    </Typography>
                  </Box>
                </Box>

                <Chip
                  label={`${zone.surge_multiplier || 1.0}x Surge`}
                  size="small"
                  sx={{
                    backgroundColor: idx === 0 ? 'rgba(0, 217, 192, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                    color: idx === 0 ? VELOUR_TOKENS.accentTeal : '#FFF',
                    fontWeight: 700,
                    fontSize: 11,
                    height: 22,
                    flexShrink: 0,
                  }}
                />
              </Box>
            ))}
          </Box>
        ) : (
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: VELOUR_TOKENS.bgSurface2,
              border: `1px dashed ${VELOUR_TOKENS.borderSubtle}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              mt: 'auto',
              minHeight: 100,
              minWidth: 0,
              boxSizing: 'border-box',
            }}
          >
            <HourglassEmptyIcon sx={{ color: VELOUR_TOKENS.accentGold, fontSize: 24, mb: 0.5 }} />
            <Typography variant="caption" sx={{ color: VELOUR_TOKENS.accentGold, fontWeight: 700, fontSize: 11 }}>
              MODEL NOT CONNECTED
            </Typography>
            <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 11.5, mt: 0.3 }}>
              Demand Zone Classification model (Student B) pending pipeline integration.
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
