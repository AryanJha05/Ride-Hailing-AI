import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { PageShell } from '../components/layout/PageShell';
import { VELOUR_TOKENS } from '../theme/palette';
import { useDemandZones } from '../hooks/useRideApi';

export const LiveDemandMap: React.FC = () => {
  const [filter, setFilter] = useState<'Demand' | 'Drivers' | 'Events'>('Demand');
  const { data: zones } = useDemandZones();

  return (
    <PageShell title="Live Demand Map" hideHeader={true}>
      <Box sx={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', backgroundColor: '#060709' }}>
        {/* Full Viewport Dark Map Simulation Surface */}
        <Box
          sx={{
            width: '100%',
            height: '100%',
            backgroundImage: 'radial-gradient(circle at 60% 40%, rgba(0, 217, 192, 0.22) 0%, rgba(124, 58, 237, 0.28) 25%, rgba(10, 10, 13, 0.98) 70%)',
            position: 'relative',
          }}
        >
          {/* Driver Pin */}
          <Box
            sx={{
              position: 'absolute',
              top: '62%',
              left: '64%',
              width: 14,
              height: 14,
              borderRadius: '50%',
              backgroundColor: '#FFF',
              boxShadow: `0 0 0 6px rgba(0, 217, 192, 0.4), 0 0 20px ${VELOUR_TOKENS.accentTeal}`,
              zIndex: 10,
            }}
          />

          {/* Recommended Ring & Floating Chip */}
          <Box
            sx={{
              position: 'absolute',
              top: '32%',
              left: '56%',
              width: 180,
              height: 180,
              borderRadius: '50%',
              border: `2px dashed ${VELOUR_TOKENS.accentLavender}`,
              backgroundColor: 'rgba(124, 58, 237, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              zIndex: 10,
            }}
          >
            <Chip
              label="Recommended · +35% demand"
              sx={{
                position: 'absolute',
                top: -16,
                backgroundColor: VELOUR_TOKENS.bgSurface1,
                color: VELOUR_TOKENS.accentLavender,
                border: `1px solid ${VELOUR_TOKENS.accentPrimary}`,
                fontWeight: 600,
                fontSize: 12,
                fontFamily: VELOUR_TOKENS.fontMono,
                boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
              }}
            />
          </Box>

          {/* Top Right Search Bar */}
          <Box sx={{ position: 'absolute', top: 24, right: 24, zIndex: 20, width: 320 }}>
            <TextField
              fullWidth
              placeholder="Search locations, zones..."
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 18 }} />
                  </InputAdornment>
                ),
                sx: {
                  backgroundColor: 'rgba(19, 18, 23, 0.9)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 999,
                  color: '#FFF',
                  borderColor: VELOUR_TOKENS.borderSubtle,
                  fontSize: 13,
                },
              }}
            />
          </Box>

          {/* Left Floating Overlay Panel (MAP FILTERS) */}
          <Paper
            sx={{
              position: 'absolute',
              top: 24,
              left: 24,
              zIndex: 20,
              width: 320,
              p: 2.5,
              backgroundColor: 'rgba(19, 18, 23, 0.92)',
              backdropFilter: 'blur(16px)',
              borderColor: VELOUR_TOKENS.borderSubtle,
              borderRadius: 3,
            }}
          >
            <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, letterSpacing: '0.08em', fontWeight: 600, fontSize: 11, mb: 1.5, display: 'block' }}>
              MAP FILTERS
            </Typography>

            <ToggleButtonGroup
              value={filter}
              exclusive
              onChange={(_, v) => v && setFilter(v)}
              fullWidth
              size="small"
              sx={{ mb: 3 }}
            >
              {(['Demand', 'Drivers', 'Events'] as const).map((item) => (
                <ToggleButton
                  key={item}
                  value={item}
                  sx={{
                    fontSize: 12,
                    py: 0.6,
                    color: VELOUR_TOKENS.textSecondary,
                    '&.Mui-selected': {
                      backgroundColor: VELOUR_TOKENS.accentPrimary,
                      color: '#FFF',
                      fontWeight: 600,
                    },
                  }}
                >
                  {item}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>

            <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, letterSpacing: '0.08em', fontWeight: 600, fontSize: 11, mb: 1, display: 'block' }}>
              ACTIVE ZONES
            </Typography>

            <List disablePadding sx={{ mb: 3 }}>
              {(zones || [
                { id: '1', zone_name: 'Financial District', demand_percentage: '+42%', surge_multiplier: 1.4 },
                { id: '2', zone_name: 'Midtown Core', demand_percentage: '+18%', surge_multiplier: 1.2 },
                { id: '3', zone_name: 'Airports (JFK)', demand_percentage: '+65%', surge_multiplier: 1.65 },
              ]).map((z) => (
                <ListItem
                  key={z.id}
                  sx={{
                    px: 0,
                    py: 1,
                    borderBottom: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
                    display: 'flex',
                    justify: 'space-between',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: z.surge_multiplier > 1.3 ? VELOUR_TOKENS.accentTeal : VELOUR_TOKENS.accentLavender }} />
                    <ListItemText primary={z.zone_name} primaryTypographyProps={{ fontSize: 13, fontWeight: 500, color: '#FFF' }} />
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography className="mono-num" variant="caption" sx={{ color: z.surge_multiplier > 1.3 ? VELOUR_TOKENS.accentTeal : VELOUR_TOKENS.accentLavender, fontWeight: 700, fontSize: 12, display: 'block' }}>
                      {z.surge_multiplier > 1.5 ? 'Surge' : z.surge_multiplier > 1.2 ? 'High' : 'Med'}
                    </Typography>
                    <Typography className="mono-num" variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 11 }}>
                      {z.demand_percentage}
                    </Typography>
                  </Box>
                </ListItem>
              ))}
            </List>

            {/* Heatmap Bar */}
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', color: VELOUR_TOKENS.textSecondary, fontSize: 10, mb: 0.5 }}>
                <span>Low</span>
                <span>Demand Heatmap</span>
                <span>High</span>
              </Box>
              <Box
                sx={{
                  height: 6,
                  borderRadius: 3,
                  background: `linear-gradient(to right, ${VELOUR_TOKENS.borderSubtle}, ${VELOUR_TOKENS.accentTeal}, ${VELOUR_TOKENS.accentPrimary})`,
                }}
              />
            </Box>
          </Paper>

          {/* Bottom Right Map Control IconButtons */}
          <Box sx={{ position: 'absolute', bottom: 32, right: 32, zIndex: 20, display: 'flex', flexDirection: 'column', gap: 1 }}>
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
      </Box>
    </PageShell>
  );
};
