"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Avatar,
  Typography,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  ShoppingBag as ProductsIcon,
  Report as ReportIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Description as InvoiceIcon,
  Summarize as QuotationsIcon,
  ShoppingCart as ClientsIcon,
  FolderOpen as ProjectsIcon,
  Person as UsersIcon,
} from "@mui/icons-material";
import { useSidebarContext } from "../../app/(admin)/layout";
import { useAuth } from "../../hooks/useAuth";
import ReceiptIcon from '@mui/icons-material/Receipt';
import GroupIcon from '@mui/icons-material/Group';
import PaymentsIcon from '@mui/icons-material/Payments';
import AddchartIcon from '@mui/icons-material/Addchart';

const drawerWidth = 240;
const drawerWidthCollapsed = 70;

const menuItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: <DashboardIcon sx={{ fontSize: "24px" }} />,
  },
  {
    label: "Invoice",
    path: "/invoice",
    icon: <InvoiceIcon sx={{ fontSize: "24px" }} />,
  },
  {
    label: "Quotations",
    path: "/quotations",
    icon: <QuotationsIcon sx={{ fontSize: "24px" }} />,
  },
  {
    label: "Clients",
    path: "/clients",
    icon: <GroupIcon sx={{ fontSize: "24px" }} />,
  },
  {
    label: "Projects",
    path: "/projects",
    icon: <ProjectsIcon sx={{ fontSize: "24px" }} />,
  },
  {
    label: "Inquiries",
    path: "/inquiries",
    icon: <ProjectsIcon sx={{ fontSize: "24px" }} />,
  },
  {
    label: "Users",
    path: "/users",
    icon: <GroupIcon sx={{ fontSize: "24px" }} />,
  },
  {
    label: "Payments",
    path: "/payments",
    icon: <PaymentsIcon sx={{ fontSize: "24px" }} />,
  },
  {
    label: "Reports",
    path: "/reports",
    icon: <AddchartIcon sx={{ fontSize: "24px" }} />,
  },
  {
    label: "Items",
    path: "/items",
    icon: <ProductsIcon sx={{ fontSize: "24px" }} />,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: <SettingsIcon sx={{ fontSize: "24px" }} />,
  },
  {
    label: "Logout",
    path: "/auth/login",
    icon: <LogoutIcon sx={{ fontSize: "24px" }} />,
    isLogout: true,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useSidebarContext();
  const { logout, isLoggingOut } = useAuth();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Box
      sx={{
        width: sidebarOpen ? drawerWidth : drawerWidthCollapsed,
        flexShrink: 0,
        transition: "width 0.3s ease-in-out",
        bgcolor: "#ffffff",
        borderRight: "1px solid #e5e7eb",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        overflow: "hidden",
        zIndex: 1200,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Logo and Header */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: sidebarOpen ? "space-between" : "center",
          // borderBottom: "1px solid #e5e7eb",
        }}
      >
        {sidebarOpen ? (
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <Box
              sx={{
                fontSize: "20px",
                fontWeight: 700,
                color: "#1f2937",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "16px",
                  fontWeight: 700,
                }}
              >
                <IconButton
                  sx={{
                    color: "#6b7280",
                    p: 0.5,
                    "&:hover": { bgcolor: "#f3f4f6" },
                  }}
                >
                  <ReceiptIcon sx={{ fontSize: "28px", color: 'primary.main' }} />
                </IconButton>
              </Box>
              <Typography
                sx={{
                  fontSize: "24px",
                  fontWeight: '700',
                  color: 'text.primary'
                }}
              >
                Invoiza
              </Typography>
            </Box>
            <IconButton
              onClick={toggleSidebar}
              sx={{
                color: "#6b7280",
                p: 0.5,
                "&:hover": { bgcolor: "#f3f4f6" },
              }}
            >
              <MenuIcon sx={{ fontSize: "22px" }} />
            </IconButton>
          </Box>
        ) : (
          <IconButton
            onClick={toggleSidebar}
            sx={{
              color: "#6b7280",
              p: 0.5,
              "&:hover": { bgcolor: "#f3f4f6" },
            }}
          >
            <MenuIcon />
          </IconButton>
        )}
      </Box>

      {/* Menu Items */}
      <List
        sx={{
          px: 1.5,
          py: 1.2,
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          "&::-webkit-scrollbar": { width: "0px" },
   
          "&::-webkit-scrollbar-track": { bgcolor: "transparent" },
        }}
      >
        {menuItems.map((item) => {
          const isActive =
            pathname === item.path || pathname.startsWith(item.path + "/");

          return (
            <ListItemButton
              key={item.label}
              component={item.isLogout ? "button" : Link}
              href={!item.isLogout ? item.path : undefined}
              onClick={item.isLogout ? handleLogout : undefined}
              disabled={item.isLogout && isLoggingOut}
              sx={{
                mb: 0.4,
                borderRadius: "12px",
                color: isActive ? "primary.main" : "#666666",
                justifyContent: sidebarOpen ? "initial" : "center",
                px: sidebarOpen ? 1.5 : 1,
                py: 0.8,
                fontWeight: isActive ? 600 : 500,
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: isActive ? "#E7E4FC" : "#E7E4FC",
                  color: "primary.main",
                },                ...(isActive && {
                  bgcolor: "#E7E4FC",
                  borderLeft: "4px solid",
                  color: "primary.main",
                  // boxShadow: "0px 2px 4px rgba(113, 97, 239, 0.15)",
                }),
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: sidebarOpen ? 40 : "auto",
                  color: "inherit",
                  justifyContent: "center",
                  fontSize: "24px",
                }}
              >
                {item.icon}
              </ListItemIcon>
              {sidebarOpen && (
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: "14px",
                    fontWeight: "inherit",
                    color: "inherit",
                  }}
                  sx={{ ml: 1 }}
                />
              )}
            </ListItemButton>
          );
        })}
      </List>

      {/* User Profile Section */}
      {sidebarOpen && (
        <Box
          sx={{
            p: 2,
            borderTop: "1px solid #e5e7eb",
            bgcolor: "#ffffff",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: "primary.main",
              fontWeight: 700,
              color: "white",
              fontSize: "14px",
            }}
          >
            JD
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#1f2937",
              }}
            >
              John Deo
            </Typography>
            <Typography
              sx={{
                fontSize: "13px",
                color: "#666666",
                fontWeight: 400,
              }}
            >
              Super Admin
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}
//--- IGNORE ---
