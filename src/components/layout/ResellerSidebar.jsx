'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, IconButton } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import MenuIcon from '@mui/icons-material/Menu';
import { useSidebarContext } from '../../app/reseller/layout';

const drawerWidth = 260;
const drawerWidthCollapsed = 64;

const menuItems = [
  { label: 'Dashboard', href: '/reseller/dashboard', icon: <DashboardIcon /> },
  { label: 'Inventory', href: '/reseller/inventory', icon: <InventoryIcon /> },
  { label: 'Sales', href: '/reseller/sales', icon: <TrendingUpIcon /> },
];

export default function ResellerSidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useSidebarContext();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box
      sx={{
        width: sidebarOpen ? drawerWidth : drawerWidthCollapsed,
        flexShrink: 0,
        transition: 'width 0.3s ease-in-out',
        bgcolor: '#2d3748',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        overflow: 'hidden',
        zIndex: 1200,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: sidebarOpen ? 'space-between' : 'center',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          minHeight: '64px',
        }}
      >
        {sidebarOpen ? (
          <>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
              Reseller Panel
            </Typography>
            <IconButton
              onClick={toggleSidebar}
              sx={{ color: 'white', p: 0.5 }}
            >
              <MenuIcon />
            </IconButton>
          </>
        ) : (
          <IconButton
            onClick={toggleSidebar}
            sx={{ color: 'white', p: 0.5 }}
          >
            <MenuIcon />
          </IconButton>
        )}
      </Box>

      {/* Menu Items */}
      <List sx={{ px: 1, py: 2, flex: 1, overflowY: 'auto', overflowX: 'hidden', '&::-webkit-scrollbar': { width: '6px' }, '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255,255,255,0.2)', borderRadius: '3px' }, '&::-webkit-scrollbar-track': { bgcolor: 'transparent' } }}>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <ListItem key={item.href} disablePadding>
              <ListItemButton
                component={Link}
                href={item.href}
                selected={isActive}
                sx={{
                  mx: 1,
                  my: 0.5,
                  borderRadius: '6px',
                  justifyContent: sidebarOpen ? 'initial' : 'center',
                  px: sidebarOpen ? 2 : 1,
                  color: isActive ? '#ff8c42' : 'rgba(255,255,255,0.7)',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.05)',
                    color: 'white',
                  },
                  '&.Mui-selected': {
                    bgcolor: 'rgba(255,140,66,0.1)',
                    color: '#ff8c42',
                    '&:hover': {
                      bgcolor: 'rgba(255,140,66,0.15)',
                    },
                    '& .MuiListItemIcon-root': {
                      color: '#ff8c42',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: sidebarOpen ? 40 : 'auto', color: 'inherit', justifyContent: 'center' }}>
                  {item.icon}
                </ListItemIcon>
                {sidebarOpen && <ListItemText primary={item.label} />}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}
