/**
 * Generic cookie utility functions
 * 
 * NOTE: Authentication cookies (access_token, refresh_token) are HTTP-only
 * and managed by the backend. These cannot be accessed via JavaScript.
 * 
 * These utilities are for non-auth cookies only (e.g., preferences, UI state).
 */

/**
 * Set a cookie (non-HTTP-only)
 */
export function setCookie(name, value, days = 7) {
  if (typeof window === 'undefined') return;

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
}

/**
 * Get a cookie value (non-HTTP-only cookies only)
 */
export function getCookie(name) {
  if (typeof window === 'undefined') return null;

  const nameEQ = name + '=';
  const cookies = document.cookie.split(';');
  
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1, cookie.length);
    }
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length, cookie.length);
    }
  }
  
  return null;
}

/**
 * Delete a cookie (non-HTTP-only)
 */
export function deleteCookie(name) {
  if (typeof window === 'undefined') return;
  
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

/**
 * Set authentication cookies (stores user role for client-side access)
 * Note: Real access/refresh tokens are HTTP-only and handled by backend
 */
export function setAuthCookies(accessToken, refreshToken, role) {
  if (typeof window === 'undefined') return;

  // Store role in a non-HTTP-only cookie for client-side use
  setCookie('userRole', role, 7);
}

/**
 * Clear authentication cookies
 */
export function clearAuthCookies() {
  if (typeof window === 'undefined') return;

  deleteCookie('userRole');
}
