import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
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
} from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { VELOUR_TOKENS } from '../theme/palette';
import { AuthLayout } from '../components/auth/AuthLayout';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Direct navigation to dashboard (Frontend entry point)
    navigate('/dashboard');
  };

  const handleDemoSignIn = () => {
    navigate('/dashboard');
  };

  return (
    <AuthLayout mode="login">
      <Paper
        elevation={0}
        sx={{
          backgroundColor: VELOUR_TOKENS.bgSurface1,
          borderColor: VELOUR_TOKENS.borderSubtle,
          borderWidth: 1,
          borderStyle: 'solid',
          borderRadius: 4,
          p: { xs: 3, sm: 4 },
          boxShadow: '0 24px 48px rgba(0, 0, 0, 0.6)',
          width: '100%',
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 3.5 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              fontSize: { xs: 22, sm: 26 },
              color: '#FFF',
              mb: 1,
              letterSpacing: '-0.02em',
            }}
          >
            Welcome Back
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: VELOUR_TOKENS.textSecondary,
              fontSize: 13.5,
              lineHeight: 1.5,
            }}
          >
            Access your Ride AI intelligence platform
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {/* Email Field */}
            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: VELOUR_TOKENS.textSecondary,
                  fontSize: 12,
                  fontWeight: 600,
                  mb: 0.8,
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
                    fontSize: 14,
                    '& fieldset': { borderColor: VELOUR_TOKENS.borderSubtle },
                    '&:hover fieldset': { borderColor: VELOUR_TOKENS.accentLavender },
                    '&.Mui-focused fieldset': { borderColor: VELOUR_TOKENS.accentPrimary },
                  },
                }}
              />
            </Box>

            {/* Password Field */}
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8 }}>
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
                  onClick={() => navigate('/dashboard')}
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
                    fontSize: 14,
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
                py: 1.3,
                mt: 1,
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

        <Divider
          sx={{
            my: 3,
            borderColor: VELOUR_TOKENS.borderSubtle,
            color: VELOUR_TOKENS.textTertiary,
            fontSize: 12,
          }}
        >
          OR
        </Divider>

        {/* Demo Driver Shortcut */}
        <Button
          fullWidth
          variant="outlined"
          size="large"
          onClick={handleDemoSignIn}
          sx={{
            borderColor: VELOUR_TOKENS.borderSubtle,
            color: VELOUR_TOKENS.textPrimary,
            py: 1.2,
            borderRadius: 2.5,
            fontWeight: 600,
            fontSize: 13.5,
            textTransform: 'none',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            '&:hover': {
              borderColor: VELOUR_TOKENS.accentLavender,
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            },
          }}
        >
          Continue as Demo Driver
        </Button>

        {/* Register Navigation Switch */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 13 }}>
            Don't have an account?{' '}
            <RouterLink
              to="/register"
              style={{
                color: VELOUR_TOKENS.accentTeal,
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              Create account
            </RouterLink>
          </Typography>
        </Box>

        {/* Security Footer Note */}
        <Box
          sx={{
            mt: 3.5,
            pt: 2.5,
            borderTop: `1px dashed ${VELOUR_TOKENS.borderSubtle}`,
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            gap: 0.8,
          }}
        >
          <SecurityOutlinedIcon sx={{ color: VELOUR_TOKENS.accentTeal, fontSize: 15 }} />
          <Typography
            variant="caption"
            sx={{
              color: VELOUR_TOKENS.textSecondary,
              fontSize: 11.5,
              textAlign: 'center',
            }}
          >
            Secure access for Ride AI drivers and fleet operators
          </Typography>
        </Box>
      </Paper>
    </AuthLayout>
  );
};
