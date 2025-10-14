import React from 'react';
import '../styles/static-pages.scss';

/**
 * About page with hero placeholder and content
 */
const About: React.FC = () => {
  return (
    <div className="static-page about-page">
      <div className="static-hero">
        <div className="static-hero__overlay"></div>
      </div>

      <div className="static-content">
        <h1>Acerca de nosotros</h1>
        <p>
          Bienvenido a Streamia, tu espacio para disfrutar del cine sin límites. Somos una plataforma creada para amantes del séptimo arte,
          pensada para ofrecerte una experiencia de entretenimiento cómoda, rápida y de calidad.
        </p>
        <p>
          Porque sabemos que cada historia merece ser contada y cada espectador merece disfrutarla a su manera.
        </p>
        <p><strong>Streamia</strong>: el cine, a un click de distancia.</p>
      </div>
    </div>
  );
};

export default About;
