/**
 * Environment configuration for STREAMIA
 * Centralized configuration management
 */

/**
 * Get environment variable with fallback
 */
function getEnvVar(key: string, fallback: string = ''): string {
  return import.meta.env[key] || fallback;
}

/**
 * Application configuration
 */
export const config = {
  // API Configuration - reads from VITE_API_URL in .env
  API_BASE_URL: getEnvVar('VITE_API_URL', ' https://streamia-server.onrender.com/'),
  
  // Application Info
  APP_NAME: getEnvVar('VITE_APP_NAME', 'STREAMIA'),
  APP_VERSION: getEnvVar('VITE_APP_VERSION', '1.0.0'),
  
  // Development
  DEBUG: getEnvVar('VITE_DEBUG', 'false') === 'true',
  
  // Authentication
  TOKEN_KEY: 'streamia_token',
  
  // API Endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      PROFILE: '/auth/profile',
      RECOVER_PASSWORD: '/auth/recover-password',
      DELETE_ACCOUNT: '/auth/account',
    },
    MOVIES: {
      LIST: '/movies',
      DETAIL: '/movies/:id',
    },
  },
} as const;

/**
 * Development helper
 */
export const isDevelopment = config.DEBUG;

/**
 * Log configuration in development
 */
if (isDevelopment) {
  console.log('🔧 STREAMIA Configuration:');
  console.log('========================');
  console.log(' API Base URL:', config.API_BASE_URL);
  console.log(' App Name:', config.APP_NAME);
  console.log(' App Version:', config.APP_VERSION);
  console.log(' Debug Mode:', config.DEBUG);
  
  // Check if using default localhost (might indicate .env not loaded)
  if (config.API_BASE_URL.includes('localhost:3000')) {
    console.warn('  Using default localhost URL. Check your .env file:');
    console.warn('  - Make sure you have a .env file in your project root');
    console.warn('  - Make sure it contains: VITE_API_URL=your_backend_url');
    console.warn('  - Restart your dev server after creating .env');
  } else {
    console.log(' Custom API URL detected - .env file is working!');
  }
  console.log('========================');
}
