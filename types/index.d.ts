export interface Movie {
  adult?: boolean;
  backdrop_path?: string | null;
  poster_path?: string | null;
  release_date?: string;
  genre_ids?: number[];
  video?: boolean;
  id: number;
  original_language?: string;
  original_title?: string;
  overview?: string;
  title?: string;
  popularity?: number;
  vote_average?: number;
  vote_count?: number;
}

export interface SavedMovie extends Movie {
  _id?: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LikedMovie extends Movie {
  _id?: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  _id: string;
  id?: string;
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  resetPass?: string;
  role: string;
  isBanned?: boolean;
  provider: string;
  createdAt?: string;
  updatedAt?: string;
  likedMovie?: string[];
  savedMovie?: string[];
}

export interface AdminStats {
  totalUsers: number;
  totalAdmins: number;
  totalBanned: number;
  totalLikes: number;
  totalSaves: number;
  providers: {
    local: number;
    google: number;
    github: number;
  };
  topLikedMovies: {
    _id: number;
    title?: string;
    poster_path?: string | null;
    backdrop_path?: string | null;
    vote_average?: number;
    count: number;
  }[];
  topSavedMovies: {
    _id: number;
    title?: string;
    poster_path?: string | null;
    backdrop_path?: string | null;
    vote_average?: number;
    count: number;
  }[];
  system: {
    uptime: number;
    nodeVersion: string;
    platform: string;
    memoryUsageMB: number;
    mongoStatus: string;
  };
}

export interface MovieDetails {
  id: number;
  title: string;
  overview?: string;
  backdrop_path?: string | null;
  poster_path?: string | null;
  release_date?: string;
  runtime?: number;
  vote_average?: number;
  vote_count?: number;
  tagline?: string;
  status?: string;
  budget?: number;
  revenue?: number;
  genres?: { id: number; name: string }[];
  credits?: {
    cast: CastMember[];
    crew: CrewMember[];
  };
  videos?: {
    results: Video[];
  };
  images?: {
    backdrops: Image[];
    posters: Image[];
  };
  imdb_id?: string;
  homepage?: string;
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
