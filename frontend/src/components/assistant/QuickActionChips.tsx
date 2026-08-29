import React from 'react';
import { Box, Chip, Typography } from '@mui/material';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { VELOUR_TOKENS } from '../../theme/palette';

interface QuickActionChipsProps {
  onSelectQuery: (queryText: string) => void;
  disabled?: boolean;
}

export const QuickActionChips: React.FC<QuickActionChipsProps> = ({ onSelectQuery, disabled = false }) => {
  const suggestions = [
    { label: 'Where should I go for high demand?', icon: <ExploreOutlinedIcon sx={{ fontSize: '14px !important' }} /> },
    { label: 'Best surge area right now', icon: <TrendingUpIcon sx={{ fontSize: '14px !important' }} /> },
    { label: 'Check airport demand status', icon: <FlightTakeoffIcon sx={{ fontSize: '14px !important' }} /> },
    { label: "Today's shift earnings summary", icon: <AttachMoneyIcon sx={{ fontSize: '14px !important' }} /> },
    { label: 'Give me positioning advice', icon: <AutoAwesomeIcon sx={{ fontSize: '14px !important' }} /> },
  ];

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 11, fontWeight: 600, display: 'block', mb: 1, letterSpacing: '0.04em' }}>
        SUGGESTED COPILOT COMMANDS
      </Typography>

      <Box
        sx={{
          display: 'flex',
          gap: 1,
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        {suggestions.map((item) => (
          <Chip
            key={item.label}
            icon={item.icon}
            label={item.label}
            onClick={() => !disabled && onSelectQuery(item.label)}
            disabled={disabled}
            sx={{
              backgroundColor: VELOUR_TOKENS.bgSurface2,
              color: VELOUR_TOKENS.textPrimary,
              border: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
              fontSize: 12,
              fontWeight: 500,
              cursor: disabled ? 'default' : 'pointer',
              py: 0.5,
              borderRadius: '12px',
              transition: 'all 0.2s ease',
              '& .MuiChip-icon': {
                color: `${VELOUR_TOKENS.accentTeal} !important`,
              },
              '&:hover': {
                backgroundColor: 'rgba(0, 217, 192, 0.1)',
                borderColor: 'rgba(0, 217, 192, 0.3)',
                color: '#FFF',
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
};
