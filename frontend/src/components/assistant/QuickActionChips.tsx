import React from 'react';
import { Box, Chip } from '@mui/material';
import { VELOUR_TOKENS } from '../../theme/palette';

interface QuickActionChipsProps {
  onSelectQuery: (queryText: string) => void;
}

export const QuickActionChips: React.FC<QuickActionChipsProps> = ({ onSelectQuery }) => {
  const suggestions = [
    'Find nearest EV charger',
    "Today's earnings summary",
    'Airport queue status',
  ];

  return (
    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
      {suggestions.map((chipText) => (
        <Chip
          key={chipText}
          label={chipText}
          onClick={() => onSelectQuery(chipText)}
          sx={{
            backgroundColor: VELOUR_TOKENS.bgSurface2,
            color: VELOUR_TOKENS.textSecondary,
            border: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
            fontSize: 12,
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: VELOUR_TOKENS.bgSurface3,
              color: '#FFF',
            },
          }}
        />
      ))}
    </Box>
  );
};
