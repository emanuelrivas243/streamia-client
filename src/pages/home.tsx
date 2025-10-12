import React from 'react';
import MovieCarousel from '../components/MovieCarousel';
import Button from '../components/Button';
import { mockMovies } from '../data/mockMovies';
import './home.scss';

/**
 * Home page component - Landing page with hero section
 * @returns JSX element containing the home page content
 */
const Home: React.FC = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero__background">
          <div className="hero__overlay"></div>
        </div>
        <div className="hero__content">
          <h1 className="hero__title">Películas sin límites</h1>
          <p className="hero__subtitle">Disfruta donde quieras.</p>
          <p className="hero__subtitle">Miles de títulos esperándote.</p>
          <div className="hero__actions">
            <Button 
              variant="outline" 
              size="large"
              href="/login"
            >
              Iniciar Sesión
            </Button>
            <Button 
              variant="primary" 
              size="large"
              href="/register"
            >
              Registrarse
            </Button>
          </div>
        </div>
      </section>

      {/* Movies Section */}
      <MovieCarousel
        title="Mira estas películas para ti"
        movies={mockMovies}
        onMovieClick={(movie) => console.log('Movie clicked:', movie)}
      />
    </div>
  );
};

export default Home;
