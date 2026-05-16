"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Chip,
  Typography,
  Grid,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ErrorIcon from "@mui/icons-material/Error";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

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
];

const ROWS_PER_PAGE = 5;

// ─── Pagination Component ─────────────────────────────────────────────────────

function Pagination({ totalItems, currentPage, onPageChange }) {
  const totalPages = Math.ceil(totalItems / ROWS_PER_PAGE);

  if (totalPages <= 1) return null;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: 1,
        mt: 2,
      }}
    >
      {/* Prev arrow */}
      <IconButton
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        size="small"
        sx={{
          width: 36,
          height: 36,
          backgroundColor: "#e5e7eb",
          borderRadius: "50%",
          color: currentPage === 1 ? "#9ca3af" : "#374151",
          "&:hover": {
            backgroundColor: currentPage === 1 ? "#e5e7eb" : "#d1d5db",
          },
          "&.Mui-disabled": { backgroundColor: "#e5e7eb", opacity: 0.5 },
        }}
      >
        <ArrowBackIosNewIcon sx={{ fontSize: 13 }} />
      </IconButton>

      {/* Page number buttons */}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Box
          key={page}
          onClick={() => onPageChange(page)}
          sx={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: "14px",
            fontFamily: "public/sans-serif",
            fontWeight: 500,
            backgroundColor: page === currentPage ? "primary.main" : "#e5e7eb",
            color: page === currentPage ? "#ffffff" : "#374151",
            transition: "background 0.15s",
            "&:hover": {
              backgroundColor:
                page === currentPage ? "primary.hover" : "#d1d5db",
            },
          }}
        >
          {page}
        </Box>
      ))}

      {/* Next arrow */}
      <IconButton
        onClick={() =>
          currentPage < totalPages && onPageChange(currentPage + 1)
        }
        disabled={currentPage === totalPages}
        size="small"
        sx={{
          width: 36,
          height: 36,
          backgroundColor: "#e5e7eb",
          borderRadius: "50%",
          color: currentPage === totalPages ? "#9ca3af" : "#374151",
          "&:hover": {
            backgroundColor: currentPage === totalPages ? "#e5e7eb" : "#d1d5db",
          },
          "&.Mui-disabled": { backgroundColor: "#e5e7eb", opacity: 0.5 },
        }}
      >
        <ArrowForwardIosIcon sx={{ fontSize: 13 }} />
      </IconButton>
    </Box>
  );
}

// ─── Shared Add Customer Dialog Component ─────────────────────────────────────

function AddCustomerDialog({ open, onClose, onSave, editingCustomer }) {
  const [formData, setFormData] = useState({
    customerName: "",
    companyName: "",
    businessNumber: "",
    email: "",
    phoneNumber: "",
    country: "",
    billingAddress: "",
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (open) {
      if (editingCustomer) {
        setFormData({
          customerName: editingCustomer.customerName,
          companyName: editingCustomer.companyName || "",
          businessNumber: editingCustomer.businessNumber || "",
          email: editingCustomer.email,
          phoneNumber: editingCustomer.phoneNumber || "",
          country: editingCustomer.country || "",
          billingAddress: editingCustomer.billingAddress || "",
        });
      } else {
        setFormData({
          customerName: "",
          companyName: "",
          businessNumber: "",
          email: "",
          phoneNumber: "",
          country: "",
          billingAddress: "",
        });
      }
      setFormErrors({});
    }
  }, [open, editingCustomer]);

  const validateForm = () => {
    const errors = {};
    if (!formData.customerName.trim())
      errors.customerName = "Customer name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email format";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSave = () => {
    if (validateForm()) onSave(formData, editingCustomer?.id);
  };

  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      height: "50px",
      "& fieldset": { borderColor: "#d1d5db" },
      "&:hover fieldset": { borderColor: "#9ca3af" },
      "&.Mui-focused fieldset": { borderColor: "primary.main" },
    },
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: "25px" } }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <Typography
          sx={{
            fontSize: "22px",
            fontWeight: 600,
            color: "#1f2937",
            textAlign: "center",
            flex: 1,
          }}
        >
          {editingCustomer ? "Edit Customer" : "New Customer"}
        </Typography>
        <IconButton onClick={onClose} sx={{ color: "#6b7280" }}>
          <Box sx={{ fontSize: "24px", fontWeight: "bold" }}>×</Box>
        </IconButton>
      </Box>

      {/* Body */}
      <DialogContent sx={{ pt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 500,
                color: "#1f2937",
                mb: 1,
              }}
            >
              Customer Name
            </Typography>
            <TextField
              fullWidth
              name="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
              error={Boolean(formErrors.customerName)}
              helperText={formErrors.customerName}
              placeholder="Enter customer name"
              variant="outlined"
              size="medium"
              sx={textFieldSx}
            />
          </Grid>

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
              value={formData.companyName}
              onChange={handleInputChange}
              placeholder="Enter company name"
              variant="outlined"
              size="medium"
              sx={textFieldSx}
            />
          </Grid>

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
              value={formData.businessNumber}
              onChange={handleInputChange}
              placeholder="Enter business number"
              variant="outlined"
              size="medium"
              sx={textFieldSx}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 500,
                color: "#1f2937",
                mb: 1,
              }}
            >
              Email address
            </Typography>
            <TextField
              fullWidth
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              error={Boolean(formErrors.email)}
              helperText={formErrors.email}
              placeholder="Enter email address"
              variant="outlined"
              size="medium"
              sx={textFieldSx}
            />
          </Grid>

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
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="Enter phone number"
              variant="outlined"
              size="medium"
              sx={textFieldSx}
            />
          </Grid>

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
                value={formData.country}
                onChange={handleInputChange}
                displayEmpty
                variant="outlined"
                sx={{
                  borderRadius: "8px",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#d1d5db",
                    height: "55px",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#9ca3af",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "primary.main",
                  },
                }}
              >
                <MenuItem value="">
                  <em>Select Country</em>
                </MenuItem>
                {COUNTRIES.map((country) => (
                  <MenuItem key={country} value={country}>
                    {country}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 500,
                color: "#1f2937",
                mb: 1,
              }}
            >
              Billing address
            </Typography>
            <TextField
              fullWidth
              name="billingAddress"
              value={formData.billingAddress}
              onChange={handleInputChange}
              placeholder="Enter billing address"
              multiline
              rows={3}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  "& fieldset": { borderColor: "#d1d5db" },
                  "&:hover fieldset": { borderColor: "#9ca3af" },
                  "&.Mui-focused fieldset": { borderColor: "primary.main" },
                },
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>

      {/* Footer */}
      <DialogActions
        sx={{
          p: 3,
          gap: 2,
          borderTop: "1px solid #e5e7eb",
          justifyContent: "flex-end",
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            color: "#1f2937",
            borderRadius: "8px",
            px: 6,
            py: 1.2,
            textTransform: "none",
            border: "1px solid #d1d5db",
            fontSize: "16px",
            fontWeight: 500,
            "&:hover": { backgroundColor: "#dee2e6" },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{
            backgroundColor: "primary.main",
            px: 6,
            py: 1.2,
            borderRadius: "8px",
            textTransform: "none",
            fontSize: "16px",
            fontWeight: 500,
            "&:hover": { backgroundColor: "primary.hover" },
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ClientsPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingCustomer, setEditingCustomer] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Reset to page 1 whenever search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/customers");
      if (response.ok) {
        const data = await response.json();
        setCustomers(data);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (customer) => {
    setEditingCustomer(customer);
    setOpenModal(true);
  };

  const handleOpenAddCustomer = () => {
    setEditingCustomer(null);
    setOpenModal(true);
  };

  const handleSaveCustomer = async (formData, customerId) => {
    try {
      const url = customerId
        ? `/api/customers/${customerId}`
        : "/api/customers";
      const method = customerId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const savedCustomer = await response.json();
        if (customerId) {
          // Update existing customer
          setCustomers((prev) =>
            prev.map((c) => (c.id === customerId ? savedCustomer : c)),
          );
          setEditingCustomer(null);
        } else {
          // Add new customer
          setCustomers((prev) => [...prev, savedCustomer]);
        }
        setOpenModal(false);
      } else {
        const error = await response.json();
        console.error(
          `Error ${customerId ? "updating" : "creating"} customer:`,
          error,
        );
      }
    } catch (error) {
      console.error(`Error saving customer:`, error);
    }
  };

  const handleOpenDeleteConfirm = (id) => {
    setSelectedDeleteId(id);
    setOpenDeleteConfirm(true);
  };

  const handleCloseDeleteConfirm = () => {
    setOpenDeleteConfirm(false);
    setSelectedDeleteId(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedDeleteId) return;
    try {
      const response = await fetch(`/api/customers/${selectedDeleteId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        const updated = customers.filter((c) => c.id !== selectedDeleteId);
        setCustomers(updated);
        // If last item on page was deleted, step back one page
        const filtered = updated.filter(
          (c) =>
            c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.email.toLowerCase().includes(searchQuery.toLowerCase()),
        );
        const newTotalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages);
        }
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
    } finally {
      handleCloseDeleteConfirm();
    }
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Slice for current page
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE,
  );

  // ── Loading ──────────────────────────────────────────────────────────────

  if (loading) {
    return (
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
    );
  }

  // ── Empty State ──────────────────────────────────────────────────────────

  if (customers.length === 0) {
    return (
      <Box sx={{ width: "100%" }}>
        <Typography
          variant="h4"
          sx={{ mb: 1, fontWeight: 700, color: "#1f2937" }}
        >
          Clients
        </Typography>
        <Typography
          variant="body1"
          sx={{ mb: 4, color: "#666666", fontSize: "15px" }}
        >
          Keep track of all your clients in one place.
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "400px",
            backgroundColor: "#FFFF",
            border: "1px solid #66666620",
            borderRadius: 2,
            gap: 3,
          }}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: 600, color: "text.primary" }}
          >
            Create the first client
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenModal(true)}
            sx={{
              backgroundColor: "primary.main",
              color: "white",
              borderRadius: "10px",
              px: 6,
              py: 1.2,
              textTransform: "none",
              fontSize: "16px",
              "&:hover": { backgroundColor: "primary.hover" },
            }}
          >
            Create
          </Button>
        </Box>

        <AddCustomerDialog
          open={openModal}
          onClose={() => setOpenModal(false)}
          onSave={handleSaveCustomer}
        />
      </Box>
    );
  }

  // ── List View ────────────────────────────────────────────────────────────

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
        Clients
      </Typography>
      <Typography
        variant="body1"
        sx={{ mb: 4, color: "#666666", fontSize: "15px" }}
      >
        Keep track of all your clients in one place.
      </Typography>

      {/* Search and Add Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          gap: 2,
        }}
      >
        <Box sx={{ position: "relative", flex: 1 }}>
          <SearchIcon
            sx={{
              position: "absolute",
              left: 16,
              zIndex: 100,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#6b7280",
              fontSize: "22px",
              pointerEvents: "none",
            }}
          />
          <TextField
            placeholder="Search client by name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            variant="outlined"
            size="medium"
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                paddingLeft: "48px",
                height: "48px",
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                fontSize: "15px",
                "& fieldset": { borderColor: "#d1d5db" },
                "&:hover fieldset": { borderColor: "#9ca3af" },
                "&.Mui-focused fieldset": {
                  borderColor: "primary.main",
                  borderWidth: "2px",
                },
              },
              "& .MuiOutlinedInput-input::placeholder": {
                color: "#9ca3af",
                opacity: 1,
              },
            }}
          />
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAddCustomer}
          sx={{
            backgroundColor: "primary.main",
            color: "white",
            textTransform: "none",
            fontSize: "16px",
            fontWeight: 500,
            px: 4,
            py: 1.2,
            borderRadius: "10px",
            "&:hover": { backgroundColor: "primary.hover" },
          }}
        >
          Add Customer
        </Button>
      </Box>

      {/* Customers Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f9fafb" }}>
            <TableRow>
              {[
                "Name",
                "Company Name",
                "Phone Number",
                "Email Address",
                "Status",
                "Actions",
              ].map((col, i) => (
                <TableCell
                  key={col}
                  align={i === 5 ? "right" : "left"}
                  sx={{
                    fontWeight: 600,
                    color: "text.secondary",
                    textTransform: "uppercase",
                    fontSize: "12px",
                  }}
                >
                  {col}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCustomers.map((customer) => (
              <TableRow key={customer.id} hover>
                <TableCell>{customer.customerName}</TableCell>
                <TableCell>{customer.companyName}</TableCell>
                <TableCell>{customer.phoneNumber}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>
                  <Chip
                    label="Active"
                    size="small"
                    sx={{
                      backgroundColor: "#d1fae5",
                      color: "#065f46",
                      fontWeight: 500,
                    }}
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => handleOpenEdit(customer)}
                    sx={{ color: "#1B83FA" }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDeleteConfirm(customer.id)}
                    sx={{ color: "#C81E1E" }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination or empty search message */}
      {filteredCustomers.length === 0 && customers.length > 0 ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography color="text.secondary">
            No clients found matching your search.
          </Typography>
        </Box>
      ) : (
        <Pagination
          totalItems={filteredCustomers.length}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteConfirm}
        onClose={handleCloseDeleteConfirm}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "16px" } }}
      >
        <DialogContent sx={{ pt: 4, pb: 0, textAlign: "center" }}>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                backgroundColor: "#fecaca",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ErrorIcon sx={{ fontSize: 36, color: "#dc2626" }} />
            </Box>
          </Box>
          <Typography
            sx={{
              fontSize: "24px",
              fontWeight: 700,
              mb: 1.5,
              color: "#1f2937",
            }}
          >
            Are you sure you want to delete?
          </Typography>
          <Typography sx={{ fontSize: "14px", color: "#6b7280", mb: 2 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2, justifyContent: "center" }}>
          <Button
            onClick={handleCloseDeleteConfirm}
            sx={{
              color: "#1f2937",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              px: 8,
              py: 1,
              textTransform: "none",
              fontSize: "16px",
              fontWeight: 500,
              "&:hover": { backgroundColor: "#f9fafb" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            sx={{
              backgroundColor: "#dc2626",
              px: 8,
              py: 1,
              borderRadius: "8px",
              textTransform: "none",
              fontSize: "16px",
              fontWeight: 500,
              "&:hover": { backgroundColor: "#b91c1c" },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Shared Add Customer Dialog */}
      <AddCustomerDialog
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setEditingCustomer(null);
        }}
        onSave={handleSaveCustomer}
        editingCustomer={editingCustomer}
      />
    </Box>
  );
}
