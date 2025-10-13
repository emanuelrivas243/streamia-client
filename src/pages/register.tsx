import React, { useState } from "react";
import { ArrowLeft, User, Mail, Lock, Calendar, Eye, EyeOff, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { 
  validatePassword, 
  validateEmail, 
  validateAge, 
  validateName,
  sanitizeInput,
  getPasswordStrengthText,
  getPasswordStrengthColor,
  DEFAULT_PASSWORD_REQUIREMENTS
} from "../utils/security";
import "../styles/register.scss";

/**
 * Register page component with comprehensive security validations
 * Handles user registration with backend integration
 */
export default function Register() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    edad: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, text: "", color: "" });
  
  const { register, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  /**
   * Handle input changes with sanitization
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Sanitize input to prevent XSS
    const sanitizedValue = sanitizeInput(value);
    
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }

    // Real-time password strength check
    if (name === "password") {
      const validation = validatePassword(sanitizedValue, DEFAULT_PASSWORD_REQUIREMENTS);
      setPasswordStrength({
        score: validation.score,
        text: getPasswordStrengthText(validation.score),
        color: getPasswordStrengthColor(validation.score)
      });
    }
  };

  /**
   * Validate all form fields
   */
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Validate name
    const nameValidation = validateName(formData.nombre, "nombre");
    if (!nameValidation.isValid) {
      errors.nombre = nameValidation.errors[0];
    }

    // Validate last name
    const lastNameValidation = validateName(formData.apellido, "apellido");
    if (!lastNameValidation.isValid) {
      errors.apellido = lastNameValidation.errors[0];
    }

    // Validate age
    const ageValidation = validateAge(formData.edad);
    if (!ageValidation.isValid) {
      errors.edad = ageValidation.errors[0];
    }

    // Validate email
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      errors.email = emailValidation.errors[0];
    }

    // Validate password
    const passwordValidation = validatePassword(formData.password, DEFAULT_PASSWORD_REQUIREMENTS);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.errors[0];
    }

    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Las contraseñas no coinciden";
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

    // Prepare registration data
    const registrationData = {
      nombre: formData.nombre.trim(),
      apellido: formData.apellido.trim(),
      edad: parseInt(formData.edad, 10),
      email: formData.email.trim().toLowerCase(),
      password: formData.password
    };

    // Attempt registration
    const success = await register(registrationData);
    
    if (success) {
      // Redirect to home page on successful registration
      navigate("/");
    }
  };

  /**
   * Handle cancel button click
   */
  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className="register-container">
      <div className="register-content">
        {/* Card del Formulario */}
        <div className="register-card">
          {/* Botón Atrás */}
          <button 
            type="button"
            onClick={handleCancel}
            className="back-button"
            aria-label="Volver a la página principal"
          >
            <ArrowLeft size={20} />
          </button>

          {/* Título y Descripción */}
          <div className="header-section">
            <h2 className="register-title">Registro</h2>
            <p className="register-subtitle">
              Accede al contenido que te encanta
            </p>
          </div>

          {/* Error message from API */}
          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-grid">
              {/* Fila 1 - Nombre y Apellido */}
              <div className="input-group">
                <div className="input-container">
                  <User className="input-icon" size={20} />
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className={validationErrors.nombre ? "error" : ""}
                    disabled={isLoading}
                    aria-describedby={validationErrors.nombre ? "nombre-error" : undefined}
                    aria-invalid={!!validationErrors.nombre}
                    maxLength={50}
                  />
                </div>
                {validationErrors.nombre && (
                  <span id="nombre-error" className="field-error" role="alert">
                    {validationErrors.nombre}
                  </span>
                )}
              </div>

              <div className="input-group">
                <div className="input-container">
                  <User className="input-icon" size={20} />
                  <input
                    type="text"
                    name="apellido"
                    placeholder="Apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    className={validationErrors.apellido ? "error" : ""}
                    disabled={isLoading}
                    aria-describedby={validationErrors.apellido ? "apellido-error" : undefined}
                    aria-invalid={!!validationErrors.apellido}
                    maxLength={50}
                  />
                </div>
                {validationErrors.apellido && (
                  <span id="apellido-error" className="field-error" role="alert">
                    {validationErrors.apellido}
                  </span>
                )}
              </div>

              {/* Fila 2 - Edad y Email */}
              <div className="input-group">
                <div className="input-container">
                  <Calendar className="input-icon" size={20} />
                  <input
                    type="number"
                    name="edad"
                    placeholder="Edad"
                    value={formData.edad}
                    onChange={handleChange}
                    className={validationErrors.edad ? "error" : ""}
                    disabled={isLoading}
                    aria-describedby={validationErrors.edad ? "edad-error" : undefined}
                    aria-invalid={!!validationErrors.edad}
                    min="13"
                    max="120"
                  />
                </div>
                {validationErrors.edad && (
                  <span id="edad-error" className="field-error" role="alert">
                    {validationErrors.edad}
                  </span>
                )}
              </div>

              <div className="input-group">
                <div className="input-container">
                  <Mail className="input-icon" size={20} />
                  <input
                    type="email"
                    name="email"
                    placeholder="Correo electrónico"
                    value={formData.email}
                    onChange={handleChange}
                    className={validationErrors.email ? "error" : ""}
                    disabled={isLoading}
                    aria-describedby={validationErrors.email ? "email-error" : undefined}
                    aria-invalid={!!validationErrors.email}
                    maxLength={254}
                  />
                </div>
                {validationErrors.email && (
                  <span id="email-error" className="field-error" role="alert">
                    {validationErrors.email}
                  </span>
                )}
              </div>

              {/* Fila 3 - Contraseña */}
              <div className="input-group full-width">
                <div className="input-container has-toggle">
                  <Lock className="input-icon" size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Contraseña"
                    value={formData.password}
                    onChange={handleChange}
                    className={validationErrors.password ? "error" : ""}
                    disabled={isLoading}
                    aria-describedby={validationErrors.password ? "password-error" : "password-strength"}
                    aria-invalid={!!validationErrors.password}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                
                
                
                {validationErrors.password && (
                  <span id="password-error" className="field-error" role="alert">
                    {validationErrors.password}
                  </span>
                )}
              </div>

              {/* Fila 4 - Confirmar Contraseña */}
              <div className="input-group full-width">
                <div className="input-container has-toggle">
                  <Lock className="input-icon" size={20} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirmar contraseña"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={validationErrors.confirmPassword ? "error" : ""}
                    disabled={isLoading}
                    aria-describedby={validationErrors.confirmPassword ? "confirm-password-error" : undefined}
                    aria-invalid={!!validationErrors.confirmPassword}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Ocultar confirmación" : "Mostrar confirmación"}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {validationErrors.confirmPassword && (
                  <span id="confirm-password-error" className="field-error" role="alert">
                    {validationErrors.confirmPassword}
                  </span>
                )}
              </div>
            </div>


            {/* Botones */}
            <div className="form-buttons">
              <button 
                onClick={handleCancel} 
                type="button" 
                className="cancel-button"
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="register-button"
                disabled={isLoading}
                aria-describedby={isLoading ? "loading-text" : undefined}
              >
                {isLoading ? (
                  <>
                    <span className="spinner" aria-hidden="true"></span>
                    <span id="loading-text">Registrando...</span>
                  </>
                ) : (
                  "Registrarse"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}