/**
 * Favorites page
 *
 * Displays the user's favorite movies in a two-row horizontal layout.
 */
import React from 'react';
import MovieCard from '../components/MovieCard';
import '../styles/favorites.scss';
import { favoritesAPI, apiUtils } from '../services/api';

const Favorites: React.FC = () => {
  const [movies, setMovies] = React.useState<Array<{ id: number; title: string; imageUrl: string }>>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const token = apiUtils.getToken();

React.useEffect(() => {
  const loadFavorites = async () => {
    setIsLoading(true);
    try {
      const resp = await favoritesAPI.getFavorites(token || '');

      if (!resp.success || !resp.data) {
        setError(resp.error || 'No se pudieron cargar los favoritos');
        setMovies([]);
        return;
      }

      const items = resp.data.map((fav: any) => ({
        id: fav.movieId,
        title: fav.title,
        imageUrl: fav.poster || '/images/placeholder.png',
      }));

      setMovies(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  loadFavorites();
}, []);



  // Prepare rows for rendering
  const firstRow = movies.slice(0, 6);
  const secondRow = movies.slice(6, 12);

  return (
    <div className="favorites page">
      <div className="favorites__hero">
        <div className="favorites__hero-inner">
          <h1 className="favorites__title">Mis Favoritos</h1>
          <p className="favorites__count">{movies.length} películas</p>
        </div>
      </div>

      <div className="favorites__content">
        <div className="favorites__row" aria-label="Favoritos fila 1">
          {isLoading && <div className="favorites__loading">Cargando favoritos...</div>}
          {error && <div className="favorites__error" role="alert">{error}</div>}
          {!isLoading && !error && firstRow.map((m) => (
            <div className="favorites__card" key={`r1-${m.id}`}>
              <MovieCard id={m.id} title={m.title} imageUrl={m.imageUrl} isFavorite />
            </div>
          ))}
        </div>

        <div className="favorites__row" aria-label="Favoritos fila 2">
          {!isLoading && !error && secondRow.map((m) => (
            <div className="favorites__card" key={`r2-${m.id}`}>
              <MovieCard id={m.id} title={m.title} imageUrl={m.imageUrl} isFavorite />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
