/**
 * Environment configuration for STREAMIA
 */

export const API_BASE_URL =
  (import.meta as any).env.VITE_API_URL || "http://localhost:3000/api/users";

export const config = {
  API_BASE_URL,

  ENDPOINTS: {
    AUTH: {
      REGISTER: `${API_BASE_URL}/register`,
      LOGIN: `${API_BASE_URL}/login`,
      LOGOUT: `${API_BASE_URL}/logout`,
      PROFILE: `${API_BASE_URL}/me`,
      UPDATE_PROFILE: `${API_BASE_URL}/me`,
      DELETE_ACCOUNT: `${API_BASE_URL}/me`,
      FORGOT_PASSWORD: `${API_BASE_URL}/forgot-password`,
      RESET_PASSWORD: `${API_BASE_URL}/reset-password`,
    },
    MOVIES: {
      LIST: "http://localhost:3000/api/movies",
      DETAIL: (id: string) => `http://localhost:3000/api/movies/${id}`,
    },
  },

  TOKEN_KEY: "streamia_token",
  APP_NAME: "STREAMIA",
  APP_VERSION: "1.0.0",
  DEBUG: true,
} as const;
