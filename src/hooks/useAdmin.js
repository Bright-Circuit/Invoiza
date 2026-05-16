'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAdminDashboard,
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getAdminOrders,
  getAdminOrderById,
  updateOrderStatus,
  getAdminSettings,
  updateAdminSettings,
} from '../services/admin.service';

const QUERY_KEYS = {
  ADMIN_DASHBOARD: 'adminDashboard',
  ADMIN_USERS: 'adminUsers',
  ADMIN_USER: 'adminUser',
  ADMIN_ORDERS: 'adminOrders',
  ADMIN_ORDER: 'adminOrder',
  ADMIN_SETTINGS: 'adminSettings',
};

export function useAdmin() {
  const queryClient = useQueryClient();

  // Dashboard query
  const {
    data: dashboardData,
    isLoading: isDashboardLoading,
    error: dashboardError,
    refetch: refetchDashboard,
  } = useQuery({
    queryKey: [QUERY_KEYS.ADMIN_DASHBOARD],
    queryFn: () => getAdminDashboard(),
    select: (response) => response.data,
  });

  // Users query
  const useUsersQuery = (params) => {
    return useQuery({
      queryKey: [QUERY_KEYS.ADMIN_USERS, params],
      queryFn: () => getUsers(params),
      select: (response) => response.data,
    });
  };

  // User by ID query
  const useUserQuery = (userId) => {
    return useQuery({
      queryKey: [QUERY_KEYS.ADMIN_USER, userId],
      queryFn: () => getUserById(userId),
      select: (response) => response.data,
      enabled: !!userId,
    });
  };

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: (userData) => createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.ADMIN_USERS]);
    },
    onError: (error) => {
      console.error('Create user error:', error.message);
      throw error;
    },
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: ({ userId, userData }) => updateUser(userId, userData),
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.ADMIN_USERS]);
      queryClient.invalidateQueries([QUERY_KEYS.ADMIN_USER]);
    },
    onError: (error) => {
      console.error('Update user error:', error.message);
      throw error;
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: (userId) => deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.ADMIN_USERS]);
    },
    onError: (error) => {
      console.error('Delete user error:', error.message);
      throw error;
    },
  });

  // Orders query
  const useOrdersQuery = (params) => {
    return useQuery({
      queryKey: [QUERY_KEYS.ADMIN_ORDERS, params],
      queryFn: () => getAdminOrders(params),
      select: (response) => response.data,
    });
  };

  // Order by ID query
  const useOrderQuery = (orderId) => {
    return useQuery({
      queryKey: [QUERY_KEYS.ADMIN_ORDER, orderId],
      queryFn: () => getAdminOrderById(orderId),
      select: (response) => response.data,
      enabled: !!orderId,
    });
  };

  // Update order status mutation
  const updateOrderStatusMutation = useMutation({
    mutationFn: ({ orderId, status }) => updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.ADMIN_ORDERS]);
      queryClient.invalidateQueries([QUERY_KEYS.ADMIN_ORDER]);
    },
    onError: (error) => {
      console.error('Update order status error:', error.message);
      throw error;
    },
  });

  // Settings query
  const {
    data: settingsData,
    isLoading: isSettingsLoading,
    error: settingsError,
    refetch: refetchSettings,
  } = useQuery({
    queryKey: [QUERY_KEYS.ADMIN_SETTINGS],
    queryFn: () => getAdminSettings(),
    select: (response) => response.data,
  });

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: (settings) => updateAdminSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.ADMIN_SETTINGS]);
    },
    onError: (error) => {
      console.error('Update settings error:', error.message);
      throw error;
    },
  });

  return {
    // Dashboard
    dashboardData,
    isDashboardLoading,
    dashboardError,
    refetchDashboard,

    // Users
    useUsersQuery,
    useUserQuery,
    createUser: async (userData) => await createUserMutation.mutateAsync(userData),
    isCreatingUser: createUserMutation.isPending,
    createUserError: createUserMutation.error,
    createUserSuccess: createUserMutation.isSuccess,
    resetCreateUser: createUserMutation.reset,

    updateUser: async (userId, userData) =>
      await updateUserMutation.mutateAsync({ userId, userData }),
    isUpdatingUser: updateUserMutation.isPending,
    updateUserError: updateUserMutation.error,
    updateUserSuccess: updateUserMutation.isSuccess,
    resetUpdateUser: updateUserMutation.reset,

    deleteUser: async (userId) => await deleteUserMutation.mutateAsync(userId),
    isDeletingUser: deleteUserMutation.isPending,
    deleteUserError: deleteUserMutation.error,
    deleteUserSuccess: deleteUserMutation.isSuccess,
    resetDeleteUser: deleteUserMutation.reset,

    // Orders
    useOrdersQuery,
    useOrderQuery,
    updateOrderStatus: async (orderId, status) =>
      await updateOrderStatusMutation.mutateAsync({ orderId, status }),
    isUpdatingOrderStatus: updateOrderStatusMutation.isPending,
    updateOrderStatusError: updateOrderStatusMutation.error,
    updateOrderStatusSuccess: updateOrderStatusMutation.isSuccess,
    resetUpdateOrderStatus: updateOrderStatusMutation.reset,

    // Settings
    settingsData,
    isSettingsLoading,
    settingsError,
    refetchSettings,
    updateSettings: async (settings) =>
      await updateSettingsMutation.mutateAsync(settings),
    isUpdatingSettings: updateSettingsMutation.isPending,
    updateSettingsError: updateSettingsMutation.error,
    updateSettingsSuccess: updateSettingsMutation.isSuccess,
    resetUpdateSettings: updateSettingsMutation.reset,
  };
}
