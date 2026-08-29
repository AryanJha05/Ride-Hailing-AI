import React from 'react';
import {
  Paper,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  List,
  ListItem,
  ListItemText,
  Box,
  Slider,
} from '@mui/material';
import { VELOUR_TOKENS } from '../../theme/palette';
import { DemandZone } from '../../types/api.types';

interface MapFilterPanelProps {
  filter: 'Demand' | 'Drivers' | 'Events';
  onFilterChange: (value: 'Demand' | 'Drivers' | 'Events') => void;
  zones: DemandZone[];
  hour?: number;
  onHourChange?: (hour: number) => void;
}

export const MapFilterPanel: React.FC<MapFilterPanelProps> = ({
  filter,
  onFilterChange,
  zones,
  hour = new Date().getHours(),
  onHourChange,
}) => {
  return (
    <Paper
      sx={{
        position: 'absolute',
        top: 24,
        left: 24,
        zIndex: 1000,
        width: 320,
        p: 2.5,
        backgroundColor: 'rgba(19, 18, 23, 0.92)',
        backdropFilter: 'blur(16px)',
        borderColor: VELOUR_TOKENS.borderSubtle,
        borderRadius: 3,
      }}
    >
      <Typography
        variant="caption"
        sx={{
          color: VELOUR_TOKENS.textSecondary,
          letterSpacing: '0.08em',
          fontWeight: 600,
          fontSize: 11,
          mb: 1.5,
          display: 'block',
        }}
      >
        MAP FILTERS
      </Typography>

      <ToggleButtonGroup
        value={filter}
        exclusive
        onChange={(_, v) => v && onFilterChange(v)}
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

      {/* Hourly Time Selection Control for Demand Zone Intelligence */}
      <Box sx={{ mb: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
          <Typography
            variant="caption"
            sx={{
              color: VELOUR_TOKENS.textSecondary,
              letterSpacing: '0.08em',
              fontWeight: 600,
              fontSize: 11,
            }}
          >
            DEMAND HOUR (ZONE INTELLIGENCE)
          </Typography>
          <Typography
            className="mono-num"
            variant="caption"
            sx={{ color: VELOUR_TOKENS.accentTeal, fontWeight: 700, fontSize: 12 }}
          >
            {`${hour.toString().padStart(2, '0')}:00`}
          </Typography>
        </Box>

        <Slider
          value={hour}
          min={0}
          max={23}
          step={1}
          onChange={(_, val) => onHourChange && onHourChange(val as number)}
          sx={{
            color: VELOUR_TOKENS.accentTeal,
            height: 4,
            py: 1,
            '& .MuiSlider-thumb': {
              width: 14,
              height: 14,
              backgroundColor: '#FFF',
              border: `2px solid ${VELOUR_TOKENS.accentTeal}`,
            },
            '& .MuiSlider-track': {
              backgroundColor: VELOUR_TOKENS.accentTeal,
            },
            '& .MuiSlider-rail': {
              backgroundColor: VELOUR_TOKENS.borderSubtle,
            },
          }}
        />
      </Box>

      <Typography
        variant="caption"
        sx={{
          color: VELOUR_TOKENS.textSecondary,
          letterSpacing: '0.08em',
          fontWeight: 600,
          fontSize: 11,
          mb: 1,
          display: 'block',
        }}
      >
        {filter === 'Demand' ? 'ACTIVE ZONES' : filter === 'Drivers' ? 'FLEET DRIVERS' : 'EVENT FEED'}
      </Typography>

      {filter === 'Demand' ? (
        zones.length > 0 ? (
          <List disablePadding sx={{ mb: 2 }}>
            {zones.map((z) => {
              let zoneColor = VELOUR_TOKENS.accentTeal;
              let labelText = 'Med';
              if (z.surge_multiplier >= 1.6 || z.demand_score >= 85) {
                zoneColor = '#EF4444'; // Red (Surge)
                labelText = 'Surge';
              } else if (z.surge_multiplier >= 1.35 || z.demand_score >= 70) {
                zoneColor = '#F97316'; // Orange (High)
                labelText = 'High';
              } else if (z.surge_multiplier >= 1.18 || z.demand_score >= 55) {
                zoneColor = '#FACC15'; // Yellow (Med)
                labelText = 'Med';
              } else {
                zoneColor = '#00D9C0'; // Cyan/Blue (Low)
                labelText = 'Low';
              }

              return (
                <ListItem
                  key={z.id}
                  sx={{
                    px: 0,
                    py: 0.8,
                    borderBottom: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, minWidth: 0 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: zoneColor,
                        boxShadow: `0 0 6px ${zoneColor}`,
                        flexShrink: 0,
                      }}
                    />
                    <ListItemText
                      primary={z.zone_name}
                      primaryTypographyProps={{ fontSize: 12.5, fontWeight: 600, color: '#FFF', noWrap: true }}
                    />
                  </Box>
                  <Box sx={{ textAlign: 'right', flexShrink: 0, ml: 1 }}>
                    <Typography
                      className="mono-num"
                      variant="caption"
                      sx={{
                        color: zoneColor,
                        fontWeight: 700,
                        fontSize: 11.5,
                        display: 'block',
                      }}
                    >
                      {labelText} ({z.surge_multiplier}x)
                    </Typography>
                    <Typography className="mono-num" variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 10.5 }}>
                      {z.demand_percentage}
                    </Typography>
                  </Box>
                </ListItem>
              );
            })}
          </List>
        ) : (
          <Box
            sx={{
              p: 2,
              mb: 2,
              borderRadius: 2,
              backgroundColor: VELOUR_TOKENS.bgSurface2,
              border: `1px dashed ${VELOUR_TOKENS.borderSubtle}`,
              textAlign: 'center',
            }}
          >
            <Typography variant="caption" sx={{ color: VELOUR_TOKENS.accentGold, fontWeight: 700, display: 'block', mb: 0.5 }}>
              MODEL NOT CONNECTED
            </Typography>
            <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 11, display: 'block' }}>
              Demand Zone Intelligence model is not connected. Base map operational.
            </Typography>
          </Box>
        )
      ) : filter === 'Drivers' ? (
        <Box
          sx={{
            p: 2,
            mb: 2,
            borderRadius: 2,
            backgroundColor: VELOUR_TOKENS.bgSurface2,
            border: `1px dashed ${VELOUR_TOKENS.borderSubtle}`,
            textAlign: 'center',
          }}
        >
          <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 600, display: 'block' }}>
            No live driver data available
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            p: 2,
            mb: 2,
            borderRadius: 2,
            backgroundColor: VELOUR_TOKENS.bgSurface2,
            border: `1px dashed ${VELOUR_TOKENS.borderSubtle}`,
            textAlign: 'center',
          }}
        >
          <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 600, display: 'block' }}>
            No event data source connected
          </Typography>
        </Box>
      )}

      {/* Heatmap Semantic Legend Bar */}
      <Box sx={{ mt: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', color: VELOUR_TOKENS.textSecondary, fontSize: 10, mb: 0.5, fontWeight: 600 }}>
          <span style={{ color: '#00D9C0' }}>LOW</span>
          <span style={{ color: '#FACC15' }}>MED</span>
          <span style={{ color: '#F97316' }}>HIGH</span>
          <span style={{ color: '#EF4444' }}>SURGE</span>
        </Box>
        <Box
          sx={{
            height: 6,
            borderRadius: 3,
            background: 'linear-gradient(to right, #00D9C0 0%, #FACC15 35%, #F97316 70%, #EF4444 100%)',
            boxShadow: '0 0 10px rgba(0, 217, 192, 0.15)',
          }}
        />
      </Box>
    </Paper>
  );
};
