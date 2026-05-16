import { apiGet, apiPost, apiPut, apiDelete } from '../api/apiManager';
import { API_ENDPOINTS } from '../lib/constants';

/**
 * Get all orders
 */
export async function getOrders(params = {}) {
  try {
    const response = await apiGet(API_ENDPOINTS.ORDERS, { params });
    
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
 * Get order by ID
 */
export async function getOrderById(orderId) {
  try {
    const response = await apiGet(`${API_ENDPOINTS.ORDERS}/${orderId}`);
    
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
 * Create order
 */
export async function createOrder(orderData) {
  try {
    const response = await apiPost(API_ENDPOINTS.ORDERS, orderData);
    
    if (response.data?.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Order created successfully',
      };
    }
    
    throw new Error(response.data?.message || 'Failed to create order');
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An error occurred while creating order';
    throw new Error(message);
  }
}

/**
 * Checkout order
 */
export async function checkoutOrder(checkoutData) {
  try {
    const response = await apiPost(API_ENDPOINTS.ORDER_CHECKOUT, checkoutData);
    
    if (response.data?.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Order placed successfully',
      };
    }
    
    throw new Error(response.data?.message || 'Failed to checkout');
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An error occurred during checkout';
    throw new Error(message);
  }
}

/**
 * Update order
 */
export async function updateOrder(orderId, orderData) {
  try {
    const response = await apiPut(
      `${API_ENDPOINTS.ORDERS}/${orderId}`,
      orderData
    );
    
    if (response.data?.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Order updated successfully',
      };
    }
    
    throw new Error(response.data?.message || 'Failed to update order');
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An error occurred while updating order';
    throw new Error(message);
  }
}

/**
 * Cancel order
 */
export async function cancelOrder(orderId) {
  try {
    const response = await apiDelete(`${API_ENDPOINTS.ORDERS}/${orderId}`);
    
    if (response.data?.success) {
      return {
        success: true,
        message: response.data.message || 'Order cancelled successfully',
      };
    }
    
    throw new Error(response.data?.message || 'Failed to cancel order');
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An error occurred while cancelling order';
    throw new Error(message);
  }
}

/**
 * Get cart
 */
export async function getCart() {
  try {
    const response = await apiGet(API_ENDPOINTS.CART);
    
    if (response.data?.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    }
    
    throw new Error(response.data?.message || 'Failed to fetch cart');
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An error occurred while fetching cart';
    throw new Error(message);
  }
}

/**
 * Add to cart
 */
export async function addToCart(productId, quantity = 1) {
  try {
    const response = await apiPost(API_ENDPOINTS.CART_ADD, {
      productId,
      quantity,
    });
    
    if (response.data?.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Added to cart',
      };
    }
    
    throw new Error(response.data?.message || 'Failed to add to cart');
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An error occurred while adding to cart';
    throw new Error(message);
  }
}

/**
 * Update cart item
 */
export async function updateCartItem(itemId, quantity) {
  try {
    const response = await apiPut(API_ENDPOINTS.CART_UPDATE, {
      itemId,
      quantity,
    });
    
    if (response.data?.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Cart updated',
      };
    }
    
    throw new Error(response.data?.message || 'Failed to update cart');
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An error occurred while updating cart';
    throw new Error(message);
  }
}

/**
 * Remove from cart
 */
export async function removeFromCart(itemId) {
  try {
    const response = await apiDelete(`${API_ENDPOINTS.CART_REMOVE}/${itemId}`);
    
    if (response.data?.success) {
      return {
        success: true,
        message: response.data.message || 'Removed from cart',
      };
    }
    
    throw new Error(response.data?.message || 'Failed to remove from cart');
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An error occurred while removing from cart';
    throw new Error(message);
  }
}
