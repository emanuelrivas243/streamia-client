import React from 'react';
import '../styles/static-pages.scss';

const Contact: React.FC = () => {
  return (
    <div className="static-page static-page--contact contact-page">
      <div className="static-hero">
        <div className="static-hero__overlay"></div>
      </div>

      <div className="static-content">
        <h1>Contáctanos</h1>
        <p className="lead">¿Tienes dudas, sugerencias o encontraste un problema en la plataforma? Nuestro equipo está aquí para ayudarte.</p>

        <div className="info-grid">
          <div className="card">
            <h3>Correo</h3>
            <p>soporte@streamia.com</p>
          </div>
          <div className="card">
            <h3>Teléfono</h3>
            <p>+57 300 000 0000</p>
          </div>
          <div className="card">
            <h3>Ubicación</h3>
            <p>Cali, Colombia</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;


