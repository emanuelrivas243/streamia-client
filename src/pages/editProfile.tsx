import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Mail, Lock, Eye, EyeOff, Calendar, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import '../styles/editProfile.scss';

const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateProfile, deleteAccount } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '', 
    email: '',
    age: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false); // ← Nuevo estado
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteText, setDeleteText] = useState('');
  const [password, setPassword] = useState('');

  // Cargar datos del usuario cuando el componente se monta
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        age: user.age?.toString() || '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  // Obtener iniciales para el avatar
  const getUserInitials = () => {
    if (!user) return 'U';
    const first = user.firstName?.charAt(0) || '';
    const last = user.lastName?.charAt(0) || '';
    return `${first}${last}`.toUpperCase() || 'U';
  };

  const getFullName = () => {
    if (!user) return 'Usuario';
    return `${user.firstName} ${user.lastName}`.trim();
  };

  // Manejar cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'age') {
      if (value === '' || (/^\d+$/.test(value) && parseInt(value) >= 0 && parseInt(value) <= 150)) {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    const updateData: any = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
    };

    if (formData.age.trim() !== '') {
      updateData.age = parseInt(formData.age);
    }

    if (formData.newPassword) {
      updateData.password = formData.newPassword;
    }

    console.log('Datos a actualizar:', updateData);

    try {
      await updateProfile(updateData);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
    }
  };

  // Manejar eliminación de cuenta
  const handleDeleteAccount = async () => {
    if (deleteText !== 'ELIMINAR CUENTA') {
      alert('Por favor, escribe exactamente "ELIMINAR CUENTA" para confirmar');
      return;
    }

    if (!password) {
      alert('Por favor, ingresa tu contraseña para confirmar la eliminación');
      return;
    }

    if (window.confirm('¿Estás completamente seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      try {
        const success = await deleteAccount(password);
        if (success) {
          // Mostrar mensaje verde de éxito
          setShowDeleteSuccess(true);
          setTimeout(() => {
            setShowDeleteSuccess(false);
            navigate('/');
          }, 2000); // Mostrar por 2 segundos y luego redirigir
        }
      } catch (error) {
        console.error('Error al eliminar cuenta:', error);
        alert('Error al eliminar la cuenta');
      }
    }
  };

  if (!user) {
    return (
      <div className="edit-profile-container">
        <div className="error-message">Cargando usuario...</div>
      </div>
    );
  }

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-content">
        
        {/* Header */}
        <div className="profile-header">
          <button 
            onClick={() => navigate(-1)}
            className="back-button"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="profile-title">Editar Perfil</h1>
        </div>

        <div className="profile-layout">
          
          {/* Tarjeta de Usuario */}
          <div className="user-card-section">
            <div className="user-card">
              <div className="user-avatar">
                <div className="avatar-circle">
                  {getUserInitials()}
                </div>
              </div>
              <div className="user-info">
                <h3 className="user-name">{getFullName()}</h3>
                <p className="user-email">{user.email}</p>
                {user.age && (
                  <p className="user-age">{user.age} años</p>
                )}
              </div>
            </div>
          </div>

          {/* Formulario de Edición */}
          <div className="form-section">
            <div className="form-header">
              <h2>Información Personal</h2>
              <p>Actualiza tu información personal</p>
            </div>

            <form onSubmit={handleSubmit} className="edit-form">
              <div className="form-grid">
                
                {/* Nombre */}
                <div className="input-group">
                  <label>Nombre</label>
                  <div className="input-container">
                    <User className="input-icon" size={20} />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Tu nombre"
                    />
                  </div>
                </div>

                {/* Apellido */}
                <div className="input-group">
                  <label>Apellido</label>
                  <div className="input-container">
                    <User className="input-icon" size={20} />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Tu apellido"
                    />
                  </div>
                </div>

                {/* Edad */}
                <div className="input-group">
                  <label>Edad</label>
                  <div className="input-container">
                    <Calendar className="input-icon" size={20} />
                    <input
                      type="text"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="Tu edad"
                      maxLength={3}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="input-group full-width">
                  <label>Correo Electrónico</label>
                  <div className="input-container">
                    <Mail className="input-icon" size={20} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>

                {/* Cambiar Contraseña */}
                <div className="input-group full-width">
                  <label>Cambiar Contraseña</label>
                  <div className="input-container has-toggle">
                    <Lock className="input-icon" size={20} />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="Nueva contraseña"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Confirmar Contraseña */}
                <div className="input-group full-width">
                  <label>Confirmar Contraseña</label>
                  <div className="input-container has-toggle">
                    <Lock className="input-icon" size={20} />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirmar contraseña"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

              </div>

              {/* Botones */}
              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => navigate(-1)}
                >
                  Cancelar
                </button>
                <button type="submit" className="save-button">
                  Guardar Cambios
                </button>
              </div>
            </form>

            {/* Mensaje de éxito - Actualización */}
            {showSuccess && (
              <div className="success-message">
                ✅ Perfil actualizado correctamente
              </div>
            )}

            {/* Mensaje de éxito - Eliminación */}
            {showDeleteSuccess && (
              <div className="success-message">
                ✅ Su cuenta fue eliminada correctamente
              </div>
            )}

            {/* Sección de Eliminar Cuenta */}
            <div className="delete-account-section">
              <div className="delete-header">
                <Trash2 size={20} className="delete-icon" />
                <h3>Eliminar Cuenta</h3>
              </div>
              <p className="delete-warning">
                ¿Deseas eliminar esta cuenta? Esta acción es permanente y no se puede deshacer.
              </p>
              
              <button 
                type="button" 
                className="delete-toggle-button"
                onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
              >
                {showDeleteConfirm ? 'Cancelar Eliminación' : 'Eliminar Cuenta'}
              </button>

              {showDeleteConfirm && (
                <div className="delete-confirmation">
                  <p>
                    Para confirmar, escribe <strong>"ELIMINAR CUENTA"</strong> en el campo below:
                  </p>
                  <div className="delete-input-container">
                    <input
                      type="text"
                      value={deleteText}
                      onChange={(e) => setDeleteText(e.target.value)}
                      placeholder="ELIMINAR CUENTA"
                      className="delete-input"
                    />
                  </div>
                  
                  {/* Campo de contraseña */}
                  <div className="password-input-container">
                    <label>Contraseña actual:</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Ingresa tu contraseña actual"
                      className="delete-input"
                    />
                  </div>
                  
                  <button 
                    type="button" 
                    className="confirm-delete-button"
                    onClick={handleDeleteAccount}
                    disabled={deleteText !== 'ELIMINAR CUENTA' || !password}
                  >
                    Eliminar Cuenta Permanentemente
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;