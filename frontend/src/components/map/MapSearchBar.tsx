import React from 'react';
import { Box, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { VELOUR_TOKENS } from '../../theme/palette';

export const MapSearchBar: React.FC = () => {
  return (
    <Box sx={{ position: 'absolute', top: 24, right: 24, zIndex: 1000, width: 320 }}>
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
  );
};
