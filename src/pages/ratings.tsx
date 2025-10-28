import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { ratingsAPI, apiUtils } from '../services/api';
import { mockMovies } from '../data/mockMovies';
import './ratings.scss';

interface UserRating {
  _id: string;
  userId: string;
  movieId: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

const Ratings: React.FC = () => {
  const [ratings, setRatings] = useState<UserRating[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRatings = async () => {
      try {
        const token = apiUtils.getToken();
        if (!token) {
          setError('Debes iniciar sesión para ver tus calificaciones');
          setLoading(false);
          return;
        }

        const resp = await ratingsAPI.getUserRatings(token);
        if (resp.success && resp.data) {
          setRatings(resp.data);
        } else {
          setError(resp.error || 'Error al cargar las calificaciones');
        }
      } catch (err) {
        console.error('Load ratings error', err);
        setError('Error al cargar las calificaciones');
      } finally {
        setLoading(false);
      }
    };

    loadRatings();
  }, []);

  // Helper to get movie details from mockMovies
  const getMovieDetails = (movieId: string) => {
    return mockMovies.find(m => String(m.id) === movieId);
  };

  // Render stars based on rating
  const renderStars = (rating: number) => {
    return (
      <div className="ratings__stars" role="radiogroup" aria-label={`Calificación: ${rating} estrellas`}>
        {[1, 2, 3, 4, 5].map((value) => (
          <Star
            key={value}
            size={20}
            className={value <= rating ? 'ratings__star--active' : 'ratings__star--inactive'}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="ratings">
        <div className="ratings__loading">
          <p>Cargando tus calificaciones...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ratings">
        <div className="ratings__error">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (ratings.length === 0) {
    return (
      <div className="ratings">
        <h1 className="ratings__title">Mis Calificaciones</h1>
        <div className="ratings__empty">
          <p>Aún no has calificado ninguna película</p>
          <p className="ratings__empty-subtitle">Ve a la sección de películas y califica tus favoritas</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ratings">
      <h1 className="ratings__title">Mis Calificaciones</h1>
      <p className="ratings__subtitle">Has calificado {ratings.length} película{ratings.length > 1 ? 's' : ''}</p>

      <div className="ratings__grid">
        {ratings.map((rating) => {
          const movie = getMovieDetails(rating.movieId);
          if (!movie) return null;

          return (
            <div key={rating._id} className="ratings__card">
              <div
                className="ratings__poster"
                style={{ backgroundImage: `url(${movie.imageUrl})` }}
              />
              <div className="ratings__info">
                <h3 className="ratings__movie-title">{movie.title}</h3>
                <div className="ratings__rating-section">
                  <span className="ratings__label">Tu calificación:</span>
                  {renderStars(rating.rating)}
                  <span className="ratings__rating-value">{rating.rating}/5</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Ratings;

