import React, { useState, useEffect } from 'react';
import { Play, Heart, SlidersHorizontal, Star } from 'lucide-react';
import Button from '../components/Button';
import MovieCard from '../components/MovieCard';
import VideoPlayer from '../components/VideoPlayer';
import { mockMovies } from '../data/mockMovies';
import './home-movies.scss';

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

  const selectedMovie = mockMovies[selectedMovieIndex] ?? mockMovies[0];

  const handleRate = (value: number) => {
    setRating(value);
  };

  /**
   * Get videos from backend (like in your professor's example)
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
