import { apiGet, apiPost, apiPut, apiDelete } from '../api/apiManager';
import { API_ENDPOINTS } from '../lib/constants';

/**
 * Get admin dashboard data
 */
export async function getAdminDashboard() {
  try {
    const response = await apiGet(API_ENDPOINTS.ADMIN_DASHBOARD);
    
    if (response.data?.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    }
    
    throw new Error(response.data?.message || 'Failed to fetch dashboard data');
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An error occurred while fetching dashboard data';
    throw new Error(message);
  }
}

/**
 * Get all users
 */
export async function getUsers(params = {}) {
  try {
    const response = await apiGet(API_ENDPOINTS.ADMIN_USERS, { params });
    
    if (response.data?.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    }
    
    throw new Error(response.data?.message || 'Failed to fetch users');
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An error occurred while fetching users';
    throw new Error(message);
  }
}

/**
 * Get user by ID
 */
export async function getUserById(userId) {
  try {
    const response = await apiGet(`${API_ENDPOINTS.ADMIN_USERS}/${userId}`);
    
    if (response.data?.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    }
    
    throw new Error(response.data?.message || 'Failed to fetch user');
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An error occurred while fetching user';
    throw new Error(message);
  }
}

/**
 * Create user
 */
export async function createUser(userData) {
  try {
    const response = await apiPost(API_ENDPOINTS.ADMIN_USERS, userData);
    
    if (response.data?.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'User created successfully',
      };
    }
    
    throw new Error(response.data?.message || 'Failed to create user');
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An error occurred while creating user';
    throw new Error(message);
  }
}

/**
 * Update user
 */
export async function updateUser(userId, userData) {
  try {
    const response = await apiPut(
      `${API_ENDPOINTS.ADMIN_USERS}/${userId}`,
      userData
    );
    
    if (response.data?.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'User updated successfully',
      };
    }
    
    throw new Error(response.data?.message || 'Failed to update user');
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An error occurred while updating user';
    throw new Error(message);
  }
}

/**
 * Delete user
 */
export async function deleteUser(userId) {
  try {
    const response = await apiDelete(`${API_ENDPOINTS.ADMIN_USERS}/${userId}`);
    
    if (response.data?.success) {
      return {
        success: true,
        message: response.data.message || 'User deleted successfully',
      };
    }
    
    throw new Error(response.data?.message || 'Failed to delete user');
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An error occurred while deleting user';
    throw new Error(message);
  }
}

/**
 * Get all admin orders
 */
export async function getAdminOrders(params = {}) {
  try {
    const response = await apiGet(API_ENDPOINTS.ADMIN_ORDERS, { params });
    
    if (response.data?.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    }
    
    throw new Error(response.data?.message || 'Failed to fetch orders');
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An error occurred while fetching orders';
    throw new Error(message);
  }
}

/**
 * Get admin order by ID
 */
export async function getAdminOrderById(orderId) {
  try {
    const response = await apiGet(`${API_ENDPOINTS.ADMIN_ORDERS}/${orderId}`);
    
    if (response.data?.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    }
    
    throw new Error(response.data?.message || 'Failed to fetch order');
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An error occurred while fetching order';
    throw new Error(message);
  }
}

/**
 * Update order status
 */
export async function updateOrderStatus(orderId, status) {
  try {
    const response = await apiPut(`${API_ENDPOINTS.ADMIN_ORDERS}/${orderId}`, {
      status,
    });
    
    if (response.data?.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Order status updated successfully',
      };
    }
    
    throw new Error(response.data?.message || 'Failed to update order status');
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An error occurred while updating order status';
    throw new Error(message);
  }
}

/**
 * Get admin settings
 */
export async function getAdminSettings() {
  try {
    const response = await apiGet(API_ENDPOINTS.ADMIN_SETTINGS);
    
    if (response.data?.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    }
    
    throw new Error(response.data?.message || 'Failed to fetch settings');
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An error occurred while fetching settings';
    throw new Error(message);
  }
}

/**
 * Update admin settings
 */
export async function updateAdminSettings(settings) {
  try {
    const response = await apiPut(API_ENDPOINTS.ADMIN_SETTINGS, settings);
    
    if (response.data?.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Settings updated successfully',
      };
    }
    
    throw new Error(response.data?.message || 'Failed to update settings');
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An error occurred while updating settings';
    throw new Error(message);
  }
}
