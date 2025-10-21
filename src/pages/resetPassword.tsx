import React, { useState, useEffect } from 'react';
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { authAPI } from '../services/api';
import { validatePassword } from '../utils/security';
import '../styles/reset-password.scss';

/**
 * Reset Password page component
 * Handles password reset with token from email link
 */
const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});

  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();

  useEffect(() => {
    if (!token) {
      setError('Token de recuperación no válido o expirado');
    }
  }, [token]);

  const handleBack = () => navigate(-1);
  const handleCancel = () => navigate('/');

  const validateForm = () => {
    const errors: { password?: string; confirmPassword?: string } = {};

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.errors[0];
    }

    if (confirmPassword !== password) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setFieldErrors({});

    if (!validateForm()) return;

    if (!token) {
      setError('Token de recuperación no válido');
      return;
    }

    setIsLoading(true);

    try {
      const res = await authAPI.resetPassword(token, password, confirmPassword);
      if (res.success) {
        setSuccess('Contraseña actualizada exitosamente. Redirigiendo al login...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(res.error || 'No se pudo actualizar la contraseña. Intenta de nuevo.');
      }
    } catch {
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword((prev) => !prev);

  if (!token && !error) {
    return (
      <div className="reset">
        <div className="reset__card">
          <div className="reset__loading">Cargando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="reset">
      <div className="reset__card" role="dialog" aria-labelledby="reset-title">
        <button type="button" className="reset__back" onClick={handleBack} aria-label="Volver">
          <ArrowLeft size={18} />
        </button>

        <div className="reset__icon">
          <Lock size={36} />
        </div>

        <h1 id="reset-title" className="reset__title">Nueva contraseña</h1>
        <p className="reset__subtitle">Ingresa tu nueva contraseña</p>

        {error && <div className="reset__alert reset__alert--error" role="alert">{error}</div>}
        {success && (
          <div className="reset__alert reset__alert--success" role="status">
            <CheckCircle size={16} /> {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="reset__form">
          <label className="reset__field">
            <span className="reset__field-icon"><Lock size={18} /></span>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Nueva contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={!!fieldErrors.password}
              aria-describedby={fieldErrors.password ? 'password-error' : undefined}
              disabled={isLoading}
            />
            <button
              type="button"
              className="reset__field-toggle"
              onClick={togglePasswordVisibility}
              disabled={isLoading}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </label>
          {fieldErrors.password && (
            <span id="password-error" className="reset__field-error" role="alert">
              {fieldErrors.password}
            </span>
          )}

          <label className="reset__field">
            <span className="reset__field-icon"><Lock size={18} /></span>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              aria-invalid={!!fieldErrors.confirmPassword}
              aria-describedby={fieldErrors.confirmPassword ? 'confirm-password-error' : undefined}
              disabled={isLoading}
            />
            <button
              type="button"
              className="reset__field-toggle"
              onClick={toggleConfirmPasswordVisibility}
              disabled={isLoading}
              aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </label>
          {fieldErrors.confirmPassword && (
            <span id="confirm-password-error" className="reset__field-error" role="alert">
              {fieldErrors.confirmPassword}
            </span>
          )}

          <button type="submit" className="reset__submit" disabled={isLoading}>
            {isLoading ? 'Actualizando...' : 'Actualizar contraseña'}
          </button>

          <button type="button" className="reset__cancel" onClick={handleCancel} disabled={isLoading}>
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
