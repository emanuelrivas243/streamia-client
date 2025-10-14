/**
 * Authentication Context for STREAMIA application
 * Manages user authentication state and provides auth methods
 */
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { authAPI, apiUtils, User, LoginCredentials, RegisterData } from '../services/api';

/**
 * Authentication context interface
 */
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
  updateProfile: (userData: Partial<RegisterData>) => Promise<boolean>;
  deleteAccount: () => Promise<boolean>;
}

/**
 * Create authentication context
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Authentication provider component
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = !!user && apiUtils.isAuthenticated();

  /**
   * Clear error state
   */
  const clearError = () => setError(null);

  /**
   * Login user with credentials
   */
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authAPI.login(credentials);
      
      if (response.success && response.data) {
        console.log("Token recibido del backend:", response.data.token);
        // Save token and user data
        apiUtils.saveToken(response.data.token);
        setUser(response.data.user);
        return true;
      } else {
        setError(response.error || 'Login failed');
        return false;
      }
    } catch (err) {
      setError('Network error occurred');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Register new user
   */
  const register = async (userData: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authAPI.register(userData);
      
      if (response.success && response.data) {
        // Save token and user data
        apiUtils.saveToken(response.data.token);
        setUser(response.data.user);
        return true;
      } else {
        setError(response.error || 'Registration failed');
        return false;
      }
    } catch (err) {
      setError('Network error occurred');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout user
   */
  const logout = async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      const token = apiUtils.getToken();
      if (token) {
        await authAPI.logout(token);
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear local state regardless of API response
      apiUtils.removeToken();
      setUser(null);
      setIsLoading(false);
    }
  };

  /**
   * Update user profile
   */
  const updateProfile = async (userData: Partial<RegisterData>): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const token = apiUtils.getToken();
      if (!token) {
        setError('No authentication token found');
        return false;
      }

      const response = await authAPI.updateProfile(token, userData);
      
      if (response.success && response.data) {
        setUser(response.data);
        return true;
      } else {
        setError(response.error || 'Profile update failed');
        return false;
      }
    } catch (err) {
      setError('Network error occurred');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Delete user account
   */
  const deleteAccount = async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const token = apiUtils.getToken();
      if (!token) {
        setError('No authentication token found');
        return false;
      }

      const response = await authAPI.deleteAccount(token);
      
      if (response.success) {
        // Clear local state
        apiUtils.removeToken();
        setUser(null);
        return true;
      } else {
        setError(response.error || 'Account deletion failed');
        return false;
      }
    } catch (err) {
      setError('Network error occurred');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Initialize authentication state on app load
   */
  useEffect(() => {
    const initializeAuth = async () => {
      const token = apiUtils.getToken();
      if (token) {
        setIsLoading(true);
        try {
          const response = await authAPI.getProfile(token);
          if (response.success && response.data) {
            setUser(response.data);
          } else {
            // Token is invalid, remove it
            apiUtils.removeToken();
          }
        } catch (err) {
          console.error('Auth initialization error:', err);
          apiUtils.removeToken();
        } finally {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
    updateProfile,
    deleteAccount,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to use authentication context
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

