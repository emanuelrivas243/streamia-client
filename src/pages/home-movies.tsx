import React, { useState, useEffect } from 'react';
import { Play, Heart, SlidersHorizontal, Star, Search } from 'lucide-react';
import Button from '../components/Button';
import MovieCard from '../components/MovieCard';
import VideoPlayer from '../components/VideoPlayer';
import { mockMovies } from '../data/mockMovies';
import './home-movies.scss';
import { favoritesAPI, apiUtils } from '../services/api';

/**
 * Home Movies detailed view with video playback functionality
 * Matches the shared mock with poster, actions, rating and recommendations
 */
const HomeMovies: React.FC = () => {
  const [rating, setRating] = useState<number>(4); // default mocked rating
  const [selectedMovieIndex, setSelectedMovieIndex] = useState<number>(2); // default to Demon Slayer (id 3)
  const [showVideoPlayer, setShowVideoPlayer] = useState<boolean>(false);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isLoadingVideo, setIsLoadingVideo] = useState<boolean>(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [favoritesIds, setFavoritesIds] = useState<Array<string | number>>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredMovies, setFilteredMovies] = useState(mockMovies);

  const selectedMovie = mockMovies[selectedMovieIndex] ?? mockMovies[0];

  const handleRate = (value: number) => {
    setRating(value);
  };

  // Filter movies based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredMovies(mockMovies);
    } else {
      const filtered = mockMovies.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMovies(filtered);
    }
  }, [searchQuery]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  /**
   * Get videos from backend
   */
  const getData = async () => {
    try {
      const apiUrl = (import.meta as any).env.VITE_API_URL || 'http://localhost:3000';
      console.log('VITE_API_URL:', apiUrl);
      
      const url = `${apiUrl}/videos/popular?per_page=10`;
      console.log('Calling backend URL:', url);
      
      const response = await fetch(url);
      console.log('Backend response status:', response.status);

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Backend response data:', result);
      
      if (result.videos && result.videos.length > 0) {
        // Use different video based on movie index for variety
        const videoIndex = selectedMovieIndex % result.videos.length;
        const selectedVideo = result.videos[videoIndex];
        
        console.log('Selected movie:', selectedMovie.title);
        console.log('Using video index:', videoIndex);
        console.log('Selected video:', selectedVideo);
        
        // Use the video file link
        if (selectedVideo.video_files && selectedVideo.video_files.length > 0) {
          const videoUrl = selectedVideo.video_files[0].link;
          console.log('Video URL from backend:', videoUrl);
          setVideoUrl(videoUrl);
          setShowVideoPlayer(true);
        } else {
          setVideoError('El video no tiene archivos disponibles.');
        }
      } else {
        setVideoError('No se encontraron videos en el backend.');
      }
    } catch (error) {
      console.error('Error loading video from backend:', error);
      setVideoError('Error al cargar el video. Verifica tu conexión a internet.');
      throw error; // Re-throw to trigger fallback
    }
  };

  /**
   * Handle play button click - get video from backend
   */
  const handlePlayMovie = async () => {
    setIsLoadingVideo(true);
    setVideoError(null);

    try {
      await getData();
    } catch (error) {
      console.error('Error loading video from backend:', error);
      setVideoError('Error al cargar el video. Verifica tu conexión a internet.');
    } finally {
      setIsLoadingVideo(false);
    }
  };

  /**
   * Handle close video player
   */
  const handleCloseVideoPlayer = () => {
    setShowVideoPlayer(false);
    setVideoUrl('');
    setVideoError(null);
  };

  // Load user favorites when component mounts
  useEffect(() => {
    const loadUserFavorites = async () => {
      try {
        const token = apiUtils.getToken();
        if (!token) return;
        const resp = await favoritesAPI.getFavorites(token);
        if (resp.success && resp.data) {
          // resp.data viene con objects que incluyen movieId
          setFavoritesIds(resp.data.map((f: any) => f.movieId));
        }
      } catch (err) {
        console.error('Load favorites error', err);
      }
    };

    loadUserFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // toggle handler
  const handleToggleFavorite = async (movie: { id: number | string; title: string; imageUrl: string }) => {
    const token = apiUtils.getToken();
    if (!token) {
      alert('Inicia sesión para usar favoritos');
      return;
    }

    const movieId = String(movie.id);
    // si ya está en favoritos se elimina
    if (favoritesIds.includes(movieId)) {
      const resp = await favoritesAPI.removeFavorite(token, movieId);
      if (resp.success) {
        setFavoritesIds((prev) => prev.filter((id) => String(id) !== movieId));
      } else {
        alert(resp.error || 'No se pudo quitar de favoritos');
      }
      return;
    }

    // si no está se agrega
    const payload = { movieId, title: movie.title, poster: movie.imageUrl };
    const resp = await favoritesAPI.addFavorite(token, payload);
    if (resp.success) {
      // la respuesta devuelve el documento nuevo con .movieId
      setFavoritesIds((prev) => [...prev, movieId]);
    } else {
      alert(resp.error || 'No se pudo agregar a favoritos');
    }
  };

  const isSelectedFavorite = favoritesIds.includes(String(selectedMovie.id));

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
            <Button 
              variant="primary" 
              size="medium" 
              className="home-movies__action-btn"
              onClick={handlePlayMovie}
              disabled={isLoadingVideo}
            >
              <Play size={18} />
              <span>{isLoadingVideo ? 'Cargando...' : 'Ver ahora'}</span>
            </Button>

            <Button
              variant="secondary"
              size="medium"
              className={`home-movies__action-btn ${isSelectedFavorite ? 'is-favorite' : ''}`}
              onClick={() => handleToggleFavorite(selectedMovie)}
            >
              {isSelectedFavorite ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M12 21s-7-4.35-9-6.5C-0.5 11.5 2.5 6 6.5 6c2 0 3.5 1.25 5.5 3.25C13 7.25 14.5 6 16.5 6 20.5 6 23.5 11.5 21 14.5 19 16.65 12 21 12 21z" fill="#ffffff"/>
                  <path d="M12.1 8.64c-.9-1.03-2.5-1.03-3.4 0-.87.98-.87 2.56 0 3.54l3.4 3.48 3.4-3.48c.87-.98.87-2.56 0-3.54-.9-1.03-2.5-1.03-3.4 0z" fill="#ffffff"/>
                </svg>
              ) : (
                <Heart size={18} color="#9ca3af" />
              )}
              <span>{isSelectedFavorite ? 'Quitar de favoritos' : 'Marcar como favorita'}</span>
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

      {/* Search Bar - centered above categories */}
      <div className="home-movies__search-section">
        <div className="home-movies__search-container">
          <Search size={20} className="home-movies__search-icon" />
          <input
            type="text"
            placeholder="Buscar películas..."
            value={searchQuery}
            onChange={handleSearch}
            className="home-movies__search-input"
          />
        </div>
      </div>

      {/* Search Results */}
      {searchQuery && (
        <section className="home-movies__section">
          <h2 className="home-movies__section-title">
            Resultados de búsqueda: "{searchQuery}"
            <span className="home-movies__results-count">({filteredMovies.length} películas)</span>
          </h2>
          <div className="home-movies__grid">
            {filteredMovies.length > 0 ? (
              filteredMovies.map((movie, idx) => (
                <MovieCard
                  key={movie.id}
                  id={movie.id}
                  title={movie.title}
                  imageUrl={movie.imageUrl}
                  isFavorite={favoritesIds.includes(String(movie.id))}
                  onFavorite={(movieId) => {
                    const m = mockMovies.find((mm) => String(mm.id) === String(movieId));
                    if (m) handleToggleFavorite(m);
                  }}
                  onClick={() => setSelectedMovieIndex(idx)}
                />
              ))
            ) : (
              <div className="home-movies__no-results">
                <p>No se encontraron películas para "{searchQuery}"</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Popular Movies */}
      {!searchQuery && (
        <section className="home-movies__section">
          <h2 className="home-movies__section-title">Películas Populares</h2>
          <div className="home-movies__grid">
            {mockMovies.slice(0, 4).map((movie, idx) => (
              <MovieCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                imageUrl={movie.imageUrl}
                isFavorite={favoritesIds.includes(String(movie.id))}
                onFavorite={(movieId) => {
                  const m = mockMovies.find((mm) => String(mm.id) === String(movieId));
                  if (m) handleToggleFavorite(m);
                }}
                onClick={() => setSelectedMovieIndex(idx)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Trending Movies */}
      {!searchQuery && (
        <section className="home-movies__section">
          <h2 className="home-movies__section-title">Tendencias</h2>
          <div className="home-movies__grid">
            {mockMovies.slice(4, 8).map((movie, idx) => (
              <MovieCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                imageUrl={movie.imageUrl}
                isFavorite={favoritesIds.includes(String(movie.id))}
                onFavorite={(movieId) => {
                  const m = mockMovies.find((mm) => String(mm.id) === String(movieId));
                  if (m) handleToggleFavorite(m);
                }}
                onClick={() => setSelectedMovieIndex(idx + 4)}
              />
            ))}
          </div>
        </section>
      )}

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
              isFavorite={favoritesIds.includes(String(movie.id))}
              onFavorite={(movieId) => {
                const m = mockMovies.find((mm) => String(mm.id) === String(movieId));
                if (m) handleToggleFavorite(m);
              }}
              onClick={() => setSelectedMovieIndex(idx)}
            />
          ))}
        </div>

        {/* Video Player Modal - Only in movies section */}
        {showVideoPlayer && videoUrl && (
          <div className="home-movies__video-modal">
            <VideoPlayer
              videoUrl={videoUrl}
              title={selectedMovie.title}
              onClose={handleCloseVideoPlayer}
            />
          </div>
        )}
      </section>

      {/* Video Error Message */}
      {videoError && (
        <div className="home-movies__error-modal">
          <div className="home-movies__error-content">
            <h3>Error al cargar el video</h3>
            <p>{videoError}</p>
            <Button 
              variant="primary" 
              size="medium" 
              onClick={() => setVideoError(null)}
            >
              Cerrar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
export default HomeMovies;