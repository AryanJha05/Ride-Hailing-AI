import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useNavigate } from 'react-router-dom';
import { PageShell } from '../../components/layout/PageShell';
import { VELOUR_TOKENS } from '../../theme/palette';
import { ROUTES } from '../../routes/routes';
import { APP_ENV } from '../../config/envConfig';

export const Support: React.FC = () => {
  const navigate = useNavigate();

  const faqs = [
    {
      q: 'How does spatial-temporal demand forecasting work?',
      a: 'Ride AI combines spatial clustering and PyTorch LSTM time-series modeling trained on historical NYC taxi & ride-hailing datasets to predict demand intensity 24 hours into the future.',
    },
    {
      q: 'How does trip duration prediction work?',
      a: 'The XGBoost Trip Duration model evaluates origin/destination coordinates, spatial features, passenger counts, and temporal signals to estimate trip duration in minutes and miles.',
    },
    {
      q: 'What data is used by the AI models?',
      a: 'Models are trained on publicly available NYC TLC trip record datasets containing anonymized pickup/drop-off timestamps, zones, trip distances, and fare structures.',
    },
    {
      q: 'How should I interpret demand levels?',
      a: 'Demand levels range from Low (neutral) to Surge (high intensity). High and Surge levels indicate areas with elevated demand relative to historical baselines.',
    },
    {
      q: 'How is demo data generated and managed?',
      a: 'In demo mode, sample shift performance and trip records are calculated from pre-processed validation sets to demonstrate real-time model inference and UX capabilities.',
    },
  ];

  return (
    <PageShell title="Ride AI Support & Help Center">
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#FFF' }}>
              Ride AI Support
            </Typography>
            <Chip
              label={APP_ENV.labels.environmentBadge}
              size="small"
              sx={{
                backgroundColor: 'rgba(234, 179, 8, 0.12)',
                color: VELOUR_TOKENS.accentGold,
                fontSize: 10,
                fontWeight: 700,
              }}
            />
          </Box>
          <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary }}>
            {APP_ENV.labels.supportSubtitle}
          </Typography>
        </Box>

        {/* AI Copilot Help Banner */}
        <Paper
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 3,
            backgroundColor: VELOUR_TOKENS.bgSurface1,
            borderColor: 'rgba(124, 58, 237, 0.3)',
            borderWidth: 1,
            borderStyle: 'solid',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <SmartToyIcon sx={{ color: VELOUR_TOKENS.accentPrimary, fontSize: 32 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFF' }}>
                AI Assistant & Copilot Help
              </Typography>
              <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary }}>
                Ask questions about models, ETA predictions, surge zones, and system setup in real time.
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            onClick={() => navigate(ROUTES.DRIVER.ASSISTANT)}
            startIcon={<SmartToyIcon />}
            sx={{
              backgroundColor: VELOUR_TOKENS.accentPrimary,
              fontWeight: 700,
              px: 3,
              py: 1,
              borderRadius: 2.5,
              '&:hover': { backgroundColor: VELOUR_TOKENS.accentPrimary },
            }}
          >
            Open AI Assistant
          </Button>
        </Paper>

        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFF', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <HelpOutlineIcon sx={{ color: VELOUR_TOKENS.accentTeal, fontSize: 20 }} />
              Platform FAQ & Model Documentation
            </Typography>

            {faqs.map((item, idx) => (
              <Accordion
                key={idx}
                sx={{
                  backgroundColor: VELOUR_TOKENS.bgSurface1,
                  color: '#FFF',
                  borderColor: VELOUR_TOKENS.borderSubtle,
                  mb: 1.5,
                  borderRadius: '10px !important',
                  '&:before': { display: 'none' },
                }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: VELOUR_TOKENS.textSecondary }} />}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{item.q}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary }}>{item.a}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 3, backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle, borderRadius: 3 }}>
              <Box sx={{ textAlign: 'center', mb: 2.5 }}>
                <SupportAgentIcon sx={{ fontSize: 44, color: VELOUR_TOKENS.accentTeal }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFF', mt: 1 }}>
                  Application Support Options
                </Typography>
                <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary, mt: 0.5 }}>
                  Access AI decision support and technical documentation for the demo environment.
                </Typography>
              </Box>

              <Button
                fullWidth
                variant="contained"
                onClick={() => navigate(ROUTES.DRIVER.ASSISTANT)}
                sx={{
                  backgroundColor: VELOUR_TOKENS.accentPrimary,
                  fontWeight: 700,
                  py: 1.2,
                  mb: 1.5,
                  borderRadius: 2,
                  '&:hover': { backgroundColor: VELOUR_TOKENS.accentPrimary },
                }}
              >
                Launch AI Driver Assistant
              </Button>

              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate(ROUTES.DRIVER.SETTINGS)}
                sx={{
                  color: '#FFF',
                  borderColor: VELOUR_TOKENS.borderSubtle,
                  py: 1,
                  borderRadius: 2,
                }}
              >
                Configure Settings & Targets
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </PageShell>
  );
};
