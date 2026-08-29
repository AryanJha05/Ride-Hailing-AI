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
  Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import BuildIcon from '@mui/icons-material/Build';
import { useNavigate } from 'react-router-dom';
import { PageShell } from '../../components/layout/PageShell';
import { VELOUR_TOKENS } from '../../theme/palette';
import { ROUTES } from '../../routes/routes';

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
      q: 'How do I request a fare adjustment or review a completed trip log?',
      a: 'Navigate to Driver Earnings, select the specific trip record from your shift log, and submit a review request. The dispatch system recalculates fare estimates based on actual GPS logs.',
    },
    {
      q: 'What should I do if the Live Map or location services experience delay?',
      a: 'Ensure your browser location permission is set to High Accuracy. You can refresh map tiles anytime using the map reset control in the top-right corner of the Live Demand page.',
    },
    {
      q: 'How is driver identity and vehicle registration updated?',
      a: 'Go to Settings > Account & Vehicle Information to update your full name, phone number, and TLC license plate. Changes synchronize instantly across your profile and header.',
    },
    {
      q: 'How are surge multipliers calculated for driver positioning?',
      a: 'Surge multipliers are generated dynamically by comparing predicted zonal demand against current active driver density in real time.',
    },
  ];

  return (
    <PageShell title="Ride AI Support & Operational Mobility Center">
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#FFF' }}>
              Ride AI Operations Support
            </Typography>
            <Chip
              label="24/7 Active Operations"
              size="small"
              sx={{
                backgroundColor: 'rgba(0, 217, 192, 0.12)',
                color: VELOUR_TOKENS.accentTeal,
                fontSize: 10,
                fontWeight: 700,
                borderColor: 'rgba(0, 217, 192, 0.3)',
                borderWidth: 1,
                borderStyle: 'solid',
              }}
            />
          </Box>
          <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary }}>
            Driver assistance, copilot support, vehicle maintenance, and emergency roadside dispatch.
          </Typography>
        </Box>

        {/* Emergency Assistance Banner */}
        <Paper
          sx={{
            p: 2.5,
            mb: 3.5,
            borderRadius: 3,
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            borderColor: 'rgba(239, 68, 68, 0.3)',
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
            <LocalHospitalIcon sx={{ color: '#F87171', fontSize: 30 }} />
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#FFF' }}>
                Emergency Driver Assistance & Safety Ops
              </Typography>
              <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 13 }}>
                If you encounter a vehicle collision, emergency incident, or safety issue during shift, contact NYC Dispatch Safety.
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            startIcon={<PhoneInTalkIcon />}
            sx={{
              backgroundColor: '#EF4444',
              color: '#FFF',
              fontWeight: 700,
              textTransform: 'none',
              px: 2.5,
              py: 1,
              borderRadius: 2.5,
              '&:hover': { backgroundColor: '#DC2626' },
            }}
          >
            Call +1 (800) 555-RIDE
          </Button>
        </Paper>

        {/* AI Copilot Banner */}
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
                AI Driver Copilot & Assistant
              </Typography>
              <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary }}>
                Real-time recommendations for demand zones, surge multipliers, and route optimization.
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
              '&:hover': { backgroundColor: VELOUR_TOKENS.accentPrimaryHover },
            }}
          >
            Open AI Copilot
          </Button>
        </Paper>

        <Grid container spacing={3}>
          {/* FAQ Accordions */}
          <Grid item xs={12} md={7}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFF', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <HelpOutlineIcon sx={{ color: VELOUR_TOKENS.accentTeal, fontSize: 20 }} />
              Driver Knowledge Base & Intelligence FAQ
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
                  <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary, lineHeight: 1.6 }}>{item.a}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Grid>

          {/* Quick Action Options */}
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 3, backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle, borderRadius: 3 }}>
              <Box sx={{ textAlign: 'center', mb: 2.5 }}>
                <SupportAgentIcon sx={{ fontSize: 44, color: VELOUR_TOKENS.accentTeal }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFF', mt: 1 }}>
                  Support Quick Actions
                </Typography>
                <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary, mt: 0.5 }}>
                  Access instant AI guidance, update shift settings, or review platform documentation.
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => navigate(ROUTES.DRIVER.ASSISTANT)}
                  startIcon={<SmartToyIcon />}
                  sx={{
                    backgroundColor: VELOUR_TOKENS.accentPrimary,
                    fontWeight: 700,
                    py: 1.2,
                    borderRadius: 2,
                    '&:hover': { backgroundColor: VELOUR_TOKENS.accentPrimaryHover },
                  }}
                >
                  Ask AI Copilot
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate(ROUTES.DRIVER.SETTINGS)}
                  startIcon={<BuildIcon />}
                  sx={{
                    color: '#FFF',
                    borderColor: VELOUR_TOKENS.borderSubtle,
                    py: 1.2,
                    borderRadius: 2,
                    fontWeight: 600,
                    '&:hover': { borderColor: VELOUR_TOKENS.accentLavender, color: VELOUR_TOKENS.accentLavender },
                  }}
                >
                  Configure Account & Vehicle
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </PageShell>
  );
};
