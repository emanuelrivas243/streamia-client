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
  description?: string;
  videoUrl?: string;
  pexelsVideoId?: string;
}

/**
 * Mock movies data
 */
export const mockMovies: Movie[] = [
  {
    id: 1,
    title: "John Wick 4",
    imageUrl: "https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg",
    category: "Acción",
    year: 2023,
    rating: 8.5,
    description: "John Wick libra una guerra total contra el Alto Consejo, enfrentando nuevos enemigos y alianzas en una batalla imparable.",
    pexelsVideoId: "action-movie-trailer"
  },
  {
    id: 2,
    title: "Batman",
    imageUrl: "https://i.ibb.co/rBZd4CY/imagen-2025-10-25-175217428.png",
    category: "Drama",
    year: 2023,
    rating: 7.8,
    description: "Batman investiga una red de corrupción en Gotham mientras se enfrenta a un enigmático asesino serial.",
    pexelsVideoId: "batman-drama-scene"
  },
  {
    id: 3,
    title: "Demon Slayer",
    imageUrl: "https://i.ibb.co/4RGmBZzf/imagen-2025-10-25-172857480.png",
    category: "Anime",
    year: 2023,
    rating: 9.2,
    description: "Los cazadores de demonios son arrastrados al Castillo del Infinito para afrontar batallas definitivas contra demonios de alto rango.",
    pexelsVideoId: "anime-fight-scene"
  },
  {
    id: 4,
    title: "K-Pop Demon Hunters",
    imageUrl: "/images/kpopdemonhunters.jpg",
    category: "Comedia",
    year: 2023,
    rating: 7.5,
    description: "Un grupo de idols K‑Pop dobla como cazadoras de demonios, equilibrando escenarios y peligros sobrenaturales.",
    pexelsVideoId: "kpop-dance-performance"
  },
  {
    id: 5,
    title: "Weapons",
    imageUrl: "/images/waapons.jpg",
    category: "Thriller",
    year: 2023,
    rating: 8.0,
    description: "Un thriller que entrelaza historias oscuras alrededor de un misterioso accidente y sus consecuencias.",
    pexelsVideoId: "thriller-suspense-scene"
  },
  {
    id: 6,
    title: "Wicked",
    imageUrl: "https://i.ibb.co/BVsCYh27/imagen-2025-10-25-174605393.png",
    category: "Drama",
    year: 1989,
    rating: 8.9,
    description: "La historia no contada de las brujas de Oz, donde amistad y destino chocan en un mundo de magia.",
    pexelsVideoId: "magical-drama-scene"
  },
  {
    id: 7,
    title: "Elio",
    imageUrl: "/images/eliomovie.jpg",
    category: "Suspense",
    year: 2023,
    rating: 7.2,
    description: "Elio es transportado accidentalmente a una asamblea intergaláctica y debe representar a la Tierra.",
    pexelsVideoId: "sci-fi-space-scene"
  }
];
