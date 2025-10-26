/**
 * Authentication Context for STREAMIA application
 * Manages user authentication state and provides auth methods
 */
import React, { createContext, useState, useContext, useEffect, ReactNode, useMemo } from 'react';
import { authAPI, apiUtils, User, LoginCredentials, RegisterData } from '../services/api';

/**
 * Authentication context interface
 */
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
  setSuccessMessage: (msg: string | null) => void;
  updateProfile: (userData: Partial<RegisterData>) => Promise<boolean>;
  deleteAccount: (password: string) => Promise<boolean>;
}

/**
 * Create authentication context
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Authentication provider component
 */
export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  /**
   * Check if user is authenticated.
   *
   * This helper reads the stored token state via `apiUtils.isAuthenticated()`
   * and returns a boolean indicating whether a token is present.
   */
  // Consider authenticated if a valid token exists; user is fetched lazily
  const isAuthenticated = apiUtils.isAuthenticated();

  /**
   * Clear error state.
   *
   * Resets the `error` field in context to null.
   */
  const clearError = () => setError(null);

  /**
   * Login the user with credentials.
   *
   * Attempts to authenticate using `authAPI.login`. On success saves the
   * returned token via `apiUtils.saveToken`, updates `user` state and sets
   * a `successMessage`. On failure sets the `error` state. Returns true when
   * login was successful.
   *
   * @param credentials - The user's login credentials (email/password)
   * @returns Promise<boolean> - true if login succeeded
   */
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authAPI.login(credentials);
      
      if (response.success && response.data) {
        console.log("Token recibido del backend:", response.data.token);
        
        if (response.data.user && response.data.user.firstName) {
        localStorage.setItem('currentUserName', response.data.user.firstName);
      } else {
        localStorage.setItem('currentUserName', credentials.email.split('@')[0]);
      }

        // Save token and user data
        apiUtils.saveToken(response.data.token);
        setUser(response.data.user);
        setSuccessMessage('Inicio de sesión exitoso');
        return true;
      } else {
        setError(response.error || 'Login failed');
        return false;
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error occurred');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Register a new user and sign them in.
   *
   * Calls `authAPI.register` and on success stores the returned token and
   * user, and sets a `successMessage`. Errors populate the `error` state.
   *
   * @param userData - Registration payload (name, email, password, ...)
   * @returns Promise<boolean> - true if registration succeeded
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
        setSuccessMessage('Registro exitoso');
        return true;
      } else {
        setError(response.error || 'Registration failed');
        return false;
      }
    } catch (err) {
      console.error('Register error:', err);
      setError('Network error occurred');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout the current user.
   *
   * Attempts to notify the backend via `authAPI.logout`. Regardless of API
   * response it clears stored token and user state locally. Does not throw on
   * failure but logs the error.
   *
   * @returns Promise<void>
   */
  const logout = async (): Promise<void> => {
          setSuccessMessage('Cierre de sesión exitoso');
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
        const updatedUser = (response.data as any).user ?? response.data;
        setUser(updatedUser);
        return true;
      } else {
        setError(response.error || 'Profile update failed');
        return false;
      }
    } catch (err) {
      console.error('Update profile error:', err);
      setError('Network error occurred');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Delete user account
   */
  /**
 * Delete user account
 */
const deleteAccount = async (password: string): Promise<boolean> => { // ← Agrega password como parámetro
  setIsLoading(true);
  setError(null);

  try {
    const token = apiUtils.getToken();
    if (!token) {
      setError('No authentication token found');
      return false;
    }

    const response = await authAPI.deleteAccount(token, password); // ← Envía la contraseña
    
    if (response.success) {
      // Clear local state
      apiUtils.removeToken();
      setUser(null);
      setSuccessMessage('Cuenta eliminada correctamente');
      return true;
    } else {
      setError(response.error || 'Account deletion failed');
      return false;
    }
  } catch (err) {
    console.error('Delete account error:', err);
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

  const value: AuthContextType = useMemo(() => ({
    user,
    isAuthenticated,
    isLoading,
    error,
    successMessage,
    login,
    register,
    logout,
    clearError,
    setSuccessMessage,
    updateProfile,
    deleteAccount,
  }), [user, isAuthenticated, isLoading, error, successMessage, login, register, logout, clearError, setSuccessMessage, updateProfile, deleteAccount]);

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

