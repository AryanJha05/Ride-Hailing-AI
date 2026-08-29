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

      {/* Hourly Time Selection Control for Student B HDBSCAN Demand Model */}
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
            DEMAND HOUR (STUDENT B)
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
          <List disablePadding sx={{ mb: 3, maxHeight: 220, overflowY: 'auto' }}>
            {zones.map((z) => (
              <ListItem
                key={z.id}
                sx={{
                  px: 0,
                  py: 1,
                  borderBottom: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: z.surge_multiplier > 1.3 ? VELOUR_TOKENS.accentTeal : VELOUR_TOKENS.accentLavender,
                    }}
                  />
                  <ListItemText
                    primary={z.zone_name}
                    primaryTypographyProps={{ fontSize: 13, fontWeight: 500, color: '#FFF' }}
                  />
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography
                    className="mono-num"
                    variant="caption"
                    sx={{
                      color: z.surge_multiplier > 1.3 ? VELOUR_TOKENS.accentTeal : VELOUR_TOKENS.accentLavender,
                      fontWeight: 700,
                      fontSize: 12,
                      display: 'block',
                    }}
                  >
                    {z.surge_multiplier > 1.5 ? 'Surge' : z.surge_multiplier > 1.2 ? 'High' : 'Med'}
                  </Typography>
                  <Typography className="mono-num" variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 11 }}>
                    {z.demand_percentage}
                  </Typography>
                </Box>
              </ListItem>
            ))}
          </List>
        ) : (
          <Box
            sx={{
              p: 2,
              mb: 3,
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
              Demand Zone Classification model (Student B) is not connected. Base map operational.
            </Typography>
          </Box>
        )
      ) : filter === 'Drivers' ? (
        <Box
          sx={{
            p: 2,
            mb: 3,
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
            mb: 3,
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
  );
};
