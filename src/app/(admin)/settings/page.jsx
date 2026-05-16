"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  Grid,
  Select,
  MenuItem,
  FormControl,
  IconButton,
  Alert,
  CircularProgress,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const COUNTRIES = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "India",
  "Germany",
  "France",
  "Spain",
  "Italy",
  "Japan",
  "China",
  "Brazil",
  "Mexico",
  "South Africa",
  "UAE",
  "Sri Lanka",
];

const USER_TYPES = ["Super Admin", "Admin", "User", "Manager"];
const DEFAULT_COMPANY_LOGO = "/images/company-logo-default.svg";

function TabPanel(props) {
  const { children, value, index } = props;

  return (
    <div hidden={value !== index} style={{ width: "100%" }}>
      {value === index && <Box sx={{ pt: 4 }}>{children}</Box>}
    </div>
  );
}

export default function SettingsPage() {
  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [generalData, setGeneralData] = useState({
    firstName: "John",
    lastName: "Deo",
    email: "johndeo@gmail.com",
    phoneNumber: "0789541254",
    userType: "Super Admin",
    country: "Sri Lanka",
  });

  const [securityData, setSecurityData] = useState({
    username: "johndeo",
    password: "••••••••",
    newPassword: "",
    confirmPassword: "",
  });

  const [companyData, setCompanyData] = useState({
    companyId: "OXY12",
    companyName: "OXY12",
    companyEmail: "oxy2welve@gmail.com",
    businessNumber: "+94 71 195 0429",
    taxId: "OXY12-TAX-001",
  });

  const [companyLogo, setCompanyLogo] = useState(null);

  // Fetch company data on component mount
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/company");
        if (response.ok) {
          const data = await response.json();
          setCompanyData({
            companyId: data.companyId || "OXY12",
            companyName: data.companyName || "OXY12",
            companyEmail: data.companyEmail || "oxy2welve@gmail.com",
            businessNumber: data.businessNumber || "+94 71 195 0429",
            taxId: data.taxId || "OXY12-TAX-001",
          });
            if (data.logoBase64) {
              setCompanyLogo(data.logoBase64);
            }
        }
      } catch (error) {
        console.error("Error fetching company data:", error);
        setErrorMessage("Failed to load company data");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleGeneralChange = (e) => {
    const { name, value } = e.target;
    setGeneralData({ ...generalData, [name]: value });
  };

  const handleSecurityChange = (e) => {
    const { name, value } = e.target;
    setSecurityData({ ...securityData, [name]: value });
  };

  const handleCompanyChange = (e) => {
    const { name, value } = e.target;
    setCompanyData({ ...companyData, [name]: value });
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompanyLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Save company data
      const response = await fetch("/api/company", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...companyData,
          ...(companyLogo ? { logoBase64: companyLogo } : {}),
        }),
      });

      if (response.ok) {
        setSuccessMessage("Settings saved successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setErrorMessage("Failed to save settings");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      setErrorMessage("An error occurred while saving settings");
    } finally {
      setSaving(false);
    }
  };

  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      height: "50px",
      "& fieldset": { borderColor: "#d1d5db" },
      "&:hover fieldset": { borderColor: "#9ca3af" },
      "&.Mui-focused fieldset": { borderColor: "primary.main" },
    },
    "& .MuiOutlinedInput-input": {
      fontSize: "14px",
      padding: "0 14px",
    },
  };

  const tabsSx = {
    "& .MuiTabs-root": {
      borderBottom: "2px solid #e5e7eb",
      minHeight: "auto",
    },
    "& .MuiTab-root": {
      fontSize: "16px",
      fontWeight: 500,
      color: "#6b7280",
      textTransform: "none",
      minHeight: "auto",
      padding: "16px 0",
      marginRight: "32px",
      borderBottom: "3px solid transparent",
      "&.Mui-selected": {
        color: "primary.main",
        borderBottom: "3px solid",
        borderBottomColor: "primary.main",
      },
      "&:hover": {
        color: "#374151",
      },
    },
    "& .MuiTabScrollButtonAuto-root": {
      display: "none",
    },
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Header */}
      <Typography
        variant="h4" sx={{ mb: 1, fontWeight: 700 }}
      >
        Settings
      </Typography>

      {/* Messages */}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {/* Tabs - Only show when not loading */}
      {!loading && (
        <>
          <Box sx={tabsSx}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="General" />
              <Tab label="Security" />
              <Tab label="Company" />
            </Tabs>
          </Box>

      {/* ─── General Tab ─────────────────────────────────────────────────────────── */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {/* User Avatar & Name */}
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                mb: 4,
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  backgroundColor: "#DBDAF9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "primary.main",
                  fontSize: "32px",
                  fontWeight: 600,
                }}
              >
                JD
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontSize: "20px",
                    fontWeight: 600,
                    color: "#1f2937",
                  }}
                >
                  {generalData.firstName} {generalData.lastName}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "14px",
                    color: "#6b7280",
                    mt: 0.5,
                  }}
                >
                  {generalData.email}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* First Name */}
          <Grid item xs={12} sm={6}>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 500,
                color: "#1f2937",
                mb: 1,
              }}
            >
              First Name
            </Typography>
            <TextField
              fullWidth
              name="firstName"
              value={generalData.firstName}
              onChange={handleGeneralChange}
              variant="outlined"
              sx={textFieldSx}
            />
          </Grid>

          {/* Last Name */}
          <Grid item xs={12} sm={6}>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 500,
                color: "#1f2937",
                mb: 1,
              }}
            >
              Last Name
            </Typography>
            <TextField
              fullWidth
              name="lastName"
              value={generalData.lastName}
              onChange={handleGeneralChange}
              variant="outlined"
              sx={textFieldSx}
            />
          </Grid>

          {/* Email */}
          <Grid item xs={12} sm={6}>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 500,
                color: "#1f2937",
                mb: 1,
              }}
            >
              Email
            </Typography>
            <TextField
              fullWidth
              name="email"
              type="email"
              value={generalData.email}
              onChange={handleGeneralChange}
              variant="outlined"
              sx={textFieldSx}
            />
          </Grid>

          {/* Phone Number */}
          <Grid item xs={12} sm={6}>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 500,
                color: "#1f2937",
                mb: 1,
              }}
            >
              Phone Number
            </Typography>
            <TextField
              fullWidth
              name="phoneNumber"
              value={generalData.phoneNumber}
              onChange={handleGeneralChange}
              variant="outlined"
              sx={textFieldSx}
            />
          </Grid>

          {/* User Type */}
          <Grid item xs={12} sm={6}>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 500,
                color: "#1f2937",
                mb: 1,
              }}
            >
              User Type
            </Typography>
            <FormControl fullWidth>
              <Select
                name="userType"
                value={generalData.userType}
                onChange={handleGeneralChange}
                variant="outlined"
                sx={{
                  borderRadius: "8px",
                  height: "50px",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#d1d5db",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#9ca3af",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "primary.main",
                  },
                }}
              >
                {USER_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Country */}
          <Grid item xs={12} sm={6}>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 500,
                color: "#1f2937",
                mb: 1,
              }}
            >
              Country
            </Typography>
            <FormControl fullWidth>
              <Select
                name="country"
                value={generalData.country}
                onChange={handleGeneralChange}
                variant="outlined"
                sx={{
                  borderRadius: "8px",
                  height: "50px",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#d1d5db",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#9ca3af",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "primary.main",
                  },
                }}
              >
                {COUNTRIES.map((country) => (
                  <MenuItem key={country} value={country}>
                    {country}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </TabPanel>

      {/* ─── Security Tab ─────────────────────────────────────────────────────────── */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          {/* Username */}
          <Grid item xs={12} sm={6}>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 500,
                color: "#1f2937",
                mb: 1,
              }}
            >
              Username
            </Typography>
            <TextField
              fullWidth
              name="username"
              value={securityData.username}
              onChange={handleSecurityChange}
              variant="outlined"
              sx={textFieldSx}
            />
          </Grid>

          {/* Current Password */}
          <Grid item xs={12} sm={6}>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 500,
                color: "#1f2937",
                mb: 1,
              }}
            >
              Password
            </Typography>
            <TextField
              fullWidth
              name="password"
              type={showPassword ? "text" : "password"}
              value={securityData.password}
              onChange={handleSecurityChange}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    sx={{ mr: 1 }}
                  >
                    {showPassword ? (
                      <VisibilityOffIcon sx={{ fontSize: 20 }} />
                    ) : (
                      <VisibilityIcon sx={{ fontSize: 20 }} />
                    )}
                  </IconButton>
                ),
              }}
              sx={textFieldSx}
            />
          </Grid>

          {/* New Password */}
          <Grid item xs={12} sm={6}>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 500,
                color: "#1f2937",
                mb: 1,
              }}
            >
              New Password
            </Typography>
            <TextField
              fullWidth
              name="newPassword"
              type={showNewPassword ? "text" : "password"}
              value={securityData.newPassword}
              onChange={handleSecurityChange}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    edge="end"
                    sx={{ mr: 1 }}
                  >
                    {showNewPassword ? (
                      <VisibilityOffIcon sx={{ fontSize: 20 }} />
                    ) : (
                      <VisibilityIcon sx={{ fontSize: 20 }} />
                    )}
                  </IconButton>
                ),
              }}
              sx={textFieldSx}
            />
          </Grid>

          {/* Confirm Password */}
          <Grid item xs={12} sm={6}>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 500,
                color: "#1f2937",
                mb: 1,
              }}
            >
              Confirm Password
            </Typography>
            <TextField
              fullWidth
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={securityData.confirmPassword}
              onChange={handleSecurityChange}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                    sx={{ mr: 1 }}
                  >
                    {showConfirmPassword ? (
                      <VisibilityOffIcon sx={{ fontSize: 20 }} />
                    ) : (
                      <VisibilityIcon sx={{ fontSize: 20 }} />
                    )}
                  </IconButton>
                ),
              }}
              sx={textFieldSx}
            />
          </Grid>
        </Grid>
      </TabPanel>

      {/* ─── Company Tab ─────────────────────────────────────────────────────────── */}
      <TabPanel value={tabValue} index={2}>
        {/* Company Logo Upload & Info */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 4,
          }}
        >
          <Box
            sx={{
              position: "relative",
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                backgroundColor: companyLogo ? "#f3f4f6" : "#fbbf24",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "32px",
                fontWeight: 600,
                overflow: "hidden",
                border: "2px solid #e5e7eb",
              }}
            >
              {companyLogo ? (
                <img
                  src={companyLogo}
                  alt="Company Logo"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <img
                  src={DEFAULT_COMPANY_LOGO}
                  alt="Default Company Logo"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              )}
            </Box>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              style={{ display: "none" }}
              id="logo-upload"
            />
            <label htmlFor="logo-upload">
              <IconButton
                component="span"
                sx={{
                  position: "absolute",
                  bottom: -10,
                  right: -10,
                  backgroundColor: "primary.main",
                  color: "white",
                  width: 30,
                  height: 30,
                  "&:hover": {
                    backgroundColor: "primary.hover",
                  },
                }}
              >
                <CloudUploadIcon sx={{ fontSize: 15 }} />
              </IconButton>
            </label>
          </Box>
          <Box>
            <Typography
              sx={{
                fontSize: "20px",
                fontWeight: 600,
                color: "#1f2937",
              }}
            >
              {companyData.companyName}
            </Typography>
            <Typography
              sx={{
                fontSize: "14px",
                color: "#6b7280",
                mt: 0.5,
              }}
            >
              {companyData.companyEmail}
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Company ID */}
          <Grid item xs={12} sm={6}>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 500,
                color: "#1f2937",
                mb: 1,
              }}
            >
              Company ID
            </Typography>
            <TextField
              fullWidth
              name="companyId"
              value={companyData.companyId}
              onChange={handleCompanyChange}
              variant="outlined"
              sx={textFieldSx}
            />
          </Grid>

          {/* Company Name */}
          <Grid item xs={12} sm={6}>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 500,
                color: "#1f2937",
                mb: 1,
              }}
            >
              Company Name
            </Typography>
            <TextField
              fullWidth
              name="companyName"
              value={companyData.companyName}
              onChange={handleCompanyChange}
              variant="outlined"
              sx={textFieldSx}
            />
          </Grid>

          {/* Company Email */}
          <Grid item xs={12} sm={6}>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 500,
                color: "#1f2937",
                mb: 1,
              }}
            >
              Company Email
            </Typography>
            <TextField
              fullWidth
              name="companyEmail"
              type="email"
              value={companyData.companyEmail}
              onChange={handleCompanyChange}
              variant="outlined"
              sx={textFieldSx}
            />
          </Grid>

          {/* Business Number */}
          <Grid item xs={12} sm={6}>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 500,
                color: "#1f2937",
                mb: 1,
              }}
            >
              Business Number
            </Typography>
            <TextField
              fullWidth
              name="businessNumber"
              value={companyData.businessNumber}
              onChange={handleCompanyChange}
              variant="outlined"
              sx={textFieldSx}
            />
          </Grid>

          {/* Tax ID */}
          <Grid item xs={12} sm={6}>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 500,
                color: "#1f2937",
                mb: 1,
              }}
            >
              Tax ID
            </Typography>
            <TextField
              fullWidth
              name="taxId"
              value={companyData.taxId}
              onChange={handleCompanyChange}
              variant="outlined"
              sx={textFieldSx}
            />
          </Grid>
        </Grid>
      </TabPanel>

      {/* ─── Save Button ─────────────────────────────────────────────────────────── */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mt: 6,
          pt: 4,
          borderTop: "1px solid #e5e7eb",
        }}
      >
        <Button
          onClick={handleSaveChanges}
          disabled={saving}
          variant="contained"
          sx={{
            backgroundColor: "primary.main",
            px: 6,
            py: 1.2,
            borderRadius: "10px",
            textTransform: "none",
            fontSize: "16px",
            fontWeight: 500,
            "&:hover": { backgroundColor: "primary.hover" },
            "&:disabled": { opacity: 0.6 },
          }}
        >
          {saving ? <CircularProgress size={24} /> : "Save Changes"}
        </Button>
      </Box>
        </>
      )}
    </Box>
  );
}
