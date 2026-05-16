'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Box,
  Avatar,
  IconButton,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Grid,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Search as SearchIcon,
  PointOfSale as PosIcon,
} from '@mui/icons-material';
import { useStore } from '../../store/useStore';

// Import all sidebar contexts
let useSidebarContext = null;

export default function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchValue, setSearchValue] = useState('');

  // Dynamically import the correct context based on the current path
  if (pathname?.startsWith('/customer')) {
    const { useSidebarContext: useCustomerSidebarContext } = require('../../app/customer/layout');
    useSidebarContext = useCustomerSidebarContext;
  } else {
    const { useSidebarContext: useAdminSidebarContext } = require('../../app/(admin)/layout');
    useSidebarContext = useAdminSidebarContext;
  }

  const { sidebarOpen } = useSidebarContext();

  // Calculate left position based on route and sidebar state
  let sidebarWidth = 240; // Default admin width
  let sidebarCollapsedWidth = 64;

  if (pathname?.startsWith('/customer')) {
    sidebarWidth = 260;
  }

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const [open, setOpen] = useState(false);
  const [terminal, setTerminal] = useState("");
  const [code, setCode] = useState("");
  const [validating, setValidating] = useState(false);
  const [terminals, setTerminals] = useState([]);
  const [terminalsLoading, setTerminalsLoading] = useState(false);
  const showSnackbar = useStore((s) => s.showSnackbar);

  const handleClose = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setTerminal("");
    setOpen(false);
  };

  const handleSubmit = async () => {
    if (!terminal || !code) return;
    setValidating(true);
    try {
      const { posService } = require('../../services/pos.services');
      await posService.validateTerminal(terminal, code);
      // Save terminal uuid to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('pos_terminal_uuid', terminal);
      }
      handleClose();
      router.push('/pos');
    } catch (err) {
      console.error('Terminal validation error', err);
          showSnackbar(err.message || 'Terminal validation error', 'error');
    } finally {
      setValidating(false);
    }
  };

  return (
    <Box
      sx={{
        height: '64px',
        bgcolor: 'white',
        borderBottom: '1px solid #e5e7eb',
        borderLeft: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 3,
        position: 'fixed',
        top: 0,
        left: sidebarOpen ? sidebarWidth : sidebarCollapsedWidth,
        right: 0,
        zIndex: 1100,
        transition: 'left 0.3s ease-in-out',
      }}
    >
      {/* Search Bar - Left Side */}
      <TextField
        placeholder="Search Here..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        size="small"
        sx={{
          width: '320px',
          '& .MuiOutlinedInput-root': {
            bgcolor: '#f9fafb',
            borderRadius: '8px',
            fontSize: '14px',
            height: '40px',
            '& fieldset': {
              borderColor: '#e5e7eb',
            },
            '&:hover fieldset': {
              borderColor: '#d1d5db',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#7161EF',
            },
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: '#9ca3af', fontSize: '20px', mr: 1 }} />
            </InputAdornment>
          ),
        }}
      />

      {/* Right Side Icons and Avatar */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>

        {/* Notification Icon */}
        <IconButton
          sx={{
            color: '#6b7280',
            width: 40,
            height: 40,
            bgcolor: '#f3f4f6',
            '&:hover': {
              bgcolor: '#f3f4f6',
            },
          }}
        >
          <NotificationsIcon sx={{ fontSize: '20px' }} />
        </IconButton>

        {/* User Avatar */}
        <IconButton
          onClick={handleMenuOpen}
          sx={{ p: 0 }}
        >
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: '#7161EF',
              fontSize: '16px',
              fontWeight: 600,
              color: 'white',
            }}
          >
            JD
          </Avatar>
        </IconButton>

        {/* User Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 180,
            },
          }}
        >
          <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
          <MenuItem onClick={handleMenuClose}>My Account</MenuItem>
          <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
        </Menu>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle sx={{ fontFamily: "'Play', sans-serif" }}>Select Terminal & Enter Code</DialogTitle>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1, minWidth: "400px" }}>

            <Grid item xs={6}>
            <FormControl fullWidth>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, fontFamily: "'Play', sans-serif" }}>Terminal</Typography>
              <Select
                value={terminal}
                onChange={(e) => setTerminal(e.target.value)}
              >
                <MenuItem value="">
                  <em>Select terminal</em>
                </MenuItem>
                {terminals && terminals.length > 0 ? (
                  terminals.map((t) => (
                    <MenuItem key={t.uuid} value={t.uuid}>
                      {t.name}{t.location ? ` - ${t.location}` : ''}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>
                    {terminalsLoading ? 'Loading terminals...' : 'No terminals available'}
                  </MenuItem>
                )}
              </Select>
            </FormControl>
            </Grid>

            <Grid item xs={6}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, fontFamily: "'Play', sans-serif" }}>Code</Typography>
            <TextField
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter code"
              fullWidth 
              sx={{
                fontFamily: "'Play', sans-serif",
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  height: '45px',
                  borderColor: '#D9D9D9',
                  bgcolor: 'white',
                  fontFamily: "'Play', sans-serif",
                  fontSize: '14px',
                  '& fieldset': {
                    borderColor: '#D9D9D9',
                  },
                  '&:hover fieldset': {
                    borderColor: '#D9D9D9',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#D9D9D9',
                  },
                },
              }}
            />
            </Grid>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleCancel} variant="outlined" sx={{ fontFamily: "'Play', sans-serif" }}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={validating}
              sx={{ fontFamily: "'Play', sans-serif", bgcolor: 'primary.main', '&:hover': { bgcolor: '#ff7a2e' } }}
            >
              {validating ? 'Validating...' : 'Submit'}
            </Button>
          </DialogActions>
        </Dialog>

      </Box>
    </Box>
  );
}
//--- IGNORE ---