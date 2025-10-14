import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../routes/routes';
import './footer.scss';

/**
 * Footer component with logo, description, social media links and navigation
 * @returns JSX element containing the footer
 */
const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        {/* Left Section - Logo and Description */}
        <div className="footer__left">
          <Link to={ROUTES.HOME} className="footer__logo">
            STREAMIA
          </Link>
          <p className="footer__description">
            La mejor plataforma de streaming con contenido ilimitado para toda la familia.
          </p>
          <div className="footer__social">
            <a href="#" className="footer__social-link" aria-label="Facebook">
              <span className="footer__social-icon">f</span>
            </a>
            <a href="#" className="footer__social-link" aria-label="Instagram">
              <span className="footer__social-icon">📷</span>
            </a>
            <a href="#" className="footer__social-link" aria-label="YouTube">
              <span className="footer__social-icon">▶</span>
            </a>
          </div>
        </div>

        {/* Right Section - Navigation Links */}
        <div className="footer__right">
          <Link to={ROUTES.ABOUT} className="footer__link">
            Acerca de nosotros
          </Link>
          <Link to={ROUTES.SITEMAP} className="footer__link">
            Mapa del sitio
          </Link>
          <Link to={ROUTES.CONTACT} className="footer__link">
            Contacto
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
