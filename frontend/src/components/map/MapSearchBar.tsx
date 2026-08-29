import React, { useState } from 'react';
import { Box, TextField, InputAdornment, Autocomplete, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { VELOUR_TOKENS } from '../../theme/palette';

export interface LocationOption {
  label: string;
  lat: number;
  lng: number;
}

export const NYC_LOCATIONS: LocationOption[] = [
  { label: 'Midtown Manhattan Core', lat: 40.7549, lng: -73.9840 },
  { label: 'JFK International Airport (JFK)', lat: 40.6413, lng: -73.7781 },
  { label: 'Williamsburg, Brooklyn', lat: 40.7081, lng: -73.9571 },
  { label: 'Financial District (FiDi)', lat: 40.7075, lng: -74.0090 },
  { label: 'LaGuardia Airport (LGA)', lat: 40.7769, lng: -73.8740 },
  { label: 'Downtown Brooklyn', lat: 40.6925, lng: -73.9875 },
];

interface MapSearchBarProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onSelectLocation?: (location: LocationOption) => void;
}

export const MapSearchBar: React.FC<MapSearchBarProps> = ({
  searchQuery = '',
  onSearchChange,
  onSelectLocation,
}) => {
  return (
    <Box sx={{ position: 'absolute', top: 24, right: 24, zIndex: 1000, width: 320 }}>
      <Autocomplete
        options={NYC_LOCATIONS}
        getOptionLabel={(option) => typeof option === 'string' ? option : option.label}
        onChange={(_, newValue) => {
          if (newValue && typeof newValue !== 'string') {
            if (onSelectLocation) onSelectLocation(newValue);
            if (onSearchChange) onSearchChange(newValue.label);
          }
        }}
        onInputChange={(_, newInputValue) => {
          if (onSearchChange) onSearchChange(newInputValue);
        }}
        inputValue={searchQuery}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Search Midtown, JFK, Williamsburg..."
            size="small"
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: VELOUR_TOKENS.accentTeal, fontSize: 18 }} />
                </InputAdornment>
              ),
              sx: {
                backgroundColor: 'rgba(19, 18, 23, 0.94)',
                backdropFilter: 'blur(16px)',
                borderRadius: 999,
                color: '#FFF',
                borderColor: VELOUR_TOKENS.borderSubtle,
                fontSize: 13,
                '& fieldset': { borderColor: VELOUR_TOKENS.borderSubtle },
                '&:hover fieldset': { borderColor: VELOUR_TOKENS.accentTeal },
              },
            }}
          />
        )}
        PaperComponent={({ children }) => (
          <Paper
            sx={{
              backgroundColor: 'rgba(19, 18, 23, 0.96)',
              backdropFilter: 'blur(16px)',
              border: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
              color: '#FFF',
              borderRadius: 2,
              mt: 1,
            }}
          >
            {children}
          </Paper>
        )}
        renderOption={(props, option) => (
          <Box component="li" {...props} key={option.label} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1, px: 2, fontSize: 13, color: '#FFF', '&:hover': { backgroundColor: 'rgba(0, 217, 192, 0.1)' } }}>
            <LocationOnIcon sx={{ color: VELOUR_TOKENS.accentTeal, fontSize: 16 }} />
            {option.label}
          </Box>
        )}
      />
    </Box>
  );
};
