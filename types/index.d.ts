export interface Movie {
  adult: boolean;
  backdrop_path: string;
  poster_path: string;
  release_date: string;
  genre_ids: number[];
  video: boolean;
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  title: string;
  popularity: number;
  vote_average: number;
  vote_count: number;
}
export interface SavedMovie {
  id: number;
  userId: string;
  movieId: number;
  movieData: Movie;
  createdAt: string;
}
export interface LikedMovie {
  id: number;
  movieId: number;
  movieData: Movie;
  createdAt: string;
  movieId: number;
}
export interface User {
  name: string;
  email: string;
  password: string;
  avatar: string;
  resetPass?: number;
  createdAt?: number;
  updatedAt?: number;
  _id: string;
}
export interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string;
  poster_path: string;
  release_date: string;
  runtime: number;
  vote_average: number;
  vote_count: number;
  tagline: string;
  status: string;
  budget: number;
  revenue: number;
  genres: { id: number; name: string }[];
  credits: {
    cast: CastMember[];
    crew: CrewMember[];
  };
  videos: {
    results: Video[];
  };
  images: {
    backdrops: Image[];
    posters: Image[];
  };
  imdb_id: string;
  homepage: string;
}
export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}
export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}
export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}
export interface Image {
  file_path: string;
  width: number;
  height: number;
}