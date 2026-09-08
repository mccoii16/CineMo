import React from 'react';
import { Bookmark, Clock, Play, Trash2, Film, Tv } from 'lucide-react';
import { MediaItem, WatchHistoryItem } from '../types';
import { MediaCard } from './MediaCard';

interface WatchlistViewProps {
  watchlistItems: MediaItem[];
  watchHistory: WatchHistoryItem[];
  onSelectMedia: (item: MediaItem) => void;
  onToggleBookmark: (item: MediaItem, e: React.MouseEvent) => void;
  onClearWatchlist: () => void;
  onClearHistory: () => void;
}

export const WatchlistView: React.FC<WatchlistViewProps> = ({
  watchlistItems,
  watchHistory,
  onSelectMedia,
  onToggleBookmark,
  onClearWatchlist,
  onClearHistory,
}) => {
  return (
    <div className="space-y-10 animate-fadeIn pb-12">
      {/* Continue Watching Section */}
      {watchHistory.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-400" /> Continue Watching
              </h2>
              <p className="text-xs text-white/50 font-medium uppercase tracking-wider">Resume your recent movies & TV episodes where you left off</p>
            </div>
            <button
              onClick={onClearHistory}
              className="text-xs text-white/50 hover:text-red-400 font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear History
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {watchHistory.map(hist => (
              <div
                key={`${hist.media_type}-${hist.id}`}
                onClick={() =>
                  onSelectMedia({
                    id: hist.id,
                    title: hist.title,
                    poster_path: hist.poster_path,
                    media_type: hist.media_type,
                    overview: '',
                    backdrop_path: null,
                    vote_average: 8.0,
                  })
                }
                className="group bg-[#080808] border border-white/10 hover:border-yellow-400/60 p-3 rounded cursor-pointer transition-all flex items-center space-x-3"
              >
                <div className="relative w-16 h-22 rounded-sm overflow-hidden shrink-0 bg-black">
                  <img src={hist.poster_path || ''} alt={hist.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-5 h-5 text-yellow-400 fill-current" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-black uppercase text-white group-hover:text-yellow-400 truncate">{hist.title}</h4>
                  {hist.season && hist.episode && (
                    <p className="text-[11px] text-yellow-400 font-black uppercase tracking-wider mt-0.5">
                      S{hist.season}:E{hist.episode} - {hist.episodeTitle || 'Episode'}
                    </p>
                  )}
                  <div className="w-full bg-white/10 rounded-none h-1.5 mt-2 overflow-hidden">
                    <div className="bg-yellow-400 h-full" style={{ width: `${hist.progressPercent || 70}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Watchlist / Saved Bookmarks */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-red-500 fill-current" /> My Saved List ({watchlistItems.length})
            </h2>
            <p className="text-xs text-white/50 font-medium uppercase tracking-wider">Your personal library of bookmarked titles</p>
          </div>
          {watchlistItems.length > 0 && (
            <button
              onClick={onClearWatchlist}
              className="text-xs text-white/50 hover:text-red-400 font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All
            </button>
          )}
        </div>

        {watchlistItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
            {watchlistItems.map(item => (
              <MediaCard
                key={`${item.media_type}-${item.id}`}
                item={item}
                onSelect={onSelectMedia}
                isBookmarked={true}
                onToggleBookmark={onToggleBookmark}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-white/5 border border-white/10 rounded p-6">
            <div className="w-12 h-12 rounded bg-white/5 border border-white/10 text-yellow-400 flex items-center justify-center mx-auto mb-3">
              <Bookmark className="w-6 h-6" />
            </div>
            <h3 className="text-xs font-black uppercase tracking-wider text-white">Your list is currently empty</h3>
            <p className="text-xs text-white/50 mt-1 max-w-sm mx-auto font-medium uppercase tracking-wider">
              Click the bookmark icon on any movie or TV series card while browsing to save it to your personal watchlist!
            </p>
          </div>
        )}
      </section>
    </div>
  );
};
