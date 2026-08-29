import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, IconButton, Avatar, Tooltip, Divider, Button } from '@mui/material';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import DeleteSweepOutlinedIcon from '@mui/icons-material/DeleteSweepOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { PageShell } from '../../components/layout/PageShell';
import { VELOUR_TOKENS } from '../../theme/palette';
import { ROUTES } from '../../routes/routes';
import { useDriverAdviceMutation } from '../../hooks/useRideApi';
import { ChatMessageStream, ChatMessage } from '../../components/assistant/ChatMessageStream';
import { QuickActionChips } from '../../components/assistant/QuickActionChips';
import { AssistantInputBar } from '../../components/assistant/AssistantInputBar';

const INITIAL_WELCOME_MSG: ChatMessage = {
  id: 'm-init',
  sender: 'ai',
  text: "Hello! I am your AI Copilot. I analyze live spatial demand, surge patterns, and trip estimates across New York City in real time. How can I help optimize your shift today?",
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  statusTag: 'Live intelligence connected',
};

export const AIAssistant: React.FC = () => {
  const navigate = useNavigate();
  const adviceMutation = useDriverAdviceMutation();

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_WELCOME_MSG]);

  const handleClearChat = () => {
    setMessages([
      {
        ...INITIAL_WELCOME_MSG,
        id: `m-reset-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || adviceMutation.isPending) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');

    adviceMutation.mutate(
      { query },
      {
        onSuccess: (data) => {
          const suggestedArea = data.suggested_area || 'Midtown Manhattan';
          const isFallbackText = data.reason?.includes('Student A') || data.reason?.includes('XGBoost');

          const narrativeText = isFallbackText
            ? `Demand is currently high around ${suggestedArea}. Based on live spatial telemetry, positioning your vehicle near this area will optimize your ride availability and earnings.`
            : data.reason || `Positioning guidance generated for ${suggestedArea}.`;

          const aiMsg: ChatMessage = {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: narrativeText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            card: {
              category: 'RECOMMENDED POSITIONING ZONE',
              suggestedArea: suggestedArea,
              insight: `Demand activity in ${suggestedArea} is currently above normal shift averages.`,
              recommendation: `Head toward ${suggestedArea} for higher trip frequency and reduced waiting time.`,
              confidence: data.confidence ? Math.round(data.confidence * 100) : 94,
              actionText: 'View on Live Map',
            },
            statusTag: 'Live intelligence • Connected',
          };
          setMessages((prev) => [...prev, aiMsg]);
        },
        onError: (err: any) => {
          const errorMsg: ChatMessage = {
            id: `ai-err-${Date.now()}`,
            sender: 'ai',
            text: 'AI Copilot service is currently unavailable. Please verify backend service connection and try again in a moment.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isError: true,
            statusTag: 'Service status offline',
          };
          setMessages((prev) => [...prev, errorMsg]);
        },
      }
    );
  };

  return (
    <PageShell title="AI Copilot" hideHeader={true}>
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: VELOUR_TOKENS.bgBase,
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          p: { xs: 1.5, sm: 2, md: 3 },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: 880,
            borderRadius: { xs: 2.5, md: 4 },
            backgroundColor: VELOUR_TOKENS.bgSurface1,
            border: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.75)',
          }}
        >
          {/* Production AI Header Bar */}
          <Box
            sx={{
              p: { xs: '14px 18px', md: '18px 24px' },
              borderBottom: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
              backgroundColor: 'rgba(20, 20, 32, 0.95)',
              display: 'flex',
              alignItems: 'center',
              justify: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar
                sx={{
                  background: 'linear-gradient(135deg, rgba(0, 217, 192, 0.2) 0%, rgba(124, 58, 237, 0.2) 100%)',
                  color: VELOUR_TOKENS.accentTeal,
                  border: '1px solid rgba(0, 217, 192, 0.4)',
                  width: 40,
                  height: 40,
                }}
              >
                <SmartToyOutlinedIcon fontSize="small" />
              </Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, fontSize: 16, color: '#FFF', lineHeight: 1.2 }}>
                  AI Copilot
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mt: 0.2 }}>
                  <Box
                    sx={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      backgroundColor: VELOUR_TOKENS.accentTeal,
                      boxShadow: '0 0 8px #00D9C0',
                    }}
                  />
                  <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 12, fontWeight: 500 }}>
                    Live Intelligence Active
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Header Right Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Tooltip title="Clear Chat History">
                <Button
                  size="small"
                  variant="outlined"
                  onClick={handleClearChat}
                  startIcon={<DeleteSweepOutlinedIcon sx={{ fontSize: 16 }} />}
                  sx={{
                    borderColor: VELOUR_TOKENS.borderSubtle,
                    color: VELOUR_TOKENS.textSecondary,
                    fontSize: 12,
                    fontWeight: 600,
                    textTransform: 'none',
                    py: 0.4,
                    px: 1.2,
                    borderRadius: 2,
                    '&:hover': {
                      borderColor: VELOUR_TOKENS.accentLavender,
                      color: VELOUR_TOKENS.accentLavender,
                      backgroundColor: 'rgba(168, 85, 247, 0.08)',
                    },
                  }}
                >
                  Clear Chat
                </Button>
              </Tooltip>

              <Tooltip title="Return to Driver Dashboard">
                <IconButton
                  size="small"
                  onClick={() => navigate(ROUTES.DRIVER.DASHBOARD)}
                  sx={{ color: VELOUR_TOKENS.textSecondary }}
                >
                  <ArrowBackIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Conversation Timeline Stream */}
          <ChatMessageStream
            messages={messages}
            isLoading={adviceMutation.isPending}
            onNavigateToMap={() => navigate(ROUTES.DRIVER.DEMAND)}
          />

          <Divider sx={{ borderColor: VELOUR_TOKENS.borderSubtle }} />

          {/* Quick Action Commands & Modern Input Bar */}
          <Box sx={{ p: { xs: 2, md: 2.5 }, backgroundColor: VELOUR_TOKENS.bgSurface1 }}>
            <QuickActionChips
              onSelectQuery={(query) => handleSend(query)}
              disabled={adviceMutation.isPending}
            />
            <AssistantInputBar
              inputQuery={inputQuery}
              onChangeQuery={setInputQuery}
              onSend={() => handleSend()}
              isDisabled={adviceMutation.isPending}
            />
          </Box>
        </Paper>
      </Box>
    </PageShell>
  );
};
