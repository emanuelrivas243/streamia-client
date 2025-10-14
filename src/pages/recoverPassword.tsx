import React, { useState } from 'react';
import { ArrowLeft, KeyRound, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { validateEmail } from '../utils/security';
import '../styles/recover-password.scss';

/**
 * Recover Password page component
 */
const RecoverPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleBack = () => navigate(-1);
  const handleCancel = () => navigate('/');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setFieldError(null);

    const { isValid, errors } = validateEmail(email);
    if (!isValid) {
      setFieldError(errors[0]);
      return;
    }

    setIsLoading(true);
    const res = await authAPI.recoverPassword(email.trim());
    setIsLoading(false);

    if (res.success) {
      setSuccess('Si el correo existe, te enviaremos un enlace de recuperación.');
      setEmail('');
    } else {
      setError(res.error || 'No se pudo enviar el enlace. Intenta de nuevo.');
    }
  };

  return (
    <div className="recover">
      <div className="recover__card" role="dialog" aria-labelledby="recover-title">
        <button type="button" className="recover__back" onClick={handleBack} aria-label="Volver">
          <ArrowLeft size={18} />
        </button>

        <div className="recover__icon">
          <KeyRound size={36} />
        </div>

        <h1 id="recover-title" className="recover__title">¿Olvidaste tu contraseña?</h1>
        <p className="recover__subtitle">Ingresa tu correo para recuperar tu cuenta</p>

        {error && <div className="recover__alert recover__alert--error" role="alert">{error}</div>}
        {success && <div className="recover__alert recover__alert--success" role="status">{success}</div>}

        <form onSubmit={handleSubmit} className="recover__form">
          <label className="recover__field">
            <span className="recover__field-icon"><Mail size={18} /></span>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!fieldError}
              aria-describedby={fieldError ? 'email-error' : undefined}
              disabled={isLoading}
            />
          </label>
          {fieldError && (
            <span id="email-error" className="recover__field-error" role="alert">{fieldError}</span>
          )}

          <button type="submit" className="recover__submit" disabled={isLoading}>
            {isLoading ? 'Enviando…' : 'Enviar enlace de recuperación'}
          </button>
          <button type="button" className="recover__cancel" onClick={handleCancel} disabled={isLoading}>
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
};

export default RecoverPassword;
