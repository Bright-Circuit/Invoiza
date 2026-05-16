'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';

/**
 * AuthProvider - Bootstrap authentication on app initialization
 * 
 * This component:
 * 1. Calls /auth/me on mount to check if user is authenticated
 * 2. Populates Redux store with user info if authenticated
 * 3. Redirects to login if not authenticated (handled by apiManager)
 * 4. Prevents infinite loops with mounted flag
 * 
 * Usage: Wrap your app layout with this provider
 */
export function AuthProvider({ children }) {
  const { checkSession, isCheckingSession } = useAuth();
  const hasCheckedSession = useRef(false);

  useEffect(() => {
    // Prevent multiple session checks
    if (hasCheckedSession.current) {
      return;
    }

    hasCheckedSession.current = true;

    // Check if user has valid session on app mount
    const initAuth = async () => {
      try {
        await checkSession();
        // Session is valid, user info populated in store
      } catch (error) {
        // Session invalid or expired
        // apiManager will handle redirect to login
        console.error('Authentication check failed:', error);
      }
    };

    initAuth();
  }, [checkSession]);

  // Show loading state while checking session
  // You can customize this with your own loading component
  if (isCheckingSession && !hasCheckedSession.current) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        Checking authentication...
      </div>
    );
  }

  return <>{children}</>;
}
