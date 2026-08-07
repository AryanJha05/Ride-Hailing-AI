import React from 'react';
import { Chip, ChipProps } from '@mui/material';
import { VELOUR_TOKENS } from '../../theme/palette';

interface DemandChipProps extends Omit<ChipProps, 'color'> {
  variantType?: 'surge' | 'demand' | 'neutral';
}

export const DemandChip: React.FC<DemandChipProps> = ({
  label,
  variantType = 'neutral',
  sx,
  ...props
}) => {
  let bgColor = VELOUR_TOKENS.bgSurface2;
  let textColor = VELOUR_TOKENS.textSecondary;
  let borderColor = VELOUR_TOKENS.borderSubtle;

  if (variantType === 'surge') {
    bgColor = 'rgba(0, 217, 192, 0.12)';
    textColor = VELOUR_TOKENS.accentTeal;
    borderColor = 'rgba(0, 217, 192, 0.3)';
  } else if (variantType === 'demand') {
    bgColor = 'rgba(196, 181, 253, 0.12)';
    textColor = VELOUR_TOKENS.accentLavender;
    borderColor = 'rgba(196, 181, 253, 0.3)';
  }

  return (
    <Chip
      label={label}
      size="small"
      sx={{
        backgroundColor: bgColor,
        color: textColor,
        border: `1px solid ${borderColor}`,
        fontFamily: VELOUR_TOKENS.fontMono,
        fontSize: 12,
        fontWeight: 600,
        ...sx,
      }}
      {...props}
    />
  );
};
