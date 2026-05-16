"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
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
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ErrorIcon from "@mui/icons-material/Error";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import FilterListIcon from "@mui/icons-material/FilterList";

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

// ─── Main Invoices Page ───────────────────────────────────────────────────────

export default function InvoicesPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchInvoices();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/invoices");
      if (response.ok) {
        const data = await response.json();
        setInvoices(data);
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (invoice) => {
    router.push(`/invoice/create?id=${invoice.id}`);
  };

  const handleOpenAddInvoice = () => {
    router.push("/invoice/create");
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
      const response = await fetch(`/api/invoices/${selectedDeleteId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setInvoices((prev) => prev.filter((i) => i.id !== selectedDeleteId));
        handleCloseDeleteConfirm();
      }
    } catch (error) {
      console.error("Error deleting invoice:", error);
    }
  };

  const getStatusChip = (status) => {
    if (status === "paid") {
      return (
        <Chip
          label="Paid"
          size="small"
          sx={{
            backgroundColor: "#dcfce7",
            color: "#166534",
            fontWeight: 500,
            fontSize: "12px",
          }}
        />
      );
    }
    if (status === "overdue") {
      return (
        <Chip
          label="Overdue"
          size="small"
          sx={{
            backgroundColor: "#fee2e2",
            color: "#991b1b",
            fontWeight: 500,
            fontSize: "12px",
          }}
        />
      );
    }
    return (
      <Chip
        label="Draft"
        size="small"
        sx={{
          backgroundColor: "#fef3c7",
          color: "#92400e",
          fontWeight: 500,
          fontSize: "12px",
        }}
      />
    );
  };

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.invoiceNumber
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      invoice.clientName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const paginatedInvoices = filteredInvoices.slice(
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

  if (invoices.length === 0) {
    return (
      <Box sx={{ width: "100%" }}>
        <Typography
          variant="h4"
          sx={{ mb: 1, fontWeight: 700, color: "#1f2937" }}
        >
          Invoices
        </Typography>
        <Typography
          variant="body1"
          sx={{ mb: 4, color: "#666666", fontSize: "15px" }}
        >
          Create and manage your invoices.
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "400px",
            backgroundColor: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            gap: 3,
          }}
        >
          <AddIcon sx={{ fontSize: 48, color: "#d1d5db" }} />
          <Typography variant="h5" sx={{ fontWeight: 600, color: "#1f2937" }}>
            Create the first invoice
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAddInvoice}
            sx={{
              backgroundColor: "primary.main",
              color: "white",
              borderRadius: "12px",
              px: 6,
              py: 1.5,
              textTransform: "none",
              fontSize: "15px",
              fontWeight: 600,
              "&:hover": { backgroundColor: "primary.hover" },
            }}
          >
            Create Invoice
          </Button>
        </Box>
      </Box>
    );
  }

  // ── List View ────────────────────────────────────────────────────────────

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
        Invoices
      </Typography>
      <Typography
        variant="body1"
        sx={{ mb: 4, color: "#666666", fontSize: "15px" }}
      >
        Create and manage your invoices.
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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box sx={{ position: "relative", flex: 1, maxWidth: "320px" }}>
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
              placeholder="Search Invoice here..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              variant="outlined"
              size="small"
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  paddingLeft: "40px",
                  height: "50px",
                  backgroundColor: "#ffffff",
                  borderRadius: "8px",
                  fontSize: "14px",
                  "& fieldset": { borderColor: "#e5e7eb" },
                  "&:hover fieldset": { borderColor: "#d1d5db" },
                  "&.Mui-focused fieldset": {
                    borderColor: "primary.main",
                    borderWidth: "1px",
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
            startIcon={<FilterListIcon />}
            sx={{
              color: "#6b7280",
              textTransform: "none",
              fontSize: "14px",
              fontWeight: 500,
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              px: 2.5,
              py: 1.2,
              minWidth: "auto",
              "&:hover": { backgroundColor: "#f9fafb" },
            }}
          >
            More
          </Button>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAddInvoice}
          sx={{
            backgroundColor: "primary.main",
            color: "white",
            textTransform: "none",
            fontSize: "15px",
            fontWeight: 600,
            px: 3,
            py: 1.2,
            borderRadius: "12px",
            "&:hover": { backgroundColor: "primary.hover" },
          }}
        >
          Create Invoice
        </Button>
      </Box>

      {/* Invoices Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f9fafb" }}>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: "text.secondary",
                  textTransform: "uppercase",
                  fontSize: "12px",
                }}
              >
                Invoice No
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: "text.secondary",
                  textTransform: "uppercase",
                  fontSize: "12px",
                }}
              >
                Issued Date
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: "text.secondary",
                  textTransform: "uppercase",
                  fontSize: "12px",
                }}
              >
                Due Date
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: "text.secondary",
                  textTransform: "uppercase",
                  fontSize: "12px",
                }}
              >
                Customer
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: "text.secondary",
                  textTransform: "uppercase",
                  fontSize: "12px",
                }}
              >
                Amount
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: "text.secondary",
                  textTransform: "uppercase",
                  fontSize: "12px",
                }}
              >
                Status
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: "text.secondary",
                  textTransform: "uppercase",
                  fontSize: "12px",
                }}
                align="right"
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedInvoices.map((invoice) => (
              <TableRow key={invoice.id} hover>
                <TableCell>{invoice.invoiceNumber}</TableCell>
                <TableCell>
                  {new Date(invoice.issuedDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </TableCell>
                <TableCell>
                  {new Date(invoice.dueDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </TableCell>
                <TableCell>{invoice.clientName}</TableCell>
                <TableCell>
                  LKR {invoice.totalAmount?.toFixed(2) || "0.00"}
                </TableCell>
                <TableCell>{getStatusChip(invoice.status)}</TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => handleOpenEdit(invoice)}
                    sx={{ color: "#1B83FA" }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDeleteConfirm(invoice.id)}
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
      {filteredInvoices.length === 0 && invoices.length > 0 ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography color="text.secondary">
            No invoices found matching your search.
          </Typography>
        </Box>
      ) : (
        <Pagination
          totalItems={filteredInvoices.length}
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
    </Box>
  );
}
