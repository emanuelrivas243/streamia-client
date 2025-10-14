import React from 'react';
import { ROUTES } from '../routes/routes';
import { Link } from 'react-router-dom';
import '../styles/static-pages.scss';

const Sitemap: React.FC = () => {
  return (
    <div className="static-page sitemap-page">
      <div className="static-hero">
        <div className="static-hero__overlay"></div>
      </div>

      <div className="static-content">
        <h1>Mapa del sitio</h1>
        <div className="sitemap-grid">
          <div className="link-card"><Link to={ROUTES.HOME}>Inicio</Link></div>
          <div className="link-card"><Link to={ROUTES.ABOUT}>Acerca de nosotros</Link></div>
          <div className="link-card"><Link to={ROUTES.CONTACT}>Contáctanos</Link></div>
          <div className="link-card"><Link to={ROUTES.LOGIN}>Iniciar sesión</Link></div>
          <div className="link-card"><Link to={ROUTES.REGISTER}>Registrarse</Link></div>
          <div className="link-card"><Link to={ROUTES.RECOVER_PASSWORD}>Recuperar contraseña</Link></div>
          <div className="link-card"><Link to={ROUTES.EDIT_PROFILE}>Editar perfil</Link></div>
        </div>
      </div>
    </div>
  );
};

export default Sitemap;


