import { VideoServer, ContentType } from '../types';

export const SERVERS: VideoServer[] = [
  {
    id: 'vidlink',
    name: 'Server 1 (VidLink Ultra)',
    quality: '4K / 1080p',
    speed: 'Ultra Fast',
    reliability: 99,
    description: 'Primary high-speed HTML5 player with customizable subtitles and audio tracks.',
  },
  {
    id: 'vidsrc-me',
    name: 'Server 2 (VidSrc Pro)',
    quality: '1080p / 60fps',
    speed: 'Ultra Fast',
    reliability: 98,
    description: 'Reliable global CDN source with multi-language subtitle support.',
  },
  {
    id: 'vidsrc-to',
    name: 'Server 3 (VidSrc TO HD)',
    quality: '1080p / 720p',
    speed: 'Fast',
    reliability: 97,
    description: 'Multi-server mirror with automatic fallback and fast buffering.',
  },
  {
    id: 'vidsrc-pm',
    name: 'Server 4 (VidSrc PM)',
    quality: '1080p HD',
    speed: 'Fast',
    reliability: 96,
    description: 'High availability mirror for latest movies and trending series.',
  },
  {
    id: 'vidsrc-in',
    name: 'Server 5 (VidSrc IN)',
    quality: '1080p',
    speed: 'Fast',
    reliability: 95,
    description: 'Stable stream source supporting direct TV episode navigation.',
  },
  {
    id: 'rivestream',
    name: 'Server 6 (RiveStream HD)',
    quality: '1080p / 720p',
    speed: 'Fast',
    reliability: 94,
    description: 'Multiple backup servers for popular Hollywood & Asian content.',
  },
  {
    id: '2embed',
    name: 'Server 7 (2Embed)',
    quality: '1080p / 720p',
    speed: 'Fast',
    reliability: 92,
    description: 'Global content mirror with fast load speeds across regions.',
  },
  {
    id: 'vidsrc-net',
    name: 'Server 8 (VidSrc Net)',
    quality: '720p / 1080p',
    speed: 'Normal',
    reliability: 90,
    description: 'Classic embed server with extensive back-catalog movies.',
  },
];

export function getEmbedUrl(
  serverId: string,
  mediaType: ContentType,
  tmdbId: number,
  season: number = 1,
  episode: number = 1
): string {
  const isMovie = mediaType === 'movie';

  switch (serverId) {
    case 'vidlink':
      return isMovie
        ? `https://vidlink.pro/movie/${tmdbId}?primaryColor=F9E154&secondaryColor=E94B3C`
        : `https://vidlink.pro/tv/${tmdbId}/${season}/${episode}?primaryColor=F9E154&secondaryColor=E94B3C`;

    case 'vidsrc-me':
    case 'vidsrc-pro':
      return isMovie
        ? `https://vidsrc.me/embed/movie?tmdb=${tmdbId}`
        : `https://vidsrc.me/embed/tv?tmdb=${tmdbId}&season=${season}&episode=${episode}`;

    case 'vidsrc-to':
      return isMovie
        ? `https://vidsrc.to/embed/movie/${tmdbId}`
        : `https://vidsrc.to/embed/tv/${tmdbId}/${season}/${episode}`;

    case 'vidsrc-pm':
      return isMovie
        ? `https://vidsrc.pm/embed/movie?tmdb=${tmdbId}`
        : `https://vidsrc.pm/embed/tv?tmdb=${tmdbId}&season=${season}&episode=${episode}`;

    case 'vidsrc-in':
      return isMovie
        ? `https://vidsrc.in/embed/movie?tmdb=${tmdbId}`
        : `https://vidsrc.in/embed/tv?tmdb=${tmdbId}&season=${season}&episode=${episode}`;

    case 'rivestream':
      return isMovie
        ? `https://rivestream.live/embed/movie/${tmdbId}`
        : `https://rivestream.live/embed/tv/${tmdbId}/${season}/${episode}`;

    case '2embed':
      return isMovie
        ? `https://www.2embed.cc/embed/${tmdbId}`
        : `https://www.2embed.cc/embedtv/${tmdbId}&s=${season}&e=${episode}`;

    case 'vidsrc-net':
      return isMovie
        ? `https://vidsrc.net/embed/movie/${tmdbId}`
        : `https://vidsrc.net/embed/tv?tmdb=${tmdbId}&season=${season}&episode=${episode}`;

    default:
      return isMovie
        ? `https://vidsrc.me/embed/movie?tmdb=${tmdbId}`
        : `https://vidsrc.me/embed/tv?tmdb=${tmdbId}&season=${season}&episode=${episode}`;
  }
}
