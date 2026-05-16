"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  Typography,
  Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DownloadIcon from "@mui/icons-material/Download";
import { generateInvoicePDF } from "../../../../utils/pdfGenerator";

// ─── Add Item Modal Component ─────────────────────────────────────────────────

function AddItemModal({ open, onClose, onAdd, onUpdate, existingItems, editingIndex, allItems }) {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    if (open) {
      if (editingIndex !== undefined && editingIndex !== null && allItems && allItems[editingIndex]) {
        // Pre-fill form when editing
        const itemToEdit = allItems[editingIndex];
        setSelectedItem(itemToEdit.itemId || "");
        setItemName(itemToEdit.itemName || "");
        setQuantity(itemToEdit.quantity.toString());
        setPrice(itemToEdit.price.toString());
      } else {
        // Reset form when modal opens for new item
        setSelectedItem("");
        setItemName("");
        setQuantity("");
        setPrice("");
      }
    }
  }, [open, editingIndex, allItems]);

  const fetchItems = async () => {
    try {
      const response = await fetch("/api/items");
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const handleItemSelect = (e) => {
    const itemId = e.target.value;
    setSelectedItem(itemId);

    // Auto-populate item name and price when item is selected
    if (itemId) {
      const selectedItemData = items.find((item) => item.id === itemId);
      if (selectedItemData) {
        setItemName(selectedItemData.itemName);
        setPrice(selectedItemData.price.toString());
      }
    } else {
      setItemName("");
      setPrice("");
    }
  };

  const calculateItemTotal = () => {
    const q = parseFloat(quantity) || 0;
    const p = parseFloat(price) || 0;
    return (q * p).toFixed(2);
  };

  const handleAdd = () => {
    if (!itemName.trim() || !quantity || !price) {
      alert("Please fill in all fields");
      return;
    }

    const itemData = {
      itemId: selectedItem || undefined,
      itemName: itemName.trim(),
      quantity: parseInt(quantity),
      price: parseFloat(price),
      subtotal: parseInt(quantity) * parseFloat(price),
    };

    if (editingIndex !== undefined && editingIndex !== null) {
      // Update existing item
      onUpdate(editingIndex, itemData);
    } else {
      // Add new item
      onAdd(itemData);
    }

    // Reset form
    setSelectedItem("");
    setItemName("");
    setQuantity("");
    setPrice("");
    onClose();
  };

  const availableItems = items.filter(
    (item) => !existingItems.some((ei) => ei.itemId === item.id),
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: "16px" } }}
    >
      <Box sx={{ p: 3, borderBottom: "1px solid #e5e7eb" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{ fontSize: "20px", fontWeight: 600, color: "#1f2937" }}
          >
            {editingIndex !== undefined && editingIndex !== null ? "Edit Item" : "Add Item"}
          </Typography>
          <IconButton onClick={onClose} size="small" sx={{ color: "#6b7280" }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>

      <DialogContent sx={{ pt: 3, pb: 2 }}>
        {/* Select Item Dropdown */}
        <FormControl fullWidth sx={{ mb: 2.5 }}>
          <Typography
            sx={{
              fontSize: "13px",
              fontWeight: 600,
              color: "#1f2937",
              mb: 1,
            }}
          >
            Select Item
          </Typography>
          <Select
            value={selectedItem}
            onChange={handleItemSelect}
            displayEmpty
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
            <MenuItem value="">Choose an item</MenuItem>
            {availableItems.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.itemName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Item Name Field */}
        <Box>
          <Typography
            sx={{ fontSize: "13px", fontWeight: 600, color: "#1f2937", mb: 1 }}
          >
            Item Name
          </Typography>
          <TextField
            fullWidth
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="Enter item name"
            sx={{
              mb: 2.5,
              "& .MuiOutlinedInput-root": {
                height: "50px",
                borderRadius: "8px",
                "& fieldset": { borderColor: "#d1d5db" },
                "&:hover fieldset": { borderColor: "#9ca3af" },
                "&.Mui-focused fieldset": { borderColor: "primary.main" },
              },
            }}
          />
        </Box>

        {/* Quantity and Unit Price - Side by Side */}
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, mb: 2.5 }}>
          <Box sx={{ width: "100%" }}>
            <Typography
              sx={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#1f2937",
                mb: 1,
              }}
            >
              Quantity
            </Typography>

            <TextField
              type="number"
              fullWidth
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0"
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: "50px",
                  borderRadius: "8px",
                  "& fieldset": { borderColor: "#d1d5db" },
                  "&:hover fieldset": { borderColor: "#9ca3af" },
                  "&.Mui-focused fieldset": { borderColor: "primary.main" },
                },
              }}
            />
          </Box>

          <Box sx={{ width: "100%" }}>
            <Typography
              sx={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#1f2937",
                mb: 1,
              }}
            >
              Unit Price
            </Typography>

            <TextField
              type="number"
              fullWidth
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: "50px",
                  borderRadius: "8px",
                  "& fieldset": { borderColor: "#d1d5db" },
                  "&:hover fieldset": { borderColor: "#9ca3af" },
                  "&.Mui-focused fieldset": { borderColor: "primary.main" },
                },
              }}
            />
          </Box>
        </Box>

        {/* Item Total */}
        <Box
          sx={{
            p: 2,
            backgroundColor: "rgba(99, 102, 241, 0.1)",
            borderRadius: "8px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#1f2937",
            }}
          >
            Item total
          </Typography>
          <Typography
            sx={{
              fontSize: "18px",
              fontWeight: 700,
              color: "primary.main",
            }}
          >
            Rs. {calculateItemTotal()}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          p: 2,
          gap: 1.5,
          borderTop: "1px solid #e5e7eb",
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            color: "#1f2937",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            textTransform: "none",
            fontSize: "14px",
            fontWeight: 600,
            px: 4,
            "&:hover": { backgroundColor: "#f9fafb" },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleAdd}
          variant="contained"
          sx={{
            backgroundColor: "primary.main",
            borderRadius: "8px",
            textTransform: "none",
            fontSize: "14px",
            fontWeight: 600,
            px: 4,
            "&:hover": { backgroundColor: "primary.hover" },
          }}
        >
          {editingIndex !== undefined && editingIndex !== null ? "Update" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Create Invoice Page ──────────────────────────────────────────────────────

export default function CreateInvoicePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const invoiceId = searchParams.get("id");

  const [formData, setFormData] = useState({
    issuedDate: "",
    dueDate: "",
    clientId: "",
    description: "",
    additionalNote: "",
    items: [],
    discount: 0,
    discountType: "amount", // 'amount' or 'percentage'
  });
  const [formErrors, setFormErrors] = useState({});
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAddItem, setOpenAddItem] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [editingItemIndex, setEditingItemIndex] = useState(null);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [companyData, setCompanyData] = useState(null);

  // Generate random invoice number
  const generateInvoiceNumber = () => {
    const randomNum = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, "0");
    return `INV-${new Date().getFullYear()}-${randomNum}`;
  };

  useEffect(() => {
    const initPage = async () => {
      try {
        setLoading(true);

        // Fetch customers
        const customersRes = await fetch("/api/customers");
        if (customersRes.ok) {
          const customersData = await customersRes.json();
          setCustomers(customersData);
        }

        // Fetch company data
        try {
          const companyRes = await fetch("/api/company");
          if (companyRes.ok) {
            const company = await companyRes.json();
            setCompanyData(company);
          }
        } catch (error) {
          console.error("Error fetching company data:", error);
        }

        // If editing, fetch the invoice
        if (invoiceId) {
          const invoiceRes = await fetch(`/api/invoices/${invoiceId}`);
          if (invoiceRes.ok) {
            const invoice = await invoiceRes.json();
            setEditingInvoice(invoice);
            setFormData({
              issuedDate: invoice.issuedDate,
              dueDate: invoice.dueDate,
              clientId: invoice.clientId,
              description: invoice.description || "",
              additionalNote: invoice.additionalNote || "",
              items: invoice.items || [],
              discount: invoice.discount || 0,
              discountType: invoice.discountType || "amount",
            });
            setInvoiceNumber(invoice.invoiceNumber);
          }
        } else {
          // Generate random invoice number for new invoice
          setInvoiceNumber(generateInvoiceNumber());
        }
      } catch (error) {
        console.error("Error initializing page:", error);
      } finally {
        setLoading(false);
      }
    };

    initPage();
  }, [invoiceId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleAddItem = (itemData) => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, itemData],
    }));
  };

  const handleRemoveItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleEditItem = (index) => {
    setEditingItemIndex(index);
    setOpenAddItem(true);
  };

  const handleUpdateItem = (index, updatedItem) => {
    setFormData((prev) => {
      const newItems = [...prev.items];
      newItems[index] = updatedItem;
      return { ...prev, items: newItems };
    });
    setEditingItemIndex(null);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.issuedDate) errors.issuedDate = "Issued Date is required";
    if (!formData.dueDate) errors.dueDate = "Due Date is required";
    if (!formData.clientId) errors.clientId = "Client is required";
    if (formData.items.length === 0) errors.items = "Add at least one item";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      let subtotalAmount = formData.items.reduce(
        (sum, item) => sum + item.subtotal,
        0,
      );

      // Calculate discount amount
      let discountAmount = 0;
      if (formData.discount > 0) {
        if (formData.discountType === "percentage") {
          discountAmount = (subtotalAmount * formData.discount) / 100;
        } else {
          discountAmount = formData.discount;
        }
      }

      const totalAmount = subtotalAmount - discountAmount;

      const clientName = customers.find(
        (c) => c.id === formData.clientId,
      )?.customerName;

      const url = invoiceId
        ? `/api/invoices/${invoiceId}`
        : "/api/invoices";
      const method = invoiceId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          invoiceNumber,
          totalAmount,
          discountAmount,
          clientName,
        }),
      });

      if (response.ok) {
        router.push("/invoice");
      } else {
        const error = await response.json();
        console.error("Error saving invoice:", error);
      }
    } catch (error) {
      console.error("Error saving invoice:", error);
    }
  };

  const subtotalAmount = formData.items.reduce(
    (sum, item) => sum + item.subtotal,
    0,
  );

  // Calculate discount amount
  let discountAmount = 0;
  if (formData.discount > 0) {
    if (formData.discountType === "percentage") {
      discountAmount = (subtotalAmount * formData.discount) / 100;
    } else {
      discountAmount = formData.discount;
    }
  }

  const totalAmount = subtotalAmount - discountAmount;

  const handleDownloadPDF = async () => {
    if (formData.items.length === 0) {
      alert("Please add at least one item to download the invoice");
      return;
    }

    try {
      setGeneratingPDF(true);

      const selectedCustomer = customers.find(
        (c) => c.id === formData.clientId
      );

      // Prepare invoice data for PDF
      const invoiceDataForPDF = {
        invoiceNumber,
        issuedDate: formData.issuedDate,
        dueDate: formData.dueDate,
        items: formData.items,
        discount: formData.discount,
        discountType: formData.discountType,
        discountAmount:
          formData.discountType === "percentage"
            ? (subtotalAmount * formData.discount) / 100
            : formData.discount,
      };

      // Generate PDF
      await generateInvoicePDF(invoiceDataForPDF, companyData, selectedCustomer);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Failed to generate PDF");
    } finally {
      setGeneratingPDF(false);
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

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "500px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          mb: 4,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton onClick={() => router.back()} sx={{ color: "#6b7280" }}>
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: "#1f2937", mb: 0.5 }}
            >
              {editingInvoice ? "Edit Invoice" : "Create Invoice"}
            </Typography>
            <Typography
              sx={{
                fontSize: "14px",
                color: "#6b7280",
              }}
            >
              Manage and track your invoices easily.
            </Typography>
          </Box>
        </Box>
        <Button
          onClick={handleDownloadPDF}
          disabled={generatingPDF}
          variant="contained"
          sx={{
            backgroundColor: "primary.main",
            textTransform: "none",
            borderRadius: "8px",
            px: 3,
            py: 1,
            fontSize: "14px",
            fontWeight: 500,
            "&:hover": { backgroundColor: "primary.hover" },
            "&:disabled": { opacity: 0.6 },
          }}
          startIcon={
            generatingPDF ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <DownloadIcon />
            )
          }
        >
          {generatingPDF ? "Generating..." : "Download PDF"}
        </Button>
      </Box>

      {/* Form Container */}
      <Box
        sx={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
          p: 4,
        }}
      >
        <Grid container spacing={3}>
          {/* Row 1: Invoice Details */}
          <Grid item xs={12} sm={6}>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#1f2937",
                mb: 1,
              }}
            >
              Invoice Number
            </Typography>
            <TextField
              fullWidth
              value={invoiceNumber}
              disabled
              sx={textFieldSx}
            />
          </Grid>
                    {/* Row 2b: Select Clients */}
          <Grid item xs={6}>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#1f2937",
                mb: 1,
              }}
            >
              Select Clients <span style={{ color: "red" }}>*</span>
            </Typography>
            <FormControl fullWidth>
              <Select
                name="clientId"
                value={formData.clientId}
                onChange={handleInputChange}
                displayEmpty
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
                error={Boolean(formErrors.clientId)}
              >
                <MenuItem value="">Choose a client</MenuItem>
                {customers.map((customer) => (
                  <MenuItem key={customer.id} value={customer.id}>
                    {customer.customerName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {formErrors.clientId && (
              <Typography sx={{ fontSize: "12px", color: "#dc2626", mt: 0.5 }}>
                {formErrors.clientId}
              </Typography>
            )}
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#1f2937",
                mb: 1,
              }}
            >
              Issued Date <span style={{ color: "red" }}>*</span>
            </Typography>
            <TextField
              fullWidth
              name="issuedDate"
              type="date"
              value={formData.issuedDate}
              onChange={handleInputChange}
              error={Boolean(formErrors.issuedDate)}
              helperText={formErrors.issuedDate}
              InputLabelProps={{ shrink: true }}
              sx={textFieldSx}
            />
          </Grid>

          {/* Row 2: Due Date */}
          <Grid item xs={12} sm={6}>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#1f2937",
                mb: 1,
              }}
            >
              Due Date <span style={{ color: "red" }}>*</span>
            </Typography>
            <TextField
              fullWidth
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleInputChange}
              error={Boolean(formErrors.dueDate)}
              helperText={formErrors.dueDate}
              InputLabelProps={{ shrink: true }}
              sx={textFieldSx}
            />
          </Grid>

          {/* Row 3: Description */}
          <Grid item xs={12}>
            <Typography
              sx={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#1f2937",
                mb: 1,
              }}
            >
              Description
            </Typography>
            <TextField
              fullWidth
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Add Description"
              multiline
              rows={2}
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

          {/* Row 4: Items Section */}
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography
                sx={{ fontSize: "18px", fontWeight: 700, color: "#1f2937" }}
              >
                Invoice Items
                {formErrors.items && (
                  <span style={{ color: "red", fontSize: "12px" }}>
                    {" "}
                    ({formErrors.items})
                  </span>
                )}
              </Typography>
              <Button
                size="small"
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenAddItem(true)}
                sx={{
                  textTransform: "none",
                  backgroundColor: "primary.main",
                  fontSize: "14px",
                  fontWeight: 500,
                  "&:hover": { backgroundColor: "primary.hover" },
                }}
              >
                Add Item
              </Button>
            </Box>

            {formData.items.length === 0 ? (
              <Box
                sx={{
                  p: 3,
                  bgcolor: "#f9fafb",
                  borderRadius: "8px",
                  textAlign: "center",
                  border: "1px dashed #d1d5db",
                }}
              >
                <Typography sx={{ color: "#9ca3af", fontSize: "14px" }}>
                  No items added yet. Click on Add Item to get started.
                </Typography>
              </Box>
            ) : (
              <TableContainer component={Paper} sx={{ mb: 2 }}>
                <Table size="medium">
                  <TableHead sx={{ backgroundColor: "#f3f4f6" }}>
                    <TableRow>
                      <TableCell
                        sx={{
                          fontWeight: 700,
                          color: "#6b7280",
                          fontSize: "12px",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        ITEM NAME
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{
                          fontWeight: 700,
                          color: "#6b7280",
                          fontSize: "12px",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        QUANTITY
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{
                          fontWeight: 700,
                          color: "#6b7280",
                          fontSize: "12px",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        UNIT PRICE
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{
                          fontWeight: 700,
                          color: "#6b7280",
                          fontSize: "12px",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        TOTAL
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          fontWeight: 700,
                          color: "#6b7280",
                          fontSize: "12px",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        ACTION
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.items.map((item, index) => (
                      <TableRow key={index} hover>
                        <TableCell sx={{ fontSize: "14px", color: "#1f2937" }}>
                          {item.itemName}
                        </TableCell>
                        <TableCell align="left" sx={{ fontSize: "14px" }}>
                          {item.quantity}
                        </TableCell>
                        <TableCell
                          align="left"
                          sx={{ fontSize: "14px", color: "#1f2937" }}
                        >
                          Rs. {item.price.toFixed(2)}
                        </TableCell>
                        <TableCell
                          align="left"
                          sx={{
                            fontSize: "14px",
                            color: "#1f2937",
                            fontWeight: 600,
                          }}
                        >
                          Rs. {item.subtotal.toFixed(2)}
                        </TableCell>
                        <TableCell align="left">
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              gap: 1,
                            }}
                          >
                            <IconButton
                              size="small"
                              sx={{ color: "#1B83FA" }}
                              onClick={() => handleEditItem(index)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              sx={{ color: "#C81E1E" }}
                              onClick={() => handleRemoveItem(index)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* Total Amount */}
            {formData.items.length > 0 && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 2,
                  backgroundColor: "#f9fafb",
                  borderRadius: "8px",
                  mb: 3,
                }}
              >
                <Typography
                  sx={{ fontSize: "18px", fontWeight: 700, color: "#1f2937" }}
                >
                  Subtotal:
                </Typography>
                <Typography
                  sx={{
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "primary.main",
                  }}
                >
                  Rs {subtotalAmount.toFixed(2)}
                </Typography>
              </Box>
            )}
          </Grid>

          {/* Row: Discount Section */}
          {formData.items.length > 0 && (
            <Grid item xs={12}>
              <Box
                sx={{
                  p: 2,
                  backgroundColor: "#EFEFFE",
                  borderRadius: "8px",
                  border: "1px solid #EFEFFE",
                  mb: 3,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#1f2937",
                    mb: 2,
                  }}
                >
                  Discount (Optional)
                </Typography>
                <Box sx={{ display: "flex", gap: 2, alignItems: "flex-end" }}>
                  <Box sx={{ width: "100%" }}>
                    <Typography
                      sx={{
                        fontSize: "13px",
                        fontWeight: 500,
                        color: "#1f2937",
                        mb: 1,
                      }}
                    >
                      Discount Amount
                    </Typography>
                    <TextField
                      type="number"
                      fullWidth
                      name="discount"
                      value={formData.discount}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      inputProps={{ step: "0.01", min: "0" }}
                      sx={textFieldSx}
                    />
                  </Box>
                  <Box sx={{ width: "120px" }}>
                    <Typography
                      sx={{
                        fontSize: "13px",
                        fontWeight: 500,
                        color: "#1f2937",
                        mb: 1,
                      }}
                    >
                      Type
                    </Typography>
                    <FormControl fullWidth>
                      <Select
                        name="discountType"
                        value={formData.discountType}
                        onChange={handleInputChange}
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
                        <MenuItem value="amount">Amount</MenuItem>
                        <MenuItem value="percentage">%</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Box>

                {/* Discount Preview */}
                {discountAmount > 0 && (
                  <Box
                    sx={{
                      mt: 2,
                      p: 1.5,
                      backgroundColor: "#ffffff",
                      borderRadius: "6px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography sx={{ fontSize: "13px", color: "#1f2937" }}>
                      Discount ({formData.discountType === "percentage" ? `${formData.discount}%` : "Fixed"}):
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#dc2626",
                      }}
                    >
                      -Rs {discountAmount.toFixed(2)}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Grid>
          )}

          {/* Row: Final Total */}
          {formData.items.length > 0 && (
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 2,
                  backgroundColor: "rgba(99, 102, 241, 0.1)",
                  borderRadius: "8px",
                  mb: 3,
                }}
              >
                <Typography
                  sx={{ fontSize: "18px", fontWeight: 700, color: "#1f2937" }}
                >
                  Total:
                </Typography>
                <Typography
                  sx={{
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "primary.main",
                  }}
                >
                  Rs {totalAmount.toFixed(2)}
                </Typography>
              </Box>
            </Grid>
          )}

          {/* Row 5: Additional Note */}
          <Grid item xs={12}>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#1f2937",
                mb: 2,
              }}
            >
              Additional Note
            </Typography>
            <TextField
              fullWidth
              name="additionalNote"
              value={formData.additionalNote || ""}
              onChange={handleInputChange}
              placeholder="Add any additional notes for this invoice"
              multiline
              rows={3}
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

        {/* Footer Buttons */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "flex-end",
            mt: 4,
            pt: 3,
            borderTop: "1px solid #e5e7eb",
          }}
        >
          <Button
            onClick={() => router.back()}
            sx={{
              color: "#1f2937",
              borderRadius: "8px",
              px: 4,
              py: 1.2,
              textTransform: "none",
              border: "1px solid #d1d5db",
              fontSize: "14px",
              fontWeight: 500,
              "&:hover": { backgroundColor: "#f9fafb" },
            }}
          >
            Save as a Draft
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              backgroundColor: "primary.main",
              px: 4,
              py: 1.2,
              borderRadius: "8px",
              textTransform: "none",
              fontSize: "14px",
              fontWeight: 500,
              "&:hover": { backgroundColor: "primary.hover" },
            }}
          >
            Save Invoice
          </Button>
        </Box>
      </Box>

      <AddItemModal
        open={openAddItem}
        onClose={() => {
          setOpenAddItem(false);
          setEditingItemIndex(null);
        }}
        onAdd={handleAddItem}
        onUpdate={handleUpdateItem}
        editingIndex={editingItemIndex}
        allItems={formData.items}
        existingItems={formData.items}
      />
    </Box>
  );
}
