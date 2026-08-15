import React from 'react';
import {
  Grid,
  Box,
  Card,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DnsIcon from '@mui/icons-material/Dns';
import SpeedIcon from '@mui/icons-material/Speed';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import MemoryIcon from '@mui/icons-material/Memory';
import { PageShell } from '../../components/layout/PageShell';
import { VELOUR_TOKENS } from '../../theme/palette';

export const AdminModelHealthPage: React.FC = () => {
  const modelServices = [
    { name: 'Trip Duration Model (Student A)', type: 'XGBoost Regressor', status: 'OPERATIONAL', latency: '12ms', loss: 'MAE 2.1 mins', updated: '1 min ago', icon: <SpeedIcon sx={{ color: VELOUR_TOKENS.accentTeal }} /> },
    { name: 'Demand Zone Classification (Student B)', type: 'Random Forest Classifier', status: 'OPERATIONAL', latency: '18ms', loss: 'Accuracy 96.2%', updated: '2 mins ago', icon: <MemoryIcon sx={{ color: VELOUR_TOKENS.success }} /> },
    { name: 'Demand Forecast Model (Student C)', type: 'LSTM Time-Series', status: 'OPERATIONAL', latency: '14ms', loss: 'MAPE 5.8%', updated: '30 secs ago', icon: <DnsIcon sx={{ color: VELOUR_TOKENS.accentLavender }} /> },
    { name: 'Ollama LLM (Gemma2 Dispatch Assistant)', type: 'LLM (Gemma-2-9B)', status: 'HEALTHY', latency: '140ms', loss: 'Perplexity 1.12', updated: 'Real-time Stream', icon: <SmartToyIcon sx={{ color: VELOUR_TOKENS.accentGold }} /> },
  ];

  return (
    <PageShell title="ML & LLM Model Health NOC">
      <Grid container spacing={3}>
        {/* Model NOC Status Bar */}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {[
              { label: 'REGISTERED MODELS', val: '4 ACTIVE', color: '#FFF' },
              { label: 'AVG INFERENCE LATENCY', val: '14.2 ms', color: VELOUR_TOKENS.accentTeal },
              { label: 'OLLAMA LLM STATUS', val: 'ONLINE (140ms)', color: VELOUR_TOKENS.accentGold },
              { label: 'MODEL DRIFT ALERTS', val: '0 DETECTED', color: VELOUR_TOKENS.success },
            ].map((stat, idx) => (
              <Grid item xs={6} md={3} key={idx}>
                <Card sx={{ p: 2.5, backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle }}>
                  <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 700, letterSpacing: '0.06em' }}>
                    {stat.label}
                  </Typography>
                  <Typography className="mono-num" variant="h5" sx={{ fontWeight: 700, color: stat.color, mt: 1 }}>
                    {stat.val}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Detailed Model Services List */}
        <Grid item xs={12}>
          <Card sx={{ p: 3, backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFF', fontSize: 16 }}>
                Production Machine Learning Services Roster
              </Typography>
              <Chip label="All Microservices Operational" size="small" sx={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: VELOUR_TOKENS.success, fontSize: 11, fontWeight: 600 }} />
            </Box>

            <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {modelServices.map((model, idx) => (
                <Box
                  key={idx}
                  sx={{
                    p: 2.5,
                    borderRadius: 2,
                    backgroundColor: VELOUR_TOKENS.bgSurface2,
                    border: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 2,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.04)', display: 'flex' }}>
                      {model.icon}
                    </Box>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 700, color: '#FFF', fontSize: 15 }}>
                        {model.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontFamily: VELOUR_TOKENS.fontMono }}>
                        Architecture: {model.type} • Last Evaluated: {model.updated}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textTertiary, display: 'block' }}>
                        INFERENCE LATENCY
                      </Typography>
                      <Typography className="mono-num" variant="subtitle1" sx={{ fontWeight: 700, color: VELOUR_TOKENS.accentTeal }}>
                        {model.latency}
                      </Typography>
                    </Box>

                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textTertiary, display: 'block' }}>
                        ACCURACY / METRIC
                      </Typography>
                      <Typography className="mono-num" variant="subtitle1" sx={{ fontWeight: 700, color: '#FFF' }}>
                        {model.loss}
                      </Typography>
                    </Box>

                    <Chip
                      icon={<CheckCircleIcon sx={{ fontSize: '14px !important', color: `${VELOUR_TOKENS.success} !important` }} />}
                      label={model.status}
                      size="small"
                      sx={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: VELOUR_TOKENS.success, fontSize: 11, fontWeight: 700, px: 0.5 }}
                    />
                  </Box>
                </Box>
              ))}
            </List>
          </Card>
        </Grid>
      </Grid>
    </PageShell>
  );
};
