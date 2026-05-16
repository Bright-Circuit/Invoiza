import { apiGet, apiPost, apiPut, apiDelete } from '../api/apiManager';
import { API_ENDPOINTS } from '../utils/constants';

/**
 * Get current authenticated user
 * Called on app startup to check if user is logged in
 * Uses HTTP-only cookies automatically sent by browser
 */
export async function getCurrentUser() {
  try {
    const response = await apiGet(API_ENDPOINTS.GET_CURRENT_USER);
    
    if (response.data?.success && response.data?.data) {
      return {
        success: true,
        data: response.data.data, // { userId, uuid, email, role, emailVerified, posCashierUuid }
        message: response.data.message || 'User retrieved successfully',
      };
    }
    
    throw new Error(response.data?.message || 'Failed to get user');
  } catch (error) {
    // 401 or 403 means not authenticated - handled by apiManager interceptor
    const message =
      error.response?.data?.message ||
      error.message ||
      'Not authenticated';
    throw new Error(message);
  }
}

/**
 * Login service - Cookie-based authentication
 * Backend sets HTTP-only cookies automatically
 * Response contains defaultPortal for navigation
 */
export async function login(credentials) {
  try {
    const response = await apiPost(API_ENDPOINTS.LOGIN, credentials);
    
    if (response.data?.success && response.data?.data) {
      return {
        success: true,
        data: response.data.data, // { success, defaultPortal }
        message: response.data.message || 'Login successful',
      };
    }
    
    throw new Error(response.data?.message || 'Login failed');
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An error occurred during login';
    throw new Error(message);
  }
}

/**
 * Register service
 * After registration, user may need to verify email before logging in
 */
export async function register(userData) {
  try {
    const response = await apiPost(API_ENDPOINTS.REGISTER, userData);
    
    if (response.data?.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Registration successful',
      };
    }
    
    throw new Error(response.data?.message || 'Registration failed');
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An error occurred during registration';
    throw new Error(message);
  }
}

/**
 * Logout service - Cookie-based
 * Backend clears HTTP-only cookies and invalidates session
 */
export async function logout() {
  try {
    const response = await apiPost(API_ENDPOINTS.LOGOUT);
    
    return {
      success: true,
      message: response.data?.message || 'Logout successful',
    };
  } catch (error) {
    // Even on error, client should clear state and redirect
    const message =
      error.response?.data?.message ||
      error.message ||
      'An error occurred during logout';
    throw new Error(message);
  }
}

/**
 * Forgot password service
 */
export async function forgotPassword(email) {
  try {
    const response = await apiPost(API_ENDPOINTS.FORGOT_PASSWORD, { email });
    
    if (response.data?.success) {
      return {
        success: true,
        message: response.data.message || 'Password reset email sent',
      };
    }
    
    throw new Error(response.data?.message || 'Failed to send reset email');
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An error occurred while sending reset email';
    throw new Error(message);
  }
}

/**
 * Reset password service
 */
export async function resetPassword(token, newPassword) {
  try {
    const response = await apiPost(API_ENDPOINTS.RESET_PASSWORD, {
      token,
      newPassword,
    });
    
    if (response.data?.success) {
      return {
        success: true,
        message: response.data.message || 'Password reset successful',
      };
    }
    
    throw new Error(response.data?.message || 'Password reset failed');
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An error occurred while resetting password';
    throw new Error(message);
  }
}

/**
 * Verify email service
 */
export async function verifyEmail(token) {
  try {
    const response = await apiPost(API_ENDPOINTS.VERIFY_EMAIL, { token });
    
    if (response.data?.success) {
      return {
        success: true,
        message: response.data.message || 'Email verified successfully',
      };
    }
    
    throw new Error(response.data?.message || 'Email verification failed');
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An error occurred during email verification';
    throw new Error(message);
  }
}
