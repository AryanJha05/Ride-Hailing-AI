import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, IconButton, Avatar, Divider } from '@mui/material';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import HistoryIcon from '@mui/icons-material/History';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { PageShell } from '../../components/layout/PageShell';
import { VELOUR_TOKENS } from '../../theme/palette';
import { ROUTES } from '../../routes/routes';
import { useDriverAdviceMutation } from '../../hooks/useRideApi';
import { ChatMessageStream, ChatMessage } from '../../components/assistant/ChatMessageStream';
import { QuickActionChips } from '../../components/assistant/QuickActionChips';
import { AssistantInputBar } from '../../components/assistant/AssistantInputBar';

export const AIAssistant: React.FC = () => {
  const navigate = useNavigate();
  const adviceMutation = useDriverAdviceMutation();

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-init',
      sender: 'ai',
      text: "Hello! I am your AI Dispatch Assistant. Ask me for real-time dispatch advice, pickup optimization, or surge queries.",
    },
  ]);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || adviceMutation.isPending) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');

    adviceMutation.mutate(
      { query },
      {
        onSuccess: (data) => {
          const aiMsg: ChatMessage = {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: (data.recommendation ? `${data.recommendation} ` : '') + (data.reason || ''),
            analysis: data.reasoning_chips?.[0] ? {
              demandForecast: data.reasoning_chips[0]?.value,
              historicalAvg: data.reasoning_chips[1]?.value,
              distance: data.reasoning_chips[2]?.value,
            } : undefined,
          };
          setMessages((prev) => [...prev, aiMsg]);
        },
        onError: () => {
          const errorMsg: ChatMessage = {
            id: `ai-err-${Date.now()}`,
            sender: 'ai',
            text: 'AI Dispatch Assistant service unavailable. Please verify backend microservice connectivity.',
          };
          setMessages((prev) => [...prev, errorMsg]);
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
          <ChatMessageStream
            messages={messages}
            isLoading={adviceMutation.isPending}
            onNavigateToMap={() => navigate(ROUTES.USER.LIVE_MAP)}
          />

          <Divider sx={{ borderColor: VELOUR_TOKENS.borderSubtle }} />

          {/* Quick Action Suggestion Chips & Input */}
          <Box sx={{ p: 2.5, backgroundColor: VELOUR_TOKENS.bgSurface1 }}>
            <QuickActionChips onSelectQuery={(query) => handleSend(query)} />
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
