/**
 * API Service for STREAMIA application
 * Handles all HTTP requests to the backend using Fetch API
 */
import { config } from '../config/environment';

// Base URL from configuration
const API_BASE_URL = config.API_BASE_URL;

/**
 * HTTP request configuration interface
 */
interface RequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: string;
}

/**
 * API Response interface
 */
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  status?: number;
}

/**
 * User interface for authentication
 */
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Login credentials interface
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Register data interface
 */
export interface RegisterData {
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  password: string;
  confirmPassword: string;
}

/**
 * Login response interface
 */
export interface LoginResponse {
  user: User;
  token: string;
}

/**
 * Generic HTTP request function
 */
async function makeRequest<T>(
  endpoint: string, 
  config: RequestConfig
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Include Authorization header automatically when token is present
    const token = apiUtils.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...config.headers,
    } as Record<string, string>;

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...config,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      // Map some common HTTP status codes to friendly messages
      let errorMsg = data?.message || `HTTP Error: ${response.status}`;
      if (response.status === 409) {
        // Conflict - usually used when resource (like email) already exists
        errorMsg = 'El correo ya está registrado';
      } else if (response.status === 401) {
        // Unauthorized - token invalid or credentials wrong
        // Remove token locally to force re-authentication
        apiUtils.removeToken();
        errorMsg = 'Sesión expirada. Inicia sesión de nuevo';
      } else if (response.status === 400) {
        // Bad Request - validation or malformed data
        errorMsg = data?.message || 'Solicitud inválida';
      }

      return {
        success: false,
        status: response.status,
        error: errorMsg,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error occurred',
    };
  }
}

/**
 * Authentication API functions
 */
export const authAPI = {
  /**
   * Login user with email and password
   */
  async login(credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> {
    return makeRequest<LoginResponse>('/api/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  /**
   * Register new user
   */
  async register(userData: RegisterData): Promise<ApiResponse<LoginResponse>> {
    return makeRequest<LoginResponse>('/api/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  /**
   * Logout user
   */
  async logout(token: string): Promise<ApiResponse> {
    return makeRequest('/api/users/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  /**
   * Request password recovery
   */
  async recoverPassword(email: string): Promise<ApiResponse> {
    return makeRequest('/api/users/recover-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  /**
   * Get current user profile
   */
  async getProfile(token: string): Promise<ApiResponse<User>> {
    return makeRequest<User>('/api/users/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  /**
   * Update user profile
   */
  async updateProfile(
    token: string, 
    userData: Partial<RegisterData>
  ): Promise<ApiResponse<User>> {
    return makeRequest<User>('/api/users/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
  },

  /**
   * Delete user account
   */
  async deleteAccount(token: string): Promise<ApiResponse> {
    return makeRequest('/api/users/account', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
};

/**
 * Movies API functions (for future implementation)
 */
export const moviesAPI = {
  /**
   * Get all movies
   */
  async getMovies(token: string): Promise<ApiResponse<any[]>> {
    return makeRequest<any[]>('/movies', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  /**
   * Get movie by ID
   */
  async getMovieById(token: string, movieId: string): Promise<ApiResponse<any>> {
    return makeRequest<any>(`/movies/${movieId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
};

/**
 * Utility functions
 */
export const apiUtils = {
  /**
   * Get token from localStorage
   */
  getToken(): string | null {
    return localStorage.getItem('streamia_token');
  },

  /**
   * Save token to localStorage
   */
  saveToken(token: string): void {
    localStorage.setItem('streamia_token', token);
  },

  /**
   * Remove token from localStorage
   */
  removeToken(): void {
    localStorage.removeItem('streamia_token');
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
