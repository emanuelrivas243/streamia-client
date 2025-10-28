/**
 * Application routes constants (STREAMIA client).
 *
 * Centralized route definitions to keep route paths consistent across the app.
 */
export const ROUTES = {
  // Public Routes
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  MANUAL: '/manual',
  SITEMAP: '/sitemap',
  LOGIN: '/login',
  REGISTER: '/register',
  RECOVER_PASSWORD: '/recover-password',
  RESET_PASSWORD: '/reset-password',
  
  // Protected Routes
  EDIT_PROFILE: '/edit-profile',
  RATINGS: '/ratings',
  
  // Future routes can be added here
  // DASHBOARD: '/dashboard',
  // MOVIES: '/movies',
  // PROFILE: '/profile',
} as const;

/**
 * Route types for TypeScript
 */
export type RouteType = typeof ROUTES[keyof typeof ROUTES];
