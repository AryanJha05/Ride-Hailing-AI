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
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import BusinessIcon from '@mui/icons-material/Business';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { VELOUR_TOKENS } from '../../theme/palette';
import { AuthLayout } from '../../components/auth/AuthLayout';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState<'driver' | 'fleet'>('driver');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Direct navigation to dashboard (Frontend entry point)
    navigate('/dashboard');
  };

  return (
    <AuthLayout mode="register">
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
        <Box sx={{ mb: 3 }}>
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
            Create your account
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: VELOUR_TOKENS.textSecondary,
              fontSize: 13.5,
              lineHeight: 1.5,
            }}
          >
            Join the Ride AI mobility intelligence platform
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Role Selector Cards */}
            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: VELOUR_TOKENS.textSecondary,
                  fontSize: 12,
                  fontWeight: 600,
                  mb: 1,
                  display: 'block',
                }}
              >
                Select Account Role
              </Typography>
              <Grid container spacing={1.5}>
                <Grid item xs={6}>
                  <Card
                    onClick={() => setRole('driver')}
                    sx={{
                      cursor: 'pointer',
                      backgroundColor: role === 'driver' ? 'rgba(124, 58, 237, 0.12)' : VELOUR_TOKENS.bgSurface2,
                      borderColor: role === 'driver' ? VELOUR_TOKENS.accentPrimary : VELOUR_TOKENS.borderSubtle,
                      borderWidth: 1.5,
                      borderStyle: 'solid',
                      borderRadius: 2.5,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: VELOUR_TOKENS.accentLavender,
                      },
                    }}
                  >
                    <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 }, textAlign: 'center' }}>
                      <DirectionsCarIcon
                        sx={{
                          fontSize: 22,
                          color: role === 'driver' ? VELOUR_TOKENS.accentPrimary : VELOUR_TOKENS.textSecondary,
                          mb: 0.5,
                        }}
                      />
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontSize: 12.5,
                          fontWeight: 700,
                          color: role === 'driver' ? '#FFF' : VELOUR_TOKENS.textSecondary,
                        }}
                      >
                        Driver
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card
                    onClick={() => setRole('fleet')}
                    sx={{
                      cursor: 'pointer',
                      backgroundColor: role === 'fleet' ? 'rgba(0, 217, 192, 0.12)' : VELOUR_TOKENS.bgSurface2,
                      borderColor: role === 'fleet' ? VELOUR_TOKENS.accentTeal : VELOUR_TOKENS.borderSubtle,
                      borderWidth: 1.5,
                      borderStyle: 'solid',
                      borderRadius: 2.5,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: VELOUR_TOKENS.accentTeal,
                      },
                    }}
                  >
                    <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 }, textAlign: 'center' }}>
                      <BusinessIcon
                        sx={{
                          fontSize: 22,
                          color: role === 'fleet' ? VELOUR_TOKENS.accentTeal : VELOUR_TOKENS.textSecondary,
                          mb: 0.5,
                        }}
                      />
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontSize: 12.5,
                          fontWeight: 700,
                          color: role === 'fleet' ? '#FFF' : VELOUR_TOKENS.textSecondary,
                        }}
                      >
                        Fleet Operator
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>

            {/* Full Name */}
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
                Full Name
              </Typography>
              <TextField
                fullWidth
                placeholder="Alex Morgan"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlinedIcon sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 18 }} />
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
                Password
              </Typography>
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

            {/* Confirm Password */}
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
                Confirm Password
              </Typography>
              <TextField
                fullWidth
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                        size="small"
                        sx={{ color: VELOUR_TOKENS.textSecondary }}
                      >
                        {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
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

            {/* Primary Button */}
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
              Create Account
            </Button>
          </Box>
        </form>

        {/* Login Navigation Switch */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 13 }}>
            Already have an account?{' '}
            <RouterLink
              to="/login"
              style={{
                color: VELOUR_TOKENS.accentTeal,
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              Sign in
            </RouterLink>
          </Typography>
        </Box>

        {/* Security Footer */}
        <Box
          sx={{
            mt: 3,
            pt: 2,
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
            Enterprise-grade 256-bit encrypted security
          </Typography>
        </Box>
      </Paper>
    </AuthLayout>
  );
};
