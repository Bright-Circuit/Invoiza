'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useStore } from '../store/useStore';
import {
  getCurrentUser as getCurrentUserService,
  login as loginService,
  register as registerService,
  logout as logoutService,
  forgotPassword as forgotPasswordService,
  resetPassword as resetPasswordService,
  verifyEmail as verifyEmailService,
} from '../services/auth.service';

const QUERY_KEYS = {
  CURRENT_USER: 'currentUser',
};

export function useAuth() {
  const queryClient = useQueryClient();
  const { setAuth, clearAuth, user, isAuthenticated } = useStore();

  // Get current user query - Called on app initialization
  // Uses React Query's built-in retry and refetch logic
  const {
    data: currentUserData,
    isLoading: isLoadingCurrentUser,
    error: currentUserError,
    refetch: refetchCurrentUser,
  } = useQuery({
    queryKey: [QUERY_KEYS.CURRENT_USER],
    queryFn: getCurrentUserService,
    enabled: false, // Manual fetch to prevent infinite loops
    retry: false, // Don't retry on 401/403 - just redirect to login
    refetchOnWindowFocus: false, // Don't auto-refetch to prevent loops
    onSuccess: (response) => {
      if (response?.data) {
        // Update store with user info (no tokens)
        setAuth(response.data); // { userId, uuid, email, role, emailVerified, posCashierUuid }
      }
    },
    onError: () => {
      // Clear auth state on error (401/403 handled by apiManager)
      clearAuth();
    },
  });

  // Login mutation - Cookie-based authentication
  const loginMutation = useMutation({
    mutationFn: (credentials) => loginService(credentials),
    onSuccess: async (response) => {
      // Backend sets HTTP-only cookies automatically
      // Response contains: { success, defaultPortal }
      
      if (response?.data?.defaultPortal) {
        // Fetch current user to populate store
        await refetchCurrentUser();
        
        // Show session replacement message if needed
        const message = response.message || 'Login successful';
        if (message.toLowerCase().includes('session') || message.toLowerCase().includes('replaced')) {
          console.info('Previous session has been replaced');
        }
      }
    },
    onError: (error) => {
      console.error('Login error:', error.message);
      clearAuth();
      throw error;
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: (userData) => registerService(userData),
    onSuccess: async (response) => {
      // After registration, user may need to verify email
      // Optionally fetch current user if backend logs them in automatically
      if (response?.data?.userInfo) {
        await refetchCurrentUser();
      }
      
      queryClient.invalidateQueries([QUERY_KEYS.CURRENT_USER]);
    },
    onError: (error) => {
      console.error('Register error:', error.message);
      throw error;
    },
  });

  // Logout mutation - Cookie-based
  const logoutMutation = useMutation({
    mutationFn: () => logoutService(),
    onSuccess: () => {
      // Backend clears HTTP-only cookies
      // Clear client-side state
      clearAuth();
      queryClient.clear();
      
      // Redirect to auth app login
      if (typeof window !== 'undefined') {
        const authUrl = process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:3000';
        window.location.href = `${authUrl}/auth/login`;
      }
    },
    onError: (error) => {
      console.error('Logout error:', error.message);
      // Still clear on error and redirect
      clearAuth();
      queryClient.clear();
      
      if (typeof window !== 'undefined') {
        const authUrl = process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:3000';
        window.location.href = `${authUrl}/auth/login`;
      }
    },
  });

  // Forgot password mutation
  const forgotPasswordMutation = useMutation({
    mutationFn: (email) => forgotPasswordService(email),
    onError: (error) => {
      console.error('Forgot password error:', error.message);
      throw error;
    },
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: ({ token, newPassword }) =>
      resetPasswordService(token, newPassword),
    onError: (error) => {
      console.error('Reset password error:', error.message);
      throw error;
    },
  });

  // Verify email mutation
  const verifyEmailMutation = useMutation({
    mutationFn: (token) => verifyEmailService(token),
    onError: (error) => {
      console.error('Verify email error:', error.message);
      throw error;
    },
  });

  // Helper wrappers
  const login = async (credentials) => {
    return await loginMutation.mutateAsync(credentials);
  };

  const register = async (userData) => {
    return await registerMutation.mutateAsync(userData);
  };

  const logout = async () => {
    return await logoutMutation.mutateAsync();
  };

  const forgotPassword = async (email) => {
    return await forgotPasswordMutation.mutateAsync(email);
  };

  const resetPassword = async (token, newPassword) => {
    return await resetPasswordMutation.mutateAsync({ token, newPassword });
  };

  const verifyEmail = async (token) => {
    return await verifyEmailMutation.mutateAsync(token);
  };

  // Check current session - Call this on app mount
  const checkSession = async () => {
    try {
      await refetchCurrentUser();
    } catch (error) {
      // Error handled by query onError - will clear auth and redirect
      console.error('Session check failed:', error.message);
    }
  };

  return {
    // State
    user,
    isAuthenticated,
    
    // Session check
    checkSession,
    isCheckingSession: isLoadingCurrentUser,
    sessionCheckError: currentUserError,

    // Login
    login,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    loginSuccess: loginMutation.isSuccess,
    loginData: loginMutation.data,
    resetLogin: loginMutation.reset,

    // Register
    register,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    registerSuccess: registerMutation.isSuccess,
    registerData: registerMutation.data,
    resetRegister: registerMutation.reset,

    // Logout
    logout,
    isLoggingOut: logoutMutation.isPending,
    logoutError: logoutMutation.error,

    // Forgot password
    forgotPassword,
    isSendingResetEmail: forgotPasswordMutation.isPending,
    forgotPasswordError: forgotPasswordMutation.error,
    forgotPasswordSuccess: forgotPasswordMutation.isSuccess,
    resetForgotPassword: forgotPasswordMutation.reset,

    // Reset password
    resetPassword,
    isResettingPassword: resetPasswordMutation.isPending,
    resetPasswordError: resetPasswordMutation.error,
    resetPasswordSuccess: resetPasswordMutation.isSuccess,
    resetResetPassword: resetPasswordMutation.reset,

    // Verify email
    verifyEmail,
    isVerifyingEmail: verifyEmailMutation.isPending,
    verifyEmailError: verifyEmailMutation.error,
    verifyEmailSuccess: verifyEmailMutation.isSuccess,
    resetVerifyEmail: verifyEmailMutation.reset,
  };
}
