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
  Shield,
  ShieldCheck,
  CheckCircle2,
  Check,
  Film,
  Tv,
  Maximize2,
  ExternalLink,
  X,
  AlertTriangle,
  HelpCircle
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
  const [showAdTipsModal, setShowAdTipsModal] = useState<boolean>(false);

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/5 border border-white/10 p-3 sm:p-4 rounded shadow-xl">
        <div className="flex items-center justify-between sm:justify-start gap-2 min-w-0">
          <button
            onClick={onBack}
            className="min-h-[40px] px-3.5 py-2 border-2 border-white/20 hover:border-yellow-400 hover:text-yellow-400 active:border-yellow-400 text-white font-black uppercase tracking-wider text-xs flex items-center gap-1.5 transition-all bg-white/5 rounded-sm shrink-0 touch-manipulation"
          >
            <ArrowLeft className="w-4 h-4 text-yellow-400" /> <span>Back</span>
          </button>

          <div className="flex items-center space-x-1.5 text-xs text-white/80 min-w-0 truncate">
            <span className="font-black uppercase tracking-tight text-white text-sm md:text-base truncate">
              {media.title}
            </span>
            {isTvShow && (
              <span className="px-1.5 py-0.5 rounded-sm bg-yellow-400 text-black font-black text-[10px] tracking-wider uppercase shrink-0">
                S{seasonNum}:E{episodeNum}
              </span>
            )}
            <span className="hidden xs:inline-block px-1.5 py-0.5 rounded-sm bg-white/10 text-white/70 text-[10px] uppercase font-black shrink-0">
              {media.quality || '4K'}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end space-x-2 border-t sm:border-t-0 border-white/10 pt-2.5 sm:pt-0">
          <button
            onClick={() => setShowAdTipsModal(true)}
            className="flex-1 sm:flex-initial min-h-[38px] px-3 py-1.5 rounded transition-all text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 border border-yellow-400/30 text-yellow-400 bg-yellow-400/10 hover:bg-yellow-400 hover:text-black active:bg-yellow-400 active:text-black touch-manipulation"
            title="Tips for ad-free streaming, popups, and mirror servers"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Ad & Stream Tips</span>
          </button>
          <button
            onClick={handleOpenNewTab}
            className="min-h-[38px] px-3 py-1.5 bg-white/5 border border-white/20 text-white hover:border-yellow-400 hover:text-yellow-400 active:border-yellow-400 active:text-yellow-400 rounded transition-all text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 touch-manipulation"
            title="Open video player directly in new tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Open in Tab</span>
            <span className="sm:hidden">Pop-out</span>
          </button>
          <button
            onClick={handleReload}
            className="min-h-[38px] min-w-[38px] p-2 bg-white/5 border border-white/10 hover:border-yellow-400 active:border-yellow-400 text-white/80 hover:text-yellow-400 rounded transition-colors text-xs flex items-center justify-center touch-manipulation"
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

        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full touch-scroll no-scrollbar -mx-3 px-3 sm:mx-0 sm:px-0">
          {SERVERS.map(srv => {
            const isActive = srv.id === activeServerId;
            return (
              <button
                key={srv.id}
                onClick={() => handleServerChange(srv.id)}
                className={`server-pill px-3.5 sm:px-4 py-2 rounded text-xs font-bold uppercase transition shrink-0 flex items-center gap-2 min-h-[38px] touch-manipulation ${
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
          key={`${activeServerId}-${seasonNum}-${episodeNum}`}
          src={embedUrl}
          title={media.title}
          onLoad={() => setLoadingIframe(false)}
          className="w-full h-full border-0"
          allowFullScreen
          referrerPolicy="origin"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
        ></iframe>
      </div>

      {/* Server Notice Banner */}
      <div className="bg-white/5 border border-white/10 rounded p-3 flex flex-wrap items-center justify-between gap-2 text-xs text-white/70">
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>
            <strong className="text-white">Active Mirror: {activeServerObj.name}.</strong>
            {' '}Unrestricted stream embed loaded. If video buffers or has ads, switch servers above or view{' '}
            <button
              onClick={() => setShowAdTipsModal(true)}
              className="text-yellow-400 underline font-bold hover:text-yellow-300"
            >
              Ad & Streaming Tips
            </button>.
          </span>
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

        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={e => onToggleBookmark(media, e)}
            className={`min-h-[44px] px-3 sm:px-5 py-2.5 sm:py-3 border-2 font-black uppercase text-xs tracking-wider transition-all flex items-center justify-center gap-1.5 rounded-sm touch-manipulation active:scale-95 ${
              isBookmarked
                ? 'bg-red-600 text-white border-red-500'
                : 'border-white/20 text-white hover:border-yellow-400 hover:text-yellow-400 active:border-yellow-400 bg-white/5'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            <span className="truncate">{isBookmarked ? 'In List' : 'Add to List'}</span>
          </button>

          <button
            onClick={() => onOpenTrailer(media)}
            className="min-h-[44px] px-3 sm:px-5 py-2.5 sm:py-3 border-2 border-white/20 hover:border-yellow-400 hover:text-yellow-400 active:border-yellow-400 active:text-yellow-400 bg-white/5 text-white font-black uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-1.5 rounded-sm touch-manipulation active:scale-95"
          >
            <Info className="w-4 h-4 text-yellow-400" /> <span>Trailer</span>
          </button>

          <button
            onClick={() => setShowDownloadModal(true)}
            className="min-h-[44px] px-3 sm:px-5 py-2.5 sm:py-3 border-2 border-yellow-400/50 bg-yellow-400/10 hover:bg-yellow-400 hover:text-black active:bg-yellow-400 active:text-black text-yellow-400 font-black uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-1.5 rounded-sm touch-manipulation active:scale-95"
          >
            <Download className="w-4 h-4" /> <span>Download</span>
          </button>

          <button
            onClick={handleShare}
            className="min-h-[44px] p-2.5 sm:p-3 bg-white/5 border-2 border-white/20 hover:border-yellow-400 hover:text-yellow-400 active:border-yellow-400 text-white text-xs transition-colors flex items-center justify-center gap-1.5 rounded-sm touch-manipulation active:scale-95"
            title="Share Link"
          >
            {copiedShare ? <Check className="w-4 h-4 text-yellow-400" /> : <Share2 className="w-4 h-4" />}
            <span className="sm:hidden text-xs font-black uppercase">{copiedShare ? 'Copied' : 'Share'}</span>
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
      <div className="bg-white/5 border border-white/10 rounded p-4 sm:p-6 space-y-3 sm:space-y-4">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/50 border-b border-white/10 pb-2">Overview & Storyline</h3>
        <p className="text-white/80 text-xs sm:text-sm leading-relaxed font-medium">{media.overview}</p>

        {media.genres && media.genres.length > 0 && (
          <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-2">
            {media.genres.map(g => (
              <span key={g.id} className="px-2.5 py-1 bg-white/5 text-white/80 text-[11px] sm:text-xs font-bold uppercase rounded-sm border border-white/10">
                {g.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Cast & Crew Section */}
      {cast.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded p-4 sm:p-6 space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/50">Top Cast</h3>
            <span className="text-[10px] text-white/40 uppercase sm:hidden">Swipe →</span>
          </div>
          <div className="flex overflow-x-auto pb-2 gap-3 touch-scroll no-scrollbar -mx-2 px-2 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6">
            {cast.map(c => (
              <div key={c.id} className="flex flex-col items-center text-center bg-[#080808] border border-white/10 p-3 rounded shrink-0 w-28 sm:w-auto">
                <img
                  src={getImageUrl(c.profile_path)}
                  alt={c.name}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover mb-2 border border-white/20"
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
          <div className="relative w-full max-w-md bg-[#080808] border border-white/10 rounded p-5 sm:p-6 shadow-2xl text-white max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-black uppercase tracking-tight text-white mb-1 flex items-center gap-2">
              <Download className="w-5 h-5 text-yellow-400" /> Download {media.title}
            </h3>
            <p className="text-xs text-white/50 font-medium mb-4 uppercase tracking-wider">Select quality resolution and subtitle track for offline viewing</p>

            <div className="space-y-2 text-xs mb-6">
              <div className="p-3 bg-white/5 border border-white/10 rounded flex items-center justify-between hover:border-yellow-400/50 cursor-pointer transition-colors active:scale-[0.98]">
                <div>
                  <span className="font-bold text-white uppercase block">4K Ultra HD (.MP4)</span>
                  <span className="text-white/50 text-[11px] font-medium">Bitrate: 22 Mbps • 2160p</span>
                </div>
                <span className="px-2.5 py-1 bg-yellow-400 text-black font-black rounded-sm text-[11px]">~4.2 GB</span>
              </div>

              <div className="p-3 bg-white/5 border border-white/10 rounded flex items-center justify-between hover:border-yellow-400/50 cursor-pointer transition-colors active:scale-[0.98]">
                <div>
                  <span className="font-bold text-white uppercase block">1080p Full HD (.MP4)</span>
                  <span className="text-white/50 text-[11px] font-medium">Bitrate: 8 Mbps • Multi-Subtitles</span>
                </div>
                <span className="px-2.5 py-1 bg-white/10 text-yellow-400 font-bold rounded-sm text-[11px]">~1.8 GB</span>
              </div>

              <div className="p-3 bg-white/5 border border-white/10 rounded flex items-center justify-between hover:border-yellow-400/50 cursor-pointer transition-colors active:scale-[0.98]">
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
                className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 border border-white/20 hover:border-yellow-400 active:border-yellow-400 text-white font-black uppercase tracking-wider text-xs bg-white/5 touch-manipulation"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ad & Streaming Tips Modal */}
      {showAdTipsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-4 animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#080808] border border-white/10 rounded p-5 sm:p-6 shadow-2xl text-white max-h-[90vh] overflow-y-auto touch-scroll">
            <button
              onClick={() => setShowAdTipsModal(false)}
              className="absolute top-3.5 right-3.5 p-2 rounded hover:bg-white/10 text-white/50 hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-yellow-400 mb-1.5">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-white">
                Streaming & Ad Guide
              </h3>
            </div>
            <p className="text-xs text-white/50 font-medium uppercase tracking-wider mb-5">
              How video embeds work & recommendations for a 100% ad-free experience
            </p>

            <div className="space-y-4 text-xs">
              {/* Explanation of the sandboxed frame error */}
              <div className="p-3.5 bg-yellow-400/10 border border-yellow-400/30 rounded space-y-1.5">
                <div className="flex items-center gap-2 text-yellow-400 font-bold uppercase tracking-wider">
                  <Info className="w-4 h-4 shrink-0" />
                  <span>Why Did "Sandboxed Frame" Error Occur?</span>
                </div>
                <p className="text-white/80 leading-relaxed text-[11px]">
                  Third-party video streaming hosts (such as VidSrc) intentionally check for the HTML5 <code className="text-yellow-400 font-mono">sandbox</code> attribute. If sandbox is detected, their player halts and displays that warning screen. We have removed the sandbox attribute so all mirror servers load and play smoothly.
                </p>
              </div>

              {/* Tips for ad-free watching */}
              <div className="space-y-2.5">
                <h4 className="font-bold uppercase tracking-wider text-white">Best Ways to Stream Without Ads:</h4>

                <div className="p-3 bg-white/5 border border-white/10 rounded space-y-1">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>1. Use Brave Browser or uBlock Origin</span>
                  </div>
                  <p className="text-white/60 text-[11px] leading-relaxed">
                    Browser extensions like <strong>uBlock Origin</strong>, <strong>AdGuard</strong>, or using <strong>Brave Browser</strong> block pop-up ad networks at the DNS/network level without breaking the video player.
                  </p>
                </div>

                <div className="p-3 bg-white/5 border border-white/10 rounded space-y-1">
                  <div className="flex items-center gap-2 text-yellow-400 font-bold uppercase">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>2. Quick Popup Dismissal</span>
                  </div>
                  <p className="text-white/60 text-[11px] leading-relaxed">
                    On standard browsers, the host may open one pop-up tab on first play. Simply close that tab and return here to enjoy uninterrupted playback.
                  </p>
                </div>

                <div className="p-3 bg-white/5 border border-white/10 rounded space-y-1">
                  <div className="flex items-center gap-2 text-white font-bold uppercase">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>3. Try Different Mirror Servers</span>
                  </div>
                  <p className="text-white/60 text-[11px] leading-relaxed">
                    We provide 7 CDN mirrors above. If one mirror is slow or has excessive redirects, tap <strong>Server 2 (VidSrc TO)</strong>, <strong>Server 5 (RiveStream)</strong>, or <strong>Server 6 (2Embed)</strong> for an alternate stream.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowAdTipsModal(false)}
                className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 bg-yellow-400 text-black font-black uppercase tracking-wider text-xs hover:bg-yellow-300 active:bg-yellow-300 transition-colors rounded-sm touch-manipulation"
              >
                Got It, Let's Watch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
