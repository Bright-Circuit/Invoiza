'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Link as MuiLink,
  Alert,
} from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';


// Demo credentials for testing
const DEMO_CREDENTIALS = {
  email: 'demo@invoiza.com',
  password: 'Demo@123',
};

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showDemoInfo, setShowDemoInfo] = useState(true);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
    setErrors({ ...errors, [name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      // Check against demo credentials
      if (formData.email === DEMO_CREDENTIALS.email && 
          formData.password === DEMO_CREDENTIALS.password) {
        
        const { useStore } = await import('../../../../store/useStore');
        const { setAuthCookies } = await import('../../../../lib/cookies');
        const { ROLES } = await import('../../../../lib/roles');
        
        // Create demo user
        const dummyUser = {
          id: 1,
          name: 'Demo Admin',
          email: formData.email,
          role: ROLES.ADMIN,
        };

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Set cookies
        setAuthCookies(null, null, ROLES.ADMIN);
        
        // Set auth state
        useStore.getState().setAuth(dummyUser);
        
        // Redirect to admin dashboard
        router.push('/dashboard');
      } else {
        setErrors({ general: 'Invalid email or password. Please use demo credentials.' });
      }
    } catch (error) {
      setErrors({ general: error.message || 'Login failed' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            bgcolor: 'white',
            borderRadius: 3,
            p: 4,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          }}
        >
         {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
            <Typography
              sx={{
                fontSize: '1.6rem',
                fontWeight: 700,
                color: '#1f2937',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                mb: 2,
                cursor: 'pointer',
              }}
            >
              <ReceiptIcon sx={{ color: 'primary.main', fontSize: '1.8rem' }} />
              Invoiza
            </Typography>
          </Link>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              textAlign: 'center',
              mb: 1,
              color: 'text.primary',
            }}
          >
            Welcome Back !
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: 'center', mb: 3 }}
          >
            Please enter your credentials here
          </Typography>

          {/* Demo Credentials Info */}
          {showDemoInfo && (
            <Alert 
              severity="info" 
              onClose={() => setShowDemoInfo(false)}
              sx={{ mb: 2, fontSize: '0.875rem' }}
            >
              Demo: {DEMO_CREDENTIALS.email} / {DEMO_CREDENTIALS.password}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            {/* Email Field */}
            <Box sx={{ mb: 2.5 }}>
              <Typography
                variant="body2"
                sx={{ mb: 0.5, color: 'text.primary', fontWeight: 500 }}
              >
                Email
              </Typography>
              <TextField
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                placeholder=""
                error={!!errors.email}
                helperText={errors.email}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'white',
                    height: 50,
                    borderRadius: 1.5,
                    '& fieldset': {
                      borderColor: 'rgba(0,0,0,0.12)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(0,0,0,0.2)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />
            </Box>

            {/* Password Field */}
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="body2"
                sx={{ mb: 0.5, color: 'text.primary', fontWeight: 500 }}
              >
                Password
              </Typography>
              <TextField
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                fullWidth
                placeholder=""
                error={!!errors.password}
                helperText={errors.password}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'white',
                    borderRadius: 1.5,
                    height: 50,
                    '& fieldset': {
                      borderColor: 'rgba(0,0,0,0.12)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(0,0,0,0.2)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />
            </Box>

            {/* Remember Me & Forgot Password */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    size="small"
                    sx={{
                      color: 'rgba(0,0,0,0.4)',
                      '&.Mui-checked': {
                        color: 'primary.main',
                      },
                    }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Remember Me
                  </Typography>
                }
              />
              <MuiLink
                href="/auth/forgot-password"
                underline="hover"
                sx={{
                  fontSize: '0.875rem',
                  color: 'text.secondary',
                  cursor: 'pointer',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                Forgot Password?
              </MuiLink>
            </Box>

            {/* Error Message */}
            {errors.general && (
              <Typography
                color="error"
                variant="body2"
                sx={{ mb: 2, textAlign: 'center' }}
              >
                {errors.general}
              </Typography>
            )}

            {/* Sign In Button */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isLoading}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                py: 1.5,
                borderRadius: 1.5,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: 'primary.hover',
                  boxShadow: 'none',
                },
                '&:disabled': {
                  bgcolor: '#a5b4fc',
                },
              }}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>

            {/* Sign Up Link */}
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Don&apos;t have an account ? 
                <Link href="/auth/register" passHref style={{ textDecoration: 'none' }}>
                  <Typography
                    component="span"
                    sx={{
                      color: 'primary.main',
                      fontWeight: 600,
                      cursor: 'pointer',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    {' '}Sign Up
                  </Typography>
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
