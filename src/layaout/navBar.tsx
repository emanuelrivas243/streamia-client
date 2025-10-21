import React, { useState } from 'react'
/**
 * Navigation bar component used on top of all pages.
 */
import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '../routes/routes'
import { useAuth } from '../context/authContext'
import './navBar.scss'

/**
 * Navigation bar component with logo
 * @returns JSX element containing the navigation bar
 */
const NavBar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    navigate(ROUTES.HOME);
  };

  return (
    <nav className="navbar">
      <div className="navbar__container">
        {/* Logo */}
        <Link to={ROUTES.HOME} className="navbar__logo">
          STREAMIA
        </Link>

        {/* Primary navigation (only when authenticated) */}
        {isAuthenticated && (
          <ul className="navbar__menu" role="menubar" aria-label="Primary">
            <li className="navbar__menu-item" role="none"><Link role="menuitem" to={ROUTES.HOME}>Inicio</Link></li>
            <li className="navbar__menu-item" role="none"><Link role="menuitem" to="/home-movies">Películas</Link></li>
            <li className="navbar__menu-item" role="none"><Link role="menuitem" to="/Favorites">Favoritos</Link></li>
            <li className="navbar__menu-item" role="none"><Link role="menuitem" to="#">Mis calificaciones</Link></li>
          </ul>
        )}

        {/* Account */}
        {isAuthenticated && (
          <div className="navbar__account">
            <button
              type="button"
              className="navbar__account-button"
              aria-haspopup="menu"
              aria-expanded={open}
              onClick={() => setOpen(!open)}
            >
              Mi cuenta
            </button>
            {open && (
              <div className="navbar__dropdown" role="menu">
                <Link to={ROUTES.EDIT_PROFILE} role="menuitem" className="navbar__dropdown-item" onClick={() => setOpen(false)}>Editar perfil</Link>
                <button type="button" role="menuitem" className="navbar__dropdown-item" onClick={handleLogout}>Cerrar sesión</button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default NavBar