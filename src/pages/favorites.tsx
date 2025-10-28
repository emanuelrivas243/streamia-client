/**
 * Favorites page
 *
 * Displays the user's favorite movies in a two-row horizontal layout.
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import './favorites.scss';
import { favoritesAPI, apiUtils } from '../services/api';
import { mockMovies } from '../data/mockMovies';

const Favorites: React.FC = () => {
  const [movies, setMovies] = React.useState<Array<{ id: string; title: string; imageUrl: string }>>([]);
  const [error, setError] = React.useState<string | null>(null);
  const token = apiUtils.getToken();
  const navigate = useNavigate();

  React.useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const resp = await favoritesAPI.getFavorites(token || '');

      if (!resp.success || !resp.data) {
        setError(resp.error || 'No se pudieron cargar los favoritos');
        setMovies([]);
        return;
      }

      const items = resp.data.map((fav: any) => {
        const matched = mockMovies.find((m) => String(m.id) === String(fav.movieId));
        return {
          id: fav.movieId,
          title: fav.title,
          imageUrl: matched?.imageUrl || fav.poster || '/images/placeholder.png',
        };
      });

      setMovies(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const handleRemoveFavorite = async (movieId: number | string) => {
    if (!token) {
      alert('Inicia sesión para gestionar favoritos');
      return;
    }

    try {
      const resp = await favoritesAPI.removeFavorite(token, String(movieId));
      if (resp.success) {
        setMovies(prev => prev.filter(movie => String(movie.id) !== String(movieId)));
      } else {
        alert(resp.error || 'No se pudo quitar de favoritos');
      }
    } catch (err) {
      console.error('Error removing favorite:', err);
      alert('Error al quitar de favoritos');
    }
  };

  const handleFavoriteToggle = (movieId: number | string) => {
    handleRemoveFavorite(movieId);
  };

  const handleMovieClick = (movieId: number | string) => {
    navigate(`/movie/${movieId}`);
  };

  return (
    <div className="favorites page">
      <div className="favorites__header">
        <h1 className="favorites__title">Mis Favoritos</h1>
        <p className="favorites__count">{movies.length} película{movies.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="favorites__content">
        {error && <div className="favorites__error" role="alert">{error}</div>}
        
        {!error && movies.length > 0 && (
          <div className="favorites__row" aria-label="Películas favoritas">
            {movies.map((m) => (
              <div className="favorites__card" key={m.id}>
                <MovieCard 
                  id={m.id} 
                  title={m.title} 
                  imageUrl={m.imageUrl} 
                  isFavorite 
                  onClick={() => handleMovieClick(m.id)}
                  onFavorite={handleFavoriteToggle}
                />
              </div>
            ))}
          </div>
        )}

        {!error && movies.length === 0 && (
          <div className="favorites__empty">
            <div className="favorites__empty-icon">❤️</div>
            <h3>No tienes películas favoritas</h3>
            <p>Agrega películas a favoritos para verlas aquí</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;