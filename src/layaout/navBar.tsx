import React from 'react'
import { Link } from 'react-router-dom'
import './navBar.scss'

/**
 * Navigation bar component with logo
 * @returns JSX element containing the navigation bar
 */
const NavBar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar__container">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          STREAMIA
        </Link>
      </div>
    </nav>
  )
}

export default NavBar