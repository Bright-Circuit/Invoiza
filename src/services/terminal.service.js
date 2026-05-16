import { apiGet, apiPost } from "../api/apiManager";
import { API_ENDPOINTS } from "../utils/constants";

export const terminalService = {
    // Create terminal
    createTerminal: async (payload) => {
        try {
            const response = await apiPost(API_ENDPOINTS.CREATE_TERMINAL, payload);
            console.log('Create terminal response:', response);

            if (response.data?.success) {
                return {
                    success: true,
                    data: response.data.data,
                    message: response.data.message || "Terminal created successfully",
                };
            } else {
                throw new Error(response.data?.message || "Failed to create terminal");
            }
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "An error occurred while creating terminal";
            throw new Error(message);
        }
    },

    //Get terminal list
    getPosTerminalList: async () => {
        try {
            const response = await apiGet(API_ENDPOINTS.GET_POS_TERMINAL_LIST);

            if (response.data?.success) {
                return {
                    success: true,
                    data: response.data.data,
                    message: response.data.message,
                };
            } else {
                throw new Error(response.data?.message || "Failed to fetch terminal list");
            }
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "An error occurred while fetching terminal list";
            throw new Error(message);
        }
    },
}