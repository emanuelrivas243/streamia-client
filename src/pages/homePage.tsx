import React, { useState, useEffect } from 'react';
import { Play, Heart, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../components/Button';
import MovieCard from '../components/MovieCard';
import VideoPlayer from '../components/VideoPlayer';
import { mockMovies } from '../data/mockMovies';
import { favoritesAPI, apiUtils } from '../services/api';
import './homePage.scss';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [showVideoPlayer, setShowVideoPlayer] = useState<boolean>(false);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isLoadingVideo, setIsLoadingVideo] = useState<boolean>(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [favoritesIds, setFavoritesIds] = useState<Array<string | number>>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  
  const featuredMovies = [
    {
      id: "68fe440f0f375de5da710444",
      title: "John Wick 4",
      description: "John Wick descubre un camino para derrotar a la Alta Mesa. Pero para ganar su libertad, debe enfrentarse a un nuevo enemigo con poderosas alianzas.",
      background: "https://image.tmdb.org/t/p/original/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg",
      imageUrl: "https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg",
      year: 2023
    },
    {
      id: "68fe776a1f47ab544c72e3dd",
      title: "Weapons",
      description: "Todos los niños de la clase, excepto uno, desaparecen misteriosamente en la misma noche y exactamente a la misma hora. La comunidad se pregunta quién o qué está detrás de la desaparición.",
      background: "https://i.ibb.co/tM2fRWGQ/imagen-2025-10-25-173329618.png",
      imageUrl: "/images/waapons.jpg",
      year: 2024
    },
    {
      id: "68fe51230f375de5da710446",
      title: "Wicked",
      description: "La historia nunca antes contada de las Brujas de Oz, siguiendo a Elphaba y Glinda en su extraordinario viaje de amistad y destino.",
      background: "https://i.ibb.co/rR2T9khs/wp14661325-wicked-film-wallpapers.jpg",
      imageUrl: "https://i.ibb.co/BVsCYh27/imagen-2025-10-25-174605393.png",
      year: 2024
    },
    {
      id: "68fe73ef1f47ab544c72e3d8",
      title: "Demon Slayer",
      description: "Tanjiro y sus amigos se preparan para el entrenamiento de los Pilares mientras continúan su batalla contra los demonios.",
      background: "https://i.ibb.co/RTY4pwnq/imagen-2025-10-25-161041429.png",
      imageUrl: "/images/demonslayer.jpg",
      year: 2024
    }
  ];


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredMovies.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);


  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredMovies.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length);
  };

  const handleMovieClick = (movieId: number | string) => {
    navigate(`/movie/${movieId}`);
  };

  /**
   * Get videos from backend
   */
const getData = async (movie: any) => {
  try {
    const identifier = movie.cloudinaryId || movie.public_id || movie.id;
    const apiUrl = (import.meta as any).env.VITE_API_URL || 'http://localhost:3000';
    const url = `${apiUrl}/api/movies/${identifier}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();

    if (result.data && result.data.videoUrl) {
      setVideoUrl(result.data.videoUrl);
      setShowVideoPlayer(true);
    } else {
      setVideoError('No se encontró la URL del video en el backend.');
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
  const handlePlayMovie = async (movie: any) => {
    setIsLoadingVideo(true);
    setVideoError(null);

    try {
      await getData(movie);
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


  const popularMovies = mockMovies.slice(0, 8);
  const trendingMovies = mockMovies.slice(4, 12);

  return (
    <div className="homepage">
      {/* Hero Carrusel Gigante */}
      <section className="homepage__hero">
        <div className="homepage__carousel">
          {featuredMovies.map((movie, index) => (
            <div
              key={movie.id}
              className={`homepage__carousel-slide ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(${movie.background})` }}
            >
              <div className="homepage__carousel-content">
                <h1 className="homepage__carousel-title">
                  {movie.title}
                  <span className="homepage__carousel-year"> ({movie.year})</span>
                </h1>
                <p className="homepage__carousel-description">{movie.description}</p>
                <div className="homepage__carousel-buttons">
                  <Button 
                    variant="primary" 
                    size="large" 
                    onClick={() => handlePlayMovie(movie)}
                    disabled={isLoadingVideo}
                  >
                    <Play size={24} fill="currentColor" /> 
                    {isLoadingVideo ? 'Cargando...' : 'Reproducir'}
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="large"
                    onClick={() => handleMovieClick(movie.id)}
                  >
                    <Info size={24} /> Más Info
                  </Button>
                  <button 
                    className="homepage__favorite-btn"
                    onClick={() => handleToggleFavorite(movie)}
                  >
                    <Heart 
                      size={24} 
                      fill={favoritesIds.includes(String(movie.id)) ? 'currentColor' : 'none'} 
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>


        <button className="homepage__carousel-btn homepage__carousel-btn--prev" onClick={prevSlide}>
          <ChevronLeft size={32} />
        </button>
        <button className="homepage__carousel-btn homepage__carousel-btn--next" onClick={nextSlide}>
          <ChevronRight size={32} />
        </button>

        <div className="homepage__carousel-indicators">
          {featuredMovies.map((_, index) => (
            <button
              key={index}
              className={`homepage__carousel-indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </section>


      <section className="homepage__section">
        <h2 className="homepage__section-title">Películas Populares</h2>
        <div className="homepage__movies-grid">
          {popularMovies.map((movie) => (
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


      <section className="homepage__section">
        <h2 className="homepage__section-title">Tendencias</h2>
        <div className="homepage__movies-grid">
          {trendingMovies.map((movie) => (
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

      {/* Video Player Modal */}
      {showVideoPlayer && videoUrl && (
        <div className="homepage__video-modal">
          <VideoPlayer
            videoUrl={videoUrl}
            title="Reproduciendo película"
            onClose={handleCloseVideoPlayer}
          />
        </div>
      )}

      {/* Video Error Message */}
      {videoError && (
        <div className="homepage__error-modal">
          <div className="homepage__error-content">
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

export default HomePage;