import React, { useState } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import BuildIcon from '@mui/icons-material/Build';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import InfoIcon from '@mui/icons-material/Info';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from 'react-router-dom';
import { PageShell } from '../../components/layout/PageShell';
import { VELOUR_TOKENS } from '../../theme/palette';
import { ROUTES } from '../../routes/routes';

export const Support: React.FC = () => {
  const navigate = useNavigate();
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [ticketCategory, setTicketCategory] = useState('technical');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  const faqs = [
    {
      q: 'How does spatial-temporal demand forecasting work?',
      a: 'Ride AI uses a 2-layer PyTorch LSTM Neural Network trained on historical NYC ride-hailing datasets. It generates 24-hour rolling demand forecasts across urban micro-zones by analyzing time-series sequences.',
    },
    {
      q: 'How are trip duration predictions generated?',
      a: 'Our XGBoost Regressor V3 inference engine evaluates pickup/drop-off coordinates, 44 spatial features, distance metrics, and temporal factors to predict trip duration in minutes and miles.',
    },
    {
      q: 'What does a high-demand surge zone mean for drivers?',
      a: 'High-demand zones indicate areas where forecasted ride requests significantly exceed active driver density. Positioning near these clusters increases your likelihood of immediate trip assignments and surge earnings.',
    },
    {
      q: 'How does AI positioning work in the Driver Assistant?',
      a: 'The AI Assistant combines spatial cluster centers from our HDBSCAN model with live dispatch metrics to recommend high-yield street intersections and pickup hubs.',
    },
    {
      q: 'What happens if internet connectivity is temporarily lost?',
      a: 'The Ride AI driver dashboard caches recent demand maps and offline telemetry locally. Once reconnecting, offline shift data automatically syncs with the dispatch backend.',
    },
    {
      q: 'How are estimated shift earnings calculated?',
      a: 'Shift earnings combine base distance fares, duration rates estimated by the XGBoost V3 model, zonal surge multipliers, and driver tips. Historical logs are stored in your Driver Earnings page.',
    },
    {
      q: 'How do I update driver preferences and navigation settings?',
      a: 'Navigate to Settings > Driver Preferences to select your preferred navigation provider (Google Maps, Waze, etc.), turn-by-turn prompts, and daily earnings target goals.',
    },
  ];

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTicketSubmitted(true);
    setTimeout(() => {
      setTicketSubmitted(false);
      setTicketModalOpen(false);
      setTicketSubject('');
      setTicketDescription('');
    }, 2500);
  };

  return (
    <PageShell title="Ride AI Driver Support & Operations Center">
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#FFF', mb: 0.5 }}>
              Driver Support & Intelligence Helpdesk
            </Typography>
            <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary }}>
              Comprehensive assistance for ML demand models, trip predictions, shift troubleshooting, and ticket resolution.
            </Typography>
          </Box>
          <Chip
            icon={<SupportAgentIcon sx={{ fontSize: '14px !important', color: `${VELOUR_TOKENS.accentTeal} !important` }} />}
            label="24/7 Operations Support"
            size="small"
            sx={{
              backgroundColor: 'rgba(0, 217, 192, 0.12)',
              color: VELOUR_TOKENS.accentTeal,
              fontSize: 11,
              fontWeight: 700,
              borderColor: 'rgba(0, 217, 192, 0.3)',
              borderWidth: 1,
              borderStyle: 'solid',
            }}
          />
        </Box>

        {/* Emergency Assistance Banner with Honest Demo Disclaimer */}
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
            <LocalHospitalIcon sx={{ color: '#F87171', fontSize: 32 }} />
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#FFF' }}>
                  Emergency Driver Safety Operations
                </Typography>
                <Chip
                  label="DEMO SIMULATED CAPABILITY"
                  size="small"
                  sx={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#F87171', fontSize: 10, fontWeight: 700 }}
                />
              </Box>
              <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 13 }}>
                Demonstration roadside dispatch for vehicle incidents. In actual emergencies, drivers should always contact official municipal emergency services (911).
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            startIcon={<PhoneInTalkIcon />}
            onClick={() => alert("Demo Mode: Emergency hotline simulation triggered (+1 800-555-RIDE).")}
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
            Simulate Safety Dispatch
          </Button>
        </Paper>

        {/* AI Copilot Quick Access Banner */}
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
            <SmartToyIcon sx={{ color: VELOUR_TOKENS.accentPrimary, fontSize: 34 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFF' }}>
                Ask AI Driver Copilot (Instant Support)
              </Typography>
              <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary }}>
                Get instant AI answers about demand forecasts, trip duration models, surge areas, or app features.
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
            Launch AI Assistant
          </Button>
        </Paper>

        <Grid container spacing={3}>
          {/* Driver Knowledge Base FAQ Accordions */}
          <Grid item xs={12} md={7}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFF', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <HelpOutlineIcon sx={{ color: VELOUR_TOKENS.accentTeal, fontSize: 22 }} />
              Driver Knowledge Base & Platform FAQ
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
                <AccordionDetails sx={{ pt: 0 }}>
                  <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary, lineHeight: 1.6 }}>{item.a}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Grid>

          {/* Support Ticket & Quick Action Panel */}
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 3, backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle, borderRadius: 3, mb: 3 }}>
              <Box sx={{ textAlign: 'center', mb: 2.5 }}>
                <SupportAgentIcon sx={{ fontSize: 44, color: VELOUR_TOKENS.accentTeal }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFF', mt: 1 }}>
                  Submit Support Ticket
                </Typography>
                <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary, mt: 0.5 }}>
                  Need help with an issue, fare discrepancy, or technical question? Submit a ticket to fleet operations.
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => setTicketModalOpen(true)}
                  startIcon={<ConfirmationNumberIcon />}
                  sx={{
                    backgroundColor: VELOUR_TOKENS.accentTeal,
                    color: '#000',
                    fontWeight: 700,
                    py: 1.2,
                    borderRadius: 2,
                    '&:hover': { backgroundColor: '#00BFA5' },
                  }}
                >
                  Create Support Ticket
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
                  Manage Account & Vehicle Settings
                </Button>
              </Box>
            </Paper>

            <Paper sx={{ p: 2.5, backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle, borderRadius: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <InfoIcon sx={{ color: VELOUR_TOKENS.accentGold, fontSize: 20 }} />
                <Typography variant="subtitle2" sx={{ color: '#FFF', fontWeight: 700 }}>
                  Demo Environment Note
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, lineHeight: 1.5, display: 'block' }}>
                This support hub provides realistic guidance for the Ride AI prototype platform. All ticket submissions are processed in demo mode for evaluation purposes.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Support Ticket Submission Dialog Modal */}
        <Dialog
          open={ticketModalOpen}
          onClose={() => setTicketModalOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              backgroundColor: VELOUR_TOKENS.bgSurface1,
              color: '#FFF',
              border: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
              borderRadius: 3,
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: 700, color: '#FFF', pb: 1 }}>
            Submit Driver Support Request
          </DialogTitle>
          <form onSubmit={handleTicketSubmit}>
            <DialogContent dividers sx={{ borderColor: VELOUR_TOKENS.borderSubtle, display: 'flex', flexDirection: 'column', gap: 2 }}>
              {ticketSubmitted ? (
                <Alert severity="success" sx={{ backgroundColor: 'rgba(0, 217, 192, 0.15)', color: '#FFF' }}>
                  Support ticket created successfully! Ticket ID #TKT-2026-9041 has been dispatched to fleet management.
                </Alert>
              ) : (
                <>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="Issue Category"
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value)}
                  >
                    <MenuItem value="fare">Fare & Earnings Adjustment</MenuItem>
                    <MenuItem value="account">Account & Vehicle Details</MenuItem>
                    <MenuItem value="technical">Technical App / Map Discrepancy</MenuItem>
                    <MenuItem value="copilot">AI Model & Copilot Guidance</MenuItem>
                  </TextField>

                  <TextField
                    fullWidth
                    required
                    size="small"
                    label="Subject / Short Summary"
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    placeholder="e.g. Trip fare review for shift log #t-101"
                  />

                  <TextField
                    fullWidth
                    required
                    multiline
                    rows={4}
                    size="small"
                    label="Detailed Description"
                    value={ticketDescription}
                    onChange={(e) => setTicketDescription(e.target.value)}
                    placeholder="Provide relevant trip IDs, location details, or specific questions..."
                  />
                </>
              )}
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setTicketModalOpen(false)} sx={{ color: VELOUR_TOKENS.textSecondary }}>
                Cancel
              </Button>
              {!ticketSubmitted && (
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SendIcon />}
                  sx={{
                    backgroundColor: VELOUR_TOKENS.accentPrimary,
                    fontWeight: 700,
                    '&:hover': { backgroundColor: VELOUR_TOKENS.accentPrimaryHover },
                  }}
                >
                  Submit Ticket
                </Button>
              )}
            </DialogActions>
          </form>
        </Dialog>
      </Container>
    </PageShell>
  );
};
