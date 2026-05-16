import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set) => ({
      // Auth state - Cookie-based (NO tokens stored client-side)
      user: null, // { userId, uuid, email, role, emailVerified, posCashierUuid }
      isAuthenticated: false,

      // Cart state
      cart: [],
      cartCount: 0,

      // Wishlist state
      wishlist: [],

      // UI state
      sidebarOpen: true,
      theme: 'light',
      snackbar: {
        open: false,
        message: '',
        severity: 'info',
      },

      // Auth actions
      setAuth: (user) =>
        set({
          user, // { userId, uuid, email, role, emailVerified, posCashierUuid }
          isAuthenticated: true,
        }),

      clearAuth: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),

      updateUser: (userData) =>
        set((state) => ({
          user: { ...state.user, ...userData },
        })),

      // Cart actions
      setCart: (cart) =>
        set({
          cart,
          cartCount: cart.reduce((sum, item) => sum + item.quantity, 0),
        }),

      addToCart: (product) =>
        set((state) => {
          const existingItem = state.cart.find((item) => item.id === product.id);
          let updatedCart;

          if (existingItem) {
            updatedCart = state.cart.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          } else {
            updatedCart = [...state.cart, { ...product, quantity: 1 }];
          }

          return {
            cart: updatedCart,
            cartCount: updatedCart.reduce((sum, item) => sum + item.quantity, 0),
          };
        }),

      removeFromCart: (productId) =>
        set((state) => {
          const updatedCart = state.cart.filter((item) => item.id !== productId);
          return {
            cart: updatedCart,
            cartCount: updatedCart.reduce((sum, item) => sum + item.quantity, 0),
          };
        }),

      updateCartItemQuantity: (productId, quantity) =>
        set((state) => {
          const updatedCart = state.cart.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          );
          return {
            cart: updatedCart,
            cartCount: updatedCart.reduce((sum, item) => sum + item.quantity, 0),
          };
        }),

      clearCart: () =>
        set({
          cart: [],
          cartCount: 0,
        }),

      // Wishlist actions
      setWishlist: (wishlist) => set({ wishlist }),

      addToWishlist: (product) =>
        set((state) => ({
          wishlist: [...state.wishlist, product],
        })),

      removeFromWishlist: (productId) =>
        set((state) => ({
          wishlist: state.wishlist.filter((item) => item.id !== productId),
        })),

      clearWishlist: () => set({ wishlist: [] }),

      // UI actions
      toggleSidebar: () =>
        set((state) => ({
          sidebarOpen: !state.sidebarOpen,
        })),

      setSidebarOpen: (open) =>
        set({
          sidebarOpen: open,
        }),

      setTheme: (theme) => set({ theme }),

      showSnackbar: (message, severity = 'info') =>
        set({
          snackbar: {
            open: true,
            message,
            severity,
          },
        }),

      hideSnackbar: () =>
        set((state) => ({
          snackbar: {
            ...state.snackbar,
            open: false,
          },
        })),
    }),
    {
      name: 'invoiza-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        cart: state.cart,
        cartCount: state.cartCount,
        wishlist: state.wishlist,
        theme: state.theme,
      }),
    }
  )
);
