'use client';

import { usePathname } from 'next/navigation';
import Box from '@mui/material/Box';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import BottomNav from '../../components/layout/BottomNav';
import SplashScreen from '../../components/layout/SplashScreen';

export default function WebsiteLayout({ children }) {
  const pathname = usePathname();
  
  // Don't show header/footer on auth pages
  const isAuthPage = pathname?.startsWith('/auth');

  if (isAuthPage) {
    return children;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <SplashScreen />
      <Header />
      <Box component="main" sx={{ flexGrow: 1, pb: { xs: '65px', md: 0 } }}>
        {children}
      </Box>
      <Footer />
      <BottomNav />
    </Box>
  );
}
