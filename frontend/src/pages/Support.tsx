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
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { PageShell } from '../components/layout/PageShell';
import { VELOUR_TOKENS } from '../theme/palette';

export const Support: React.FC = () => {
  return (
    <PageShell title="Driver Support & Fleet Assistance">
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#FFF', mb: 0.5 }}>
          Driver Command Support
        </Typography>
        <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary, mb: 3 }}>
          24/7 dedicated fleet support, emergency road services, and AI navigation assistance.
        </Typography>

        {/* Emergency SOS Banner */}
        <Paper
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 3,
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderColor: 'rgba(239, 68, 68, 0.3)',
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <LocalHospitalIcon sx={{ color: '#EF4444', fontSize: 32 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFF' }}>
                Emergency Roadside & SOS Dispatch
              </Typography>
              <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary }}>
                Instant priority connection to emergency fleet safety operators.
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            color="error"
            startIcon={<PhoneInTalkIcon />}
            sx={{ fontWeight: 700, px: 3, py: 1 }}
          >
            Call Fleet Emergency
          </Button>
        </Paper>

        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFF', mb: 2 }}>
              Frequently Asked Driver Questions
            </Typography>

            {[
              { q: 'How does the AI Surge Forecasting work?', a: 'Ride AI combines spatial ML telemetry, historical driver density curves, and real-time event signals to predict surge hotspots 30–60 minutes in advance.' },
              { q: 'When are weekly earnings paid out?', a: 'Earnings are deposited directly to your linked bank account via ACH direct deposit every Monday at 06:00 EST. Instant payouts can be triggered via Profile > Earnings.' },
              { q: 'What happens if I lose internet connection during a surge trip?', a: 'The Ride AI driver portal automatically caches trip telemetry offline and synchronizes your fare data once connection is restored.' },
            ].map((item, idx) => (
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
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <SupportAgentIcon sx={{ fontSize: 44, color: VELOUR_TOKENS.accentLavender }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFF', mt: 1 }}>
                  Contact Driver Operations
                </Typography>
                <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary }}>
                  Avg response time: 2 minutes
                </Typography>
              </Box>

              <Button
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor: VELOUR_TOKENS.accentPrimary,
                  fontWeight: 700,
                  py: 1.2,
                  mb: 1.5,
                }}
              >
                Start Live Support Chat
              </Button>

              <Button
                fullWidth
                variant="outlined"
                sx={{
                  color: '#FFF',
                  borderColor: VELOUR_TOKENS.borderSubtle,
                  py: 1,
                }}
              >
                Submit Fare Issue Ticket
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </PageShell>
  );
};
