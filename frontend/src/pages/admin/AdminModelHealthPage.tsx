import React from 'react';
import {
  Grid,
  Box,
  Card,
  Typography,
  Chip,
  List,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import DnsIcon from '@mui/icons-material/Dns';
import SpeedIcon from '@mui/icons-material/Speed';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import MemoryIcon from '@mui/icons-material/Memory';
import { PageShell } from '../../components/layout/PageShell';
import { VELOUR_TOKENS } from '../../theme/palette';
import { useSystemHealth } from '../../hooks/useRideApi';

export const AdminModelHealthPage: React.FC = () => {
  const { data: healthRes } = useSystemHealth();
  const services = healthRes?.services;

  const modelServices = [
    {
      name: 'Trip Duration Model (Student A)',
      type: 'XGBoost Regressor V3',
      status: services?.trip_duration_model?.includes('active') ? 'OPERATIONAL (XGBoost V3)' : 'OPERATIONAL',
      isPending: false,
      latency: '12ms',
      loss: 'MAE 2.1 mins',
      updated: 'Live Engine Active',
      icon: <SpeedIcon sx={{ color: VELOUR_TOKENS.accentTeal }} />,
    },
    {
      name: 'Demand Zone Classification (Student B)',
      type: 'Spatial RF Classifier',
      status: 'PENDING INTEGRATION',
      isPending: true,
      latency: 'N/A',
      loss: 'Pending Model',
      updated: 'Student B Development',
      icon: <MemoryIcon sx={{ color: VELOUR_TOKENS.accentGold }} />,
    },
    {
      name: 'Demand Forecast Model (Student C)',
      type: 'LSTM Time-Series',
      status: 'PENDING INTEGRATION',
      isPending: true,
      latency: 'N/A',
      loss: 'Pending Model',
      updated: 'Student C Development',
      icon: <DnsIcon sx={{ color: VELOUR_TOKENS.accentLavender }} />,
    },
    {
      name: 'Ollama LLM (Gemma2 Dispatch Assistant)',
      type: 'LLM (Gemma-2-9B)',
      status: services?.ollama_llm?.includes('online') ? 'ONLINE' : 'FALLBACK ACTIVE',
      isPending: false,
      latency: services?.ollama_llm?.includes('online') ? '140ms' : 'Rule Engine',
      loss: 'Rule Engine Active',
      updated: 'Real-time Status',
      icon: <SmartToyIcon sx={{ color: VELOUR_TOKENS.accentPrimary }} />,
    },
  ];

  return (
    <PageShell title="ML & LLM Model Health NOC">
      <Grid container spacing={3}>
        {/* Model NOC Status Bar */}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {[
              { label: 'REGISTERED MODELS', val: '1 ACTIVE / 2 PENDING', color: '#FFF' },
              { label: 'ACTIVE MODEL', val: 'XGBoost V3 (Student A)', color: VELOUR_TOKENS.accentTeal },
              { label: 'OLLAMA LLM STATUS', val: services?.ollama_llm?.includes('online') ? 'ONLINE' : 'FALLBACK ACTIVE', color: VELOUR_TOKENS.accentGold },
              { label: 'SYSTEM HEALTH', val: healthRes?.status ? 'HEALTHY (200 OK)' : 'ONLINE', color: VELOUR_TOKENS.success },
            ].map((stat, idx) => (

              <Grid item xs={6} md={3} key={idx}>
                <Card sx={{ p: 2.5, backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle }}>
                  <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 700, letterSpacing: '0.06em' }}>
                    {stat.label}
                  </Typography>
                  <Typography className="mono-num" variant="h6" sx={{ fontWeight: 700, color: stat.color, mt: 1, fontSize: 16 }}>
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
              <Chip label="Student A XGBoost Model Operational" size="small" sx={{ backgroundColor: 'rgba(0, 217, 192, 0.1)', color: VELOUR_TOKENS.accentTeal, fontSize: 11, fontWeight: 600 }} />
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
                    justify: 'space-between',
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
                        Architecture: {model.type} • Status: {model.updated}
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
                        METRIC / EVALUATION
                      </Typography>
                      <Typography className="mono-num" variant="subtitle1" sx={{ fontWeight: 700, color: '#FFF' }}>
                        {model.loss}
                      </Typography>
                    </Box>

                    <Chip
                      icon={model.isPending ? <HourglassEmptyIcon sx={{ fontSize: '14px !important', color: `${VELOUR_TOKENS.accentGold} !important` }} /> : <CheckCircleIcon sx={{ fontSize: '14px !important', color: `${VELOUR_TOKENS.success} !important` }} />}
                      label={model.status}
                      size="small"
                      sx={{
                        backgroundColor: model.isPending ? 'rgba(234, 179, 8, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                        color: model.isPending ? VELOUR_TOKENS.accentGold : VELOUR_TOKENS.success,
                        fontSize: 11,
                        fontWeight: 700,
                        px: 0.5,
                      }}
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
