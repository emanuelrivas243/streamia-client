import React, { useState } from "react";
import { ArrowLeft, Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import "../styles/login.scss";

/**
 * Login page component
 * Handles user authentication with backend integration
 */
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  const { login, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  /**
   * Validate form inputs
   */
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!email.trim()) {
      errors.email = "El correo electrónico es requerido";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "El correo electrónico no es válido";
    }

    if (!password.trim()) {
      errors.password = "La contraseña es requerida";
    } else if (password.length < 6) {
      errors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    clearError();
    setValidationErrors({});

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Attempt login
    const success = await login({ email, password });
    
    if (success) {
      // Redirect to home page on successful login
      navigate("/");
    }
  };

  /**
   * Handle input changes and clear validation errors
   */
  const handleInputChange = (field: string, value: string) => {
    if (field === "email") {
      setEmail(value);
    } else if (field === "password") {
      setPassword(value);
    }

    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  /**
   * Handle back button click
   */
  const handleBackClick = () => {
    navigate("/");
  };

  return (
    <div className="login-container">
      <div className="login-content">
        {/* Logo */}
        <div className="logo">
          {/* Logo content can be added here */}
        </div>

        {/* Card del Formulario */}
        <div className="login-card">
          {/* Botón Atrás */}
          <button 
            type="button"
            onClick={handleBackClick}
            className="back-button"
            aria-label="Volver a la página principal"
          >
            <ArrowLeft size={20} />
          </button>

          {/* Título */}
          <h2 className="login-title">Iniciar Sesión</h2>

          {/* Error message from API */}
          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="login-form">
            {/* Campos del Formulario */}
            <div className="form-fields">
              {/* Email */}
              <div className="input-group">
                <div className="input-container">
                  <Mail className="input-icon" size={20} />
                  <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={validationErrors.email ? "error" : ""}
                    disabled={isLoading}
                    aria-describedby={validationErrors.email ? "email-error" : undefined}
                    aria-invalid={!!validationErrors.email}
                  />
                </div>
                {validationErrors.email && (
                  <span id="email-error" className="field-error" role="alert">
                    {validationErrors.email}
                  </span>
                )}
              </div>

              {/* Contraseña */}
              <div className="input-group">
                <div className="input-container">
                  <Lock className="input-icon" size={20} />
                  <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={validationErrors.password ? "error" : ""}
                    disabled={isLoading}
                    aria-describedby={validationErrors.password ? "password-error" : undefined}
                    aria-invalid={!!validationErrors.password}
                  />
                </div>
                {validationErrors.password && (
                  <span id="password-error" className="field-error" role="alert">
                    {validationErrors.password}
                  </span>
                )}
              </div>
            </div>

            {/* Enlaces de Ayuda */}
            <div className="help-links">
              <a href="/recover-password" className="forgot-password">
                ¿Olvidaste tu contraseña?
              </a>
              <p className="register-link">
                No tienes una cuenta?{" "}
                <a href="/register">Regístrate aquí</a>
              </p>
            </div>

            {/* Botón de Iniciar Sesión */}
            <button 
              type="submit" 
              className="login-button"
              disabled={isLoading}
              aria-describedby={isLoading ? "loading-text" : undefined}
            >
              {isLoading ? (
                <>
                  <span className="spinner" aria-hidden="true"></span>
                  <span id="loading-text">Iniciando sesión...</span>
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}