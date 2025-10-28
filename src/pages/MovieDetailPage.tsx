import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Heart, SlidersHorizontal, Star, ArrowLeft } from 'lucide-react';
import Button from '../components/Button';
import VideoPlayer from '../components/VideoPlayer';
import { mockMovies } from '../data/mockMovies';
import { favoritesAPI, ratingsAPI, apiUtils } from '../services/api';
import './movie-detail.scss';

interface Comment {
  id: string;
  user: string;
  text: string;
  timestamp: Date;
  rating: number;
}

const MovieDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [rating, setRating] = useState<number>(0); // Iniciar en 0, se cargará desde el backend
  const [showVideoPlayer, setShowVideoPlayer] = useState<boolean>(false);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isLoadingVideo, setIsLoadingVideo] = useState<boolean>(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [favoritesIds, setFavoritesIds] = useState<Array<string | number>>([]);
  const [currentUser, setCurrentUser] = useState<string>('');
  const [userRating, setUserRating] = useState<number>(0); // Rating del usuario para esta película
  const [ratingId, setRatingId] = useState<string | null>(null); // ID del rating en la base de datos
  
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const [commentRating, setCommentRating] = useState<number>(0);

  const movie = mockMovies.find(m => String(m.id) === id);

  useEffect(() => {
  const loadCurrentUser = () => {
    const token = apiUtils.getToken();
    if (token) {
      const userName = localStorage.getItem('currentUserName');
      setCurrentUser(userName || 'Usuario');
    } else {
      setCurrentUser('Invitado');
    }
  };

  loadCurrentUser();
}, []);

  useEffect(() => {
    if (!movie) {
      navigate('/');
    }
  }, [movie, navigate]);

  const handleRate = async (value: number) => {
    if (!movie) return;
    
    setRating(value);
    setUserRating(value);
    
    const token = apiUtils.getToken();
    if (!token) {
      alert('Inicia sesión para calificar esta película');
      return;
    }

    try {
      const payload = { movieId: String(movie.id), rating: value };
      const resp = await ratingsAPI.addRating(token, payload);
      
      if (resp.success) {
        console.log('Rating saved successfully');
        // Actualizar el ID si es un nuevo rating
        if (resp.data && resp.data.rating && resp.data.rating._id) {
          setRatingId(resp.data.rating._id);
        }
      } else {
        console.error('Failed to save rating:', resp.error);
        alert(resp.error || 'No se pudo guardar la calificación');
      }
    } catch (error) {
      console.error('Error saving rating:', error);
      alert('Error al guardar la calificación');
    }
  };

  const handleDeleteRating = async () => {
    if (!ratingId) {
      alert('No hay calificación para eliminar');
      return;
    }
    
    if (!movie) return;
    
    const token = apiUtils.getToken();
    if (!token) {
      alert('Inicia sesión para eliminar la calificación');
      return;
    }

    try {
      const resp = await ratingsAPI.deleteRating(token, ratingId);
      
      if (resp.success) {
        setRating(0);
        setUserRating(0);
        setRatingId(null);
        console.log('Rating deleted successfully');
      } else {
        console.error('Failed to delete rating:', resp.error);
        alert(resp.error || 'No se pudo eliminar la calificación');
      }
    } catch (error) {
      console.error('Error deleting rating:', error);
      alert('Error al eliminar la calificación');
    }
  };

  const handlePlayMovie = async () => {
    if (!movie) return;
    
    setIsLoadingVideo(true);
    setVideoError(null);

    try {
      const apiUrl = (import.meta as any).env.VITE_API_URL || 'http://localhost:3000';
      const url = `${apiUrl}/${movie.id}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Response status: ${response.status}`);

      const result = await response.json();
      
      if (result.videos && result.videos.length > 0) {
        const movieIndex = mockMovies.findIndex(m => m.id === movie.id);
        const videoIndex = movieIndex % result.videos.length;
        const selectedVideo = result.videos[videoIndex];
        
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
      console.error('Error loading video:', error);
      setVideoError('Error al cargar el video. Verifica tu conexión a internet.');
    } finally {
      setIsLoadingVideo(false);
    }
  };

  const handleCloseVideoPlayer = () => {
    setShowVideoPlayer(false);
    setVideoUrl('');
    setVideoError(null);
  };

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

  // Cargar la calificación del usuario para esta película
  useEffect(() => {
    const loadUserRating = async () => {
      if (!movie) return;
      
      const token = apiUtils.getToken();
      if (!token) return;

      try {
        const resp = await ratingsAPI.getUserRatings(token);
        if (resp.success && resp.data) {
          const movieRating = resp.data.find((r: any) => r.movieId === String(movie.id));
          if (movieRating) {
            setUserRating(movieRating.rating);
            setRating(movieRating.rating); // También actualizar el rating visual
            setRatingId(movieRating._id); // Guardar el ID del rating
          } else {
            setUserRating(0);
            setRating(0);
            setRatingId(null);
          }
        }
      } catch (err) {
        console.error('Load user rating error', err);
      }
    };
    loadUserRating();
  }, [movie]);

  const handleToggleFavorite = async () => {
    if (!movie) return;
    
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
    } else {
      const payload = { movieId, title: movie.title, poster: movie.imageUrl };
      const resp = await favoritesAPI.addFavorite(token, payload);
      if (resp.success) {
        setFavoritesIds((prev) => [...prev, movieId]);
      } else {
        alert(resp.error || 'No se pudo agregar a favoritos');
      }
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const token = apiUtils.getToken();
    if (!token) {
      alert('Inicia sesión para comentar');
      return;
    }
    
    const comment: Comment = {
      id: Date.now().toString(),
      user: currentUser,
      text: newComment,
      timestamp: new Date(),
      rating: commentRating
    };
    
    setComments(prev => [comment, ...prev]);
    setNewComment('');
    setCommentRating(0);
  };

  const handleDeleteComment = (commentId: string) => {
    setComments(prev => prev.filter(comment => comment.id !== commentId));
  };

  const isFavorite = favoritesIds.includes(String(movie?.id));

  if (!movie) {
    return (
      <div className="movie-detail">
        <div className="movie-detail__header">
          <Button 
            variant="outline" 
            size="small"
            onClick={() => navigate(-1)}
            className="movie-detail__back-btn"
          >
            <ArrowLeft size={16} />
            <span>Volver</span>
          </Button>
        </div>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <h2>Película no encontrada</h2>
          <p>La película que buscas no existe.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="movie-detail">
      {showVideoPlayer && videoUrl && (
        <div className="movie-detail__video-modal-overlay">
          <VideoPlayer
            videoUrl={videoUrl}
            title={movie.title}
            onClose={handleCloseVideoPlayer}
          />
        </div>
      )}

      <div className="movie-detail__header">
        <Button 
          variant="outline" 
          size="small"
          onClick={() => navigate(-1)}
          className="movie-detail__back-btn"
        >
          <ArrowLeft size={16} />
          <span>Volver</span>
        </Button>
      </div>

      <div className="movie-detail__hero">
        <div
          className="movie-detail__poster"
          aria-label={`Póster de ${movie.title}`}
          style={{ backgroundImage: `url(${movie.imageUrl})` }}
        />

        <div className="movie-detail__details">
          <h1 className="movie-detail__title">{movie.title}</h1>
          <p className="movie-detail__description">
            {movie.description}
          </p>

          <div className="movie-detail__actions">
            <Button 
              variant="primary" 
              size="medium" 
              className="movie-detail__action-btn"
              onClick={handlePlayMovie}
              disabled={isLoadingVideo}
            >
              <Play size={18} />
              <span>{isLoadingVideo ? 'Cargando...' : 'Ver ahora'}</span>
            </Button>

            <Button
              variant="secondary"
              size="medium"
              className={`movie-detail__action-btn ${isFavorite ? 'is-favorite' : ''}`}
              onClick={handleToggleFavorite}
            >
              {isFavorite ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 21s-7-4.35-9-6.5C-0.5 11.5 2.5 6 6.5 6c2 0 3.5 1.25 5.5 3.25C13 7.25 14.5 6 16.5 6 20.5 6 23.5 11.5 21 14.5 19 16.65 12 21 12 21z" fill="#ffffff"/>
                </svg>
              ) : (
                <Heart size={18} color="#9ca3af" />
              )}
              <span>{isFavorite ? 'Quitar de favoritos' : 'Marcar como favorita'}</span>
            </Button>

            <Button variant="outline" size="medium" className="movie-detail__action-btn">
              <SlidersHorizontal size={18} />
              <span>Audio y subtítulos</span>
            </Button>
          </div>

          <div className="movie-detail__rating">
            <span className="movie-detail__rating-label">Califica esta película</span>
            <div className="movie-detail__stars">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`movie-detail__star ${rating >= value ? 'is-active' : ''}`}
                  onClick={() => handleRate(value)}
                >
                  <Star size={22} />
                </button>
              ))}
            </div>
            <button 
              type="button" 
              className="movie-detail__clear-rating"
              onClick={handleDeleteRating}
              disabled={!ratingId || rating === 0}
            >
              Eliminar calificación
            </button>
          </div>
        </div>
      </div>

      <section className="movie-detail__comments">
        <h2 className="movie-detail__comments-title">
          Comentarios y Reseñas
          <span className="movie-detail__comments-count">({comments.length})</span>
        </h2>
        
        <div className="movie-detail__comment-form">
          <div className="movie-detail__comment-user-info">
            <span className="movie-detail__comment-user-label">
              Comentando como: <strong>{currentUser}</strong>
            </span>
          </div>
          
          <div className="movie-detail__comment-rating">
            <span>Tu calificación:</span>
            {commentRating > 0 && (
              <span className="movie-detail__comment-rating-selected">
                {commentRating} estrella{commentRating > 1 ? 's' : ''}
              </span>
            )}
          </div>
          
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Comparte tu opinión sobre esta película..."
            className="movie-detail__comment-input"
            rows={4}
          />
          
          <Button 
            variant="primary" 
            size="medium" 
            onClick={handleAddComment}
            disabled={!newComment.trim()}
            className="movie-detail__comment-submit"
          >
            Publicar Comentario
          </Button>
        </div>

        <div className="movie-detail__comments-list">
          {comments.length === 0 ? (
            <div className="movie-detail__no-comments">
              <div className="movie-detail__no-comments-icon">💬</div>
              <h3>No hay comentarios aún</h3>
              <p>Sé el primero en compartir tu opinión sobre esta película</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="movie-detail__comment">
                <div className="movie-detail__comment-header">
                  <div className="movie-detail__comment-user">
                    <div className="movie-detail__comment-avatar">
                      {comment.user.charAt(0).toUpperCase()}
                    </div>
                    <div className="movie-detail__comment-user-details">
                      <strong className="movie-detail__comment-username">
                        {comment.user}
                      </strong>
                      {comment.rating > 0 && (
                        <div className="movie-detail__comment-rating-display">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={14} 
                              fill={i < comment.rating ? "#f59e0b" : "none"}
                              color="#f59e0b"
                            />
                          ))}
                          <span className="movie-detail__comment-rating-text">
                            ({comment.rating}/5)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="movie-detail__comment-meta">
                    <span className="movie-detail__comment-time">
                      {comment.timestamp.toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    {comment.user === currentUser && (
                      <button 
                        onClick={() => handleDeleteComment(comment.id)}
                        className="movie-detail__comment-delete"
                        aria-label="Eliminar comentario"
                        title="Eliminar comentario"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
                <p className="movie-detail__comment-text">{comment.text}</p>
              </div>
            ))
          )}
        </div>
      </section>

      {videoError && (
        <div className="movie-detail__error-modal">
          <div className="movie-detail__error-content">
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

export default MovieDetailPage;