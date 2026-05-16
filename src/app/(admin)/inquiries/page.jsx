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
import { inquiryService } from "../../../services/inquiry.service";

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

// ─── Main Inquiries Page ──────────────────────────────────────────────────────

export default function InquiriesPage() {
  const router = useRouter();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchInquiries();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, startDate, endDate]);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const result = await inquiryService.getAllInquiries();
      setInquiries(result.data || []);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      setInquiries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (inquiry) => {
    router.push(`/inquiries/create?id=${inquiry.id}`);
  };

  const handleOpenAddInquiry = () => {
    router.push("/inquiries/create");
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
    try {
      await inquiryService.deleteInquiry(selectedDeleteId);
      setInquiries(inquiries.filter((inq) => inq.id !== selectedDeleteId));
      handleCloseDeleteConfirm();
    } catch (error) {
      console.error("Error deleting inquiry:", error);
      alert("Failed to delete inquiry");
    }
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      pending: { color: "#fef3c7", textColor: "#d97706", label: "Pending" },
      completed: {
        color: "#dcfce7",
        textColor: "#16a34a",
        label: "Completed",
      },
      in_progress: {
        color: "#dbeafe",
        textColor: "#0284c7",
        label: "In Progress",
      },
      cancelled: { color: "#fee2e2", textColor: "#dc2626", label: "Cancelled" },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <Chip
        label={config.label}
        sx={{
          backgroundColor: config.color,
          color: config.textColor,
          fontWeight: 600,
          fontSize: "12px",
          height: 24,
        }}
      />
    );
  };

  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesSearch =
      inquiry.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.phoneNumber.includes(searchQuery) ||
      inquiry.project.toLowerCase().includes(searchQuery.toLowerCase());

    const inquiryDate = new Date(inquiry.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    let matchesDate = true;
    if (start && end) {
      matchesDate = inquiryDate >= start && inquiryDate <= end;
    } else if (start) {
      matchesDate = inquiryDate >= start;
    } else if (end) {
      matchesDate = inquiryDate <= end;
    }

    return matchesSearch && matchesDate;
  });

  const paginatedInquiries = filteredInquiries.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );

  // ── Loading ──────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // ── Empty State ──────────────────────────────────────────────────────────

  if (inquiries.length === 0) {
    return (
      <Box sx={{ width: "100%" }}>
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
          Inquiries
        </Typography>
        <Typography
          variant="body1"
          sx={{ mb: 4, color: "#666666", fontSize: "15px" }}
        >
          Create and manage your inquiries.
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            py: 8,
            px: 3,
            backgroundColor: "#f9fafb",
            borderRadius: "16px",
            border: "1px solid #e5e7eb",
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              backgroundColor: "#e0e7ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <AddIcon sx={{ fontSize: 40, color: "#6366f1" }} />
          </Box>
          <Typography
            sx={{
              fontSize: "22px",
              fontWeight: 700,
              mb: 1,
              color: "#1f2937",
            }}
          >
            No Inquiries Yet
          </Typography>
          <Typography
            sx={{
              fontSize: "14px",
              color: "#6b7280",
              mb: 3,
              textAlign: "center",
              maxWidth: "400px",
            }}
          >
            Get started by creating your first inquiry. Click the button below to
            add a new inquiry and track customer interactions.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAddInquiry}
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
            Create Inquiry
          </Button>
        </Box>
      </Box>
    );
  }

  // ── List View ────────────────────────────────────────────────────────────

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
        Inquiries
      </Typography>
      <Typography
        variant="body1"
        sx={{ mb: 4, color: "#666666", fontSize: "15px" }}
      >
        Create and manage your inquiries.
      </Typography>

      {/* Search and Filter Bar */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
            flex: 1,
          }}
        >
          {/* Search Input */}
          <Box sx={{ position: "relative", flex: 1, minWidth: "250px", maxWidth: "320px" }}>
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
              placeholder="Search customer or project..."
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

          {/* Date Filters */}
          <TextField
            type="date"
            label="From Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            variant="outlined"
            size="small"
            InputLabelProps={{ shrink: true }}
            sx={{
              "& .MuiOutlinedInput-root": {
                height: "50px",
                borderRadius: "8px",
                "& fieldset": { borderColor: "#e5e7eb" },
                "&:hover fieldset": { borderColor: "#d1d5db" },
                "&.Mui-focused fieldset": { borderColor: "primary.main" },
              },
            }}
          />

          <TextField
            type="date"
            label="To Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            variant="outlined"
            size="small"
            InputLabelProps={{ shrink: true }}
            sx={{
              "& .MuiOutlinedInput-root": {
                height: "50px",
                borderRadius: "8px",
                "& fieldset": { borderColor: "#e5e7eb" },
                "&:hover fieldset": { borderColor: "#d1d5db" },
                "&.Mui-focused fieldset": { borderColor: "primary.main" },
              },
            }}
          />
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAddInquiry}
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
            whiteSpace: "nowrap",
          }}
        >
          Create Inquiry
        </Button>
      </Box>

      {/* Table */}
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
                Date
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: "text.secondary",
                  textTransform: "uppercase",
                  fontSize: "12px",
                }}
              >
                Customer Name
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: "text.secondary",
                  textTransform: "uppercase",
                  fontSize: "12px",
                }}
              >
                Phone Number
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: "text.secondary",
                  textTransform: "uppercase",
                  fontSize: "12px",
                }}
              >
                Call Status
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: "text.secondary",
                  textTransform: "uppercase",
                  fontSize: "12px",
                }}
              >
                Project
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: "text.secondary",
                  textTransform: "uppercase",
                  fontSize: "12px",
                }}
              >
                Comment
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: "text.secondary",
                  textTransform: "uppercase",
                  fontSize: "12px",
                }}
              >
                Project Status
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
            {paginatedInquiries.map((inquiry) => (
              <TableRow key={inquiry.id} hover>
                <TableCell>
                  {new Date(inquiry.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell>{inquiry.customerName}</TableCell>
                <TableCell>{inquiry.phoneNumber}</TableCell>
                <TableCell>{getStatusChip(inquiry.callStatus)}</TableCell>
                <TableCell>{inquiry.project}</TableCell>
                <TableCell
                  sx={{
                    maxWidth: "150px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  title={inquiry.comment}
                >
                  {inquiry.comment || "-"}
                </TableCell>
                <TableCell>{getStatusChip(inquiry.projectStatus)}</TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => handleOpenEdit(inquiry)}
                    sx={{ color: "#1B83FA" }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDeleteConfirm(inquiry.id)}
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

      {/* No Results Message */}
      {filteredInquiries.length === 0 && inquiries.length > 0 ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography color="text.secondary">
            No inquiries found matching your search.
          </Typography>
        </Box>
      ) : (
        <Pagination
          totalItems={filteredInquiries.length}
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
