'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  IconButton,
  Divider,
} from '@mui/material';
import {
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Newsletter subscription:', email);
    setEmail('');
  };

  return (
    <Box component="footer" sx={{ bgcolor: '#f5f5f5', mt: 'auto', pt: 8, pb: 3, display: { xs: 'none', md: 'block' } }}>
      {/* Main Footer */}
      <Container maxWidth="xl">
        <Grid container spacing={6}>
          {/* Company Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, fontSize: '1.25rem' }}>
              BEYOS <Box component="span" sx={{ color: '#ff8c42' }}>CLOTHING</Box>
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, fontSize: '0.875rem' }}>
              hello@beyosclothing.com
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600, mb: 2, fontSize: '0.95rem' }}>
              +02 036 038 3996
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem', lineHeight: 1.7 }}>
              3665 Paseo Place, Suite 0960<br />
              San Diego
            </Typography>
          </Grid>

          {/* Information Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, fontSize: '1.1rem', color: 'text.primary' }}>
              Information
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Link href="/about" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', '&:hover': { color: '#ff8c42' }, cursor: 'pointer', fontSize: '0.875rem' }}>
                  About us
                </Typography>
              </Link>
              <Link href="/blog" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', '&:hover': { color: '#ff8c42' }, cursor: 'pointer', fontSize: '0.875rem' }}>
                  Our Blog
                </Typography>
              </Link>
              <Link href="/returns" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', '&:hover': { color: '#ff8c42' }, cursor: 'pointer', fontSize: '0.875rem' }}>
                  Start a Return
                </Typography>
              </Link>
              <Link href="/contact" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', '&:hover': { color: '#ff8c42' }, cursor: 'pointer', fontSize: '0.875rem' }}>
                  Contact Us
                </Typography>
              </Link>
              <Link href="/faq" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', '&:hover': { color: '#ff8c42' }, cursor: 'pointer', fontSize: '0.875rem' }}>
                  Shipping FAQ
                </Typography>
              </Link>
            </Box>
          </Grid>

          {/* Useful Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, fontSize: '1.1rem', color: 'text.primary' }}>
              Useful links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Link href="/account" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', '&:hover': { color: '#ff8c42' }, cursor: 'pointer', fontSize: '0.875rem' }}>
                  My Account
                </Typography>
              </Link>
              <Link href="/print-provider" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', '&:hover': { color: '#ff8c42' }, cursor: 'pointer', fontSize: '0.875rem' }}>
                  Print Provider
                </Typography>
              </Link>
              <Link href="/partner" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', '&:hover': { color: '#ff8c42' }, cursor: 'pointer', fontSize: '0.875rem' }}>
                  Become a Partner
                </Typography>
              </Link>
            </Box>
          </Grid>

          {/* Newsletter */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, fontSize: '1.1rem', color: 'text.primary' }}>
              Newsletter
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, fontSize: '0.875rem', lineHeight: 1.7 }}>
              Get the latest news, events & more delivered to your inbox.
            </Typography>
            <Box
              component="form"
              onSubmit={handleNewsletterSubmit}
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: 'white',
                borderRadius: 1,
                overflow: 'hidden',
                border: '1px solid #e0e0e0',
              }}
            >
              <TextField
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                size="small"
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      border: 'none',
                    },
                  },
                  '& input': {
                    fontSize: '0.875rem',
                    py: 1.5,
                  },
                }}
              />
              <IconButton
                type="submit"
                sx={{
                  borderRadius: 0,
                  px: 2,
                  py: 1.5,
                  color: 'text.primary',
                  '&:hover': { 
                    bgcolor: 'transparent',
                  },
                }}
              >
                <ArrowIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        {/* Payment Methods and Copyright */}
        <Box sx={{ mt: 8, pt: 4, borderTop: '1px solid #e0e0e0' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <Box sx={{ bgcolor: 'white', px: 1, py: 1, borderRadius: 1, border: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 60, height: 36 }}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" alt="American Express" style={{ height: 20 }} />
            </Box>
            <Box sx={{ bgcolor: 'white', px: 1, py: 1, borderRadius: 1, border: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 60, height: 36 }}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg" alt="Apple Pay" style={{ height: 15 }} />
            </Box>
            <Box sx={{ bgcolor: 'white', px: 1, py: 1, borderRadius: 1, border: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 60, height: 36 }}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/d/d6/Google_Pay_Logo.svg" alt="Google Pay" style={{ height: 15 }} />
            </Box>
            <Box sx={{ bgcolor: 'white', px: 1, py: 1, borderRadius: 1, border: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 60, height: 36 }}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" style={{ height: 15 }} />
            </Box>
            <Box sx={{ bgcolor: 'white', px: 1, py: 1, borderRadius: 1, border: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 60, height: 36 }}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" style={{ height: 15 }} />
            </Box>
          </Box>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem', textAlign: 'center' }}>
            © 2025 BeyosClothing. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
