import { apiGet } from "../api/apiManager";
import { API_ENDPOINTS } from "../utils/constants";

export const customerService = {
  //Get All Customers
  getAllCustomers: async () => {
    try {
      const response = await apiGet(API_ENDPOINTS.GET_ALL_CUSTOMERS);

      if (response.data?.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message,
        };
      } else {
        throw new Error(response.data?.message || "Failed to fetch customers");
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "An error occurred while fetching customers";
      throw new Error(message);
    }
  },

  //Get Customer by ID
  getCustomerById: async (customerId) => {
    try {
      const response = await apiGet(`${API_ENDPOINTS.GET_CUSTOMER_BY_ID}?customerUuid=${customerId}`);

      if (response.data?.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message,
        };
      } else {
        throw new Error(response.data?.message || "Failed to fetch customer");
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "An error occurred while fetching customer";
      throw new Error(message);
    }
  },

  //Get Customer Orders
  getCustomerOrders: async (customerId) => {
        try {
            const response = await apiGet(`${API_ENDPOINTS.GET_CUSTOMER_ORDERS}?customerUuid=${customerId}`);

            if (response.data?.success) {
                return {
                    success: true,
                    data: response.data.data,
                    message: response.data.message,
                };
            } else {
                throw new Error(response.data?.message || "Failed to fetch customer orders");
            }
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "An error occurred while fetching customer orders";
            throw new Error(message);
        }
    },
}