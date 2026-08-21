import React from 'react';
import {
  Grid,
  Box,
  Card,
  Typography,
  Chip,
} from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { PageShell } from '../../components/layout/PageShell';
import { VELOUR_TOKENS } from '../../theme/palette';

export const AdminAIRecommendationsPage: React.FC = () => {
  return (
    <PageShell title="AI Dispatch Recommendations">
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
                  Autonomous Dispatch Reasoning Engine
                </Typography>
                <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary }}>
                  Real-time automated operational recommendations for fleet staging, surge optimization, and spatial rebalancing.
                </Typography>
              </Box>
              <Chip
                icon={<HourglassEmptyIcon sx={{ fontSize: '14px !important', color: `${VELOUR_TOKENS.accentGold} !important` }} />}
                label="SERVICE PENDING"
                sx={{ backgroundColor: 'rgba(234, 179, 8, 0.1)', color: VELOUR_TOKENS.accentGold, fontWeight: 700 }}
              />
            </Box>
          </Card>
        </Grid>

        {/* Empty State / Disconnected Banner */}
        <Grid item xs={12}>
          <Card sx={{ p: 5, backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle, textAlign: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
              <Box sx={{ p: 2, borderRadius: '50%', backgroundColor: 'rgba(124, 58, 237, 0.1)', mb: 2 }}>
                <SmartToyIcon sx={{ color: VELOUR_TOKENS.accentLavender, fontSize: 48 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFF', mb: 1 }}>
                AI Recommendation Service Not Connected
              </Typography>
              <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary, maxWidth: 520, mb: 3 }}>
                Autonomous dispatch recommendations require the AI Reasoning microservice pipeline. No automated suggestions are active at this time.
              </Typography>
              <Chip
                label="AI Reasoning Microservice Integration Planned for Future Phase"
                sx={{ backgroundColor: VELOUR_TOKENS.bgSurface2, color: VELOUR_TOKENS.accentLavender, border: `1px solid ${VELOUR_TOKENS.borderSubtle}`, fontWeight: 600 }}
              />
            </Box>
          </Card>
        </Grid>
      </Grid>
    </PageShell>
  );
};
