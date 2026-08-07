import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { VELOUR_TOKENS } from '../../theme/palette';

interface KpiCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  accentColor?: string;
  icon?: React.ReactNode;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  accentColor = VELOUR_TOKENS.accentTeal,
  icon,
}) => {
  return (
    <Card sx={{ height: '100%', backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, letterSpacing: '0.04em', fontWeight: 600 }}>
            {title}
          </Typography>
          {icon && <Box sx={{ color: accentColor }}>{icon}</Box>}
        </Box>
        <Typography className="mono-num" variant="h4" sx={{ fontWeight: 700, color: '#FFF', mb: 0.5, fontSize: 28 }}>
          {value}
        </Typography>
        {change && (
          <Typography
            className="mono-num"
            variant="caption"
            sx={{
              color: isPositive ? VELOUR_TOKENS.accentTeal : VELOUR_TOKENS.accentPrimary,
              fontWeight: 600,
              fontSize: 12,
            }}
          >
            {change}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};
