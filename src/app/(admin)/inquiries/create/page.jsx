"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Typography,
  CircularProgress,
  Paper,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { inquiryService } from "../../../../services/inquiry.service";

const callStatusOptions = [
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
  { value: "in_progress", label: "In Progress" },
  { value: "cancelled", label: "Cancelled" },
];

const projectStatusOptions = [
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
  { value: "in_progress", label: "In Progress" },
  { value: "cancelled", label: "Cancelled" },
];

export default function CreateInquiryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inquiryId = searchParams.get("id");

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    customerName: "",
    phoneNumber: "",
    callStatus: "pending",
    project: "",
    comment: "",
    projectStatus: "pending",
  });

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(inquiryId ? true : false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (inquiryId) {
      fetchInquiry();
    }
  }, [inquiryId]);

  const fetchInquiry = async () => {
    try {
      setInitialLoading(true);
      const result = await inquiryService.getInquiryById(inquiryId);
      setFormData(result.data);
    } catch (error) {
      console.error("Error fetching inquiry:", error);
      alert("Failed to fetch inquiry");
      router.push("/inquiries");
    } finally {
      setInitialLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.date.trim()) {
      errors.date = "Date is required";
    }

    if (!formData.customerName.trim()) {
      errors.customerName = "Customer name is required";
    }

    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$|^\+?\d{1,3}[-.\s]?\d{1,14}$/.test(formData.phoneNumber)) {
      errors.phoneNumber = "Please enter a valid phone number";
    }

    if (!formData.project.trim()) {
      errors.project = "Project name is required";
    }

    return errors;
  };

  const handleSave = async () => {
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setLoading(true);

      if (inquiryId) {
        // Update existing inquiry
        await inquiryService.updateInquiry(inquiryId, formData);
        alert("Inquiry updated successfully!");
      } else {
        // Create new inquiry
        await inquiryService.createInquiry(formData);
        alert("Inquiry created successfully!");
      }

      router.push("/inquiries");
    } catch (error) {
      console.error("Error saving inquiry:", error);
      alert("Failed to save inquiry");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/inquiries");
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

  if (initialLoading) {
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

  return (
    <Box sx={{ width: "100%",  }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleCancel}
          sx={{
            color: "#6b7280",
            textTransform: "none",
            fontSize: "14px",
            fontWeight: 500,
            mb: 2,
            "&:hover": { backgroundColor: "transparent", color: "#1f2937" },
          }}
        >
          Back to Inquiries
        </Button>

        <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
          {inquiryId ? "Edit Inquiry" : "Create New Inquiry"}
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: "#666666", fontSize: "15px" }}
        >
          {inquiryId
            ? "Update the inquiry details below."
            : "Fill in the details below to create a new inquiry."}
        </Typography>
      </Box>

      {/* Form */}
      <Paper sx={{ p: 4, borderRadius: "16px" }}>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3, mb: 3 }}>
          {/* Date */}
          <Box>
            <Typography
              sx={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#1f2937",
                mb: 1,
              }}
            >
              Date <span style={{ color: "#dc2626" }}>*</span>
            </Typography>
            <TextField
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              variant="outlined"
              fullWidth
              InputLabelProps={{ shrink: true }}
              error={!!formErrors.date}
              helperText={formErrors.date}
              sx={textFieldSx}
            />
          </Box>

          {/* Call Status */}
          <Box>
            <Typography
              sx={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#1f2937",
                mb: 1,
              }}
            >
              Call Status
            </Typography>
            <FormControl fullWidth>
              <Select
                name="callStatus"
                value={formData.callStatus}
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
                {callStatusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3, mb: 3 }}>
          {/* Customer Name */}
          <Box>
            <Typography
              sx={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#1f2937",
                mb: 1,
              }}
            >
              Customer Name <span style={{ color: "#dc2626" }}>*</span>
            </Typography>
            <TextField
              name="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
              placeholder="Enter customer name"
              variant="outlined"
              fullWidth
              error={!!formErrors.customerName}
              helperText={formErrors.customerName}
              sx={textFieldSx}
            />
          </Box>

          {/* Phone Number */}
          <Box>
            <Typography
              sx={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#1f2937",
                mb: 1,
              }}
            >
              Phone Number <span style={{ color: "#dc2626" }}>*</span>
            </Typography>
            <TextField
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="Enter phone number"
              variant="outlined"
              fullWidth
              error={!!formErrors.phoneNumber}
              helperText={formErrors.phoneNumber}
              sx={textFieldSx}
            />
          </Box>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3, mb: 3 }}>
          {/* Project */}
          <Box>
            <Typography
              sx={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#1f2937",
                mb: 1,
              }}
            >
              Project <span style={{ color: "#dc2626" }}>*</span>
            </Typography>
            <TextField
              name="project"
              value={formData.project}
              onChange={handleInputChange}
              placeholder="Enter project name"
              variant="outlined"
              fullWidth
              error={!!formErrors.project}
              helperText={formErrors.project}
              sx={textFieldSx}
            />
          </Box>

          {/* Project Status */}
          <Box>
            <Typography
              sx={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#1f2937",
                mb: 1,
              }}
            >
              Project Status
            </Typography>
            <FormControl fullWidth>
              <Select
                name="projectStatus"
                value={formData.projectStatus}
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
                {projectStatusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Comment */}
        <Box sx={{ mb: 4 }}>
          <Typography
            sx={{
              fontSize: "13px",
              fontWeight: 600,
              color: "#1f2937",
              mb: 1,
            }}
          >
            Comment
          </Typography>
          <TextField
            name="comment"
            value={formData.comment}
            onChange={handleInputChange}
            placeholder="Add any additional comments"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                "& fieldset": { borderColor: "#d1d5db" },
                "&:hover fieldset": { borderColor: "#9ca3af" },
                "&.Mui-focused fieldset": { borderColor: "primary.main" },
              },
            }}
          />
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
          <Button
            onClick={handleCancel}
            sx={{
              color: "#1f2937",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              px: 4,
              py: 1.2,
              textTransform: "none",
              fontSize: "16px",
              fontWeight: 600,
              "&:hover": { backgroundColor: "#f9fafb" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading}
            variant="contained"
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
            {loading ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
            {inquiryId ? "Update Inquiry" : "Create Inquiry"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
