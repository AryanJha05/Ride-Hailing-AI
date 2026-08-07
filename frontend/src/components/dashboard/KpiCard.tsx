import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { VELOUR_TOKENS } from '../../theme/palette';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  change?: string;
  isPositive?: boolean;
  accentColor?: string;
  icon?: React.ReactNode;
  variant?: 'sparkline' | 'bars' | 'stars' | 'tripsBars';
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtext,
  change,
  isPositive = true,
  accentColor = VELOUR_TOKENS.accentTeal,
  icon,
  variant = 'sparkline',
}) => {
  return (
    <Card sx={{ height: '100%', backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle, borderRadius: 3 }}>
      <CardContent sx={{ p: 2.2, '&:last-child': { pb: 2.2 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {icon && <Box sx={{ color: accentColor, display: 'flex' }}>{icon}</Box>}
            <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, letterSpacing: '0.06em', fontWeight: 700, fontSize: 11 }}>
              {title}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <Box>
            <Typography className="mono-num" variant="h4" sx={{ fontWeight: 700, color: '#FFF', fontSize: 26, lineHeight: 1.1 }}>
              {value}
            </Typography>

            <Typography
              className="mono-num"
              variant="caption"
              sx={{
                color: isPositive ? VELOUR_TOKENS.accentTeal : VELOUR_TOKENS.accentPrimary,
                fontWeight: 600,
                fontSize: 11.5,
                mt: 0.5,
                display: 'block',
              }}
            >
              {change || subtext}
            </Typography>
          </Box>

          {/* Mini Visualizer Graphics */}
          <Box sx={{ pb: 0.5 }}>
            {variant === 'sparkline' && (
              <svg width="68" height="28" viewBox="0 0 68 28">
                <path
                  d="M0 24 Q 15 18, 25 20 T 45 10 T 68 4"
                  fill="none"
                  stroke={VELOUR_TOKENS.accentPrimary}
                  strokeWidth="2.5"
                />
                <path
                  d="M0 24 Q 15 18, 25 20 T 45 10 T 68 4 L 68 28 L 0 28 Z"
                  fill="url(#sparklineGrad)"
                  opacity="0.3"
                />
                <defs>
                  <linearGradient id="sparklineGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={VELOUR_TOKENS.accentPrimary} />
                    <stop offset="100%" stopColor={VELOUR_TOKENS.accentPrimary} stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            )}

            {variant === 'bars' && (
              <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: 28 }}>
                {[12, 18, 14, 22, 28, 24, 30].map((h, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      width: 4,
                      height: h,
                      borderRadius: 1,
                      backgroundColor: idx >= 4 ? VELOUR_TOKENS.accentTeal : 'rgba(0, 217, 192, 0.3)',
                    }}
                  />
                ))}
              </Box>
            )}

            {variant === 'stars' && (
              <Box sx={{ display: 'flex', gap: '2px', color: VELOUR_TOKENS.accentGold }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <StarIcon key={s} sx={{ fontSize: 16 }} />
                ))}
              </Box>
            )}

            {variant === 'tripsBars' && (
              <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: 28 }}>
                {[10, 16, 22, 14, 26, 30, 24].map((h, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      width: 4,
                      height: h,
                      borderRadius: 1,
                      backgroundColor: idx >= 4 ? VELOUR_TOKENS.accentPrimary : 'rgba(124, 58, 237, 0.3)',
                    }}
                  />
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
