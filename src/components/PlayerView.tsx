import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Server,
  RotateCw,
  Star,
  Bookmark,
  Share2,
  Download,
  Info,
  ShieldCheck,
  Check,
  Film,
  Tv,
  Maximize2,
  ExternalLink
} from 'lucide-react';
import { MediaItem, ContentType, CastMember } from '../types';
import { SERVERS, getEmbedUrl } from '../services/servers';
import { fetchCast, fetchTrailerKey, getImageUrl } from '../services/tmdb';
import { EpisodePicker } from './EpisodePicker';

interface PlayerViewProps {
  media: MediaItem;
  onBack: () => void;
  defaultServerId: string;
  isBookmarked: boolean;
  onToggleBookmark: (item: MediaItem, e: React.MouseEvent) => void;
  onSelectMedia: (item: MediaItem) => void;
  onOpenTrailer: (item: MediaItem) => void;
  onUpdateHistory: (season?: number, episode?: number, episodeTitle?: string) => void;
}

export const PlayerView: React.FC<PlayerViewProps> = ({
  media,
  onBack,
  defaultServerId,
  isBookmarked,
  onToggleBookmark,
  onSelectMedia,
  onOpenTrailer,
  onUpdateHistory,
}) => {
  const [activeServerId, setActiveServerId] = useState<string>(() =>
    SERVERS.some(s => s.id === defaultServerId) ? defaultServerId : SERVERS[0].id
  );
  const [seasonNum, setSeasonNum] = useState<number>(1);
  const [episodeNum, setEpisodeNum] = useState<number>(1);
  const [episodeTitle, setEpisodeTitle] = useState<string>('');
  const [loadingIframe, setLoadingIframe] = useState<boolean>(true);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);
  const [showDownloadModal, setShowDownloadModal] = useState<boolean>(false);

  const isTvShow = media.media_type === 'tv' || media.media_type === 'kdrama' || media.media_type === 'anime';

  useEffect(() => {
    let isMounted = true;
    fetchCast(media.id, media.media_type).then(data => {
      if (isMounted) setCast(data);
    });
    return () => {
      isMounted = false;
    };
  }, [media]);

  // Ensure loading spinner auto-hides after 1.5s so it never gets stuck blocking player
  useEffect(() => {
    setLoadingIframe(true);
    const timer = setTimeout(() => {
      setLoadingIframe(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [activeServerId, media.id, seasonNum, episodeNum]);

  const embedUrl = getEmbedUrl(activeServerId, media.media_type, media.id, seasonNum, episodeNum);

  const handleServerChange = (srvId: string) => {
    setLoadingIframe(true);
    setActiveServerId(srvId);
  };

  const handleEpisodeSelect = (s: number, e: number, epTitle: string) => {
    setLoadingIframe(true);
    setSeasonNum(s);
    setEpisodeNum(e);
    setEpisodeTitle(epTitle);
    onUpdateHistory(s, e, epTitle);
  };

  const handleReload = () => {
    setLoadingIframe(true);
    const iframe = document.getElementById('cinehd-player-iframe') as HTMLIFrameElement;
    if (iframe) {
      iframe.src = embedUrl;
    }
  };

  const handleOpenNewTab = () => {
    window.open(embedUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const activeServerObj = SERVERS.find(s => s.id === activeServerId) || SERVERS[0];
  const year = (media.release_date || media.first_air_date || '').slice(0, 4);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Header Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/5 border border-white/10 p-3 md:p-4 rounded shadow-xl">
        <button
          onClick={onBack}
          className="px-4 py-2 border-2 border-white/20 hover:border-yellow-400 hover:text-yellow-400 text-white font-black uppercase tracking-wider text-xs flex items-center gap-2 transition-all bg-white/5"
        >
          <ArrowLeft className="w-4 h-4 text-yellow-400" /> Back to Browse
        </button>

        <div className="flex items-center space-x-2 text-xs text-white/80 min-w-0">
          <span className="font-black uppercase tracking-tight text-white text-sm md:text-base truncate max-w-[200px] sm:max-w-xs md:max-w-md">
            {media.title}
          </span>
          {isTvShow && (
            <span className="px-2 py-0.5 rounded-sm bg-yellow-400 text-black font-black text-[10px] tracking-wider uppercase">
              S{seasonNum}:E{episodeNum}
            </span>
          )}
          <span className="px-2 py-0.5 rounded-sm bg-white/10 text-white/70 text-[10px] uppercase font-black">
            {media.quality || '4K'}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleOpenNewTab}
            className="px-3 py-1.5 bg-yellow-400/10 border border-yellow-400/40 text-yellow-400 hover:bg-yellow-400 hover:text-black rounded transition-all text-xs font-black uppercase tracking-wider flex items-center gap-1.5"
            title="Open video player directly in new tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open in Tab</span>
          </button>
          <button
            onClick={handleReload}
            className="p-2 bg-white/5 border border-white/10 hover:border-yellow-400 text-white/80 hover:text-yellow-400 rounded transition-colors text-xs flex items-center gap-1"
            title="Reload Player Stream"
          >
            <RotateCw className={`w-4 h-4 ${loadingIframe ? 'animate-spin text-yellow-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Server Switcher Toolbar */}
      <div className="bg-white/5 border border-white/10 rounded p-3 md:p-4 space-y-2">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="font-black uppercase tracking-widest text-white/50 flex items-center gap-2">
            <Server className="w-4 h-4 text-yellow-400" /> Select Streaming Mirror:
          </span>
          <span className="text-white/60 text-[11px] hidden sm:inline uppercase font-bold tracking-wider">
            Active: <strong className="text-yellow-400">{activeServerObj.name}</strong> ({activeServerObj.speed})
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full custom-scrollbar">
          {SERVERS.map(srv => {
            const isActive = srv.id === activeServerId;
            return (
              <button
                key={srv.id}
                onClick={() => handleServerChange(srv.id)}
                className={`server-pill px-4 py-2 rounded text-xs font-bold uppercase transition shrink-0 flex items-center gap-2 ${
                  isActive
                    ? 'border-yellow-400 text-yellow-400 bg-yellow-400/10'
                    : 'text-white/70'
                }`}
              >
                <span>{srv.name}</span>
                <span className={`text-[9px] px-1 py-0.2 rounded font-black ${isActive ? 'bg-yellow-400 text-black' : 'bg-white/10 text-white/50'}`}>
                  {srv.speed}
                </span>
              </button>
            );
          })}
        </div>
      </div>


      {/* Player Iframe Window */}
      <div className="relative aspect-video w-full rounded overflow-hidden bg-black border border-white/10 shadow-2xl">
        {loadingIframe && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#080808]/90 backdrop-blur-sm p-4 text-center">
            <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-3"></div>
            <span className="text-yellow-400 font-black text-sm uppercase tracking-wider">Connecting to {activeServerObj.name}...</span>
            <p className="text-white/50 text-xs mt-1 max-w-md font-medium uppercase tracking-wider">Resolving high-speed video mirror node</p>
          </div>
        )}

        <iframe
          id="cinehd-player-iframe"
          src={embedUrl}
          title={media.title}
          onLoad={() => setLoadingIframe(false)}
          className="w-full h-full border-0"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
        ></iframe>
      </div>

      {/* Server Notice Banner */}
      <div className="bg-white/5 border border-white/10 rounded p-3 flex flex-wrap items-center justify-between gap-2 text-xs text-white/70">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-yellow-400 shrink-0" />
          <span>If player doesn't load or buffers, try switching servers above (<strong>Server 1 VidSrc Pro</strong> or <strong>Server 2 VidSrc TO</strong>).</span>
        </div>
        <button
          onClick={handleOpenNewTab}
          className="text-yellow-400 hover:underline font-bold text-[11px] uppercase tracking-wider flex items-center gap-1"
        >
          <ExternalLink className="w-3 h-3" /> Pop-out Stream Player
        </button>
      </div>

      {/* Action Buttons & Title Info Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/5 border border-white/10 p-4 md:p-6 rounded">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white flex items-center gap-2">
            {media.title}
          </h1>
          {isTvShow && episodeTitle && (
            <p className="text-yellow-400 font-extrabold uppercase tracking-wider text-xs">
              S{seasonNum}:E{episodeNum} - {episodeTitle}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-3 text-xs text-white/50 pt-1">
            <span className="flex items-center gap-1 text-yellow-400 font-black">
              <Star className="w-3.5 h-3.5 fill-yellow-400" /> {media.vote_average || '8.2'}
            </span>
            <span className="font-bold">{year}</span>
            <span className="uppercase px-2 py-0.5 bg-white/10 rounded-sm text-[10px] font-black text-white/80 flex items-center gap-1">
              {media.media_type === 'movie' ? <Film className="w-3 h-3 text-yellow-400" /> : <Tv className="w-3 h-3 text-yellow-400" />}
              {media.media_type}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={e => onToggleBookmark(media, e)}
            className={`px-5 py-3 border-2 font-black uppercase text-xs tracking-wider transition-all flex items-center gap-1.5 ${
              isBookmarked
                ? 'bg-red-600 text-white border-red-500'
                : 'border-white/20 text-white hover:border-yellow-400 hover:text-yellow-400 bg-white/5'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            {isBookmarked ? 'In My List' : 'Add to List'}
          </button>

          <button
            onClick={() => onOpenTrailer(media)}
            className="px-5 py-3 border-2 border-white/20 hover:border-yellow-400 hover:text-yellow-400 bg-white/5 text-white font-black uppercase tracking-wider text-xs transition-colors flex items-center gap-1.5"
          >
            <Info className="w-4 h-4 text-yellow-400" /> Trailer
          </button>

          <button
            onClick={() => setShowDownloadModal(true)}
            className="px-5 py-3 border-2 border-yellow-400/50 bg-yellow-400/10 hover:bg-yellow-400 hover:text-black text-yellow-400 font-black uppercase tracking-wider text-xs transition-colors flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" /> Download
          </button>

          <button
            onClick={handleShare}
            className="p-3 bg-white/5 border-2 border-white/20 hover:border-yellow-400 text-white hover:text-yellow-400 text-xs transition-colors"
            title="Share Link"
          >
            {copiedShare ? <Check className="w-4 h-4 text-yellow-400" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Episode Picker for TV Series */}
      {isTvShow && (
        <EpisodePicker
          tvId={media.id}
          selectedSeason={seasonNum}
          selectedEpisode={episodeNum}
          onSelectEpisode={handleEpisodeSelect}
        />
      )}

      {/* Synopsis & Details */}
      <div className="bg-white/5 border border-white/10 rounded p-6 space-y-4">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/50 border-b border-white/10 pb-2">Overview & Storyline</h3>
        <p className="text-white/80 text-sm leading-relaxed font-medium">{media.overview}</p>

        {media.genres && media.genres.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {media.genres.map(g => (
              <span key={g.id} className="px-3 py-1 bg-white/5 text-white/80 text-xs font-bold uppercase rounded-sm border border-white/10">
                {g.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Cast & Crew Section */}
      {cast.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded p-6 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/50 border-b border-white/10 pb-2">Top Cast</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {cast.map(c => (
              <div key={c.id} className="flex flex-col items-center text-center bg-[#080808] border border-white/10 p-3 rounded">
                <img
                  src={getImageUrl(c.profile_path)}
                  alt={c.name}
                  className="w-16 h-16 rounded-full object-cover mb-2 border border-white/20"
                />
                <span className="text-xs font-bold uppercase text-white line-clamp-1">{c.name}</span>
                <span className="text-[10px] text-white/50 font-medium uppercase line-clamp-1 mt-0.5">{c.character}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Download Simulator Modal */}
      {showDownloadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#080808] border border-white/10 rounded p-6 shadow-2xl text-white">
            <h3 className="text-base font-black uppercase tracking-tight text-white mb-1 flex items-center gap-2">
              <Download className="w-5 h-5 text-yellow-400" /> Download {media.title}
            </h3>
            <p className="text-xs text-white/50 font-medium mb-4 uppercase tracking-wider">Select quality resolution and subtitle track for offline viewing</p>

            <div className="space-y-2 text-xs mb-6">
              <div className="p-3 bg-white/5 border border-white/10 rounded flex items-center justify-between hover:border-yellow-400/50 cursor-pointer transition-colors">
                <div>
                  <span className="font-bold text-white uppercase block">4K Ultra HD (.MP4)</span>
                  <span className="text-white/50 text-[11px] font-medium">Bitrate: 22 Mbps • 2160p</span>
                </div>
                <span className="px-2.5 py-1 bg-yellow-400 text-black font-black rounded-sm text-[11px]">~4.2 GB</span>
              </div>

              <div className="p-3 bg-white/5 border border-white/10 rounded flex items-center justify-between hover:border-yellow-400/50 cursor-pointer transition-colors">
                <div>
                  <span className="font-bold text-white uppercase block">1080p Full HD (.MP4)</span>
                  <span className="text-white/50 text-[11px] font-medium">Bitrate: 8 Mbps • Multi-Subtitles</span>
                </div>
                <span className="px-2.5 py-1 bg-white/10 text-yellow-400 font-bold rounded-sm text-[11px]">~1.8 GB</span>
              </div>

              <div className="p-3 bg-white/5 border border-white/10 rounded flex items-center justify-between hover:border-yellow-400/50 cursor-pointer transition-colors">
                <div>
                  <span className="font-bold text-white uppercase block">720p HD Standard (.MP4)</span>
                  <span className="text-white/50 text-[11px] font-medium">Optimized for mobile & low data</span>
                </div>
                <span className="px-2.5 py-1 bg-white/10 text-white/70 font-bold rounded-sm text-[11px]">~850 MB</span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowDownloadModal(false)}
                className="px-6 py-2.5 border border-white/20 hover:border-yellow-400 text-white font-black uppercase tracking-wider text-xs bg-white/5"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
