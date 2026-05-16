import { NextResponse } from 'next/server';

/**
 * Middleware Configuration for Admin Panel
 * 
 * 
 * COOKIE-BASED AUTHENTICATION
 * - Checks for access_token HTTP-only cookie
 * - Redirects to auth app if not present
 * - UX-only protection (backend enforces security)
 */
export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Get access_token cookie (HTTP-only, set by backend)
  const accessToken = request.cookies.get('access_token');

  // Public routes that don't require authentication
  const publicRoutes = ['/401', '/403', '/404', '/500', '/', '/auth'];
  const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(route + '/'));
  
  // Website routes are always public
  const isWebsiteRoute = pathname === '/' || pathname.startsWith('/auth') || 
                          pathname.startsWith('/about') || pathname.startsWith('/pricing') || 
                          pathname.startsWith('/contact');

  if (isWebsiteRoute || isPublicRoute) {
    return NextResponse.next();
  }

  // Admin and protected routes require authentication
  if (!accessToken) {
    // For admin routes without auth, redirect to login
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - _next/data (data files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
};
