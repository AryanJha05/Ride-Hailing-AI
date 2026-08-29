import React, { useState } from 'react';
import {
  Grid,
  Box,
  Card,
  Typography,
  Chip,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  CircularProgress,
  Tooltip as MuiTooltip,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import SpeedIcon from '@mui/icons-material/Speed';
import MemoryIcon from '@mui/icons-material/Memory';
import DnsIcon from '@mui/icons-material/Dns';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CableIcon from '@mui/icons-material/Cable';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { PageShell } from '../../components/layout/PageShell';
import { VELOUR_TOKENS } from '../../theme/palette';
import { useAdminModelHealth, useReconnectAdminModelMutation } from '../../hooks/useRideApi';
import { NocServiceItem, NocIncident, NocPlatformService } from '../../types/api.types';


export const AdminModelHealthPage: React.FC = () => {
  const { data: healthRes, isLoading, refetch, isRefetching } = useAdminModelHealth();
  const reconnectMutation = useReconnectAdminModelMutation();

  const [selectedModel, setSelectedModel] = useState<NocServiceItem | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [reconnectingId, setReconnectingId] = useState<string | null>(null);

  const kpis = healthRes?.kpis || {
    system_health: 'ONLINE',
    active_ml_services: '3/3',
    requests_per_minute: 284,
    avg_inference_latency_ms: 14.8,
    error_rate_pct: 0.04,
    uptime_pct: '99.98%',
  };

  const services = healthRes?.services || [];
  const telemetryHistory = healthRes?.telemetry_history || [];
  const activeIncidents = healthRes?.active_incidents || [];
  const resolvedIncidents = healthRes?.resolved_incidents || [];
  const platformServices = healthRes?.platform_services || [];

  const handleOpenDetails = (service: NocServiceItem) => {
    setSelectedModel(service);
    setActiveTab(0);
    setDetailModalOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailModalOpen(false);
    setSelectedModel(null);
  };

  const handleReconnect = async (serviceId: string) => {
    setReconnectingId(serviceId);
    try {
      await reconnectMutation.mutateAsync(serviceId);
      await refetch();
    } catch (err) {
      console.error('Reconnect failed:', err);
    } finally {
      setReconnectingId(null);
    }
  };

  const getServiceIcon = (id: string) => {
    switch (id) {
      case 'trip_duration':
        return <SpeedIcon sx={{ color: VELOUR_TOKENS.accentTeal }} />;
      case 'demand_zone':
        return <MemoryIcon sx={{ color: VELOUR_TOKENS.accentTeal }} />;
      case 'demand_forecast':
        return <DnsIcon sx={{ color: VELOUR_TOKENS.accentLavender }} />;
      case 'ollama_llm':
        return <SmartToyIcon sx={{ color: VELOUR_TOKENS.accentPrimary }} />;
      default:
        return <DnsIcon sx={{ color: VELOUR_TOKENS.accentTeal }} />;
    }
  };

  const getStatusChip = (status: string, isPending: boolean) => {
    const isOk = status.includes('OPERATIONAL') || status.includes('HEALTHY') || status.includes('HEALTH');
    return (
      <Chip
        icon={
          isPending ? (
            <HourglassEmptyIcon sx={{ fontSize: '14px !important', color: `${VELOUR_TOKENS.accentGold} !important` }} />
          ) : isOk ? (
            <CheckCircleIcon sx={{ fontSize: '14px !important', color: `${VELOUR_TOKENS.success} !important` }} />
          ) : (
            <ErrorOutlineIcon sx={{ fontSize: '14px !important', color: `${VELOUR_TOKENS.danger} !important` }} />
          )
        }
        label={status.toUpperCase()}
        size="small"
        sx={{
          backgroundColor: isPending
            ? 'rgba(234, 179, 8, 0.1)'
            : isOk
            ? 'rgba(34, 197, 94, 0.1)'
            : 'rgba(239, 68, 68, 0.1)',
          color: isPending ? VELOUR_TOKENS.accentGold : isOk ? VELOUR_TOKENS.success : VELOUR_TOKENS.danger,
          fontSize: 11,
          fontWeight: 700,
          px: 0.5,
        }}
      />
    );
  };

  return (
    <PageShell title="Model Health NOC & Telemetry Operations">
      <Grid container spacing={3}>
        {/* Header Action Bar & Environment Badges */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Chip
                label="DEMO ENVIRONMENT"
                size="small"
                sx={{ backgroundColor: 'rgba(168, 85, 247, 0.15)', color: VELOUR_TOKENS.accentPrimary, fontSize: 11, fontWeight: 700 }}
              />
              {healthRes?.is_demo_telemetry && (
                <Chip
                  label="DEMO TELEMETRY"
                  size="small"
                  sx={{ backgroundColor: 'rgba(0, 217, 192, 0.15)', color: VELOUR_TOKENS.accentTeal, fontSize: 11, fontWeight: 700 }}
                />
              )}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontFamily: VELOUR_TOKENS.fontMono }}>
                Last NOC Refresh: {healthRes?.timestamp ? new Date(healthRes.timestamp).toLocaleTimeString() : 'Just now'}
              </Typography>
              <IconButton
                onClick={() => refetch()}
                disabled={isRefetching || isLoading}
                size="small"
                sx={{
                  backgroundColor: VELOUR_TOKENS.bgSurface2,
                  border: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
                  color: VELOUR_TOKENS.accentTeal,
                  '&:hover': { backgroundColor: VELOUR_TOKENS.bgSurface1 },
                }}
              >
                <RefreshIcon className={isRefetching ? 'spin-anim' : ''} fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </Grid>

        {/* 1. TOP SYSTEM KPI ROW */}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {[
              {
                label: 'OVERALL SYSTEM HEALTH',
                val: kpis.system_health,
                color: kpis.system_health === 'HEALTHY' ? VELOUR_TOKENS.success : VELOUR_TOKENS.accentGold,
              },
              { label: 'ACTIVE ML SERVICES', val: kpis.active_ml_services, color: VELOUR_TOKENS.accentTeal },
              { label: 'REQUESTS / MINUTE', val: `${kpis.requests_per_minute} REQ/MIN`, color: '#FFF' },
              { label: 'AVG INFERENCE LATENCY', val: `${kpis.avg_inference_latency_ms} ms`, color: VELOUR_TOKENS.accentTeal },
              { label: 'SYSTEM ERROR RATE', val: `${kpis.error_rate_pct}%`, color: kpis.error_rate_pct < 0.1 ? VELOUR_TOKENS.success : VELOUR_TOKENS.accentGold },
              { label: 'PLATFORM UPTIME', val: kpis.uptime_pct, color: VELOUR_TOKENS.accentLavender },
            ].map((stat, idx) => (
              <Grid item xs={6} sm={4} md={2} key={idx}>
                <Card sx={{ p: 2, backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle }}>
                  <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 700, letterSpacing: '0.05em', fontSize: 10 }}>
                    {stat.label}
                  </Typography>
                  <Typography className="mono-num" variant="h6" sx={{ fontWeight: 700, color: stat.color, mt: 0.8, fontSize: 14 }}>
                    {stat.val}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* 2. ML SERVICE MONITORING ROSTER */}
        <Grid item xs={12}>
          <Card sx={{ p: 3, backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFF', fontSize: 16 }}>
                Production Machine Learning Services Roster
              </Typography>
              <Chip label="Backend Telemetry Sync Active" size="small" sx={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: VELOUR_TOKENS.success, fontSize: 11, fontWeight: 600 }} />
            </Box>

            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress size={32} sx={{ color: VELOUR_TOKENS.accentTeal }} />
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {services.map((model: NocServiceItem) => (
                  <Box
                    key={model.id}
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
                    {/* Name & Type */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 260 }}>
                      <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.04)', display: 'flex' }}>
                        {getServiceIcon(model.id)}
                      </Box>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body1" sx={{ fontWeight: 700, color: '#FFF', fontSize: 15 }}>
                            {model.name}
                          </Typography>
                          <Chip label={model.version} size="small" sx={{ height: 18, fontSize: 9.5, backgroundColor: 'rgba(255,255,255,0.06)', color: VELOUR_TOKENS.textSecondary }} />
                        </Box>
                        <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontFamily: VELOUR_TOKENS.fontMono }}>
                          {model.architecture}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Operational Metrics Cluster */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textTertiary, display: 'block', fontSize: 10 }}>
                          LATENCY
                        </Typography>
                        <Typography className="mono-num" variant="subtitle2" sx={{ fontWeight: 700, color: VELOUR_TOKENS.accentTeal }}>
                          {model.inference_latency_ms > 0 ? `${model.inference_latency_ms} ms` : 'N/A'}
                        </Typography>
                      </Box>

                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textTertiary, display: 'block', fontSize: 10 }}>
                          REQ / MIN
                        </Typography>
                        <Typography className="mono-num" variant="subtitle2" sx={{ fontWeight: 700, color: '#FFF' }}>
                          {model.requests_per_min}
                        </Typography>
                      </Box>

                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textTertiary, display: 'block', fontSize: 10 }}>
                          ERR RATE
                        </Typography>
                        <Typography className="mono-num" variant="subtitle2" sx={{ fontWeight: 700, color: model.error_rate_pct > 0.1 ? VELOUR_TOKENS.accentGold : VELOUR_TOKENS.success }}>
                          {model.error_rate_pct}%
                        </Typography>
                      </Box>

                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textTertiary, display: 'block', fontSize: 10 }}>
                          CPU / MEM
                        </Typography>
                        <Typography className="mono-num" variant="subtitle2" sx={{ fontWeight: 700, color: VELOUR_TOKENS.textSecondary }}>
                          {model.cpu_utilization_pct}% / {model.memory_usage_mb}MB
                        </Typography>
                      </Box>

                      {getStatusChip(model.status, model.is_pending)}

                      {/* Action Buttons */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<VisibilityIcon sx={{ fontSize: 14 }} />}
                          onClick={() => handleOpenDetails(model)}
                          sx={{
                            borderColor: VELOUR_TOKENS.borderSubtle,
                            color: '#FFF',
                            fontSize: 11,
                            textTransform: 'none',
                            px: 1.5,
                            py: 0.5,
                            '&:hover': { borderColor: VELOUR_TOKENS.accentTeal, backgroundColor: 'rgba(0,217,192,0.05)' },
                          }}
                        >
                          View Details
                        </Button>

                        <MuiTooltip title="Probe / Reconnect Service Health">
                          <IconButton
                            size="small"
                            onClick={() => handleReconnect(model.id)}
                            disabled={reconnectingId === model.id}
                            sx={{
                              border: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
                              color: VELOUR_TOKENS.accentTeal,
                              p: 0.75,
                              '&:hover': { backgroundColor: 'rgba(0,217,192,0.1)' },
                            }}
                          >
                            {reconnectingId === model.id ? (
                              <CircularProgress size={16} sx={{ color: VELOUR_TOKENS.accentTeal }} />
                            ) : (
                              <CableIcon sx={{ fontSize: 16 }} />
                            )}
                          </IconButton>
                        </MuiTooltip>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Card>
        </Grid>

        {/* 3. LIVE TELEMETRY CHARTS */}
        <Grid item xs={12}>
          <Card sx={{ p: 3, backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFF', fontSize: 16 }}>
                  Live ML Operations Telemetry
                </Typography>
                <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary }}>
                  Real-time 24-point time-series metrics stream (Latency, Throughput, and Error Rate)
                </Typography>
              </Box>
              <Chip
                label="DEMO TELEMETRY"
                size="small"
                sx={{ backgroundColor: 'rgba(0, 217, 192, 0.1)', color: VELOUR_TOKENS.accentTeal, fontSize: 10, fontWeight: 700 }}
              />
            </Box>

            <Grid container spacing={2}>
              {/* Chart 1: Latency */}
              <Grid item xs={12} md={4}>
                <Box sx={{ p: 2, borderRadius: 2, backgroundColor: VELOUR_TOKENS.bgSurface2, border: `1px solid ${VELOUR_TOKENS.borderSubtle}` }}>
                  <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 700, display: 'block', mb: 1 }}>
                    INFERENCE LATENCY (ms)
                  </Typography>
                  <Box sx={{ width: '100%', height: 140 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={telemetryHistory} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                        <defs>
                          <linearGradient id="latGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={VELOUR_TOKENS.accentTeal} stopOpacity={0.4} />
                            <stop offset="95%" stopColor={VELOUR_TOKENS.accentTeal} stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="time" stroke={VELOUR_TOKENS.textSecondary} fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke={VELOUR_TOKENS.textSecondary} fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle, fontSize: 11 }} />
                        <Area type="monotone" dataKey="latency_ms" stroke={VELOUR_TOKENS.accentTeal} strokeWidth={2} fill="url(#latGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Box>
                </Box>
              </Grid>

              {/* Chart 2: Throughput */}
              <Grid item xs={12} md={4}>
                <Box sx={{ p: 2, borderRadius: 2, backgroundColor: VELOUR_TOKENS.bgSurface2, border: `1px solid ${VELOUR_TOKENS.borderSubtle}` }}>
                  <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 700, display: 'block', mb: 1 }}>
                    REQUEST VOLUME (req/min)
                  </Typography>
                  <Box sx={{ width: '100%', height: 140 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={telemetryHistory} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                        <defs>
                          <linearGradient id="reqGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={VELOUR_TOKENS.accentLavender} stopOpacity={0.4} />
                            <stop offset="95%" stopColor={VELOUR_TOKENS.accentLavender} stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="time" stroke={VELOUR_TOKENS.textSecondary} fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke={VELOUR_TOKENS.textSecondary} fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle, fontSize: 11 }} />
                        <Area type="monotone" dataKey="request_volume" stroke={VELOUR_TOKENS.accentLavender} strokeWidth={2} fill="url(#reqGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Box>
                </Box>
              </Grid>

              {/* Chart 3: Error Rate */}
              <Grid item xs={12} md={4}>
                <Box sx={{ p: 2, borderRadius: 2, backgroundColor: VELOUR_TOKENS.bgSurface2, border: `1px solid ${VELOUR_TOKENS.borderSubtle}` }}>
                  <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 700, display: 'block', mb: 1 }}>
                    SYSTEM ERROR RATE (%)
                  </Typography>
                  <Box sx={{ width: '100%', height: 140 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={telemetryHistory} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                        <XAxis dataKey="time" stroke={VELOUR_TOKENS.textSecondary} fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke={VELOUR_TOKENS.textSecondary} fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle, fontSize: 11 }} />
                        <Line type="monotone" dataKey="error_rate_pct" stroke={VELOUR_TOKENS.accentGold} strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Card>
        </Grid>

        {/* 4. ACTIVE & RESOLVED INCIDENTS */}
        <Grid item xs={12} md={7}>
          <Card sx={{ p: 3, backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFF', fontSize: 16, mb: 2 }}>
              Active Incidents & Alerts
            </Typography>

            {activeIncidents.length === 0 ? (
              <Box sx={{ p: 3, textAlign: 'center', backgroundColor: VELOUR_TOKENS.bgSurface2, borderRadius: 2, border: `1px dashed ${VELOUR_TOKENS.borderSubtle}` }}>
                <CheckCircleIcon sx={{ color: VELOUR_TOKENS.success, fontSize: 28, mb: 1 }} />
                <Typography variant="body2" sx={{ color: '#FFF', fontWeight: 600 }}>
                  No Active Platform Incidents
                </Typography>
                <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary }}>
                  All machine learning models and microservices are operating within nominal baseline parameters.
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {activeIncidents.map((inc: NocIncident) => (
                  <Box
                    key={inc.id}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: 'rgba(234, 179, 8, 0.05)',
                      border: `1px solid ${VELOUR_TOKENS.accentGold}`,
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                      <WarningAmberIcon sx={{ color: VELOUR_TOKENS.accentGold, mt: 0.3 }} />
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip label={inc.severity} size="small" sx={{ backgroundColor: 'rgba(234, 179, 8, 0.2)', color: VELOUR_TOKENS.accentGold, fontSize: 9.5, fontWeight: 700, height: 18 }} />
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#FFF', fontSize: 13.5 }}>
                            {inc.service}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 12.5, mt: 0.5 }}>
                          {inc.problem}
                        </Typography>
                        <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textTertiary, mt: 0.5, display: 'block', fontSize: 10.5 }}>
                          Detected: {inc.detected_time} • Duration: {inc.duration} • Status: {inc.status}
                        </Typography>
                      </Box>
                    </Box>

                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleReconnect('ollama_llm')}
                      sx={{ borderColor: VELOUR_TOKENS.accentGold, color: VELOUR_TOKENS.accentGold, fontSize: 10.5, px: 1.5, py: 0.3, textTransform: 'none', flexShrink: 0 }}
                    >
                      Probe Endpoint
                    </Button>
                  </Box>
                ))}
              </Box>
            )}

            {/* Recently Resolved Incidents */}
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: VELOUR_TOKENS.textSecondary, fontSize: 12, mt: 3, mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Recently Resolved Log
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {resolvedIncidents.map((rInc: NocIncident) => (
                <Box
                  key={rInc.id}
                  sx={{
                    p: 1.5,
                    borderRadius: 1.5,
                    backgroundColor: VELOUR_TOKENS.bgSurface2,
                    border: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <CheckCircleIcon sx={{ color: VELOUR_TOKENS.success, fontSize: 16 }} />
                    <Box>
                      <Typography variant="body2" sx={{ color: '#FFF', fontWeight: 600, fontSize: 12 }}>
                        {rInc.service} — {rInc.problem}
                      </Typography>
                      <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textTertiary, fontSize: 10 }}>
                        Resolved: {rInc.resolved_time}
                      </Typography>
                    </Box>
                  </Box>
                  <Chip label="RESOLVED" size="small" sx={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: VELOUR_TOKENS.success, fontSize: 9, height: 18 }} />
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>

        {/* 5. PLATFORM SERVICES DEPENDENCIES */}
        <Grid item xs={12} md={5}>
          <Card sx={{ p: 3, backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFF', fontSize: 16, mb: 2 }}>
              Platform Services Dependencies
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {platformServices.map((pService: NocPlatformService, idx: number) => (
                <Box
                  key={idx}
                  sx={{
                    p: 1.8,
                    borderRadius: 2,
                    backgroundColor: VELOUR_TOKENS.bgSurface2,
                    border: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#FFF', fontSize: 13 }}>
                      {pService.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 11 }}>
                      {pService.type} • Latency: {pService.latency}
                    </Typography>
                  </Box>

                  <Chip
                    label={pService.status}
                    size="small"
                    sx={{
                      backgroundColor:
                        pService.status === 'HEALTHY'
                          ? 'rgba(34, 197, 94, 0.1)'
                          : pService.status === 'DEGRADED'
                          ? 'rgba(234, 179, 8, 0.1)'
                          : 'rgba(239, 68, 68, 0.1)',
                      color:
                        pService.status === 'HEALTHY'
                          ? VELOUR_TOKENS.success
                          : pService.status === 'DEGRADED'
                          ? VELOUR_TOKENS.accentGold
                          : VELOUR_TOKENS.danger,
                      fontSize: 10,
                      fontWeight: 700,
                      height: 20,
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* 6. MODEL DETAILS MODAL DIALOG */}
      <Dialog
        open={detailModalOpen}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: VELOUR_TOKENS.bgSurface1,
            border: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
            borderRadius: 3,
            color: '#FFF',
          },
        }}
      >
        {selectedModel && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1, borderBottom: `1px solid ${VELOUR_TOKENS.borderSubtle}` }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                {getServiceIcon(selectedModel.id)}
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFF', fontSize: 16 }}>
                    {selectedModel.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontFamily: VELOUR_TOKENS.fontMono }}>
                    {selectedModel.architecture} ({selectedModel.version})
                  </Typography>
                </Box>
              </Box>

              {getStatusChip(selectedModel.status, selectedModel.is_pending)}
            </DialogTitle>

            <DialogContent sx={{ py: 2 }}>
              <Tabs
                value={activeTab}
                onChange={(_, val) => setActiveTab(val)}
                sx={{
                  mb: 2,
                  borderBottom: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
                  '& .MuiTab-root': { color: VELOUR_TOKENS.textSecondary, fontSize: 12, fontWeight: 600 },
                  '& .Mui-selected': { color: `${VELOUR_TOKENS.accentTeal} !important` },
                  '& .MuiTabs-indicator': { backgroundColor: VELOUR_TOKENS.accentTeal },
                }}
              >
                <Tab label="Deployment & Overview" />
                <Tab label="Live Resource Telemetry" />
                <Tab label="System Logs & Diagnostics" />
              </Tabs>

              {activeTab === 0 && (
                <Grid container spacing={2}>
                  {[
                    { label: 'MODEL NAME', val: selectedModel.name },
                    { label: 'ARCHITECTURE', val: selectedModel.architecture },
                    { label: 'VERSION TAG', val: selectedModel.version },
                    { label: 'DEPLOYMENT TARGET', val: selectedModel.deployment_target },
                    { label: 'LAST TRAINING DATE', val: selectedModel.training_date },
                    { label: 'EVALUATION METRIC', val: selectedModel.loss_eval },
                    { label: 'LAST HEALTH CHECK', val: new Date(selectedModel.last_health_check).toLocaleString() },
                    { label: 'LAST INFERENCE TIMESTAMP', val: new Date(selectedModel.last_inference_timestamp).toLocaleString() },
                  ].map((item, idx) => (
                    <Grid item xs={6} key={idx}>
                      <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: VELOUR_TOKENS.bgSurface2, border: `1px solid ${VELOUR_TOKENS.borderSubtle}` }}>
                        <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 10, display: 'block', fontWeight: 700 }}>
                          {item.label}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#FFF', mt: 0.3, fontSize: 13 }}>
                          {item.val}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              )}

              {activeTab === 1 && (
                <Grid container spacing={2}>
                  {[
                    { label: 'INFERENCE LATENCY', val: `${selectedModel.inference_latency_ms} ms`, color: VELOUR_TOKENS.accentTeal },
                    { label: 'THROUGHPUT', val: `${selectedModel.requests_per_min} req/min`, color: '#FFF' },
                    { label: 'ERROR RATE', val: `${selectedModel.error_rate_pct}%`, color: VELOUR_TOKENS.success },
                    { label: 'CPU UTILIZATION', val: `${selectedModel.cpu_utilization_pct}%`, color: '#FFF' },
                    { label: 'GPU UTILIZATION', val: selectedModel.gpu_utilization_pct ? `${selectedModel.gpu_utilization_pct}%` : 'N/A (CPU Engine)', color: VELOUR_TOKENS.textSecondary },
                    { label: 'MEMORY ALLOCATION', val: `${selectedModel.memory_usage_mb} MB`, color: VELOUR_TOKENS.accentLavender },
                  ].map((item, idx) => (
                    <Grid item xs={4} key={idx}>
                      <Box sx={{ p: 2, borderRadius: 2, backgroundColor: VELOUR_TOKENS.bgSurface2, border: `1px solid ${VELOUR_TOKENS.borderSubtle}`, textAlign: 'center' }}>
                        <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 10, display: 'block', fontWeight: 700 }}>
                          {item.label}
                        </Typography>
                        <Typography className="mono-num" variant="h6" sx={{ fontWeight: 700, color: item.color, mt: 0.5, fontSize: 15 }}>
                          {item.val}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              )}

              {activeTab === 2 && (
                <Box sx={{ p: 2, borderRadius: 2, backgroundColor: '#0A0A0F', border: `1px solid ${VELOUR_TOKENS.borderSubtle}`, fontFamily: VELOUR_TOKENS.fontMono, fontSize: 11, maxHeight: 220, overflowY: 'auto' }}>
                  {selectedModel.recent_logs.map((log, lIdx) => (
                    <Box key={lIdx} sx={{ mb: 1, display: 'flex', gap: 1.5 }}>
                      <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textTertiary, fontFamily: VELOUR_TOKENS.fontMono, fontSize: 10.5 }}>
                        [{new Date(log.timestamp).toLocaleTimeString()}]
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: log.level === 'INFO' ? VELOUR_TOKENS.accentTeal : log.level === 'WARN' ? VELOUR_TOKENS.accentGold : VELOUR_TOKENS.danger,
                          fontWeight: 700,
                          fontFamily: VELOUR_TOKENS.fontMono,
                          fontSize: 10.5,
                        }}
                      >
                        [{log.level}]
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#E0E0E0', fontFamily: VELOUR_TOKENS.fontMono, fontSize: 10.5 }}>
                        {log.message}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}

            </DialogContent>

            <DialogActions sx={{ p: 2, borderTop: `1px solid ${VELOUR_TOKENS.borderSubtle}` }}>
              <Button
                onClick={() => handleReconnect(selectedModel.id)}
                variant="outlined"
                size="small"
                startIcon={<CableIcon />}
                disabled={reconnectingId === selectedModel.id}
                sx={{ borderColor: VELOUR_TOKENS.accentTeal, color: VELOUR_TOKENS.accentTeal, fontSize: 11 }}
              >
                Probe & Reconnect Service
              </Button>
              <Button onClick={handleCloseDetails} variant="contained" size="small" sx={{ backgroundColor: VELOUR_TOKENS.accentPrimary, fontSize: 11 }}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </PageShell>
  );
};
