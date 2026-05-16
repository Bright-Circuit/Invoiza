import { apiGet, apiPost } from "../api/apiManager";
import { API_ENDPOINTS } from "../utils/constants";


export  const resellerService = {
  //Get all resellers
  
    getAllResellers: async () => {
      try {
        const response = await apiGet(API_ENDPOINTS.GET_ALL_RESELLERS);
        console.log("Reseller Service Response", response.data);
  
        if (response?.status == 200) {
          console.log("Response aftrer status ", response.data);
          
          return {
            success: true,
            data: response.data?.resellers,
            message: response.data.message,
          };
        } else {
          throw new Error(response.data?.message || "Failed to fetch resellers");
        }
      } catch (error) {
        const message =
          error.response?.data?.message ||
          error.message || 
          "An error occurred while fetching resellers";
        throw new Error(message);
      }
    },

    //Get reseller by ID
    getResellerById: async (resellerId) => {
      try {
        const response = await apiGet(`${API_ENDPOINTS.GET_RESELLER_BY_ID}/${resellerId}`);
        
        if (response?.status === 200 && response.data) {
          return {
            success: true,
            data: response.data,
            message: 'Reseller fetched successfully',
          };
        }
        
        throw new Error(response.data?.message || 'Failed to fetch reseller');
      } catch (error) {
        const message =
          error.response?.data?.message ||
          error.message ||
          'An error occurred while fetching reseller';
        throw new Error(message);
      }
    },

    //Approve or reject reseller -  POST API
    approveOrRejectReseller: async (resellerId, payload) => {
      try {
        const response = await apiPost(`${API_ENDPOINTS.APPROVE_OR_REJECT_RESELLER}/${resellerId}/approve`, payload);
        
        if (response?.status === 200 && response.data) {
          return {
            success: true,
            data: response.data,
            message: 'Reseller updated successfully',
          };
        }
        
        throw new Error(response.data?.message || 'Failed to update reseller');
      } catch (error) {
        const message =
          error.response?.data?.message ||
          error.message ||
          'An error occurred while updating reseller';
        throw new Error(message);
      } 
    },
    
    // Deactivate reseller - POST API
    deactivateReseller: async (resellerId, suspensionReason) => {
      try {
        const response = await apiPost(`${API_ENDPOINTS.SUSPEND_RESELLER}/${resellerId}/suspend?suspensionReason=${encodeURIComponent(suspensionReason)}`);
           
        if (response?.status === 200) {
          return {
            success: true,
            data: response.data,
            message: 'Reseller deactivated successfully',
          };
        }
        throw new Error(response.data?.message || 'Failed to deactivate reseller');
      } catch (error) {
        const message =
          error.response?.data?.message ||
          error.message ||
          'An error occurred while deactivating reseller';
        throw new Error(message);
      }
    },

   // Activate reseller
  activateReseller: async (resellerId) => {  
    try {
      const response = await apiPost(`${API_ENDPOINTS.REACTIVATE_RESELLER}/${resellerId}/reactivate`);     
      if (response?.status === 200 && response.data) {
        return {
          success: true,
          data: response.data,
          message: 'Reseller activated successfully',
        };
      }
      throw new Error(response.data?.message || 'Failed to activate reseller');
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'An error occurred while activating reseller';
      throw new Error(message);
    }
  }
  };