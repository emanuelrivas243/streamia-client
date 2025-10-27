import React, { useState, useEffect } from 'react';
import { Play, Heart, SlidersHorizontal, Star, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import MovieCard from '../components/MovieCard';
import VideoPlayer from '../components/VideoPlayer'; // ✅ Este SÍ funciona ahora
import { mockMovies } from '../data/mockMovies';
import { favoritesAPI, apiUtils } from '../services/api';
import './home-movies.scss';

const HomeMovies: React.FC = () => {
  const navigate = useNavigate();
  const [showVideoPlayer, setShowVideoPlayer] = useState<boolean>(false);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isLoadingVideo, setIsLoadingVideo] = useState<boolean>(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [favoritesIds, setFavoritesIds] = useState<Array<string | number>>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredMovies, setFilteredMovies] = useState(mockMovies);

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

  const handleMovieClick = (movieId: number | string) => {
    navigate(`/movie/${movieId}`);
  };

  /**
   * Get videos from backend
   */
  const getData = async () => {
    try {
      const apiUrl = (import.meta as any).env.VITE_API_URL || 'http://localhost:3000';
      const url = `${apiUrl}/videos/popular?per_page=10`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.videos && result.videos.length > 0) {
        const selectedVideo = result.videos[0];
        
        if (selectedVideo.video_files && selectedVideo.video_files.length > 0) {
          const videoUrl = selectedVideo.video_files[0].link;
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
      throw error;
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
          setFavoritesIds(resp.data.map((f: any) => f.movieId));
        }
      } catch (err) {
        console.error('Load favorites error', err);
      }
    };

    loadUserFavorites();
  }, []);

  // toggle handler
  const handleToggleFavorite = async (movie: { id: number | string; title: string; imageUrl: string }) => {
    const token = apiUtils.getToken();
    if (!token) {
      alert('Inicia sesión para usar favoritos');
      return;
    }

    const movieId = String(movie.id);
    if (favoritesIds.includes(movieId)) {
      const resp = await favoritesAPI.removeFavorite(token, movieId);
      if (resp.success) {
        setFavoritesIds((prev) => prev.filter((id) => String(id) !== movieId));
      } else {
        alert(resp.error || 'No se pudo quitar de favoritos');
      }
      return;
    }

    const payload = { movieId, title: movie.title, poster: movie.imageUrl };
    const resp = await favoritesAPI.addFavorite(token, payload);
    if (resp.success) {
      setFavoritesIds((prev) => [...prev, movieId]);
    } else {
      alert(resp.error || 'No se pudo agregar a favoritos');
    }
  };

  return (
    <div className="home-movies">
      {/* Search Bar */}
      <div className="home-movies__search">
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
              filteredMovies.map((movie) => (
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
                  onClick={() => handleMovieClick(movie.id)}
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
            {mockMovies.slice(0, 4).map((movie) => (
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
                onClick={() => handleMovieClick(movie.id)}
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
            {mockMovies.slice(4, 8).map((movie) => (
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
                onClick={() => handleMovieClick(movie.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* More like this */}
      <section className="home-movies__more">
        <h2 className="home-movies__section-title">Más como esto</h2>
        <div className="home-movies__grid">
          {mockMovies.slice(0, 6).map((movie) => (
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
              onClick={() => handleMovieClick(movie.id)}
            />
          ))}
        </div>
      </section>

      {/* ✅ Video Player Modal - LIMPIO Y FUNCIONAL */}
      {showVideoPlayer && videoUrl && (
        <div className="home-movies__video-modal">
          <VideoPlayer
            videoUrl={videoUrl}
            title="Reproduciendo película"
            onClose={handleCloseVideoPlayer}
          />
        </div>
      )}

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