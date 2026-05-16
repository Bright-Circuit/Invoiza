// Response codes
export const RESPONSE_CODES = {
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
};

// API endpoints
export const API_ENDPOINTS = {
  // Auth - Cookie-based endpoints
  LOGIN: '/api/v1/auth/login/cookie', // Cookie-based login
  REGISTER: '/api/v1/auth/register',
  LOGOUT: '/api/v1/auth/logout/cookie', // Cookie-based logout
  GET_CURRENT_USER: '/api/v1/auth/me', // Get current authenticated user
  FORGOT_PASSWORD: '/api/v1/auth/forgot-password',
  RESET_PASSWORD: '/api/v1/auth/reset-password',
  VERIFY_EMAIL: '/api/v1/auth/verify-email',

  // Admin
  ADMIN_DASHBOARD: '/api/admin/dashboard',
  ADMIN_USERS: '/api/admin/users',
  ADMIN_ORDERS: '/api/admin/orders',
  ADMIN_PRODUCTS: '/api/admin/products',
  ADMIN_SETTINGS: '/api/admin/settings',

  // Customer
  CUSTOMER_DASHBOARD: '/api/customer/dashboard',
  CUSTOMER_ORDERS: '/api/customer/orders',
  CUSTOMER_PROFILE: '/api/customer/profile',
  CUSTOMER_WISHLIST: '/api/customer/wishlist',

  // Reseller
  RESELLER_DASHBOARD: '/api/reseller/dashboard',
  RESELLER_INVENTORY: '/api/reseller/inventory',
  RESELLER_SALES: '/api/reseller/sales',

  // Products
  PRODUCTS: '/api/products',
  PRODUCT_DETAILS: '/api/products',
  PRODUCT_SEARCH: '/api/products/search',
  PRODUCT_CATEGORIES: '/api/products/categories',

  // Orders
  ORDERS: '/api/orders',
  ORDER_DETAILS: '/api/orders',
  ORDER_CHECKOUT: '/api/orders/checkout',

  // Cart
  CART: '/api/cart',
  CART_ADD: '/api/cart/add',
  CART_UPDATE: '/api/cart/update',
  CART_REMOVE: '/api/cart/remove',
};

// WebSocket topics
export const WS_TOPICS = {
  ORDER_UPDATES: '/topic/orders',
  PRODUCT_UPDATES: '/topic/products',
  USER_NOTIFICATIONS: '/user/queue/notifications',
};

// Local storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_ROLE: 'userRole',
  USER_DATA: 'userData',
};

// Cookie names - HTTP-only cookies set by backend
export const COOKIE_NAMES = {
  ACCESS_TOKEN: 'access_token', // HTTP-only cookie managed by backend
  REFRESH_TOKEN: 'refresh_token', // HTTP-only cookie managed by backend
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
};

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_WITH_TIME: 'MMM dd, yyyy HH:mm',
  API: 'yyyy-MM-dd',
  API_WITH_TIME: "yyyy-MM-dd'T'HH:mm:ss",
};

// Order statuses
export const ORDER_STATUS = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED',
};

// Product status
export const PRODUCT_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  OUT_OF_STOCK: 'OUT_OF_STOCK',
  DISCONTINUED: 'DISCONTINUED',
};
