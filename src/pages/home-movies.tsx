import React, { useState } from 'react';
import { Play, Heart, SlidersHorizontal, Star } from 'lucide-react';
import Button from '../components/Button';
import './home-movies.scss';

/**
 * Home Movies detailed view (mocked)
 * Matches the shared mock with poster, actions, rating and recommendations
 */
const HomeMovies: React.FC = () => {
  const [rating, setRating] = useState<number>(4); // default mocked rating

  const handleRate = (value: number) => {
    setRating(value);
  };

  return (
    <div className="home-movies">
      <div className="home-movies__hero">
        {/* Poster */}
        <div className="home-movies__poster" aria-label="Movie poster placeholder" />

        {/* Details */}
        <div className="home-movies__details">
          <h1 className="home-movies__title">Demon Slayer</h1>
          <p className="home-movies__description">
            El Cuerpo de Cazadores de Demonios es arrastrado al laberíntico Castillo del Infinito, la fortaleza de Muzan. 
            Una vez dentro, se separan y deben enfrentarse a demonios de alto rango en batallas brutales e individuales. 
            Muzan busca destruir a los cazadores de una vez por todas, mientras ellos luchan contra los poderosos demonios restantes.
          </p>

          {/* Actions */}
          <div className="home-movies__actions">
            <Button variant="primary" size="medium" className="home-movies__action-btn">
              <Play size={18} />
              <span>Ver ahora</span>
            </Button>
            <Button variant="secondary" size="medium" className="home-movies__action-btn">
              <Heart size={18} />
              <span>Marcar como favorita</span>
            </Button>
            <Button variant="outline" size="medium" className="home-movies__action-btn">
              <SlidersHorizontal size={18} />
              <span>Audio y subtítulos</span>
            </Button>
          </div>

          {/* Rating */}
          <div className="home-movies__rating">
            <span className="home-movies__rating-label">Califica esta película</span>
            <div className="home-movies__stars" role="radiogroup" aria-label="Calificación de la película">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`home-movies__star ${rating >= value ? 'is-active' : ''}`}
                  onClick={() => handleRate(value)}
                  aria-checked={rating === value}
                  role="radio"
                  aria-label={`${value} estrella${value > 1 ? 's' : ''}`}
                >
                  <Star size={22} />
                </button>
              ))}
            </div>
            <button type="button" className="home-movies__clear-rating">Eliminar calificación</button>
          </div>
        </div>
      </div>

      {/* More like this */}
      <section className="home-movies__more">
        <h2 className="home-movies__section-title">Más como esto</h2>
        <div className="home-movies__grid">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="home-movies__placeholder" aria-label="Placeholder de película" />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomeMovies;
