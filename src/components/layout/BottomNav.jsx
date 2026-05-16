'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  Badge,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Home as HomeIcon,
  FavoriteBorder as WishlistIcon,
  ShoppingCartOutlined as CartIcon,
  PersonOutline as AccountIcon,
} from '@mui/icons-material';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import { useStore } from '../../store/useStore';

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { cartCount, wishlist } = useStore();

  // Only show on mobile
  if (!isMobile) return null;

  const getActiveValue = () => {
    if (pathname === '/') return 0;
    if (pathname === '/wishlist') return 1;
    if (pathname === '/cart') return 2;
    if (pathname.includes('/auth') || pathname.includes('/profile')) return 3;
    return 0;
  };

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        borderTop: '1px solid #E8E8E8',
      }}
      elevation={3}
    >
      <BottomNavigation
        value={getActiveValue()}
        onChange={(event, newValue) => {
          const routes = ['/', '/wishlist', '/cart', '/auth/login'];
          router.push(routes[newValue]);
        }}
        showLabels
        sx={{
          height: 65,
          bgcolor: 'white',
          '& .MuiBottomNavigationAction-root': {
            minWidth: 'auto',
            padding: '6px 12px',
            color: '#666',
          },
          '& .Mui-selected': {
            color: '#FF8C42',
            '& .MuiBottomNavigationAction-label': {
              fontSize: '0.75rem',
              fontWeight: 600,
            },
          },
          '& .MuiBottomNavigationAction-label': {
            fontSize: '0.75rem',
            marginTop: '4px',
          },
        }}
      >
        <BottomNavigationAction
          label="Home"
          icon={<HomeIcon sx={{ fontSize: 24 }} />}
          sx={{
            '&.Mui-selected': {
              color: '#FF8C42',
            },
          }}
        />
        <BottomNavigationAction
          label="Wish List"
          icon={
            <Badge 
              badgeContent={wishlist?.length || 0} 
              sx={{ 
                '& .MuiBadge-badge': { 
                  bgcolor: '#FF8C42', 
                  color: 'white',
                  fontSize: '0.625rem',
                  minWidth: 16,
                  height: 16,
                  top: -2,
                  right: -2,
                } 
              }}
            >
              <WishlistIcon sx={{ fontSize: 24 }} />
            </Badge>
          }
          sx={{
            '&.Mui-selected': {
              color: '#FF8C42',
            },
          }}
        />
        <BottomNavigationAction
          label="Cart"
          icon={
            <Badge 
              badgeContent={cartCount} 
              sx={{ 
                '& .MuiBadge-badge': { 
                  bgcolor: '#FF8C42', 
                  color: 'white',
                  fontSize: '0.625rem',
                  minWidth: 16,
                  height: 16,
                  top: -2,
                  right: -2,
                } 
              }}
            >
              <LocalMallOutlinedIcon sx={{ fontSize: 24 }} />
            </Badge>
          }
          sx={{
            '&.Mui-selected': {
              color: '#FF8C42',
            },
          }}
        />
        <BottomNavigationAction
          label="Account"
          icon={<AccountIcon sx={{ fontSize: 24 }} />}
          sx={{
            '&.Mui-selected': {
              color: '#FF8C42',
            },
          }}
        />
      </BottomNavigation>
    </Paper>
  );
}
