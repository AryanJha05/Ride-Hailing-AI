import React, { useEffect, useRef } from 'react';
import { Box, Paper, Typography, Chip, Avatar, Button, CircularProgress, Tooltip } from '@mui/material';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MapIcon from '@mui/icons-material/Map';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import PersonIcon from '@mui/icons-material/Person';
import { VELOUR_TOKENS } from '../../theme/palette';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp?: string;
  card?: {
    category?: string;
    suggestedArea?: string;
    insight?: string;
    recommendation?: string;
    confidence?: number;
    actionText?: string;
  };
  statusTag?: string;
  isError?: boolean;
}

interface ChatMessageStreamProps {
  messages: ChatMessage[];
  isLoading?: boolean;
  onNavigateToMap?: () => void;
  onRetry?: () => void;
  onSelectQuery?: (query: string) => void;
}

export const ChatMessageStream: React.FC<ChatMessageStreamProps> = ({
  messages,
  isLoading = false,
  onNavigateToMap,
  onRetry,
  onSelectQuery,
}) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: VELOUR_TOKENS.bgBase,
        scrollBehavior: 'smooth',
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(255, 255, 255, 0.15)',
          borderRadius: '3px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: 'rgba(255, 255, 255, 0.3)',
        },
      }}
    >
      <Box
        sx={{
          maxWidth: 960,
          mx: 'auto',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5,
        }}
      >
      {/* Shift Context Badge */}
      <Box sx={{ textAlign: 'center', my: 0.5 }}>
        <Chip
          icon={<CheckCircleOutlineIcon sx={{ fontSize: '13px !important', color: `${VELOUR_TOKENS.accentTeal} !important` }} />}
          label="LIVE DRIVER COPILOT • REAL-TIME INTELLIGENCE ACTIVE"
          size="small"
          sx={{
            backgroundColor: 'rgba(0, 217, 192, 0.08)',
            color: VELOUR_TOKENS.accentTeal,
            border: '1px solid rgba(0, 217, 192, 0.2)',
            fontFamily: VELOUR_TOKENS.fontMono,
            fontSize: 10.5,
            fontWeight: 700,
            letterSpacing: '0.06em',
            py: 0.2,
            px: 0.5,
          }}
        />
      </Box>

      {messages.map((msg) => (
        <Box key={msg.id}>
          {msg.sender === 'user' ? (
            /* User Chat Bubble */
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', gap: 1 }}>
              <Box
                sx={{
                  background: `linear-gradient(135deg, ${VELOUR_TOKENS.accentPrimary} 0%, #6D28D9 100%)`,
                  p: '12px 18px',
                  borderRadius: '20px 20px 4px 20px',
                  maxWidth: { xs: '85%', md: '72%' },
                  color: '#FFF',
                  fontSize: 14.5,
                  lineHeight: 1.5,
                  fontWeight: 500,
                  boxShadow: '0 4px 14px rgba(124, 58, 237, 0.25)',
                }}
              >
                {msg.text}
              </Box>
              <Avatar
                sx={{
                  width: 28,
                  height: 28,
                  backgroundColor: VELOUR_TOKENS.bgSurface3,
                  color: VELOUR_TOKENS.textSecondary,
                  fontSize: 14,
                }}
              >
                <PersonIcon sx={{ fontSize: 16 }} />
              </Avatar>
            </Box>
          ) : (
            /* AI Copilot Response Card */
            <Box sx={{ display: 'flex', gap: 1.5, maxWidth: { xs: '100%', md: '90%' }, alignItems: 'flex-start' }}>
              <Avatar
                sx={{
                  background: msg.isError
                    ? 'rgba(239, 68, 68, 0.2)'
                    : `linear-gradient(135deg, rgba(0, 217, 192, 0.2) 0%, rgba(124, 58, 237, 0.2) 100%)`,
                  color: msg.isError ? '#EF4444' : VELOUR_TOKENS.accentTeal,
                  border: `1px solid ${msg.isError ? 'rgba(239, 68, 68, 0.4)' : 'rgba(0, 217, 192, 0.4)'}`,
                  width: 36,
                  height: 36,
                  mt: 0.2,
                }}
              >
                <SmartToyOutlinedIcon sx={{ fontSize: 20 }} />
              </Avatar>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                {/* Main AI Speech / Narrative */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: '4px 20px 20px 20px',
                    backgroundColor: msg.isError ? 'rgba(239, 68, 68, 0.08)' : VELOUR_TOKENS.bgSurface1,
                    border: `1px solid ${msg.isError ? 'rgba(239, 68, 68, 0.3)' : VELOUR_TOKENS.borderSubtle}`,
                    color: '#FFF',
                  }}
                >
                  {msg.isError && (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, color: '#EF4444' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ErrorOutlineIcon fontSize="small" />
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: 13 }}>
                          AI Copilot unavailable
                        </Typography>
                      </Box>
                      {onRetry && (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={onRetry}
                          sx={{
                            borderColor: 'rgba(239, 68, 68, 0.4)',
                            color: '#EF4444',
                            fontSize: 11,
                            fontWeight: 700,
                            py: 0.2,
                            px: 1,
                            borderRadius: 1.5,
                            textTransform: 'none',
                            '&:hover': {
                              backgroundColor: 'rgba(239, 68, 68, 0.15)',
                              borderColor: '#EF4444',
                            },
                          }}
                        >
                          Retry
                        </Button>
                      )}
                    </Box>
                  )}

                  <Typography
                    variant="body1"
                    sx={{
                      color: msg.isError ? '#FCA5A5' : '#ECECF1',
                      fontSize: 14.5,
                      lineHeight: 1.6,
                      fontWeight: 400,
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {msg.text}
                  </Typography>

                  {/* Recommendation Card */}
                  {msg.card && (
                    <Box
                      sx={{
                        mt: 2,
                        p: 2.2,
                        borderRadius: 3,
                        backgroundColor: 'rgba(20, 20, 32, 0.85)',
                        border: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1.5,
                      }}
                    >
                      {/* Top Category Badge & Confidence */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                        <Chip
                          icon={<TrendingUpIcon sx={{ fontSize: '13px !important', color: `${VELOUR_TOKENS.accentTeal} !important` }} />}
                          label={msg.card.category || 'RECOMMENDED POSITIONING'}
                          size="small"
                          sx={{
                            backgroundColor: 'rgba(0, 217, 192, 0.1)',
                            color: VELOUR_TOKENS.accentTeal,
                            fontWeight: 700,
                            fontSize: 10.5,
                            letterSpacing: '0.04em',
                            height: 22,
                          }}
                        />
                        {msg.card.confidence && (
                          <Typography className="mono-num" variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 11 }}>
                            ● {msg.card.confidence}% Confidence
                          </Typography>
                        )}
                      </Box>

                      {/* Area Header */}
                      {msg.card.suggestedArea && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocationOnIcon sx={{ color: VELOUR_TOKENS.accentGold, fontSize: 22 }} />
                          <Typography variant="h6" sx={{ fontWeight: 800, color: '#FFF', fontSize: 16 }}>
                            {msg.card.suggestedArea}
                          </Typography>
                        </Box>
                      )}

                      {/* Insight & Recommendation Content */}
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {msg.card.insight && (
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                            <LightbulbOutlinedIcon sx={{ color: VELOUR_TOKENS.accentTeal, fontSize: 16, mt: 0.3 }} />
                            <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 13, lineHeight: 1.45 }}>
                              <strong style={{ color: '#FFF' }}>Insight:</strong> {msg.card.insight}
                            </Typography>
                          </Box>
                        )}

                        {msg.card.recommendation && (
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                            <CheckCircleOutlineIcon sx={{ color: VELOUR_TOKENS.accentLavender, fontSize: 16, mt: 0.3 }} />
                            <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 13, lineHeight: 1.45 }}>
                              <strong style={{ color: '#FFF' }}>Recommendation:</strong> {msg.card.recommendation}
                            </Typography>
                          </Box>
                        )}
                      </Box>

                      {/* Action Bar */}
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, pt: 0.5 }}>
                        {onSelectQuery && (
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => onSelectQuery("Why is this area recommended?")}
                            sx={{
                              borderColor: VELOUR_TOKENS.borderSubtle,
                              color: VELOUR_TOKENS.textSecondary,
                              fontWeight: 600,
                              fontSize: 12,
                              px: 1.5,
                              py: 0.6,
                              borderRadius: 2,
                              textTransform: 'none',
                              '&:hover': {
                                borderColor: VELOUR_TOKENS.accentLavender,
                                color: '#FFF',
                              },
                            }}
                          >
                            Explain Why
                          </Button>
                        )}
                        <Button
                          variant="contained"
                          size="small"
                          onClick={onNavigateToMap}
                          startIcon={<MapIcon sx={{ fontSize: 16 }} />}
                          sx={{
                            backgroundColor: VELOUR_TOKENS.accentPrimary,
                            color: '#FFF',
                            fontWeight: 700,
                            fontSize: 12,
                            px: 2,
                            py: 0.6,
                            borderRadius: 2,
                            textTransform: 'none',
                            boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)',
                            '&:hover': {
                              backgroundColor: VELOUR_TOKENS.accentPrimaryHover,
                            },
                          }}
                        >
                          {msg.card.actionText || 'View on Live Map'}
                        </Button>
                      </Box>
                    </Box>
                  )}

                  {/* Subtle Status Footer */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1.2, pt: 0.8, borderTop: `1px solid rgba(255,255,255,0.05)` }}>
                    <Typography variant="caption" sx={{ color: msg.isError ? '#FCA5A5' : VELOUR_TOKENS.textSecondary, fontSize: 11, display: 'flex', alignItems: 'center', gap: 0.6 }}>
                      <span style={{ color: msg.isError ? '#EF4444' : VELOUR_TOKENS.accentTeal }}>●</span> {msg.statusTag || (msg.isError ? 'Service status offline' : 'Live intelligence connected')}
                    </Typography>
                    {msg.timestamp && (
                      <Typography className="mono-num" variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 10.5 }}>
                        {msg.timestamp}
                      </Typography>
                    )}
                  </Box>
                </Paper>
              </Box>
            </Box>
          )}
        </Box>
      ))}

      {/* Loading Skeleton Pulse */}
      {isLoading && (
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <Avatar
            sx={{
              backgroundColor: 'rgba(0, 217, 192, 0.1)',
              color: VELOUR_TOKENS.accentTeal,
              width: 32,
              height: 32,
            }}
          >
            <SmartToyOutlinedIcon sx={{ fontSize: 18 }} />
          </Avatar>
          <Paper
            elevation={0}
            sx={{
              p: '12px 18px',
              borderRadius: '4px 18px 18px 18px',
              backgroundColor: VELOUR_TOKENS.bgSurface1,
              border: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <CircularProgress size={16} sx={{ color: VELOUR_TOKENS.accentTeal }} />
            <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 12.5, fontWeight: 500 }}>
              Ride AI is analyzing your current shift...
            </Typography>
          </Paper>
        </Box>
      )}

      <div ref={bottomRef} />
      </Box>
    </Box>
  );
};
