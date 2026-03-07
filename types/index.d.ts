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