import axios from 'axios';
import { RESPONSE_CODES } from '../utils/constants';

// Track if we're currently refreshing to prevent infinite loops
let isRefreshing = false;

/**
 * Redirect to login helper
 * Clears state and redirects to auth app login
 */
const redirectToLogin = () => {
  if (typeof window !== 'undefined') {
    // Clear any client-side state
    const { clearAuth } = require('../store/useStore').useStore.getState();
    clearAuth();
    
    // Redirect to auth app login page
    const authUrl = process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:3004';
    window.location.href = `${authUrl}/auth/login`;
  }
};

// Create axios instance with cookie-based authentication
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080/api/v1',
  timeout: 30000,
  withCredentials: true, // CRITICAL: Send HTTP-only cookies automatically
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

/**
 * Request interceptor - NO manual token handling
 * Cookies are automatically sent by browser with withCredentials: true
 */
axiosInstance.interceptors.request.use(
  (config) => {
    // Reset refreshing flag on new requests (except refresh endpoint)
    if (!config.url?.includes('/auth/me')) {
      isRefreshing = false;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor - Handle 401/403 errors with session validation
 */
axiosInstance.interceptors.response.use(
  (response) => {
    // Check for application-level errors
    if (response.data?.responseCode === RESPONSE_CODES.ERROR) {
      const error = new Error(response.data.message || 'An error occurred');
      error.responseCode = response.data.responseCode;
      error.data = response.data;
      throw error;
    }
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized - Session expired or invalid
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Prevent infinite loop - if already refreshing or if this IS the /me endpoint, redirect immediately
      if (isRefreshing || originalRequest.url?.includes('/auth/me')) {
        redirectToLogin();
        return Promise.reject(error);
      }

      // Mark as refreshing
      isRefreshing = true;

      try {
        // Backend automatically handles refresh via refresh_token cookie
        // Just retry the original request - if session is still valid, it will work
        const retryResponse = await axiosInstance(originalRequest);
        isRefreshing = false;
        return retryResponse;
      } catch (retryError) {
        // Session is truly expired, redirect to login
        isRefreshing = false;
        redirectToLogin();
        return Promise.reject(retryError);
      }
    }

    // Handle 403 Forbidden - Not authenticated or insufficient permissions
    if (error.response?.status === 403) {
      // Redirect to login for all 403 errors (session invalid or not authenticated)
      redirectToLogin();
      return Promise.reject(error);
    }

    // Handle application-level errors in error response
    if (error.response?.data?.responseCode === RESPONSE_CODES.ERROR) {
      const customError = new Error(
        error.response.data.message || 'An error occurred'
      );
      customError.responseCode = error.response.data.responseCode;
      customError.data = error.response.data;
      return Promise.reject(customError);
    }

    return Promise.reject(error);
  }
);

/**
 * API helper methods
 * All methods automatically include cookies via withCredentials
 */

export const apiGet = (url, config = {}) => {
  return axiosInstance.get(url, config);
};

export const apiPost = (url, data = {}, config = {}) => {
  return axiosInstance.post(url, data, config);
};

export const apiPut = (url, data = {}, config = {}) => {
  return axiosInstance.put(url, data, config);
};

export const apiPatch = (url, data = {}, config = {}) => {
  return axiosInstance.patch(url, data, config);
};

export const apiDelete = (url, config = {}) => {
  return axiosInstance.delete(url, config);
};

/**
 * Form data helper - also uses cookies
 */
export const apiPostFormData = (url, formData, config = {}) => {
  const formDataInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080',
    timeout: 60000,
    withCredentials: true, // CRITICAL: Send cookies
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return formDataInstance.post(url, formData, config);
};

export default axiosInstance;
