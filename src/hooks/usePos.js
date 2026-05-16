import { useQuery,  } from "@tanstack/react-query"
import { posService } from "../services/pos.services"
import { getCurrentUser } from "../services/auth.service"

export const usePos = () => {
  
    //Get All POS products

    const getAllPOSProductsQuery = useQuery({
        queryKey: ['pos-products'],
        queryFn: posService.getAllProductsForPOS,
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
    });

    

    return {
        posProductsData: getAllPOSProductsQuery.data, // Full data with products, pagination
        getAllPOSProducts: getAllPOSProductsQuery.data?.products || [],
        totalProducts: getAllPOSProductsQuery.data?.totalProducts || 0,
        totalPages: getAllPOSProductsQuery.data?.totalPages || 0,
        currentPage: getAllPOSProductsQuery.data?.currentPage || 0,
        pageSize: getAllPOSProductsQuery.data?.pageSize || 20,
        isLoadingPOSProducts: getAllPOSProductsQuery.isFetching,
        posProductsError: getAllPOSProductsQuery.error,
        refetchPOSProducts: getAllPOSProductsQuery.refetch,
    }
}

// POS cart hook 
const POS_CART_QUERY_KEY = (terminalUuid) => ['pos-cart', terminalUuid];

export const usePosCart = (terminalUuid) => {
    // Fetch current user to get cashier UUID
    const currentUserQuery = useQuery({
        queryKey: ['current-user-pos'],
        queryFn: getCurrentUser,
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
        cacheTime: 10 * 60 * 1000,
        retry: false,
    });

    const cashierUuid = currentUserQuery.data?.data?.posCashierUuid;

    const query = useQuery({
        queryKey: POS_CART_QUERY_KEY(terminalUuid),
        queryFn: () => posService.getCartByTerminal(terminalUuid, cashierUuid),
        enabled: !!terminalUuid && !!cashierUuid, // Only fetch when we have both terminal and cashier UUID
        staleTime: 2 * 60 * 1000,
        cacheTime: 5 * 60 * 1000,
    });

    // Wrapper to remove item by itemUuid (reads cartUuid from localStorage)
    const removeItemFromCart = async (itemUuid) => {
        if (typeof window === 'undefined') throw new Error('No browser environment');
        const cartUuid = localStorage.getItem('pos_cart_uuid');
        if (!cartUuid) throw new Error('Cart UUID not found');

        const res = await posService.removeItemFromCart(cartUuid, itemUuid, cashierUuid);
        // Refresh query after successful removal
        try { await query.refetch(); } catch (e) { /* ignore refetch errors */ }
        return res;
    };

    const addItemToCart = async (customerUuid, payload) => {
        if (typeof window === 'undefined') throw new Error('No browser environment');
        const cartUuid = localStorage.getItem('pos_cart_uuid');
        if (!cartUuid) throw new Error('Cart UUID not found');

        const res = await posService.addItemToCart(cartUuid, customerUuid, payload, cashierUuid);
        try { await query.refetch(); } catch (e) { /* ignore */ }
        return res;
    };

    const updateItemInCart = async (itemUuid, payload) => {
        if (typeof window === 'undefined') throw new Error('No browser environment');
        const cartUuid = localStorage.getItem('pos_cart_uuid');
        if (!cartUuid) throw new Error('Cart UUID not found');

        const res = await posService.updateItemInCart(cartUuid, itemUuid, payload, cashierUuid);
        try { await query.refetch(); } catch (e) { /* ignore */ }
        return res;
    };

    return {
        cartData: query.data,
        cartItems: query.data?.items || [],
        isLoadingCart: query.isFetching,
        cartError: query.error,
        refetchCart: query.refetch,
        removeItemFromCart,
        addItemToCart,
        updateItemInCart,
    };
};