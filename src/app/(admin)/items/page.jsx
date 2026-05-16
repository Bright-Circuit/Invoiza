"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
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
          "&:hover": { backgroundColor: currentPage === 1 ? "#e5e7eb" : "#d1d5db" },
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
              backgroundColor: page === currentPage ? "primary.hover" : "#d1d5db",
            },
          }}
        >
          {page}
        </Box>
      ))}

      {/* Next arrow */}
      <IconButton
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
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

// ─── Shared Add/Edit Item Dialog Component ────────────────────────────────────

function AddItemDialog({ open, onClose, onSave, editingItem }) {
  const [formData, setFormData] = useState({
    itemName: "",
    price: "",
    description: "",
  });
  const [formErrors, setFormErrors] = useState({});

  // Reset form whenever dialog opens
  useEffect(() => {
    if (open) {
      if (editingItem) {
        setFormData({
          itemName: editingItem.itemName,
          price: editingItem.price.toString(),
          description: editingItem.description || "",
        });
      } else {
        setFormData({ itemName: "", price: "", description: "" });
      }
      setFormErrors({});
    }
  }, [open, editingItem]);

  const validateForm = () => {
    const errors = {};
    if (!formData.itemName.trim()) errors.itemName = "Item name is required";
    if (!formData.price.trim()) {
      errors.price = "Price is required";
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      errors.price = "Price must be a valid positive number";
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
    if (validateForm()) {
      onSave(formData, editingItem?.id);
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
          {editingItem ? "Edit Item" : "New Item"}
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
              sx={{ fontSize: "14px", fontWeight: 500, color: "#1f2937", mb: 1 }}
            >
              Item Name
            </Typography>
            <TextField
              fullWidth
              name="itemName"
              value={formData.itemName}
              onChange={handleInputChange}
              error={Boolean(formErrors.itemName)}
              helperText={formErrors.itemName}
              placeholder="Enter item name"
              variant="outlined"
              size="medium"
              sx={textFieldSx}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography
              sx={{ fontSize: "14px", fontWeight: 500, color: "#1f2937", mb: 1 }}
            >
              Price (Rs)
            </Typography>
            <TextField
              fullWidth
              name="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              error={Boolean(formErrors.price)}
              helperText={formErrors.price}
              placeholder="Enter price"
              variant="outlined"
              size="medium"
              sx={textFieldSx}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography
              sx={{ fontSize: "14px", fontWeight: 500, color: "#1f2937", mb: 1 }}
            >
              Description (Optional)
            </Typography>
            <TextField
              fullWidth
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter description"
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
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            px: 4,
            py: 1.1,
            textTransform: "none",
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
            borderRadius: "10px",
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

export default function ItemsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  // Reset to page 1 whenever search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/items");
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveItem = async (formData, itemId) => {
    try {
      if (itemId) {
        // Edit existing item
        const response = await fetch(`/api/items/${itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const updatedItem = await response.json();
          setItems((prev) =>
            prev.map((item) => (item.id === itemId ? updatedItem : item))
          );
          setOpenModal(false);
          setEditingItem(null);
        } else {
          const error = await response.json();
          console.error("Error updating item:", error);
        }
      } else {
        // Add new item
        const response = await fetch("/api/items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const newItem = await response.json();
          setItems((prev) => [...prev, newItem]);
          setOpenModal(false);
        } else {
          const error = await response.json();
          console.error("Error creating item:", error);
        }
      }
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setOpenModal(true);
  };

  const handleOpenAddItem = () => {
    setEditingItem(null);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingItem(null);
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
      const response = await fetch(`/api/items/${selectedDeleteId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        const updated = items.filter((item) => item.id !== selectedDeleteId);
        setItems(updated);
        // If last item on page was deleted, step back one page
        const filtered = updated.filter(
          (item) =>
            item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.description &&
              item.description.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        const newTotalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages);
        }
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    } finally {
      handleCloseDeleteConfirm();
    }
  };

  const filteredItems = items.filter(
    (item) =>
      item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description &&
        item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Slice for current page
  const paginatedItems = filteredItems.slice(
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
          minHeight: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // ── Empty State ──────────────────────────────────────────────────────────

  if (items.length === 0) {
    return (
      <Box sx={{ width: "100%" }}>
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 700, color: "#1f2937" }}>
          Items
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: "#666666", fontSize: "15px" }}>
          Manage all your products and services in one place.
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
          <Typography variant="h5" sx={{ fontWeight: 600, color: "text.primary" }}>
            Create the first item
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAddItem}
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

        {/* Shared dialog — used for both empty & list states */}
        <AddItemDialog
          open={openModal}
          onClose={handleCloseModal}
          onSave={handleSaveItem}
          editingItem={editingItem}
        />
      </Box>
    );
  }

  // ── List View ────────────────────────────────────────────────────────────

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
        Items
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, color: "#666666", fontSize: "15px" }}>
        Manage all your products and services in one place.
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
            placeholder="Search items"
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
          onClick={handleOpenAddItem}
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
          Add Item
        </Button>
      </Box>

      {/* Items Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f9fafb" }}>
            <TableRow>
              {["Item Name", "Price (LKR)", "Description", "Action"].map((col, i) => (
                <TableCell
                  key={col}
                  align={i === 3 ? "right" : "left"}
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
            {paginatedItems.map((item) => (
              <TableRow key={item.id} hover>
                <TableCell>{item.itemName}</TableCell>
                <TableCell>Rs. {parseFloat(item.price).toFixed(2)}</TableCell>
                <TableCell>{item.description || "..."}</TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => handleOpenEdit(item)}
                    sx={{ color: "#1B83FA" }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDeleteConfirm(item.id)}
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

      {filteredItems.length === 0 && items.length > 0 ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography color="text.secondary">
            No items found matching your search.
          </Typography>
        </Box>
      ) : (
        <Pagination
          totalItems={filteredItems.length}
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
          <Typography sx={{ fontSize: "24px", fontWeight: 700, mb: 1.5, color: "#1f2937" }}>
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

      {/* Shared Add/Edit Item Dialog */}
      <AddItemDialog
        open={openModal}
        onClose={handleCloseModal}
        onSave={handleSaveItem}
        editingItem={editingItem}
      />
    </Box>
  );
}