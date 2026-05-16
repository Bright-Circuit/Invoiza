import { apiGet, apiPost, apiDelete, apiPatch, apiPut } from "../api/apiManager";
import { API_ENDPOINTS } from "../utils/constants";

export const posService = {
    //Get All Products for POS
    getAllProductsForPOS: async () => {
        try {
            const response = await apiGet(API_ENDPOINTS.GET_ALL_PRODUCTS_FOR_POS);

            if (response.data?.success) {
                // Return the complete data object including products array and pagination info
                return response.data.data;
            } else {
                throw new Error(response.data?.message || 'Failed to fetch products');
            }
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                'An error occurred while fetching products';
            throw new Error(message);
        }
    },
    // Get product details for POS by uuid
    getProductDetails: async (uuid) => {
        try {
            const endpoint = API_ENDPOINTS.GET_POS_PRODUCT_DETAILS.replace('{uuid}', uuid);
            const response = await apiGet(endpoint);

            if (response.data?.success) {
                return response.data.data;
            } else {
                throw new Error(response.data?.message || 'Failed to fetch product details');
            }
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                'An error occurred while fetching product details';
            throw new Error(message);
        }
    },
    // Get variant gallery by variant uuid
    getVariantGallery: async (uuid) => {
        try {
            const endpoint = API_ENDPOINTS.GET_POS_VARIANT_GALLERY.replace('{uuid}', uuid);
            const response = await apiGet(endpoint);

            if (response.data?.success) {
                return response.data.data;
            } else {
                throw new Error(response.data?.message || 'Failed to fetch variant gallery');
            }
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                'An error occurred while fetching variant gallery';
            throw new Error(message);
        }
    },
    // Get active terminals
    getActiveTerminals: async () => {
        try {
            const response = await apiGet(API_ENDPOINTS.GET_ACTIVE_TERMINALS);

            if (response.data?.success) {
                return response.data.data?.content || [];
            } else {
                throw new Error(response.data?.message || 'Failed to fetch terminals');
            }
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                'An error occurred while fetching terminals';
            throw new Error(message);
        }
    },
    // Get cart by terminal uuid
    getCartByTerminal: async (terminalUuid, cashierUuid = null) => {
        try {
            const endpoint = API_ENDPOINTS.GET_CART_BY_TERMINAL.replace('{terminalUuid}', terminalUuid);
            
            const headers = {
                'X-Terminal-UUID': terminalUuid,
            };

            // Use cashierUuid from parameter (store) or fall back to localStorage
            const effectiveCashierUuid = cashierUuid || 
                (typeof window !== 'undefined' ? 
                    localStorage.getItem('pos_cashier_uuid') || localStorage.getItem('cashier_uuid') : 
                    null);

            if (effectiveCashierUuid) {
                headers['X-Cashier-UUID'] = effectiveCashierUuid;
            }

            const response = await apiGet(endpoint, { headers });
            if (response.data?.success) {
                const data = response.data.data || {};
                if (typeof window !== 'undefined' && data.uuid) {
                    try {
                        localStorage.setItem('pos_cart_uuid', data.uuid);
                    } catch (e) {
                        // ignore storage errors
                    }
                }
                return data;
            } else {
                throw new Error(response.data?.message || 'Failed to fetch cart');
            }
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                'An error occurred while fetching cart';
            throw new Error(message);
        }
    },
    // Validate terminal with code
    validateTerminal: async (uuid, code) => {
        try {
            const endpoint = API_ENDPOINTS.VALIDATE_TERMINAL
                .replace('{uuid}', uuid)
                .replace('{code}', code);
            const response = await apiPost(endpoint);

            if (response.data?.success) {
                return response.data;
            } else {
                throw new Error(response.data?.message || 'Terminal validation failed');
            }
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                'An error occurred while validating terminal';
            throw new Error(message);
        }
    },

     // Get customers for POS
    getCustomers: async () => {
        try {
            const response = await apiGet(API_ENDPOINTS.GET_POS_CUSTOMERS);

            if (response.data?.success) {
                return response.data.data || [];
            } else {
                throw new Error(response.data?.message || 'Failed to fetch customers');
            }
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                'An error occurred while fetching customers';
            throw new Error(message);
        }
    },
    // Create a new POS customer
    createCustomer: async (payload) => {
        try {
            const response = await apiPost(API_ENDPOINTS.CREATE_POS_CUSTOMER, payload);

            if (response.data?.success) {
                return response.data.data || response.data;
            } else {
                throw new Error(response.data?.message || 'Failed to create customer');
            }
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                'An error occurred while creating customer';
            throw new Error(message);
        }
    },
    // Add item to cart
    addItemToCart: async (cartUuid, customerUuid, payload, cashierUuid = null) => {
        try {
         
            const endpoint = customerUuid
                ? API_ENDPOINTS.ADD_ITEM_TO_CART
                    .replace('{cartUuid}', cartUuid)
                    .replace('{customerUuid}', customerUuid)
                : API_ENDPOINTS.ADD_ITEM_TO_CART_NULL_CUSTOMETR.replace('{cartUuid}', cartUuid);
            
            const headers = {};
            
            if (typeof window !== 'undefined') {
                const terminalUuid = localStorage.getItem('pos_terminal_uuid');
                if (terminalUuid) {
                    headers['X-Terminal-UUID'] = terminalUuid;
                }
            }

            // Use cashierUuid from parameter (store) or fall back to localStorage
            const effectiveCashierUuid = cashierUuid || 
                (typeof window !== 'undefined' ? 
                    localStorage.getItem('pos_cashier_uuid') || localStorage.getItem('cashier_uuid') : 
                    null);

            if (effectiveCashierUuid) {
                headers['X-Cashier-UUID'] = effectiveCashierUuid;
            }
            
            const response = await apiPost(endpoint, payload, { headers });

            if (response.data?.success) {
                return response.data.data || response.data;
            } else {
                throw new Error(response.data?.message || 'Failed to add item to cart');
            }
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                'An error occurred while adding item to cart';
            throw new Error(message);
        }
    },
    // Remove item from cart
    removeItemFromCart: async (cartUuid, itemUuid, cashierUuid = null) => {
        try {
            const endpoint = API_ENDPOINTS.REMOVE_ITEM_FROM_CART
                .replace('{cartUuid}', cartUuid)
                .replace('{itemUuid}', itemUuid);

            const headers = {};

            if (typeof window !== 'undefined') {
                const terminalUuid = localStorage.getItem('pos_terminal_uuid');
                if (terminalUuid) {
                    headers['X-Terminal-UUID'] = terminalUuid;
                }
            }

            // Use cashierUuid from parameter (store) or fall back to localStorage
            const effectiveCashierUuid = cashierUuid || 
                (typeof window !== 'undefined' ? 
                    localStorage.getItem('pos_cashier_uuid') || localStorage.getItem('cashier_uuid') : 
                    null);

            if (effectiveCashierUuid) {
                headers['X-Cashier-UUID'] = effectiveCashierUuid;
            }

            const response = await apiDelete(endpoint, { headers });

            if (response.data?.success) {
                return response.data.data || response.data;
            } else {
                throw new Error(response.data?.message || 'Failed to remove item from cart');
            }
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                'An error occurred while removing item from cart';
            throw new Error(message);
        }
    },
    
    // Update item in cart (e.g., change quantity)
    updateItemInCart: async (cartUuid, itemUuid, payload, cashierUuid = null) => {
        try {
            const endpoint = API_ENDPOINTS.UPDATE_ITEM_FROM_CART
                .replace('{cartUuid}', cartUuid)
                .replace('{itemUuid}', itemUuid);

            const headers = {};

            if (typeof window !== 'undefined') {
                const terminalUuid = localStorage.getItem('pos_terminal_uuid');
                if (terminalUuid) {
                    headers['X-Terminal-UUID'] = terminalUuid;
                }
            }

            // Use cashierUuid from parameter (store) or fall back to localStorage
            const effectiveCashierUuid = cashierUuid || 
                (typeof window !== 'undefined' ? 
                    localStorage.getItem('pos_cashier_uuid') || localStorage.getItem('cashier_uuid') : 
                    null);

            if (!effectiveCashierUuid) {
                throw new Error('X-Cashier-UUID is required but not found');
            }

            headers['X-Cashier-UUID'] = effectiveCashierUuid;

            const response = await apiPut(endpoint, payload, { headers });

            if (response.data?.success) {
                return response.data.data || response.data;
            } else {
                throw new Error(response.data?.message || 'Failed to update item in cart');
            }
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                'An error occurred while updating item in cart';
            throw new Error(message);
        }
    },
}