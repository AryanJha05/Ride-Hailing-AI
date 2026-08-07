import React from 'react';
import { Box, Typography } from '@mui/material';
import { VELOUR_TOKENS } from '../../theme/palette';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, action }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 18, color: '#FFF' }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 12 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {action && <Box>{action}</Box>}
    </Box>
  );
};
