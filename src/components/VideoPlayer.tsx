/**
 * VideoPlayer component for movie playback with controls
 * Supports play, pause, stop, and video source management
 */
import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Square, Volume2, VolumeX, Maximize } from 'lucide-react';
import './VideoPlayer.scss';

/**
 * Props interface for VideoPlayer component
 */
interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  onClose: () => void;
}

/**
 * Video player component with playback controls
 * @param props - VideoPlayerProps
 * @returns JSX element containing the video player
 */
const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  title,
  onClose
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  /**
   * Enter fullscreen automatically when component mounts
   */
  useEffect(() => {
    const enterFullscreen = async () => {
      if (containerRef.current) {
        try {
          await containerRef.current.requestFullscreen();
          setIsFullscreen(true);
        } catch (err) {
          console.log('Error al entrar en pantalla completa:', err);
        }
      }
    };

    // Enter fullscreen after a short delay to ensure DOM is ready
    const timer = setTimeout(() => {
      enterFullscreen();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  /**
   * Handle fullscreen change events
   */
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  /**
   * Handle escape key to close video when in fullscreen
   */
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Escape' && isFullscreen) {
        onClose();
      } else if (e.code === 'Space') {
        e.preventDefault();
        handlePlayPause();
      } else if (e.code === 'KeyF') {
        e.preventDefault();
        handleFullscreenToggle();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, isFullscreen]);

  /**
   * Handle play/pause toggle
   */
  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  /**
   * Handle stop video
   */
  const handleStop = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  /**
   * Handle mute/unmute toggle
   */
  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  /**
   * Handle fullscreen toggle
   */
  const handleFullscreenToggle = async () => {
    try {
      if (!document.fullscreenElement) {
        await containerRef.current?.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.log('Error al cambiar pantalla completa:', err);
    }
  };

  /**
   * Handle time update
   */
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  /**
   * Handle duration change
   */
  const handleDurationChange = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  /**
   * Handle progress bar click
   */
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current && duration > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newTime = (clickX / rect.width) * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  /**
   * Format time in MM:SS format
   */
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  /**
   * Handle video loading
   */
  const handleLoadStart = () => {
    setIsLoading(true);
    setHasError(false);
    setErrorMessage('');
  };

  const handleCanPlay = () => {
    setIsLoading(false);
    setHasError(false);
  };

  /**
   * Handle video error
   */
  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    setErrorMessage('Error al cargar el video. Verifica tu conexión a internet.');
  };

  /**
   * Handle video load timeout
   */
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        setHasError(true);
        setErrorMessage('El video está tardando mucho en cargar. Intenta con otro video.');
      }
    }, 10000); // 10 seconds timeout

    return () => clearTimeout(timeout);
  }, [isLoading]);

  /**
   * Handle mouse movement for controls visibility
   */
  const handleMouseMove = () => {
    setShowControls(true);
  };

  const handleMouseLeave = () => {
    setShowControls(false);
  };

  return (
    <div 
      ref={containerRef}
      className="video-player"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="video-player__video"
        src={videoUrl}
        onTimeUpdate={handleTimeUpdate}
        onDurationChange={handleDurationChange}
        onLoadStart={handleLoadStart}
        onCanPlay={handleCanPlay}
        onError={handleError}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        preload="metadata"
        autoPlay // Auto-play when opened
        aria-label={`Reproduciendo ${title}`}
      />

      {/* Loading indicator */}
      {isLoading && (
        <div className="video-player__loading">
          <div className="video-player__spinner"></div>
          <span>Cargando video...</span>
        </div>
      )}

      {/* Error indicator */}
      {hasError && (
        <div className="video-player__error">
          <div className="video-player__error-icon">⚠️</div>
          <h3>Error al cargar el video</h3>
          <p>{errorMessage}</p>
          <button 
            className="video-player__retry-btn"
            onClick={() => {
              setHasError(false);
              setIsLoading(true);
              if (videoRef.current) {
                videoRef.current.load();
              }
            }}
          >
            Reintentar
          </button>
          <button 
            className="video-player__close-error-btn"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      )}

      {/* Controls Overlay */}
      <div className={`video-player__controls ${showControls ? 'video-player__controls--visible' : ''}`}>
        {/* Top controls */}
        <div className="video-player__top-controls">
          <h3 className="video-player__title">{title}</h3>
          <button 
            className="video-player__close-btn"
            onClick={onClose}
            aria-label="Cerrar reproductor"
          >
            ✕
          </button>
        </div>

        {/* Center play button */}
        <div className="video-player__center-controls">
          <button
            className="video-player__play-btn"
            onClick={handlePlayPause}
            aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
          >
            {isPlaying ? <Pause size={48} /> : <Play size={48} />}
          </button>
        </div>

        {/* Bottom controls */}
        <div className="video-player__bottom-controls">
          {/* Progress bar */}
          <div 
            className="video-player__progress"
            onClick={handleProgressClick}
            role="progressbar"
            aria-label="Barra de progreso del video"
            tabIndex={0}
          >
            <div 
              className="video-player__progress-filled"
              style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>

          {/* Control buttons */}
          <div className="video-player__control-buttons">
            <div className="video-player__left-controls">
              <button
                className="video-player__control-btn"
                onClick={handlePlayPause}
                aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
              
              <button
                className="video-player__control-btn"
                onClick={handleStop}
                aria-label="Parar video"
              >
                <Square size={20} />
              </button>

              <button
                className="video-player__control-btn"
                onClick={handleMuteToggle}
                aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>

              {/* Fullscreen button */}
              <button
                className="video-player__control-btn video-player__fullscreen-btn"
                onClick={handleFullscreenToggle}
                aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
              >
                <Maximize size={20} />
              </button>
            </div>

            <div className="video-player__right-controls">
              <span className="video-player__time">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;