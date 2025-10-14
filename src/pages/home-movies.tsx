import React, { useState } from 'react';
import { Play, Heart, SlidersHorizontal, Star } from 'lucide-react';
import Button from '../components/Button';
import MovieCard from '../components/MovieCard';
import { mockMovies } from '../data/mockMovies';
import './home-movies.scss';

/**
 * Home Movies detailed view (mocked)
 * Matches the shared mock with poster, actions, rating and recommendations
 */
const HomeMovies: React.FC = () => {
  const [rating, setRating] = useState<number>(4); // default mocked rating
  const [selectedMovieIndex, setSelectedMovieIndex] = useState<number>(2); // default to Demon Slayer (id 3)

  const selectedMovie = mockMovies[selectedMovieIndex] ?? mockMovies[0];

  const handleRate = (value: number) => {
    setRating(value);
  };

  return (
    <div className="home-movies">
      <div className="home-movies__hero">
        {/* Poster */}
        <div
          className="home-movies__poster"
          aria-label={`Póster de ${selectedMovie.title}`}
          style={{ backgroundImage: `url(${selectedMovie.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />

        {/* Details */}
        <div className="home-movies__details">
          <h1 className="home-movies__title">{selectedMovie.title}</h1>
          <p className="home-movies__description">
            {selectedMovie.description}
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
          {mockMovies.slice(0, 6).map((movie, idx) => (
            <MovieCard
              key={movie.id}
              id={movie.id}
              title={movie.title}
              imageUrl={movie.imageUrl}
              onClick={() => setSelectedMovieIndex(idx)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomeMovies;
