export type ContentType = 'movie' | 'tv' | 'kdrama' | 'anime' | 'livetv';

export interface MediaItem {
  id: number;
  title: string;
  name?: string; // TMDB uses name for TV shows
  original_title?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  media_type: ContentType;
  vote_average: number;
  vote_count?: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
  runtime?: number;
  number_of_seasons?: number;
  number_of_episodes?: number;
  quality?: '4K' | '1080p' | 'HD';
  tagline?: string;
  status?: string;
  origin_country?: string[];
  original_language?: string;
}

export interface Season {
  id: number;
  season_number: number;
  name: string;
  episode_count: number;
  poster_path: string | null;
  overview?: string;
  air_date?: string;
}

export interface Episode {
  id: number;
  episode_number: number;
  season_number: number;
  name: string;
  overview: string;
  still_path: string | null;
  air_date: string;
  vote_average: number;
  runtime?: number;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface VideoServer {
  id: string;
  name: string;
  quality: string;
  speed: 'Ultra Fast' | 'Fast' | 'Normal';
  reliability: number; // 0 - 100%
  description: string;
  isAdFree?: boolean;
}

export interface LiveChannel {
  id: string;
  name: string;
  category: 'Sports' | 'News' | 'Movies' | 'Entertainment' | 'Kids' | 'Anime';
  logo: string;
  streamUrl: string;
  backupUrl?: string;
  currentProgram: string;
  country: string;
  isLive: boolean;
}

export interface WatchlistItem {
  id: number;
  media_type: ContentType;
  title: string;
  poster_path: string | null;
  vote_average: number;
  addedAt: number;
}

export interface WatchHistoryItem {
  id: number;
  media_type: ContentType;
  title: string;
  poster_path: string | null;
  season?: number;
  episode?: number;
  episodeTitle?: string;
  progressPercent: number; // 0 - 100
  lastWatchedAt: number;
}

export interface FilterOptions {
  type: ContentType | 'all';
  genreId?: number;
  year?: string;
  sortBy: 'popularity.desc' | 'vote_average.desc' | 'release_date.desc';
  searchQuery: string;
}
