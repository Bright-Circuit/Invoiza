'use client';

import { useEffect, useState, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import CustomerSidebar from '../../components/layout/CustomerSidebar';
import Topbar from '../../components/layout/Topbar';
import { useStore } from '../../store/useStore';
import { ROLES } from '../../lib/roles';
import Loader from '../../components/common/Loader';
import { useHydration } from '../../hooks/useHydration';

const SidebarContext = createContext();

export const useSidebarContext = () => useContext(SidebarContext);

export default function CustomerLayout({ children }) {
  const router = useRouter();
  const hydrated = useHydration();
  const { user, isAuthenticated } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (hydrated && (!isAuthenticated || !user || user.role !== ROLES.CUSTOMER)) {
      console.log('Customer redirect:', { hydrated, isAuthenticated, user, role: user?.role });
      router.replace('/auth/login');
    }
  }, [hydrated, user, isAuthenticated, router]);

  if (!hydrated) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <Loader />
      </Box>
    );
  }

  if (!isAuthenticated || !user || user.role !== ROLES.CUSTOMER) {
    return null;
  }

  return (
    <SidebarContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f3f4f6' }}>
        <CustomerSidebar />
        <Box 
          sx={{ 
            flexGrow: 1, 
            display: 'flex', 
            flexDirection: 'column',
            ml: sidebarOpen ? '260px' : '64px',
            transition: 'margin-left 0.3s ease-in-out',
          }}
        >
          <Topbar />
          <Box 
            component="main" 
            sx={{ 
              flexGrow: 1, 
              p: 3,
              mt: '64px',
              bgcolor: '#f3f4f6',
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </SidebarContext.Provider>
  );
}
