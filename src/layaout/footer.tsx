/**
 * Footer component displayed at the bottom of every page.
 *
 * Contains site links, social icons and copyright information.
 */
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
            <a
              href="https://www.facebook.com/streamia"
              className="footer__social-link"
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
            >
              {/* Facebook SVG */}
              <svg className="footer__social-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07c0 4.99 3.66 9.13 8.44 9.93v-7.03H7.9v-2.9h2.54V9.41c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.45h-1.25c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.9h-2.34V22c4.78-.8 8.44-4.94 8.44-9.93z"/>
              </svg>
            </a>

            <a
              href="https://www.instagram.com/streamia"
              className="footer__social-link"
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              {/* Instagram SVG */}
              <svg className="footer__social-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>

            <a
              href="https://www.youtube.com/streamia"
              className="footer__social-link"
              aria-label="YouTube"
              target="_blank"
              rel="noopener noreferrer"
            >
              {/* YouTube SVG */}
              <svg className="footer__social-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M23.5 6.2s-.2-1.6-.8-2.3c-.7-.9-1.5-.9-1.9-.9C17.6 3 12 3 12 3s-5.6 0-8.8.1c-.4 0-1.3 0-1.9.9-.6.7-.8 2.3-.8 2.3S0 8 0 9.8v2.3C0 14 0.4 15.6 0.4 15.6s.2 1.6.8 2.3c.6.9 1.5.9 1.9.9 2.9.1 12.1.1 12.1.1s5.6 0 8.8-.1c.4 0 1.3 0 1.9-.9.6-.7.8-2.3.8-2.3s.4-1.6.4-3.4V9.8c0-1.8-.4-3.6-.4-3.6zM9.8 15.1V8.9l6.2 3.1-6.2 3.1z"/>
              </svg>
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
