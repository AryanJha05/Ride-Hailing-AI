import React from 'react';
import {
  Grid,
  Box,
  Card,
  Typography,
  Chip,
  Button,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { PageShell } from '../../components/layout/PageShell';
import { VELOUR_TOKENS } from '../../theme/palette';

export const AdminAIRecommendationsPage: React.FC = () => {
  const aiRecommendations = [
    {
      id: 'REC-104',
      title: 'Pre-Stage 250 Units in Midtown Manhattan',
      zone: 'Midtown Manhattan (Zone 161)',
      impact: '+18.4% Revenue Surge',
      confidence: '96.4%',
      reasoning: 'Ollama LLM analyzed peak passenger outflow from Grand Central Station combined with incoming flight arrivals at JFK Airport. Demand expected to exceed baseline by 220% between 17:30 - 19:00 EST.',
      timestamp: '10 mins ago',
      type: 'FLEET DISPATCH',
    },
    {
      id: 'REC-103',
      title: 'Dynamic Surge Pricing Adjustment (JFK Terminal 4)',
      zone: 'JFK Airport (Zone 132)',
      impact: '1.45x Surge Optimization',
      confidence: '94.8%',
      reasoning: 'Multiple delayed international arrivals detected at JFK Terminal 4. Current staged fleet driver count is insufficient to absorb passenger influx without dynamic surge incentive.',
      timestamp: '25 mins ago',
      type: 'SURGE PRICING',
    },
    {
      id: 'REC-102',
      title: 'Redistribute Fleet Units from Financial District to Williamsburg',
      zone: 'Williamsburg / DUMBO (Zone 255)',
      impact: 'Wait Time Reduced by 4.2 mins',
      confidence: '92.1%',
      reasoning: 'Evening venue opening events in Williamsburg causing localized driver supply deficit. Reallocating 80 idle units from Wall St corridor balances regional coverage.',
      timestamp: '42 mins ago',
      type: 'REBALANCING',
    },
  ];

  return (
    <PageShell title="AI & LLM Dispatch Recommendations">
      <Grid container spacing={3}>
        {/* Header Summary Banner */}
        <Grid item xs={12}>
          <Card sx={{ p: 3, backgroundColor: 'rgba(124, 58, 237, 0.08)', borderColor: 'rgba(124, 58, 237, 0.3)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: VELOUR_TOKENS.accentPrimaryDim }}>
                <SmartToyIcon sx={{ color: VELOUR_TOKENS.accentLavender, fontSize: 32 }} />
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFF' }}>
                  Ollama Gemma2 Autonomous Dispatch Reasoning Engine
                </Typography>
                <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary }}>
                  Real-time LLM generated operational recommendations for fleet staging, surge optimization, and spatial rebalancing.
                </Typography>
              </Box>
              <Chip icon={<AutoAwesomeIcon sx={{ fontSize: '14px !important', color: `${VELOUR_TOKENS.accentGold} !important` }} />} label="LLM ACTIVE" sx={{ backgroundColor: 'rgba(234, 179, 8, 0.1)', color: VELOUR_TOKENS.accentGold, fontWeight: 700 }} />
            </Box>
          </Card>
        </Grid>

        {/* Recommendations Cards List */}
        <Grid item xs={12}>
          <Grid container spacing={2.5}>
            {aiRecommendations.map((rec) => (
              <Grid item xs={12} key={rec.id}>
                <Card sx={{ p: 3, backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, mb: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Chip label={rec.type} size="small" sx={{ backgroundColor: VELOUR_TOKENS.accentPrimaryDim, color: VELOUR_TOKENS.accentLavender, fontWeight: 700, fontSize: 10 }} />
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFF', fontSize: 16 }}>
                        {rec.title}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Chip label={`Confidence ${rec.confidence}`} size="small" sx={{ backgroundColor: 'rgba(0, 217, 192, 0.1)', color: VELOUR_TOKENS.accentTeal, fontWeight: 700, fontSize: 11 }} />
                      <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textTertiary, fontFamily: VELOUR_TOKENS.fontMono }}>
                        {rec.timestamp}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="caption" sx={{ color: VELOUR_TOKENS.accentTeal, fontWeight: 700, letterSpacing: '0.04em', display: 'block', mb: 1 }}>
                    ZONE: {rec.zone} • EXPECTED IMPACT: {rec.impact}
                  </Typography>

                  <Box sx={{ p: 2, borderRadius: 2, backgroundColor: VELOUR_TOKENS.bgSurface2, border: `1px solid ${VELOUR_TOKENS.borderSubtle}`, mb: 2 }}>
                    <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary, lineHeight: 1.6 }}>
                      <Box component="span" sx={{ color: VELOUR_TOKENS.accentLavender, fontWeight: 700 }}>LLM Reasoning: </Box>
                      {rec.reasoning}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
                    <Button variant="outlined" size="small" sx={{ borderColor: VELOUR_TOKENS.borderSubtle, color: VELOUR_TOKENS.textSecondary, textTransform: 'none', fontWeight: 600 }}>
                      Dismiss
                    </Button>
                    <Button variant="contained" size="small" endIcon={<ArrowForwardIcon />} sx={{ backgroundColor: VELOUR_TOKENS.accentTeal, color: '#0A0A0D', textTransform: 'none', fontWeight: 700, '&:hover': { backgroundColor: '#00BFA5' } }}>
                      Execute Staging Action
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </PageShell>
  );
};
