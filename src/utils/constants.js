export const API_ENDPOINTS = {
    // AUTH - Cookie-based authentication
    LOGIN: '/auth/login/cookie',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout/cookie',
    GET_CURRENT_USER: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',

    //CATEGORY
    CREATE_CATEGORY: 'products/categories',
    GET_ALL_MAIN_CATEGORIES: 'products/categories/main',
    GET_ALL_CATEGORIES: 'products/categories',
    GET_ALL_CATEGORY_HIERARCHY: 'products/categories/subcategories/hierarchy',
    GET_CATEGORY_BY_ID: 'products/categories',
    UPDATE_CATEGORY: 'products/categories',
    DELETE_CATEGORY: '/api/category/delete',
    UPLOAD_CATEGORY_IMAGE: '/products/images/category',

    //ATTRIBUTES
    CREATE_ATTRIBUTE: '/products/attributes',
    CREATE_ATTRIBUTE_VALUE: '/products/attributes/{attributeUuid}/values',
    GET_ALL_ATTRIBUTES: '/products/attributes',
    GET_ALL_ACTIVE_ATTRIBUTES: '/products/attributes/active',
    GET_ATTRIBUTE_BY_ID: '/products/attributes/{uuid}',
    UPDATE_ATTRIBUTE: '/products/attributes/{uuid}',
    DELETE_ATTRIBUTE: '/products/attributes/{uuid}',
    DELETE_ATTRIBUTE_VALUE: '/products/attributes/{attributeUuid}/values/{valueUuid}',

    //PRODUCTS
    CREATE_PRODUCT: 'products',
    GET_ALL_PRODUCTS: 'products',
    GET_PRODUCT_BY_ID: 'products',
    UPDATE_PRODUCT: '/api/products/update',
    DELETE_PRODUCT: '/api/products/delete',
    UPLOAD_PRODUCT_THUMBNAIL: 'products/images/product/thumbnail',
    UPLOAD_PRODUCT_GALLERY: 'products/images/product/gallery',
    UPLOAD_PRODUCT_VARIANT_THUMBNAIL: 'products/images/variant/thumbnail',

    //CUSTOMERS
    GET_ALL_CUSTOMERS: 'customers',
    GET_CUSTOMER_BY_ID: 'customers/profile',
    GET_CUSTOMER_ORDERS: 'orders',
    
    //USERS
    CREATE_ADMIN_USER: '/api/admin/create',
    GET_ALL_ADMIN_USERS: '/api/admin/list',
    GET_ADMIN_USER_BY_ID: '/api/admin',
    UPDATE_ADMIN_USER: '/api/admin/update',
    DELETE_ADMIN_USER: '/api/admin/delete',

    //RESELLERS
    GET_ALL_RESELLERS: '/admin/resellers',
    GET_RESELLER_BY_ID: '/admin/resellers',
    APPROVE_OR_REJECT_RESELLER: '/admin/resellers',
    SUSPEND_RESELLER: '/admin/resellers',
    REACTIVATE_RESELLER: '/admin/resellers',

    //ORDERS
    GET_ALL_ORDERS: '/api/orders/list',
    GET_ORDER_BY_ID: '/api/orders',
    UPDATE_ORDER_STATUS: '/api/orders/update-status',
    GET_ALL_PENDING_ORDERS: '/api/orders/pending/list',
    GET_PENDING_ORDER_BY_ID: '/api/orders/pending',

    //WITHDRAWALS
    GET_ALL_WITHDRAWALS: '/api/withdrawals/list',
    GET_WITHDRAWAL_BY_ID: '/api/withdrawals',
    GET_ALL_PENDING_WITHDRAWALS: '/api/withdrawals/pending/list',
    GET_PENDING_WITHDRAWAL_BY_ID: '/api/withdrawals/pending',

    //ROLES AND PERMISSIONS
    CREATE_ROLE: 'admin/roles',
    GET_ALL_ROLES: 'admin/roles',
    GET_ROLE_BY_ID: 'admin/roles',
    UPDATE_ROLE: 'admin/roles',
    DELETE_ROLE: 'admin/roles',
    GET_ALL_PERMISSIONS_GROUPED: 'admin/roles/permissions/grouped',

    // POS
    GET_ALL_PRODUCTS_FOR_POS: '/pos/products',
    GET_POS_PRODUCT_DETAILS: '/pos/products/details/{uuid}',
    GET_POS_VARIANT_GALLERY: '/pos/products/variants/gallery/{uuid}',
    GET_ACTIVE_TERMINALS: '/pos/terminals/active',
    VALIDATE_TERMINAL: '/pos/terminals/Validate/{uuid}/{code}',
    GET_POS_CUSTOMERS: '/pos/customers',
    CREATE_POS_CUSTOMER: '/pos/customers',
    GET_CART_BY_TERMINAL: '/pos/carts/terminal/{terminalUuid}',
    ADD_ITEM_TO_CART: '/pos/carts/{cartUuid}/customers/{customerUuid}/items',
    ADD_ITEM_TO_CART_NULL_CUSTOMETR: '/pos/carts/{cartUuid}/items',
    UPDATE_ITEM_FROM_CART: '/pos/carts/{cartUuid}/items/{itemUuid}',
    REMOVE_ITEM_FROM_CART: '/pos/carts/{cartUuid}/items/{itemUuid}',

    //terminals
    CREATE_TERMINAL: '/pos/terminals',
    GET_POS_TERMINAL_LIST: '/pos/terminals',
};

export const RESPONSE_CODES = {
    SUCCESS: 200,
    ERROR: 1001,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    SERVER_ERROR: 500
};

export const USER_TYPES = {
    ADMIN: 'ADMIN',
    CUSTOMER: 'CUSTOMER',
    RESELLER: 'RESELLER',
};