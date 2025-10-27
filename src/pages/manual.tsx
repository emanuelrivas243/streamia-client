import React from 'react';
import '../styles/static-pages.scss';
import { Link } from 'react-router-dom';
import { ROUTES } from '../routes/routes';

const Manual: React.FC = () => {
  return (
    <div className="static-page static-page--manual manual-page">
      <div className="static-hero">
        <div className="static-hero__overlay"></div>
      </div>

      <div className="static-content">
        <h1>Manual detallado del usuario</h1>
        <p className="lead">Bienvenido al manual de usuario de Streamia. Aquí encontrarás instrucciones detalladas para utilizar todas las funcionalidades de la plataforma.</p>

        <section className="manual-section">
          <h2>1. Registro y autenticación</h2>
          <p>
            Crea una cuenta desde la página de registro. Asegúrate de usar un correo válido y una contraseña segura.
            Después de registrarte podrás iniciar sesión desde la página de inicio de sesión.
          </p>
        </section>

        <section className="manual-section">
          <h2>2. Navegación</h2>
          <p>
            Usa la barra de navegación superior para acceder a las secciones principales: Inicio, Películas, Favoritos, Calificaciones y tu perfil.
          </p>
        </section>

        <section className="manual-section">
          <h2>3. Explorar y buscar contenido</h2>
          <p>
            En la página de películas puedes buscar títulos y explorar películas y videos populares. Utiliza la barra de búsqueda para filtrar por título.
          </p>
        </section>

        <section className="manual-section">
          <h2>4. Favoritos</h2>
          <p>
            Marca contenidos como favoritos tocando el icono de corazón en cada tarjeta. Tus favoritos se sincronizan con tu cuenta.
          </p>
        </section>

        <section className="manual-section">
          <h2>5. Perfil y configuración</h2>
          <p>
            En la sección de perfil puedes editar tu información, cambiar contraseña o eliminar tu cuenta.
          </p>
        </section>

        <section className="manual-section">
          <h2>Más ayuda</h2>
          <p>
            Si necesitas ayuda adicional, visita la página de <Link to={ROUTES.CONTACT}>Contacto</Link> o consulta el mapa del sitio.
          </p>
        </section>

      </div>
    </div>
  );
};

export default Manual;
