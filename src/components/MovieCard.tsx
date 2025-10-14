/**
 * MovieCard component displays a single movie tile with metadata and actions.
 */
import React from 'react';
import './MovieCard.scss';

/**
 * Props interface for MovieCard component
 */
interface MovieCardProps {
  id: number;
  title: string;
  imageUrl: string;
  className?: string;
  onClick?: () => void;
}

/**
 * Reusable movie card component
 * @param props - MovieCardProps
 * @returns JSX element containing the movie card
 */
const MovieCard: React.FC<MovieCardProps> = ({ 
  id, 
  title, 
  imageUrl, 
  className = '', 
  onClick 
}) => {
  return (
    <div 
      className={`movie-card ${className}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick?.();
        }
      }}
    >
      <div 
        className="movie-card__poster"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        <div className="movie-card__overlay"></div>
      </div>
      <h3 className="movie-card__title">{title}</h3>
    </div>
  );
};

export default MovieCard;
