/**
 * MovieCarousel component renders a horizontal scrolling list of MovieCard items.
 */
import React from 'react';
import MovieCard from './MovieCard';
import './MovieCarousel.scss';

/**
 * Movie interface
 */
interface Movie {
  id: number;
  title: string;
  imageUrl: string;
}

/**
 * Props interface for MovieCarousel component
 */
interface MovieCarouselProps {
  title: string;
  movies: Movie[];
  className?: string;
  onMovieClick?: (movie: Movie) => void;
}

/**
 * Reusable movie carousel component
 * @param props - MovieCarouselProps
 * @returns JSX element containing the movie carousel
 */
const MovieCarousel: React.FC<MovieCarouselProps> = ({ 
  title, 
  movies, 
  className = '',
  onMovieClick 
}) => {
  return (
    <section className={`movie-carousel ${className}`}>
      <div className="container">
        <h2 className="movie-carousel__title">{title}</h2>
        <div className="movie-carousel__wrapper">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              id={movie.id}
              title={movie.title}
              imageUrl={movie.imageUrl}
              onClick={() => onMovieClick?.(movie)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MovieCarousel;
