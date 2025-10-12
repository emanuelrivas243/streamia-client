/**
 * Mock data for movies
 * This data can be replaced with real API data later
 */

export interface Movie {
  id: number;
  title: string;
  imageUrl: string;
  category: string;
  year: number;
  rating: number;
}

/**
 * Mock movies data
 */
export const mockMovies: Movie[] = [
  {
    id: 1,
    title: "John Wick 4",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    category: "Acción",
    year: 2023,
    rating: 8.5
  },
  {
    id: 2,
    title: "One Battle After Another",
    imageUrl: "https://images.unsplash.com/photo-1489599808417-8a0a4b2b8b8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    category: "Drama",
    year: 2023,
    rating: 7.8
  },
  {
    id: 3,
    title: "Demon Slayer",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    category: "Anime",
    year: 2023,
    rating: 9.2
  },
  {
    id: 4,
    title: "K-Pop Demon Hunters",
    imageUrl: "https://images.unsplash.com/photo-1489599808417-8a0a4b2b8b8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    category: "Comedia",
    year: 2023,
    rating: 7.5
  },
  {
    id: 5,
    title: "Weapons",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    category: "Thriller",
    year: 2023,
    rating: 8.0
  },
  {
    id: 6,
    title: "Dead Poets Society",
    imageUrl: "https://images.unsplash.com/photo-1489599808417-8a0a4b2b8b8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    category: "Drama",
    year: 1989,
    rating: 8.9
  },
  {
    id: 7,
    title: "Bring Her Back",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    category: "Suspense",
    year: 2023,
    rating: 7.2
  }
];
