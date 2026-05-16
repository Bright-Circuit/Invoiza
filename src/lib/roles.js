// User roles
export const ROLES = {
  ADMIN: 'admin',
  CUSTOMER: 'customer',
  RESELLER: 'reseller',
};

// Role permissions
export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    'view_dashboard',
    'manage_users',
    'manage_products',
    'manage_orders',
    'manage_settings',
    'view_analytics',
  ],
  [ROLES.CUSTOMER]: [
    'view_products',
    'place_orders',
    'view_orders',
    'manage_profile',
    'manage_wishlist',
  ],
  [ROLES.RESELLER]: [
    'view_products',
    'manage_inventory',
    'view_sales',
    'place_orders',
    'view_orders',
  ],
};

// Role-based route mapping
export const ROLE_ROUTES = {
  [ROLES.ADMIN]: '/admin/dashboard',
  [ROLES.CUSTOMER]: '/customer/dashboard',
  [ROLES.RESELLER]: '/reseller/dashboard',
};

// Protected route prefixes
export const PROTECTED_ROUTES = {
  ADMIN: '/admin',
  CUSTOMER: '/customer',
  RESELLER: '/reseller',
};

// Public routes
export const PUBLIC_ROUTES = [
  '/',
  '/products',
  '/about',
  '/contact',
  '/auth/login',
  '/auth/register',
];

/**
 * Check if a route is protected
 */
export function isProtectedRoute(pathname) {
  return Object.values(PROTECTED_ROUTES).some((route) =>
    pathname.startsWith(route)
  );
}

/**
 * Check if a route is public
 */
export function isPublicRoute(pathname) {
  return PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(route));
}

/**
 * Get dashboard route for role
 */
export function getDashboardRoute(role) {
  return ROLE_ROUTES[role] || '/';
}

/**
 * Check if user has permission
 */
export function hasPermission(role, permission) {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
}

/**
 * Check if user can access route
 */
export function canAccessRoute(role, pathname) {
  if (isPublicRoute(pathname)) {
    return true;
  }

  if (pathname.startsWith(PROTECTED_ROUTES.ADMIN)) {
    return role === ROLES.ADMIN;
  }

  if (pathname.startsWith(PROTECTED_ROUTES.CUSTOMER)) {
    return role === ROLES.CUSTOMER;
  }

  if (pathname.startsWith(PROTECTED_ROUTES.RESELLER)) {
    return role === ROLES.RESELLER;
  }

  return false;
}
