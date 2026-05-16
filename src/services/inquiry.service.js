// Inquiry Service for handling all inquiry-related API calls

export const inquiryService = {
  // Get All Inquiries
  getAllInquiries: async () => {
    try {
      const response = await fetch('/api/inquiries');
      if (!response.ok) {
        throw new Error('Failed to fetch inquiries');
      }
      const data = await response.json();
      return {
        success: true,
        data: data,
        message: 'Inquiries fetched successfully',
      };
    } catch (error) {
      const message =
        error.message || 'An error occurred while fetching inquiries';
      throw new Error(message);
    }
  },

  // Get Inquiry by ID
  getInquiryById: async (inquiryId) => {
    try {
      const response = await fetch(`/api/inquiries/${inquiryId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch inquiry');
      }
      const data = await response.json();
      return {
        success: true,
        data: data,
        message: 'Inquiry fetched successfully',
      };
    } catch (error) {
      const message =
        error.message || 'An error occurred while fetching inquiry';
      throw new Error(message);
    }
  },

  // Create New Inquiry
  createInquiry: async (inquiryData) => {
    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inquiryData),
      });
      if (!response.ok) {
        throw new Error('Failed to create inquiry');
      }
      const data = await response.json();
      return {
        success: true,
        data: data,
        message: 'Inquiry created successfully',
      };
    } catch (error) {
      const message =
        error.message || 'An error occurred while creating inquiry';
      throw new Error(message);
    }
  },

  // Update Inquiry
  updateInquiry: async (inquiryId, inquiryData) => {
    try {
      const response = await fetch(`/api/inquiries/${inquiryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inquiryData),
      });
      if (!response.ok) {
        throw new Error('Failed to update inquiry');
      }
      const data = await response.json();
      return {
        success: true,
        data: data,
        message: 'Inquiry updated successfully',
      };
    } catch (error) {
      const message =
        error.message || 'An error occurred while updating inquiry';
      throw new Error(message);
    }
  },

  // Delete Inquiry
  deleteInquiry: async (inquiryId) => {
    try {
      const response = await fetch(`/api/inquiries/${inquiryId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete inquiry');
      }
      const data = await response.json();
      return {
        success: true,
        data: data,
        message: 'Inquiry deleted successfully',
      };
    } catch (error) {
      const message =
        error.message || 'An error occurred while deleting inquiry';
      throw new Error(message);
    }
  },
};
