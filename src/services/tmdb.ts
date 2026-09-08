import { MediaItem, Season, Episode, CastMember, ContentType } from '../types';

const DEFAULT_TMDB_KEY = '4e44d9029b1270a757cddc766a1bcb63';
const BACKUP_TMDB_KEYS = [
  '4e44d9029b1270a757cddc766a1bcb63',
  '3fd1be82150437ca50d5857969704d08'
];
const TMDB_BASE = 'https://api.themoviedb.org/3';
const IMAGE_BASE_W500 = 'https://image.tmdb.org/t/p/w500';
const IMAGE_BASE_ORIGINAL = 'https://image.tmdb.org/t/p/original';

export function getTMDBKey(): string {
  const customKey = localStorage.getItem('cinehd_tmdb_key');
  return customKey && customKey.trim().length > 0 ? customKey.trim() : DEFAULT_TMDB_KEY;
}

export function setTMDBKey(key: string): void {
  if (key.trim()) {
    localStorage.setItem('cinehd_tmdb_key', key.trim());
  } else {
    localStorage.removeItem('cinehd_tmdb_key');
  }
}

async function fetchTMDB(endpoint: string, params: string = ''): Promise<any> {
  const customKey = localStorage.getItem('cinehd_tmdb_key');
  const keysToTry = customKey && customKey.trim() ? [customKey.trim(), ...BACKUP_TMDB_KEYS] : BACKUP_TMDB_KEYS;

  for (const apiKey of keysToTry) {
    try {
      const url = `${TMDB_BASE}${endpoint}?api_key=${apiKey}&language=en-US${params ? `&${params}` : ''}`;
      const res = await fetch(url);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Continue to next key if fetch throws or fails
    }
  }
  throw new Error(`TMDB request failed for endpoint ${endpoint}`);
}

export function getImageUrl(path: string | null, size: 'w500' | 'original' = 'w500'): string {
  if (!path) {
    return 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80';
  }
  if (path.startsWith('http')) return path;
  const base = size === 'original' ? IMAGE_BASE_ORIGINAL : IMAGE_BASE_W500;
  return `${base}${path}`;
}

export const GENRES: { [key: number]: string } = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
  10759: 'Action & Adventure',
  10762: 'Kids',
  10763: 'News',
  10764: 'Reality',
  10765: 'Sci-Fi & Fantasy',
  10766: 'Soap',
  10767: 'Talk',
  10768: 'War & Politics',
};

// High-quality static fallbacks if TMDB endpoint is unreachable or rate limited
const FALLBACK_MEDIA: MediaItem[] = [
  {
    id: 550988,
    title: 'Free Guy',
    overview: 'A bank teller discovers he is actually a background player in an open-world video game, and decides to become the hero of his own story.',
    poster_path: '/xmbU4JT23S3KyS23OFqA95sN3yX.jpg',
    backdrop_path: '/8Y43POKjjKDGI9A7K0JuA3P0pt.jpg',
    media_type: 'movie',
    vote_average: 7.6,
    release_date: '2021-08-11',
    genre_ids: [28, 35, 878],
    quality: '4K',
    tagline: 'Life’s too short to be a background character.',
  },
  {
    id: 93405,
    title: 'Squid Game',
    name: 'Squid Game',
    overview: 'Hundreds of cash-strapped players accept a strange invitation to compete in children\'s games. Inside, a tempting prize awaits with deadly high stakes.',
    poster_path: '/dL11A9Z8M3IO23L3sL516E.jpg',
    backdrop_path: '/qw3O92L93Jk2lS8p3J0s.jpg',
    media_type: 'kdrama',
    vote_average: 8.3,
    first_air_date: '2021-09-17',
    genre_ids: [18, 9648, 10759],
    number_of_seasons: 2,
    number_of_episodes: 16,
    quality: '4K',
    origin_country: ['KR'],
    tagline: '45.6 Billion Won is Child\'s Play.',
  },
  {
    id: 37854,
    title: 'One Piece',
    name: 'One Piece',
    overview: 'Monkey D. Luffy sets off on an epic journey across the high seas in search of the legendary One Piece treasure to become the Pirate King.',
    poster_path: '/cMD9Y21StA23S2390S20.jpg',
    backdrop_path: '/2rm2349S20S2938Jk20.jpg',
    media_type: 'anime',
    vote_average: 8.7,
    first_air_date: '1999-10-20',
    genre_ids: [16, 10759, 35],
    number_of_seasons: 21,
    number_of_episodes: 1100,
    quality: 'HD',
    origin_country: ['JP'],
  },
  {
    id: 157336,
    title: 'Interstellar',
    overview: 'The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.',
    poster_path: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    backdrop_path: '/xJHokMbljvjADYdit5fK1P3S2so.jpg',
    media_type: 'movie',
    vote_average: 8.4,
    release_date: '2014-11-05',
    genre_ids: [12, 18, 878],
    quality: '4K',
    tagline: 'Mankind was born on Earth. It was never meant to die here.',
  },
  {
    id: 1399,
    title: 'Game of Thrones',
    name: 'Game of Thrones',
    overview: 'Seven noble families fight for control of the mythical land of Westeros. Friction between the houses leads to full-scale war.',
    poster_path: '/1XS1A3C2W23S23Jk20.jpg',
    backdrop_path: '/suA223KS930SK29.jpg',
    media_type: 'tv',
    vote_average: 8.4,
    first_air_date: '2011-04-17',
    genre_ids: [10765, 18, 10759],
    number_of_seasons: 8,
    number_of_episodes: 73,
    quality: '4K',
  },
  {
    id: 60574,
    title: 'Peaky Blinders',
    name: 'Peaky Blinders',
    overview: 'A gangster family epic set in 1919 Birmingham, England and centered on a gang who sew razor blades in the peaks of their caps, and their ambitious boss Tommy Shelby.',
    poster_path: '/v923k2S0S20S39J20.jpg',
    backdrop_path: '/v923k2S0S20S39J20.jpg',
    media_type: 'tv',
    vote_average: 8.5,
    first_air_date: '2013-09-12',
    genre_ids: [18, 80],
    number_of_seasons: 6,
    number_of_episodes: 36,
    quality: '4K',
  },
  {
    id: 120089,
    title: 'Spy x Family',
    name: 'Spy x Family',
    overview: 'A spy on an undercover mission gets married and adopts a child as part of his cover. His wife and daughter have secrets of their own, and none of them know each other\'s true identity.',
    poster_path: '/1230S20SK20S29.jpg',
    backdrop_path: '/1230S20SK20S29.jpg',
    media_type: 'anime',
    vote_average: 8.6,
    first_air_date: '2022-04-09',
    genre_ids: [16, 35, 10759],
    number_of_seasons: 2,
    number_of_episodes: 37,
    quality: 'HD',
    origin_country: ['JP'],
  },
  {
    id: 110492,
    title: 'Crash Landing on You',
    name: 'Crash Landing on You',
    overview: 'A South Korean heiress accidentally paraglides into North Korea and falls into the life of an army officer who decides he will help her hide.',
    poster_path: '/920SK20SK20S29.jpg',
    backdrop_path: '/920SK20SK20S29.jpg',
    media_type: 'kdrama',
    vote_average: 8.7,
    first_air_date: '2019-12-14',
    genre_ids: [18, 35, 10749],
    number_of_seasons: 1,
    number_of_episodes: 16,
    quality: 'HD',
    origin_country: ['KR'],
  }
];

export async function fetchTrending(type: 'all' | 'movie' | 'tv' = 'all'): Promise<MediaItem[]> {
  try {
    const data = await fetchTMDB(`/trending/${type === 'all' ? 'all' : type}/day`);
    return (data.results || []).map((item: any) => normalizeMediaItem(item, type === 'all' ? 'movie' : type));
  } catch (err) {
    console.warn('TMDB API fallback active for trending');
    return FALLBACK_MEDIA;
  }
}

export async function fetchPopularMovies(page = 1): Promise<MediaItem[]> {
  try {
    const data = await fetchTMDB('/movie/popular', `page=${page}`);
    return (data.results || []).map((item: any) => normalizeMediaItem(item, 'movie'));
  } catch {
    return FALLBACK_MEDIA.filter(m => m.media_type === 'movie');
  }
}

export async function fetchPopularTVShows(page = 1): Promise<MediaItem[]> {
  try {
    const data = await fetchTMDB('/tv/popular', `page=${page}`);
    return (data.results || []).map((item: any) => normalizeMediaItem(item, 'tv'));
  } catch {
    return FALLBACK_MEDIA.filter(m => m.media_type === 'tv' || m.media_type === 'kdrama');
  }
}

export async function fetchAsianDramas(page = 1): Promise<MediaItem[]> {
  try {
    const data = await fetchTMDB('/discover/tv', `with_origin_country=KR|JP|CN|TW|TH&sort_by=popularity.desc&page=${page}`);
    return (data.results || []).map((item: any) => {
      const norm = normalizeMediaItem(item, 'tv');
      norm.media_type = 'kdrama';
      return norm;
    });
  } catch {
    return FALLBACK_MEDIA.filter(m => m.media_type === 'kdrama');
  }
}

export async function fetchAnime(page = 1): Promise<MediaItem[]> {
  try {
    const data = await fetchTMDB('/discover/tv', `with_genres=16&with_origin_country=JP&sort_by=popularity.desc&page=${page}`);
    return (data.results || []).map((item: any) => {
      const norm = normalizeMediaItem(item, 'tv');
      norm.media_type = 'anime';
      return norm;
    });
  } catch {
    return FALLBACK_MEDIA.filter(m => m.media_type === 'anime');
  }
}

export async function searchMedia(query: string): Promise<MediaItem[]> {
  if (!query || !query.trim()) return [];
  try {
    const data = await fetchTMDB('/search/multi', `query=${encodeURIComponent(query)}&page=1`);
    return (data.results || [])
      .filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv')
      .map((item: any) => normalizeMediaItem(item, item.media_type));
  } catch {
    return FALLBACK_MEDIA.filter(m => 
      m.title.toLowerCase().includes(query.toLowerCase()) || 
      (m.name && m.name.toLowerCase().includes(query.toLowerCase()))
    );
  }
}

export async function fetchMediaDetails(id: number, mediaType: ContentType): Promise<MediaItem | null> {
  const endpointType = (mediaType === 'kdrama' || mediaType === 'anime') ? 'tv' : mediaType;
  try {
    const item = await fetchTMDB(`/${endpointType}/${id}`, 'append_to_response=videos,credits,similar');
    const norm = normalizeMediaItem(item, mediaType);
    norm.runtime = item.runtime || (item.episode_run_time ? item.episode_run_time[0] : undefined);
    norm.number_of_seasons = item.number_of_seasons;
    norm.number_of_episodes = item.number_of_episodes;
    norm.status = item.status;
    norm.tagline = item.tagline;
    norm.genres = item.genres;
    return norm;
  } catch {
    const found = FALLBACK_MEDIA.find(m => m.id === id);
    return found || FALLBACK_MEDIA[0];
  }
}

export async function fetchSeasons(tvId: number): Promise<Season[]> {
  try {
    const data = await fetchTMDB(`/tv/${tvId}`);
    return (data.seasons || []).filter((s: any) => s.season_number > 0);
  } catch {
    return [
      { id: 1, season_number: 1, name: 'Season 1', episode_count: 10, poster_path: null, overview: 'First Season' },
      { id: 2, season_number: 2, name: 'Season 2', episode_count: 10, poster_path: null, overview: 'Second Season' }
    ];
  }
}

export async function fetchEpisodes(tvId: number, seasonNumber: number): Promise<Episode[]> {
  try {
    const data = await fetchTMDB(`/tv/${tvId}/season/${seasonNumber}`);
    return (data.episodes || []).map((ep: any) => ({
      id: ep.id,
      episode_number: ep.episode_number,
      season_number: ep.season_number,
      name: ep.name || `Episode ${ep.episode_number}`,
      overview: ep.overview || 'No description available for this episode.',
      still_path: ep.still_path,
      air_date: ep.air_date || '',
      vote_average: ep.vote_average || 8.0,
      runtime: ep.runtime,
    }));
  } catch {
    return Array.from({ length: 10 }, (_, i) => ({
      id: 100 + i,
      episode_number: i + 1,
      season_number: seasonNumber,
      name: `Episode ${i + 1}`,
      overview: `Episode ${i + 1} description and high-definition stream mirror source.`,
      still_path: null,
      air_date: '2024-01-01',
      vote_average: 8.2,
      runtime: 45,
    }));
  }
}

export async function fetchCast(id: number, mediaType: ContentType): Promise<CastMember[]> {
  const endpointType = (mediaType === 'kdrama' || mediaType === 'anime') ? 'tv' : mediaType;
  try {
    const data = await fetchTMDB(`/${endpointType}/${id}/credits`);
    return (data.cast || []).slice(0, 10).map((c: any) => ({
      id: c.id,
      name: c.name,
      character: c.character,
      profile_path: c.profile_path,
    }));
  } catch {
    return [
      { id: 1, name: 'Main Actor', character: 'Lead Character', profile_path: null },
      { id: 2, name: 'Co-Star', character: 'Supporting Character', profile_path: null },
    ];
  }
}

export async function fetchTrailerKey(id: number, mediaType: ContentType): Promise<string | null> {
  const endpointType = (mediaType === 'kdrama' || mediaType === 'anime') ? 'tv' : mediaType;
  try {
    const data = await fetchTMDB(`/${endpointType}/${id}/videos`);
    const trailer = (data.results || []).find((v: any) => v.type === 'Trailer' && v.site === 'YouTube');
    return trailer ? trailer.key : (data.results?.[0]?.key || null);
  } catch {
    return null;
  }
}

function normalizeMediaItem(item: any, fallbackType: ContentType = 'movie'): MediaItem {
  const media_type = item.media_type || (item.first_air_date ? 'tv' : fallbackType);
  const title = item.title || item.name || item.original_title || 'Untitled Title';
  const vote = Math.round((item.vote_average || 8.0) * 10) / 10;
  
  return {
    id: item.id,
    title,
    name: item.name,
    original_title: item.original_title,
    overview: item.overview || 'No overview available for this title.',
    poster_path: item.poster_path,
    backdrop_path: item.backdrop_path,
    media_type: media_type as ContentType,
    vote_average: vote,
    vote_count: item.vote_count,
    release_date: item.release_date,
    first_air_date: item.first_air_date,
    genre_ids: item.genre_ids,
    quality: vote > 8.0 ? '4K' : vote > 7.0 ? '1080p' : 'HD',
    origin_country: item.origin_country,
    original_language: item.original_language,
  };
}
