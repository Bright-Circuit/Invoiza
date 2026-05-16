'use client';

import { useEffect, useState } from 'react';
import { Box, Container, Typography, LinearProgress } from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';


export default function SplashScreen() {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Animate progress bar from 0 to 100 more smoothly
    const interval = setInterval(() => {
      setProgress((prev) => {
        let increment;
        // Slower at start and end, faster in middle
        if (prev < 30) {
          increment = Math.random() * 8;
        } else if (prev < 70) {
          increment = Math.random() * 15;
        } else {
          increment = Math.random() * 12;
        }
        
        const newProgress = prev + increment;
        if (newProgress >= 100) {
          clearInterval(interval);
          // Start fade-out animation
          setTimeout(() => {
            setIsFadingOut(true);
          }, 800);
          // Then complete after fade-out
          setTimeout(() => {
            setIsComplete(true);
          }, 1300);
          return 100;
        }
        return newProgress;
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  // Hide splash screen after reaching 100%
  if (isComplete) {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        width: '100%',
        bgcolor: '#ffffff',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
        opacity: isFadingOut ? 0 : 1,
        transition: 'opacity 0.5s ease-out',
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center' }}>
          {/* Logo with animation */}
          <Typography
            sx={{
              fontSize: '2.5rem',
              fontWeight: 700,
              color: '#1f2937',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              mb: 4,
              animation: 'pulse 2s ease-in-out infinite',
              '@keyframes pulse': {
                '0%, 100%': {
                  opacity: 1,
                },
                '50%': {
                  opacity: 0.7,
                },
              },
            }}
          >
            <ReceiptIcon sx={{ color: '#6366f1', fontSize: '2.5rem' }} />
            Invoiza
          </Typography>

          {/* Progress Bar */}
          <Box sx={{ mb: 4 }}>
            <LinearProgress
              variant="determinate"
              value={Math.min(progress, 100)}
              sx={{
                height: 8,
                borderRadius: 10,
                backgroundColor: '#e5e7eb',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#6366f1',
                  borderRadius: 10,
                  transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 0 10px rgba(99, 102, 241, 0.4)',
                },
              }}
            />
          </Box>

          {/* Loading Text and Percentage */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              sx={{
                fontSize: '2rem',
                fontWeight: 700,
                color: '#6366f1',
                mb: 1,
                letterSpacing: '-0.02em',
              }}
            >
              {Math.floor(Math.min(progress, 100))}%
            </Typography>
            <Typography
              sx={{
                fontSize: '0.95rem',
                color: '#4b5563',
                fontWeight: 500,
                letterSpacing: '0.05em',
              }}
            >
              Loading...
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
