import React, { useState } from 'react'
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



  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAuthenticated) {
      navigate('/homePage'); 
    } else {
      navigate(ROUTES.LOGIN); 
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar__container">
       
        <a 
          href="#" 
          className="navbar__logo" 
          onClick={handleLogoClick}
          style={{ cursor: 'pointer', textDecoration: 'none' }}
        >
          STREAMIA
        </a>

        {/* Primary navigation (only when authenticated) */}
        {isAuthenticated && (
          <ul className="navbar__menu" role="menubar" aria-label="Primary">
            <li className="navbar__menu-item" role="none"><Link role="menuitem" to="/homePage">Inicio</Link></li>
            <li className="navbar__menu-item" role="none"><Link role="menuitem" to="/home-movies">Películas</Link></li>
            <li className="navbar__menu-item" role="none"><Link role="menuitem" to="/Favorites">Favoritos</Link></li>
            <li className="navbar__menu-item" role="none"><Link role="menuitem" to="/ratings">Mis calificaciones</Link></li>
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