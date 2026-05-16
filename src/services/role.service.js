import { apiGet, apiPost } from "../api/apiManager";
import { API_ENDPOINTS } from "../utils/constants";

export const roleService = {
    //Get All Roles
    getAllRoles: async () => {
        try {
            const response = await apiGet(API_ENDPOINTS.GET_ALL_ROLES);

            if (response.data?.success) {
                return {
                    success: true,
                    data: response.data.data,
                    message: response.data.message,
                };
            } else {
                throw new Error(response.data?.message || 'Failed to fetch roles');
            }
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                'An error occurred while fetching roles';
            throw new Error(message);
        }
    },

    //Get all permissions
    getAllPermissions: async () => {
        try {
            const response = await apiGet(API_ENDPOINTS.GET_ALL_PERMISSIONS_GROUPED);

            if (response.data?.success) {
                return {
                    success: true,
                    data: response.data.data,
                    message: response.data.message,
                };
            } else {
                throw new Error(response.data?.message || 'Failed to fetch permissions');
            }
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                'An error occurred while fetching permissions';
            throw new Error(message);
        }
    },

    //Create Role
    createRole: async (roleData) => {
        try {
            const response = await apiPost(API_ENDPOINTS.CREATE_ROLE, roleData);

            if (response.data?.success) {
                return {
                    success: true,
                    data: response.data.data,
                    message: response.data.message,
                };
            } else {
                throw new Error(response.data?.message || 'Failed to create role');
            }
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                'An error occurred while creating role';
            throw new Error(message);
        }
    },
}