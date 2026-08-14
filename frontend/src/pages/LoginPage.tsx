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
  Chip,
} from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import { VELOUR_TOKENS } from '../theme/palette';
import { AuthLayout } from '../components/auth/AuthLayout';
import { useAuth } from '../auth/AuthContext';
import { ROUTES } from '../routes/routes';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAsDriver, loginAsAdmin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Default login action routes to Driver Dashboard for demo
    loginAsDriver();
    navigate(ROUTES.DASHBOARD);
  };

  const handleDemoDriver = () => {
    loginAsDriver();
    navigate(ROUTES.DASHBOARD);
  };

  const handleDemoAdmin = () => {
    loginAsAdmin();
    navigate(ROUTES.ADMIN);
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
          p: { xs: 3.5, sm: 4.5 },
          boxShadow: '0 24px 48px rgba(0, 0, 0, 0.6)',
          width: '100%',
        }}
      >
        {/* Header with Enterprise Managed Access Badge */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Chip
              label="MANAGED ACCESS"
              size="small"
              sx={{
                backgroundColor: 'rgba(0, 217, 192, 0.1)',
                color: VELOUR_TOKENS.accentTeal,
                border: `1px solid rgba(0, 217, 192, 0.25)`,
                fontWeight: 700,
                fontSize: 9.5,
                height: 20,
                borderRadius: 1,
              }}
            />
            <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textTertiary, fontSize: 10.5 }}>
              v2.4 Enterprise
            </Typography>
          </Box>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              fontSize: { xs: 22, sm: 25 },
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
              fontSize: 13,
              lineHeight: 1.5,
            }}
          >
            Access your Ride AI intelligence platform
          </Typography>
        </Box>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.2 }}>
            {/* Email Address */}
            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: VELOUR_TOKENS.textSecondary,
                  fontSize: 12,
                  fontWeight: 600,
                  mb: 0.6,
                  display: 'block',
                }}
              >
                Email address
              </Typography>
              <TextField
                fullWidth
                placeholder="alex.morgan@rideai.nyc"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 18 }} />
                    </InputAdornment>
                  ),
                  sx: {
                    backgroundColor: VELOUR_TOKENS.bgSurface2,
                    color: '#FFF',
                    borderRadius: 2.5,
                    fontSize: 13.5,
                    '& fieldset': { borderColor: VELOUR_TOKENS.borderSubtle },
                    '&:hover fieldset': { borderColor: VELOUR_TOKENS.accentLavender },
                    '&.Mui-focused fieldset': { borderColor: VELOUR_TOKENS.accentPrimary },
                  },
                }}
              />
            </Box>

            {/* Password */}
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.6 }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: VELOUR_TOKENS.textSecondary,
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  Password
                </Typography>
                <Link
                  component="button"
                  type="button"
                  onClick={() => navigate(ROUTES.DASHBOARD)}
                  sx={{
                    color: VELOUR_TOKENS.accentLavender,
                    fontSize: 11.5,
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
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 18 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
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
                    fontSize: 13.5,
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
                py: 1.25,
                mt: 0.5,
                borderRadius: 2.5,
                fontWeight: 700,
                fontSize: 13.5,
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
            my: 2.8,
            borderColor: VELOUR_TOKENS.borderSubtle,
            color: VELOUR_TOKENS.textTertiary,
            fontSize: 10.5,
            fontWeight: 600,
            letterSpacing: '0.06em',
          }}
        >
          DEMO PLATFORM ACCESS
        </Divider>

        {/* Dual Role Demo Access Buttons — STRICTLY SAME ROW (50/50 Grid Split) */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
          {/* Demo Driver Button */}
          <Button
            fullWidth
            variant="contained"
            size="medium"
            onClick={handleDemoDriver}
            startIcon={<DirectionsCarIcon fontSize="small" />}
            sx={{
              backgroundColor: 'rgba(124, 58, 237, 0.18)',
              color: '#FFF',
              border: `1px solid ${VELOUR_TOKENS.accentPrimary}`,
              py: 1.1,
              px: 1,
              borderRadius: 2.5,
              fontWeight: 700,
              fontSize: 12.5,
              textTransform: 'none',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
              boxShadow: `0 2px 8px rgba(124, 58, 237, 0.15)`,
              '&:hover': {
                backgroundColor: VELOUR_TOKENS.accentPrimary,
                borderColor: VELOUR_TOKENS.accentPrimaryHover,
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
              py: 1.1,
              px: 1,
              borderRadius: 2.5,
              fontWeight: 600,
              fontSize: 12.5,
              textTransform: 'none',
              whiteSpace: 'nowrap',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              transition: 'all 0.2s ease',
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

        {/* Managed Enterprise Security Note */}
        <Box
          sx={{
            mt: 3,
            pt: 2.2,
            borderTop: `1px dashed ${VELOUR_TOKENS.borderSubtle}`,
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            gap: 0.8,
          }}
        >
          <SecurityOutlinedIcon sx={{ color: VELOUR_TOKENS.accentTeal, fontSize: 14 }} />
          <Typography
            variant="caption"
            sx={{
              color: VELOUR_TOKENS.textSecondary,
              fontSize: 11,
              textAlign: 'center',
              lineHeight: 1.3,
            }}
          >
            Managed access for Ride AI drivers & fleet administrators
          </Typography>
        </Box>
      </Paper>
    </AuthLayout>
  );
};
