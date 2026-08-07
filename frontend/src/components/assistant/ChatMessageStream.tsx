import React from 'react';
import { Box, Paper, Typography, Chip, Avatar, CircularProgress } from '@mui/material';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { VELOUR_TOKENS } from '../../theme/palette';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  analysis?: {
    demandForecast: string;
    historicalAvg: string;
    distance: string;
  };
}

interface ChatMessageStreamProps {
  messages: ChatMessage[];
  isLoading?: boolean;
  onNavigateToMap?: () => void;
}

export const ChatMessageStream: React.FC<ChatMessageStreamProps> = ({
  messages,
  isLoading = false,
  onNavigateToMap,
}) => {
  return (
    <Box
      sx={{
        p: 3,
        maxHeight: 520,
        minHeight: 380,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}
    >
      <Box sx={{ textAlign: 'center', my: 1 }}>
        <Chip
          label="SHIFT START • 18:00"
          size="small"
          sx={{
            backgroundColor: VELOUR_TOKENS.bgSurface2,
            color: VELOUR_TOKENS.textSecondary,
            fontFamily: VELOUR_TOKENS.fontMono,
            fontSize: 11,
            fontWeight: 600,
          }}
        />
      </Box>

      {messages.map((msg) => (
        <Box key={msg.id}>
          {msg.sender === 'user' ? (
            /* User Bubble */
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Box
                sx={{
                  backgroundColor: VELOUR_TOKENS.bgSurface3,
                  p: '12px 20px',
                  borderRadius: '18px 18px 4px 18px',
                  maxWidth: '75%',
                  color: '#FFF',
                  fontSize: 14,
                  lineHeight: 1.5,
                }}
              >
                {msg.text}
              </Box>
            </Box>
          ) : (
            /* AI Briefing Message */
            <Box sx={{ display: 'flex', gap: 2, maxWidth: '90%' }}>
              <Avatar sx={{ backgroundColor: 'rgba(196, 181, 253, 0.12)', color: VELOUR_TOKENS.accentLavender, width: 32, height: 32, mt: 0.5 }}>
                <SmartToyOutlinedIcon sx={{ fontSize: 18 }} />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body1" sx={{ color: '#FFF', fontSize: 15, lineHeight: 1.6 }}>
                  {msg.text}
                </Typography>

                {/* Embedded Real-time Analysis Card */}
                {msg.analysis && (
                  <Paper
                    sx={{
                      mt: 2,
                      p: 2,
                      backgroundColor: 'rgba(28, 26, 36, 0.6)',
                      borderColor: VELOUR_TOKENS.borderSubtle,
                      borderRadius: 2.5,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                      <TrendingUpIcon sx={{ color: VELOUR_TOKENS.accentTeal, fontSize: 16 }} />
                      <Typography variant="caption" sx={{ color: VELOUR_TOKENS.accentTeal, fontWeight: 700, fontSize: 12 }}>
                        Real-time Analysis
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 2 }}>
                      <Chip
                        icon={<TrendingUpIcon sx={{ fontSize: 14, color: `${VELOUR_TOKENS.accentTeal} !important` }} />}
                        label={`Demand Forecast ${msg.analysis.demandForecast}`}
                        size="small"
                        sx={{
                          backgroundColor: VELOUR_TOKENS.bgSurface1,
                          color: VELOUR_TOKENS.accentTeal,
                          border: '1px solid rgba(0, 217, 192, 0.3)',
                          fontFamily: VELOUR_TOKENS.fontMono,
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      />
                      <Chip
                        icon={<AccessTimeIcon sx={{ fontSize: 14, color: `${VELOUR_TOKENS.textSecondary} !important` }} />}
                        label={`Historical Avg ${msg.analysis.historicalAvg}`}
                        size="small"
                        sx={{
                          backgroundColor: VELOUR_TOKENS.bgSurface1,
                          color: VELOUR_TOKENS.textPrimary,
                          border: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
                          fontFamily: VELOUR_TOKENS.fontMono,
                          fontSize: 12,
                        }}
                      />
                      <Chip
                        icon={<AltRouteIcon sx={{ fontSize: 14, color: `${VELOUR_TOKENS.textSecondary} !important` }} />}
                        label={`Distance ${msg.analysis.distance}`}
                        size="small"
                        sx={{
                          backgroundColor: VELOUR_TOKENS.bgSurface1,
                          color: VELOUR_TOKENS.textPrimary,
                          border: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
                          fontFamily: VELOUR_TOKENS.fontMono,
                          fontSize: 12,
                        }}
                      />
                    </Box>

                    <Typography
                      variant="caption"
                      onClick={onNavigateToMap}
                      sx={{
                        color: VELOUR_TOKENS.accentLavender,
                        fontWeight: 600,
                        fontSize: 12,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.5,
                        '&:hover': { textDecoration: 'underline' },
                      }}
                    >
                      View Route on Map <ArrowForwardIcon sx={{ fontSize: 14 }} />
                    </Typography>
                  </Paper>
                )}
              </Box>
            </Box>
          )}
        </Box>
      ))}

      {isLoading && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <CircularProgress size={20} sx={{ color: VELOUR_TOKENS.accentLavender }} />
          <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary }}>
            Reasoning from spatial ML telemetry...
          </Typography>
        </Box>
      )}
    </Box>
  );
};
