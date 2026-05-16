'use client';

import { useState, createContext, useContext } from 'react';
import Box from '@mui/material/Box';
import AdminSidebar from '../../components/layout/AdminSidebar';
import Topbar from '../../components/layout/Topbar';

const SidebarContext = createContext();

export const useSidebarContext = () => useContext(SidebarContext);

/**
 * Admin Layout - No Authentication Required
 * Direct access to admin panel without login
 * TODO: Add authentication when needed
 */
export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <SidebarContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F6F8FC' }}>
        <AdminSidebar />
        <Box 
          sx={{ 
            flexGrow: 1, 
            display: 'flex', 
            flexDirection: 'column',
            ml: sidebarOpen ? '240px' : '64px',
            transition: 'margin-left 0.3s ease',
          }}
        >
          <Topbar />
          <Box 
            component="main" 
            sx={{ 
              flexGrow: 1, 
              p: 3,
              mt: '64px', // Topbar height
              bgcolor: '##F6F8FC',
              transition: 'margin-left 0.3s ease',
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </SidebarContext.Provider>
  );
}
