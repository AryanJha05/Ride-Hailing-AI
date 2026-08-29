import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Divider,
  Link,
  Alert,
} from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import { VELOUR_TOKENS } from '../../theme/palette';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { useAuth } from '../../auth/AuthContext';
import { ROUTES } from '../../routes/routes';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, loginAsDriver, loginAsAdmin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      const loginEmail = email.trim() || 'aryan.driver@rideai.demo';
      const loginPass = password || 'driver123';
      const profile = await login(loginEmail, loginPass);
      if (profile.role === 'ADMIN') {
        navigate(ROUTES.ADMIN.DASHBOARD);
      } else {
        navigate(ROUTES.USER.DASHBOARD);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.detail || err?.message || 'Authentication failed. Please check your credentials.';
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoDriver = async () => {
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      await loginAsDriver();
      navigate(ROUTES.USER.DASHBOARD);
    } catch (err: any) {
      const msg = err?.response?.data?.detail || err?.message || 'Demo Driver login failed.';
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoAdmin = async () => {
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      await loginAsAdmin();
      navigate(ROUTES.ADMIN.DASHBOARD);
    } catch (err: any) {
      const msg = err?.response?.data?.detail || err?.message || 'Demo Admin login failed.';
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <Paper
        elevation={0}
        sx={{
          backgroundColor: VELOUR_TOKENS.bgSurface1,
          borderColor: VELOUR_TOKENS.borderSubtle,
          borderWidth: 1,
          borderStyle: 'solid',
          borderRadius: 4,
          p: { xs: 4, sm: 4.5 },
          boxShadow: '0 24px 48px rgba(0, 0, 0, 0.6)',
          width: '100%',
        }}
      >
        {/* Header — Beginning directly with Welcome Back */}
        <Box sx={{ mb: 3.5 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              fontSize: { xs: 24, sm: 28, md: 30 },
              color: '#FFF',
              mb: 0.8,
              letterSpacing: '-0.02em',
            }}
          >
            Welcome Back
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: VELOUR_TOKENS.textSecondary,
              fontSize: 14,
              lineHeight: 1.5,
            }}
          >
            Access your Ride AI intelligence platform
          </Typography>
        </Box>

        {errorMsg && (
          <Alert
            severity="error"
            onClose={() => setErrorMsg(null)}
            sx={{
              mb: 2.5,
              borderRadius: 2.5,
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              color: '#F87171',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              '& .MuiAlert-icon': { color: '#F87171' },
            }}
          >
            {errorMsg}
          </Alert>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {/* Email Address */}
            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: VELOUR_TOKENS.textSecondary,
                  fontSize: 12.5,
                  fontWeight: 600,
                  mb: 0.8,
                  display: 'block',
                }}
              >
                Email address
              </Typography>
              <TextField
                fullWidth
                name="email"
                type="email"
                autoComplete="email"
                placeholder="aryan@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 19 }} />
                    </InputAdornment>
                  ),
                  sx: {
                    backgroundColor: VELOUR_TOKENS.bgSurface2,
                    color: '#FFF',
                    borderRadius: 2.5,
                    fontSize: 14,
                    height: 46,
                    '& fieldset': { borderColor: VELOUR_TOKENS.borderSubtle },
                    '&:hover fieldset': { borderColor: VELOUR_TOKENS.accentLavender },
                    '&.Mui-focused fieldset': { borderColor: VELOUR_TOKENS.accentPrimary },
                  },
                }}
              />
            </Box>

            {/* Password */}
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8 }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: VELOUR_TOKENS.textSecondary,
                    fontSize: 12.5,
                    fontWeight: 600,
                  }}
                >
                  Password
                </Typography>
                <Link
                  component="button"
                  type="button"
                  onClick={() => navigate(ROUTES.USER.DASHBOARD)}
                  sx={{
                    color: VELOUR_TOKENS.accentLavender,
                    fontSize: 12,
                    textDecoration: 'none',
                    fontWeight: 600,
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  Forgot password?
                </Link>
              </Box>
              <TextField
                fullWidth
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 19 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        type="button"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                        sx={{ color: VELOUR_TOKENS.textSecondary }}
                      >
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: {
                    backgroundColor: VELOUR_TOKENS.bgSurface2,
                    color: '#FFF',
                    borderRadius: 2.5,
                    fontSize: 14,
                    height: 46,
                    '& fieldset': { borderColor: VELOUR_TOKENS.borderSubtle },
                    '&:hover fieldset': { borderColor: VELOUR_TOKENS.accentLavender },
                    '&.Mui-focused fieldset': { borderColor: VELOUR_TOKENS.accentPrimary },
                  },
                }}
              />
            </Box>

            {/* Primary Sign In Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon fontSize="small" />}
              sx={{
                backgroundColor: VELOUR_TOKENS.accentPrimary,
                color: '#FFF',
                height: 48,
                mt: 0.5,
                borderRadius: 2.5,
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: '0.02em',
                textTransform: 'none',
                boxShadow: `0 4px 14px ${VELOUR_TOKENS.accentPrimaryDim}`,
                '&:hover': {
                  backgroundColor: VELOUR_TOKENS.accentPrimaryHover,
                },
              }}
            >
              Sign In
            </Button>
          </Box>
        </form>

        {/* Separator */}
        <Divider
          sx={{
            my: 3,
            borderColor: VELOUR_TOKENS.borderSubtle,
            color: VELOUR_TOKENS.textTertiary,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.06em',
          }}
        >
          DEMO PLATFORM ACCESS
        </Divider>

        {/* Dual Role Demo Access Buttons — STRICTLY SAME ROW (50/50 Grid Split) */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.2 }}>
          {/* Demo Driver Button */}
          <Button
            fullWidth
            variant="outlined"
            size="medium"
            onClick={handleDemoDriver}
            startIcon={<DirectionsCarIcon fontSize="small" />}
            sx={{
              borderColor: VELOUR_TOKENS.borderSubtle,
              color: VELOUR_TOKENS.textPrimary,
              height: 46,
              px: 1,
              borderRadius: 2.5,
              fontWeight: 600,
              fontSize: 13,
              textTransform: 'none',
              whiteSpace: 'nowrap',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              transition: 'all 180ms ease',
              boxShadow: 'none',
              '&:hover': {
                borderColor: VELOUR_TOKENS.accentLavender,
                color: VELOUR_TOKENS.accentLavender,
                backgroundColor: 'rgba(124, 58, 237, 0.12)',
              },
            }}
          >
            Demo Driver
          </Button>

          {/* Demo Admin Button */}
          <Button
            fullWidth
            variant="outlined"
            size="medium"
            onClick={handleDemoAdmin}
            startIcon={<AdminPanelSettingsOutlinedIcon fontSize="small" />}
            sx={{
              borderColor: VELOUR_TOKENS.borderSubtle,
              color: VELOUR_TOKENS.textPrimary,
              height: 46,
              px: 1,
              borderRadius: 2.5,
              fontWeight: 600,
              fontSize: 13,
              textTransform: 'none',
              whiteSpace: 'nowrap',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              transition: 'all 180ms ease',
              boxShadow: 'none',
              '&:hover': {
                borderColor: VELOUR_TOKENS.accentTeal,
                color: VELOUR_TOKENS.accentTeal,
                backgroundColor: 'rgba(0, 217, 192, 0.06)',
              },
            }}
          >
            Demo Admin
          </Button>
        </Box>
      </Paper>
    </AuthLayout>
  );
};
