'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  Box,
  Container,
  IconButton,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  MenuOutlined as MenuIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import ReceiptIcon from '@mui/icons-material/Receipt';

export default function Header() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '#about' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Contact Us', href: '#contact' },
  ];

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1f2937' }}>
          📊 Invoiza
        </Typography>
        <IconButton onClick={handleMobileMenuToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        {navLinks.map((link) => (
          <ListItem key={link.href} disablePadding>
            <ListItemButton
              component={Link}
              href={link.href}
              sx={{ py: 1.5 }}
            >
              <ListItemText primary={link.label} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem sx={{ p: 2 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => {
              router.push('/auth/login');
              setMobileMenuOpen(false);
            }}
            sx={{
              backgroundColor: '#6366f1',
              color: 'white',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { backgroundColor: '#4f46e5' },
            }}
          >
            Login
          </Button>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <AppBar
      position="fixed"
      sx={{
        bgcolor: 'white',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 2,
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <Typography
              sx={{
                fontSize: '1.6rem',
                fontWeight: 700,
                color: '#1f2937',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                cursor: 'pointer',
              }}
            >
              <ReceiptIcon sx={{ color: '#6366f1' }} />
              Invoiza
            </Typography>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 6, flexGrow: 1, justifyContent: 'center' }}>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{ textDecoration: 'none' }}
                >
                  <Typography
                    sx={{
                      color: '#000000d4',
                      fontWeight: 500,
                      fontSize: '1rem',
                      cursor: 'pointer',
                      '&:hover': { color: '#6366f1' },
                    }}
                  >
                    {link.label}
                  </Typography>
                </Link>
              ))}
            </Box>
          )}

          {/* Right Actions */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
              variant='contained'
                onClick={() => router.push('/auth/login')}
                sx={{
                  backgroundColor: 'primary.main',
                  color: '#fff',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  '&:hover': { color: '#fff', backgroundColor: 'primary.hover' },
                }}
              >
                Get Started
              </Button>
              <Button
                onClick={() => router.push('/auth/login')}
                variant="contained"
                sx={{
                  backgroundColor: 'transparent',
                  color: 'primary.main',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  px: 3,
                  '&:hover': { backgroundColor: 'transparent', borderColor: 'primary.hover' },
                }}
              >
                Login
              </Button>
            </Box>
          )}

          {/* Mobile Menu Icon */}
          {isMobile && (
            <IconButton
              onClick={handleMobileMenuToggle}
              sx={{ color: '#1f2937' }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={handleMobileMenuToggle}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
}
