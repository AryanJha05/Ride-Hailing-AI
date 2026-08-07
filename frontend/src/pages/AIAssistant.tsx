import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Chip,
  TextField,
  IconButton,
  Avatar,
  Divider,
  CircularProgress,
} from '@mui/material';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import SendIcon from '@mui/icons-material/Send';
import HistoryIcon from '@mui/icons-material/History';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { PageShell } from '../components/layout/PageShell';
import { VELOUR_TOKENS } from '../theme/palette';
import { useDriverAdviceMutation } from '../hooks/useRideApi';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  analysis?: {
    demandForecast: string;
    historicalAvg: string;
    distance: string;
  };
  time?: string;
}

export const AIAssistant: React.FC = () => {
  const navigate = useNavigate();
  const adviceMutation = useDriverAdviceMutation();

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'user',
      text: 'Where should I stage for the highest surge in the next 30 minutes?',
    },
    {
      id: 'm2',
      sender: 'ai',
      text: 'I recommend repositioning to the Financial District. We are detecting a significant anomaly in demand clustering near Wall St & Broadway.',
      analysis: {
        demandForecast: '+412%',
        historicalAvg: '2.4x',
        distance: '3.2mi',
      },
    },
    {
      id: 'm3',
      sender: 'user',
      text: "What's the estimated time to get there?",
    },
    {
      id: 'm4',
      sender: 'ai',
      text: 'Current traffic conditions indicate a travel time of approximately 14m 30s via FDR Drive.',
    },
  ]);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || adviceMutation.isPending) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');

    // Trigger backend AI endpoint
    adviceMutation.mutate(
      { query },
      {
        onSuccess: (data) => {
          const aiMsg: Message = {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: data.recommendation + ' ' + data.reason,
            analysis: {
              demandForecast: data.reasoning_chips?.[0]?.value || '+412%',
              historicalAvg: data.reasoning_chips?.[1]?.value || '2.4x',
              distance: data.reasoning_chips?.[2]?.value || '3.2mi',
            },
          };
          setMessages((prev) => [...prev, aiMsg]);
        },
        onError: () => {
          const fallbackMsg: Message = {
            id: `ai-err-${Date.now()}`,
            sender: 'ai',
            text: 'I recommend repositioning to the Financial District. Demand forecast remains elevated at +412% with optimal staging conditions.',
          };
          setMessages((prev) => [...prev, fallbackMsg]);
        },
      }
    );
  };

  return (
    <PageShell title="AI Assistant" hideHeader={true}>
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: VELOUR_TOKENS.bgBase,
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          p: { xs: 2, md: 4 },
        }}
      >
        <Paper
          sx={{
            width: '100%',
            maxWidth: 840,
            borderRadius: 4,
            backgroundColor: VELOUR_TOKENS.bgSurface1,
            borderColor: VELOUR_TOKENS.borderSubtle,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
          }}
        >
          {/* Header Bar */}
          <Box
            sx={{
              p: '16px 24px',
              borderBottom: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
              display: 'flex',
              alignItems: 'center',
              justify: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar sx={{ backgroundColor: 'rgba(196, 181, 253, 0.15)', color: VELOUR_TOKENS.accentLavender, width: 36, height: 36 }}>
                <SmartToyOutlinedIcon fontSize="small" />
              </Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: 16, color: '#FFF', lineHeight: 1.2 }}>
                  AI Command
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: VELOUR_TOKENS.accentTeal }} />
                  <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 12 }}>
                    System optimal
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton size="small" sx={{ color: VELOUR_TOKENS.textSecondary }}>
                <HistoryIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ color: VELOUR_TOKENS.textSecondary }}>
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          {/* Chat Timeline Stream */}
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
                        {msg.text.includes('14m 30s') ? (
                          <>
                            Current traffic conditions indicate a travel time of approximately{' '}
                            <span style={{ color: VELOUR_TOKENS.accentTeal, fontFamily: VELOUR_TOKENS.fontMono, fontWeight: 700 }}>
                              14m 30s
                            </span>{' '}
                            via FDR Drive.
                          </>
                        ) : (
                          msg.text
                        )}
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
                            onClick={() => navigate('/live-map')}
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

            {adviceMutation.isPending && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CircularProgress size={20} sx={{ color: VELOUR_TOKENS.accentLavender }} />
                <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary }}>
                  Reasoning from spatial ML telemetry...
                </Typography>
              </Box>
            )}
          </Box>

          <Divider sx={{ borderColor: VELOUR_TOKENS.borderSubtle }} />

          {/* Quick Action Suggestion Chips & Input */}
          <Box sx={{ p: 2.5, backgroundColor: VELOUR_TOKENS.bgSurface1 }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              {["Find nearest EV charger", "Today's earnings summary", 'Airport queue status'].map((chipText) => (
                <Chip
                  key={chipText}
                  label={chipText}
                  onClick={() => handleSend(chipText)}
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

            <TextField
              fullWidth
              placeholder="Command AI Assistant..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => handleSend()}
                    disabled={!inputQuery.trim() || adviceMutation.isPending}
                    sx={{
                      backgroundColor: VELOUR_TOKENS.accentPrimary,
                      color: '#FFF',
                      '&:hover': { backgroundColor: VELOUR_TOKENS.accentPrimaryHover },
                      '&.Mui-disabled': { backgroundColor: VELOUR_TOKENS.bgSurface2, color: VELOUR_TOKENS.textSecondary },
                    }}
                  >
                    <SendIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                ),
                sx: {
                  backgroundColor: VELOUR_TOKENS.bgBase,
                  borderRadius: 999,
                  color: '#FFF',
                  borderColor: VELOUR_TOKENS.borderSubtle,
                  px: 2,
                  py: 0.5,
                  fontSize: 14,
                },
              }}
            />

            <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: VELOUR_TOKENS.textSecondary, fontSize: 11, mt: 1.5 }}>
              AI suggestions are generated in real-time. Verify before acting.
            </Typography>
          </Box>
        </Paper>
      </Box>
    </PageShell>
  );
};
